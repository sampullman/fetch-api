import {
  RequestInterceptor,
  ResponseInterceptor,
  FetchApiOptions,
  FetchApiConfig,
  FetchRequestConfig,
} from './types';

import { prepareJson, basicAuth, encodeParams, toArray } from './utils';

export class FetchApi {
  readonly baseUrl: string;
  readonly timeout: number;
  requestInterceptors: RequestInterceptor[];
  responseInterceptors: ResponseInterceptor[];
  
  constructor(options: FetchApiOptions) {
    const { timeout, baseUrl } = options;
    this.responseInterceptors = toArray(options.responseInterceptors);
    this.requestInterceptors = toArray(options.requestInterceptors);

    this.baseUrl = baseUrl || '';
    this.timeout = (timeout === undefined) ? 10000 : timeout;
  }

  async request(config: FetchRequestConfig) {

    // Allow user to transform request config before we do anything
    for(const reqInt of this.requestInterceptors) {
      config = await reqInt(config);
    }

    // Transform FetchApiConfig into RequestInit for fetch
    let {
      url,
      data,
      params,
      auth,
      timeout,
      ...finalConfig
    }: FetchApiConfig & RequestInit = config;

    if(data) {
      finalConfig = prepareJson(data, finalConfig);
    }
    if(auth) {
      finalConfig = basicAuth(auth, finalConfig);
    }
    timeout = timeout || this.timeout;

    let aborter: AbortController | null = null;
    if(timeout) {
      aborter = new AbortController();
      config.signal = aborter.signal;
    }

    // Make `fetch` request, without timeout if configured
    url = encodeParams(`${this.baseUrl}${config.url}`, params).toString();
    let request = fetch(url, finalConfig);

    let timeoutId = null;
    if(aborter) {
      timeoutId = setTimeout(() => (aborter as AbortController).abort(), timeout);
    }
    let response = await request;
    if(timeoutId !== null) {
      clearTimeout(timeoutId);
    }

    // Allow user to transform response
    for(const rspInt of this.responseInterceptors) {
      response = await rspInt(response);
    }
    return response;
  }

  interceptResponse(interceptor: ResponseInterceptor) {
    this.responseInterceptors.push(interceptor);
  }

  interceptRequest(interceptor: RequestInterceptor) {
    this.requestInterceptors.push(interceptor);
  }
}
