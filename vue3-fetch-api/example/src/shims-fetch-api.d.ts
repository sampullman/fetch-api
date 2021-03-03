
declare module '@vue/runtime-core' {
  import { FetchApi } from '@sampullman/fetch-api';
  interface ComponentCustomProperties {
    $api: FetchApi;
  }
}
