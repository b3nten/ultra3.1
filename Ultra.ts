import {
  type Context,
  getMimeType,
  Hono,
  type Next,
  toFileUrl,
} from "./deps.ts";
import type { ImportMap } from "./importMap.ts";
import vendorImportMap from "./vendorImportMap.ts";
import { Logger } from "./log.ts";
import * as esbuild from 'npm:esbuild'
import injectHtmlDeps from "./injectHtmlDeps.ts";
import injectImportMap from "./injectImportMap.ts";

const safe = <T extends (...args: any) => any>(
  fn: T,
): ReturnType<T> | Error => {
  try {
    return fn();
  } catch (err) {
    if (err instanceof Error) {
      return err;
    } else {
      return new Error(err);
    }
  }
};

export default class Ultra {
  public hono = new Hono();
  public importMap?: ImportMap
  public vendorImportMap?: ImportMap

  public get = this.hono.get.bind(this.hono);
  public post = this.hono.post.bind(this.hono);
  public put = this.hono.put.bind(this.hono);
  public patch = this.hono.patch.bind(this.hono);
  public delete = this.hono.delete.bind(this.hono);
  public all = this.hono.all.bind(this.hono);
  public use = this.hono.use.bind(this.hono);

  static log = new Logger("DEBUG")

  constructor() {
    !this.importMap && safe(() => {
      this.importMap = JSON.parse(Deno.readTextFileSync("./import_map.json"))
    });
    !this.importMap && safe(() => {
      this.importMap = JSON.parse(Deno.readTextFileSync("./importMap.json"))
    });
    !this.importMap && safe(() => {
      const config = Deno.readTextFileSync("./deno.json");
      this.importMap = JSON.parse(config).importMap;
    });
    !this.importMap && safe(() => {
      const config = JSON.parse(Deno.readTextFileSync("./deno.jsonc"))
      this.importMap = {imports: config.imports}
    });
  }

  public async injectHtmlDeps(html: string) {
    const tags = await injectHtmlDeps(html, this.vendorImportMap ?? this.importMap);
    return html.replace("</head>", `${tags}\n</head>`);
  }

  public injectImportMap(html: string) {
    return injectImportMap(html, this.vendorImportMap ?? this.importMap);
  }

  #serveStatic = async (ctx: Context, next: Next) => {
    if (ctx.finalized) {
      await next();
      return;
    }
    await new Promise((resolve) => setTimeout(resolve, 1000));
    // TODO: This will be vulnerable to directory traversal attacks.
    try {
      const path = new URL(ctx.req.raw.url).pathname;
      console.log(path)
      const res = await fetch(toFileUrl(Deno.cwd() + path));
      const contentType = getMimeType(path) ?? res.headers.get("content-type");
      let headers = new Headers();
      if (contentType) {
        headers.set("content-type", contentType);
      }
      return new Response(res.body, {
        headers: headers,
      });
    } catch {
      await next();
      return;
    }
  };

  public serveStatic() {
    // @ts-ignore
    this.hono.use(this.#serveStatic);
  }

  #serveCompiler = async (ctx: Context, next: Next) => {
    // TODO: This will be vulnerable to directory traversal attacks.
    console.log('compiler')
    try {
      const path = new URL(ctx.req.raw.url).pathname.replace("/@compiler", "");
      const res = await fetch(toFileUrl(Deno.cwd() + path));
      const code = await esbuild.transform(await res.text(), {
        loader: "tsx",
        format: "esm",
        jsx: "automatic",
      });
      return new Response(code.code, {
        headers: {
          "content-type": "application/javascript"
        }
      });
    } catch {
      return new Response("Could not compile.", { status: 404 })
    }

  }

  public serveCompiler(){
    // @ts-ignore
    this.hono.get("/@compiler/*", this.#serveCompiler);
  }

  public async build() {
    if(this.importMap){
      this.vendorImportMap = await vendorImportMap(this.importMap);
    } else {
      Ultra.log.warning("No import map found")
    }
  }

  public serve() {
    Deno.serve(this.hono.fetch);
  }
}
