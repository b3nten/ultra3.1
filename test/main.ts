import Ultra from "../Ultra.ts";

const app = new Ultra()

app.serveStatic()

app.get("/", () => {
	return new Response("Hello World!")
})

app.serve()