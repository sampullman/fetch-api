import { App, Plugin } from 'vue';
import { FetchApi } from '@sampullman/fetch-api';

const defaultProperty = '$api';

function install(app: App, options?: any) {
  let globalProperty;
  let apiObject = null;
  let fetchApiConfig = {};

  if(options) {
    ({ globalProperty, apiObject, ...fetchApiConfig } = options);
  }
  globalProperty = globalProperty || defaultProperty;

  const fetchApi = apiObject || new FetchApi(fetchApiConfig);
  app.config.globalProperties[globalProperty] = fetchApi;
  app.provide(globalProperty, fetchApi);
}

const plugin = {
  install,
};

export * from '@sampullman/fetch-api';

export const FetchApiPlugin = plugin as unknown as Plugin;
