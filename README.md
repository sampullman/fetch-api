<h2 align='center'>@sampullman/fetch-api</h2>

<p align='center'>Small fetch wrapper for creating quick API wrappers</p>

<p align='center'>
<a href='https://www.npmjs.com/package/@sampullman/fetch-api'>
  <img src='https://img.shields.io/npm/v/@sampullman/fetch-api?color=222&style=flat-square'>
</a>
</p>

<br>

## Instructions

### Install

```bash
npm i -D @sampullman/fetch-api
```

```bash
yarn add @sampullman/fetch-api
```

```bash
pnpm i -D @sampullman/fetch-api
```

### Configuration

`FetchApi` global configuration is passed to the constructor.

```ts
FetchApi({
  // API base URL prepended to requests
  baseUrl: '',

  // Default request timeout
  timeout: 10000,

   // Passed to JSON.stringify and used as fetch `body`.
   // Sets headers: { Accept: 'application/json', 'Content-Type': 'application/json' }
  data: null,

  // Request URL parameters, e.g. `{ 'a': 1 }`. Passed to `new URLSearchParams(params)`
  // Entries with undefined values are filtered out
  params: RequestParams,

  // Convenience for Basic Auth.
  // Sets headers['Authorization'] = `Basic ${btoa(`${auth.username}:${auth.password}`)}`
  auth: { username: 'test', password: 'password' }

  // Request interceptors
  requestInterceptors: [],

  // Response interceptors
  responseInterceptors: [],
});
```

### Usage

Here is an example of basic usage that includes a response interceptor for handling 403 response codes and converting the body to json.

```ts
const api = new FetchApi({
  baseUrl: 'https://cool.api/',
  responseInterceptors: [
    async (res) => {
      const { status } = res;

      if (status === 403) {
        throw new Error('FORBIDDEN');
      }
      res.data = await res.json();
      return res;
    },
  ],
});

// Make a get request to 'https://cool.api/status/'
const status = api.request({ url: 'status/' });
```

## Environment

`fetch` must be available. If you need to support older browsers or Node, use a polyfill such as [whatwg-fetch](https://github.com/github/fetch)

## Example

See the `example` directory.

## License

MIT License © 2021 [Samuel Pullman](https://github.com/sampullman)
