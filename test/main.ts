import Ultra from "../Ultra.ts";

const app = new Ultra()

await app.build()

app.serveStatic()

app.serveCompiler()

app.get("/react", async () => {
	const html = await Deno.readTextFile("./react.html")
	return new Response(await app.injectHtmlDeps(app.injectImportMap(html)), {
		headers: {
			"Content-Type": "text/html"
		}
	})
})

app.get("/", () => {
	return new Response("Hello World!")
})

app.serve()