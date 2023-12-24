# elysia-msgpack

The library for [elysia](https://elysiajs.com) which allows you to work with [MessagePack](https://msgpack.org). To pack/unpack it, we use really fast [msgpackr](https://github.com/kriszyp/msgpackr)

## Installation

```bash
bun install elysia-msgpack
```

## Usage

<!-- prettier-ignore -->
```ts
import Elysia from "elysia"
import { msgpack } from "elysia-msgpack"

new Elysia()
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
    .listen(3000)
```

### Options

[All options of msgpackr constructor](https://github.com/kriszyp/msgpackr?tab=readme-ov-file#options)

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
