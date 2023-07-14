import {
  type Context,
  getMimeType,
  Hono,
  type Next,
  toFileUrl,
} from "./deps.ts";

export default class Ultra {
  public hono = new Hono();

  public get = this.hono.get.bind(this.hono);
  public post = this.hono.post.bind(this.hono);
  public put = this.hono.put.bind(this.hono);
  public patch = this.hono.patch.bind(this.hono);
  public delete = this.hono.delete.bind(this.hono);
  public all = this.hono.all.bind(this.hono);
  public use = this.hono.use.bind(this.hono);

   


  #serveStatic = async (ctx: Context, next: Next) => {
    if (ctx.finalized) {
      await next();
      return;
    }
    // TODO: This will be vulnerable to directory traversal attacks.
    try {
      const path = new URL(ctx.req.raw.url).pathname;
      console.log(toFileUrl(Deno.cwd() + path));
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

  public build() {}

  public serve() {
    Deno.serve(this.hono.fetch);
  }

}
