import { Elysia } from "elysia";
import { type Options, Packr } from "msgpackr";

const DEFAULT_MIME_TYPE = "application/x-msgpack";

export interface ElysiaMsgpackOptions extends Options {
	mimeType?: string;
	force?: boolean;
}

export function msgpack(options: ElysiaMsgpackOptions = {}) {
	const packr = new Packr(options);

	const mimeType = options.mimeType ?? DEFAULT_MIME_TYPE;

	return new Elysia({
		name: "elysia-msgpack",
		seed: options,
	})
		.onParse({ as: "global" }, async ({ request }, contentType) => {
			if (contentType === mimeType)
				return packr.unpack(new Uint8Array(await request.arrayBuffer()));
		})
		.mapResponse({ as: "global" }, ({ headers, response }) => {
			if (response && (options.force || headers.accept?.includes(mimeType))) {
				return new Response(packr.pack(response), {
					headers: {
						"content-type": mimeType,
					},
				});
			}
		});
}
