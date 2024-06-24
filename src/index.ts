import { Elysia } from "elysia";
import { type Options, Packr } from "msgpackr";

const DEFAULT_MIME_TYPE = "application/x-msgpack";

export interface ElysiaMsgpackOptions extends Options {
	mimeType?: string
	forceEnable?: boolean
}

// TODO: worry about onError serialize to msgpack
export function msgpack(opts: ElysiaMsgpackOptions = {}) {
	const packr = new Packr(opts);

	opts.mimeType ??= DEFAULT_MIME_TYPE

	return new Elysia({
		name: "elysia-msgpack",
		seed: options,
	})
		.onParse({ as: "global" }, async ({ request }, contentType) => {
			if (contentType === opts.mimeType)
				return packr.unpack(new Uint8Array(await request.arrayBuffer()));
		})
		.mapResponse({ as: "global" }, ({ headers, response }) => {
			if (
				response && 
				(opts.forceEnable || headers.accept?.includes(opts.mimeType))
			) {
				return new Response(packr.pack(response), {
					headers: {
						"content-type": opts.mimeType,
					},
				});
			}
		});
}
