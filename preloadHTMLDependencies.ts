import { parse } from "npm:node-html-parser";
import * as denoGraph from "https://deno.land/x/deno_graph/mod.ts";
import { toFileUrl } from "https://deno.land/std/path/mod.ts";
import slash from "https://deno.land/x/slash/mod.ts";
import {
  fromFileUrl,
  relative,
} from "https://deno.land/std@0.176.0/path/win32.ts";

function isExternalUrl(path: string) {
  return path.startsWith("http://") || path.startsWith("https://");
}

function arrayFromModuleGraph(graph: denoGraph.ModuleGraphJson) {
  const array = [];
  for (const module of graph.modules) {
    array.push(slash(fromFileUrl(module.specifier).replace(Deno.cwd(), "")));
  }
  return array;
}

export default async function preloadHTMLDependencies(html: string) {
  const root = parse(html);
  const scripts = root.querySelectorAll("script");
  const dependencies = scripts.map((script) => script.attributes.src);

  const allDeps: string[] = [];
  for await (const dependency of dependencies) {
    if (!isExternalUrl(dependency)) {
      const graph = await denoGraph.createGraph(
        toFileUrl(Deno.cwd() + dependency).toString(),
      );
      arrayFromModuleGraph(graph).forEach((dep) => allDeps.push(dep));
    }
  }
  const tags: string[] = [];
	for (const dep of allDeps) {
		tags.push(`<link rel="modulepreload" href="${dep}">\n`);
	}
	return tags.join("");
}


