import { parse } from "npm:node-html-parser";
import * as denoGraph from "https://deno.land/x/deno_graph/mod.ts";
import { toFileUrl } from "https://deno.land/std/path/mod.ts";
import slash from "https://deno.land/x/slash/mod.ts";
import { fromFileUrl } from "https://deno.land/std@0.176.0/path/win32.ts";
import { ImportMap } from "./importMap.ts";
import { join } from "https://deno.land/std@0.193.0/path/win32.ts";

function isExternalUrl(path: string) {
  if (!path) return false;
  return path.startsWith("http://") || path.startsWith("https://");
}

function arrayFromModuleGraph(graph: denoGraph.ModuleGraphJson) {
  const array = [];
  for (const module of graph.modules) {
    array.push(slash(fromFileUrl(module.specifier).replace(Deno.cwd(), "")));
  }
  return array;
}

export default async function injectHtmlDeps(
  html: string,
  importMap?: ImportMap,
) {
  const root = parse(html);
  const scripts = root.querySelectorAll("script");
  const dependencies = scripts.map((script) => script.attributes.src);

  const allDeps: string[] = [];
  for await (let dependency of dependencies) {
    if (!dependency) continue;
    let isCompiled = false;
    let resolvedDependency = dependency;
    if (!isExternalUrl(dependency)) {
      if (
        dependency.startsWith("@compiler/") ||
        dependency.startsWith("/@compiler/")
      ) {
        isCompiled = true;
        resolvedDependency = dependency.replace("@compiler", "");
      }
      const graph = await denoGraph.createGraph(
        toFileUrl(Deno.cwd() + resolvedDependency).toString(),
        {
          resolve(specifier: string, referrer: string): string {
            if (
              importMap && importMap.imports && importMap.imports[specifier]
            ) {
              return toFileUrl(join(Deno.cwd(), importMap.imports[specifier]!))
                .toString();
            }
            return new URL(specifier, referrer).href;
          },
        },
      );
      arrayFromModuleGraph(graph).forEach((dep) => {
        if (isCompiled && !dep.startsWith("/vendor")) dep = "/@compiler" + dep;
        allDeps.push(dep);
      });
    }
  }
  const tags: string[] = [];
  for (const dep of allDeps) {
    tags.push(`<link rel="modulepreload" href="${dep}">\n`);
  }
  return tags.join("");
}
