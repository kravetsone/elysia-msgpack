import { Elysia } from "elysia"
import { Options, Packr } from "msgpackr"

const DEFAULT_MIME_TYPE = "application/x-msgpack"

export function msgpack(options: Options & { mimeType?: string }) {
    const packr = new Packr(options)

    return new Elysia()
        .onParse(async ({ request }, contentType) => {
            if (contentType === (options.mimeType ?? DEFAULT_MIME_TYPE))
                return packr.unpack(new Uint8Array(await request.arrayBuffer()))
        })
        .onAfterHandle(({ headers, response }) => {
            if (
                headers.accept?.includes(
                    options.mimeType ?? DEFAULT_MIME_TYPE,
                ) &&
                response
            )
                return new Response(packr.pack(response), {
                    headers: {
                        "content-type": options.mimeType ?? DEFAULT_MIME_TYPE,
                    },
                })
        })
}
