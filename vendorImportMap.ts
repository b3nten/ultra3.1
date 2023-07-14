import parseImports, { Import } from "npm:parse-imports";
import slash from "https://deno.land/x/slash/mod.ts";
import {
  basename,
  dirname,
  extname,
  fromFileUrl,
  join,
  relative,
  resolve,
  toFileUrl,
} from "https://deno.land/std@0.176.0/path/mod.ts";

interface SpecifierMap {
  [url: string]: string | null;
}
interface Scopes {
  [url: string]: SpecifierMap;
}
interface ImportMap {
  imports?: SpecifierMap;
  scopes?: Scopes;
}

const headers = new Headers({
  "user-agent":
    "Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; Trident/5.0)",
});

export default async function vendorImportMap(importMap: ImportMap) {
  if (!importMap.imports) return;
  const newImportMap = importMap;
  for await (const [module, specifier] of Object.entries(importMap.imports)) {
    if (!specifier) continue;
    if (isExternalUrl(specifier)) {
      const localPath = await vendorModule(specifier);
      newImportMap.imports![module] = localPath;
    }
  }
  console.log(newImportMap);
  return newImportMap;
}

const importMap = {
  imports: {
    "react": "https://esm.sh/react",
    "react-dom": "https://esm.sh/react-dom",
  },
};

vendorImportMap(importMap);

function isExternalUrl(url: string) {
  return url.startsWith("http://") || url.startsWith("https://");
}

async function vendorModule(path: string) {
  /*
    We need to create a local path from this url. This will be the location this module will be stored.
    We parse imports. External URL's are fine, we don't need to do anything with them.
    If the path is relative, eg. ./ or ../ we need to resolve it to an absolute path with current module external url.
    If the path is absolute, we need to resolve it to an absolute path with the root url.
  */

  const module = await fetch(path, { headers });
  if (!module.ok) throw new Error(`Unable to fetch module ${path}`);
  let moduleText = await module.text();

  for await (const module of await parseImports(moduleText)) {
    const modulePath = module.moduleSpecifier.value!;

    if (!modulePath) continue;

    if (isExternalUrl(modulePath)) {
      // if path is external
      const currentModuleVendorPath = externalPathToVendorPath(path);
      const externalModuleVendorPath = externalPathToVendorPath(modulePath);

      const relativePath = slash(
        relative(currentModuleVendorPath, externalModuleVendorPath).replace(
          ".",
          "",
        ),
      );

      moduleText = moduleText.replaceAll(modulePath, relativePath);

      await vendorModule(modulePath);

    } else if (modulePath.startsWith("/")) {
      // if path is absolute
      const moduleUrl = new URL(path).origin + modulePath
      console.log(externalPathToVendorPath(moduleUrl))
      // need to go up to the vendor path, then back down to the new module path
      moduleText = moduleText.replaceAll(modulePath, externalPathToVendorPath(moduleUrl));
      await vendorModule(moduleUrl);
    }
  }
  const folderPath = dirname(externalPathToVendorPath(path));
  await Deno.mkdir(folderPath, { recursive: true });
  const fileName = extname(basename(path)) ? basename(path) : "index.js";
  await Deno.writeTextFile(folderPath + "/" + fileName, moduleText);
  return fileName;
}

function externalPathToVendorPath(path: string) {
  const url = new URL(path);
  return `./vendor/${url.host}${url.pathname}`;
}

function ensureFileExtension(path: string) {
  return extname(path) ? path : path + ".js";
}
