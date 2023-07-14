import parseImports, { Import } from "npm:parse-imports";
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

function isExternalUrl(url: string) {
  return url.startsWith("http://") || url.startsWith("https://");
}

export default async function vendorImportMap(importMap: ImportMap) {
  if (!importMap.imports) return;
  const newImportMap = importMap;
  for await (const [module, specifier] of Object.entries(importMap.imports)) {
    if (!specifier) continue;
    if (isExternalUrl(specifier)) {
      const specifierURL = new URL(specifier);
      const specifierPath = `./vendor/${specifierURL.host}${specifierURL.pathname}`
      console.log(specifierPath)
      await vendorModule(specifierPath, specifier);
      newImportMap.imports![module] = specifierPath;
    }
  }
  console.log(newImportMap);
  return newImportMap;
}

const importMap = {
  imports: {
    "react": "https://esm.sh/react",
  },
};

await vendorImportMap(importMap);


function combinePaths(path1: string, path2: string) {
  return join(dirname(path1), dirname(path2)) + "/" + basename(path2)
}

function externalPathToInternalPath(path: string) {
  const specifierURL = new URL(path);
  return `./vendor/${specifierURL.host}${specifierURL.pathname}`
}

// await vendorImportMap(importMap);

// imported module should know it's own path
// it fetches itself, and then parses the imports
// it turns the import paths into local vendored paths,
// and then changes the import statements to use those paths
// it then writes itself to the vendored path
// finally, it calls itself recursively on the import statements

async function vendorModule(targetPath: string, moduleURL: string) {
  const fetchedModule = await fetch(moduleURL, { headers });
  let moduleContent = await fetchedModule.text();
  const imports = await parseImports(moduleContent);
  if(!imports) return;
  for await (const importStatement of imports) {
  
    if(!importStatement.moduleSpecifier.value) continue;

    let importTargetPath: string;
    let importModuleURL: string;

    if(isExternalUrl(importStatement.moduleSpecifier.value)){
      importTargetPath = externalPathToInternalPath(importStatement.moduleSpecifier.value);
      importModuleURL = importStatement.moduleSpecifier.value;
    } else {
      importTargetPath = combinePaths(targetPath, importStatement.moduleSpecifier.value);
      importModuleURL = new URL(importStatement.moduleSpecifier.value, moduleURL).toString();
    }

    await vendorModule(importTargetPath, importModuleURL);
    moduleContent = moduleContent.replace(importStatement.moduleSpecifier.value, importTargetPath);
    await Deno.mkdir(dirname(importTargetPath), { recursive: true });
    await Deno.writeTextFile(importTargetPath, moduleContent);
  }
}