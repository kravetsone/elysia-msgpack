import Elysia, { t } from "elysia";
import { msgpack } from "../src";

const app = new Elysia()
	.use(msgpack())
	.post(
		"/",
		({ body }) => {
			return body;
		},
		{
			body: t.Object({
				some: t.Number(),
			}),
		},
	)
	.listen(4888, console.log);

export type AppType = typeof app;
