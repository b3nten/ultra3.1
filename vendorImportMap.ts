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

const absoluteVendorPath = Deno.cwd() + "/vendor";

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
  const module = await fetch(path, { headers });

  if (!module.ok) throw new Error(`Unable to fetch module ${path}`);

  let moduleText = await module.text();

  for await (const module of await parseImports(moduleText)) {
    const importedModulePath = module.moduleSpecifier.value!;

    if (!importedModulePath) continue;

    if (isExternalUrl(importedModulePath)) {
      // if path is external
      const currentModuleVendorPath = urlToVendorPath(path);
      const externalModuleVendorPath = urlToVendorPath(importedModulePath);

      const relativePath = slash(
        relative(dirname(currentModuleVendorPath), externalModuleVendorPath),
      );
      moduleText = moduleText.replace(importedModulePath, relativePath);

      await vendorModule(importedModulePath);
    } else if (importedModulePath.startsWith("/")) {
      // if path is absolute
      const moduleUrl = new URL(path).origin + importedModulePath;
      // need to go up to the vendor path, then back down to the new module path
      const abLink = absoluteVendorPath + "/" + new URL(path).host +
        importedModulePath;
      const relativeLink = abLink.replace(Deno.cwd(), ".");

      moduleText = slash(moduleText.replace(
        importedModulePath,
        relativeLink,
      ));
      // console.log(relativeLink)

      await vendorModule(moduleUrl);
    }
  }

  let targetPath = urlToVendorPath(path);

  const folderPath = dirname(targetPath);
  await Deno.mkdir(folderPath, { recursive: true });

  const fileName = basename(targetPath);
  await Deno.writeTextFile(folderPath + "/" + fileName, moduleText);

  return targetPath;
}

function urlToVendorPath(path: string) {
  const url = new URL(path);
  // if no extension, it's a facade. We add /index.js to the end
  if (!extname(url.pathname)) {
    return `./vendor/${url.host}${url.pathname}/index.js`;
  }
  return `./vendor/${url.host}${url.pathname}`;
}
