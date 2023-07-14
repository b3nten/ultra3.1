import Ultra from "../Ultra.ts";

const app = new Ultra()

await app.build()

app.serveStatic()

app.get("/", () => {
	return new Response("Hello World!")
})

app.serve()