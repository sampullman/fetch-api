<h2 align='center'>@sampullman/vue3-fetch-api</h2>

<p align='center'>Vue3 plugin for <a href="https://www.npmjs.com/package/@sampullman/fetch-api)">@sampullman/vue3-fetch-api</a></p>

<p align='center'>
<a href='https://www.npmjs.com/package/@sampullman/fetch-api'>
  <img src='https://img.shields.io/npm/v/@sampullman/fetch-api?color=222&style=flat-square'>
</a>
</p>

<br>

## Instructions

### Install

```bash
npm i -D @sampullman/vue3-fetch-api
```

```bash
yarn add @sampullman/vue3-fetch-api
```

```bash
pnpm i -D @sampullman/vue3-fetch-api
```

## Usage

```
import { createApp } from 'vue';
import { FetchApiPlugin } from '@sampullman/vue3-fetch-api';
import App from './App.vue';

createApp(App)
  .use(FetchApiPlugin, {
    // Configuration
  })
  .mount('#app');
```

See [@sampullman/vue3-fetch-api](https://www.npmjs.com/package/@sampullman/fetch-api) for more configuration details.
