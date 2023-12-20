# elysia-msgpack

A library for [elysia](elysia) that allows you to work with [MessagePack](https://msgpack.org/)

## Example

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
