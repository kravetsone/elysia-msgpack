import { Elysia, type LifeCycleType } from "elysia";
import { type Options, Packr } from "msgpackr";

const DEFAULT_MIME_TYPE = "application/x-msgpack";

/** Interface of Msgpack plugin options */
export interface ElysiaMsgpackOptions<Type extends LifeCycleType = "scoped">
	extends Options {
	/** An array of `content-types` that need to be serialized/deserialized
	 *
	 * @default ["application/x-msgpack"]
	 */
	contentTypes?: string[];
	/**
	 * Don't look at the `accept` header to serialize?
	 *
	 * @default false
	 */
	force?: boolean;
	/**
	 * [LifeCycleType](https://elysiajs.com/essential/scope.html#hook-type)
	 *
	 * @default "scoped"
	 */
	as?: Type;
}

/**
 * This library helps you to work with messagepack
 *
 * [About options](https://github.com/kravetsone/elysia-msgpack#options)
 */
export function msgpack<Type extends LifeCycleType = "scoped">(
	options: ElysiaMsgpackOptions<Type> = {},
) {
	options.useRecords ??= false;
	const packr = new Packr(options);

	const contentTypes = options.contentTypes ?? [DEFAULT_MIME_TYPE];

	const as = (options.as ?? "scoped") as Type;

	return new Elysia({
		name: "elysia-msgpack",
		seed: options,
	})
		.decorate("msgpack", packr)
		.onParse({ as }, async ({ request }, contentType) => {
			if (contentTypes.includes(contentType))
				return packr.unpack(Buffer.from(await request.arrayBuffer()));
		})
		.mapResponse({ as }, ({ headers, response }) => {
			if (
				response &&
				(options.force ||
					contentTypes.some((x) => headers?.accept?.includes(x)))
			) {
				return new Response(packr.pack(response), {
					headers: {
						"Content-Type": contentTypes.at(0) || "",
					},
				});
			}
		});
}
