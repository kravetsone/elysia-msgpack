import { Elysia, type LifeCycleType } from "elysia";
import { type Options, Packr } from "msgpackr";

const DEFAULT_MIME_TYPE = "application/x-msgpack";

export interface ElysiaMsgpackOptions<Type extends LifeCycleType = "scoped">
	extends Options {
	mimeType?: string;
	force?: boolean;
	as?: Type;
}

export function msgpack<Type extends LifeCycleType>(
	options: ElysiaMsgpackOptions<Type> = {},
) {
	const packr = new Packr(options);

	const mimeType = options.mimeType ?? DEFAULT_MIME_TYPE;
	const as = (options.as ?? "scoped") as Type;

	return new Elysia({
		name: "elysia-msgpack",
		seed: options,
	})
		.onParse({ as }, async ({ request }, contentType) => {
			if (contentType === mimeType)
				return packr.unpack(new Uint8Array(await request.arrayBuffer()));
		})
		.mapResponse({ as }, ({ headers, response }) => {
			if (response && (options.force || headers.accept?.includes(mimeType))) {
				return new Response(packr.pack(response), {
					headers: {
						"content-type": mimeType,
					},
				});
			}
		});
}
