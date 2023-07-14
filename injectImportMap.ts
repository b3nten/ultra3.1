import { ImportMap } from "./importMap.ts";

export default function injectImportMap(html: string, importMap?: ImportMap){
	if(!importMap) return html;
	return html.replace(
		'<html>',
		`<html>
		<script type="importmap">
			${JSON.stringify(importMap)}
		</script>`
	);
}