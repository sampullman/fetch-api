import { createApp } from 'vue';
import { FetchApiPlugin } from '@sampullman/vue3-fetch-api';
import App from './App.vue';

const jsonInterceptor = async (res: Response) => {
  res.data = res.body ? await res.json() : null;
  return res;
};

createApp(App)
  .use(FetchApiPlugin, {
    responseInterceptors: [jsonInterceptor],
  })
  .mount('#app');
