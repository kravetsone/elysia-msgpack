import { treaty } from "@elysiajs/eden";
import { pack, unpack } from "msgpackr";
import type { AppType } from "./server";

const app = treaty<AppType>("localhost:4888", {
	onRequest: (path, { body }) => {
		if (typeof body === "object")
			return {
				headers: {
					"content-type": "application/x-msgpack",
				},
				body: pack(body),
			};
	},
	onResponse: async (response) => {
		if (
			response.headers.get("Content-Type")?.startsWith("application/x-msgpack")
		)
			return unpack(Buffer.from(await response.arrayBuffer()));
	},
});

const { data, error } = await app.index.post({
	some: 228,
});

console.log(data);
