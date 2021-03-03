import { createApp } from 'vue';
import FetchPlugin from '@sampullman/vue3-fetch-api';
import App from './App.vue';

const jsonInterceptor = async (res: Response) => {
  res.data = res.body ? await res.json() : null;
  return res;
};

createApp(App)
  .use(FetchPlugin, {
    responseInterceptors: [jsonInterceptor],
  })
  .mount('#app');
