# elysia-msgpack

The library for [elysia](https://elysiajs.com) which allows you to work with [MessagePack](https://msgpack.org). To pack/unpack it, we use really fast [msgpackr](https://github.com/kriszyp/msgpackr)

## Installation

```bash
bun install elysia-msgpack
```

## Usage

```ts
// @filename: server.ts
import Elysia from "elysia"
import { msgpack } from "elysia-msgpack"

const app = new Elysia()
    .use(msgpack())
    .post("/", ({ body }) => {
        // body is unpacked MessagePack if content-type header contains application/x-msgpack


        // if accept header contains application/x-msgpack
        // this response will become a MessagePack,
        // and if not, it will remain JSON
        return {
            some: "values",
            and: true,
            keys: 228,
        }
    })
    .listen(3000);

    export AppType = typeof app;
```

It works fine with [End-to-End Type Safety](https://elysiajs.com/eden/overview.html) too!

```ts
// @filename: client.ts
import { treaty } from "@elysiajs/eden";
import { pack, unpack } from "msgpackr";
import type { AppType } from "./server";

const app = treaty<AppType>("localhost:4888", {
    onRequest: (path, { body }) => {
        return {
            headers: {
                "content-type": "application/x-msgpack",
                accept: "application/x-msgpack",
            },
            body: pack(body),
        };
    },
    onResponse: async (response) => {
        if (
            response.headers
                .get("Content-Type")
                ?.startsWith("application/x-msgpack")
        )
            return unpack(Buffer.from(await response.arrayBuffer()));
    },
});

const { data, error } = await app.index.post({
    some: 228,
});

console.log(data);
```

### Options

[All options of msgpackr constructor](https://github.com/kriszyp/msgpackr?tab=readme-ov-file#options) (but we set useRecords to `false` by default)

and `mimeType` - it's value to detect msgpack content-type and responding with it if accept contains this `mimeType`. Default is `application/x-msgpack`.

<!-- prettier-ignore -->
```ts
new Elysia()
    .use(msgpack({
        mimeType: "application/some-another-msgpack-type",
        int64AsType: "string",
        // and other msgpackr constructor options
    }))
```

You can use [Apidog](https://apidog.com/) to test the API with msgpack.

<div align='center'>
  <img src="https://github.com/kravetsone/elysia-msgpack/assets/57632712/25a3761e-4121-4849-9d77-a73b96227685" alt="Apidog" /> 
</div>
