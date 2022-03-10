import {
  RequestInterceptor,
  ResponseInterceptor,
  FetchApiOptions,
  FetchApiConfig,
  FetchRequestConfig,
} from './types';

import {
  prepareJson,
  basicAuth,
  encodeParams,
  resolveSearchParams,
  toArray,
} from './utils';

export class FetchApi<ResponseType = Response> {
  readonly baseUrl: string;
  readonly timeout: number;
  requestInterceptors: RequestInterceptor[];
  responseInterceptors: ResponseInterceptor<ResponseType>[];

  constructor(options: FetchApiOptions<ResponseType>) {
    const { timeout, baseUrl } = options;
    this.responseInterceptors = toArray(options.responseInterceptors);
    this.requestInterceptors = toArray(options.requestInterceptors);

    this.baseUrl = baseUrl || '';
    this.timeout = timeout === undefined ? 10000 : timeout;
  }

  async request(config: FetchRequestConfig): Promise<ResponseType> {
    // Allow user to transform request config before we do anything
    for (const reqInt of this.requestInterceptors) {
      config = await reqInt(config);
    }

    // Transform FetchApiConfig into RequestInit for fetch
    let {
      url,
      data,
      params,
      auth,
      timeout,
      ignoreBaseUrl,
      ...finalConfig
    }: FetchApiConfig & RequestInit = config;

    if (data) {
      finalConfig = prepareJson(data, finalConfig);
    }
    if (auth) {
      finalConfig = basicAuth(auth, finalConfig);
    }
    timeout = timeout || this.timeout;

    let aborter: AbortController | null = null;
    if (timeout) {
      aborter = new AbortController();
      config.signal = aborter.signal;
    }
    const resolvedParams = resolveSearchParams(params);

    // Make `fetch` request, without timeout if configured
    const baseUrl = ignoreBaseUrl ? '' : this.baseUrl;
    url = encodeParams(`${baseUrl}${config.url}`, resolvedParams).toString();
    let request = fetch(url, finalConfig);

    let timeoutId = null;
    if (aborter) {
      timeoutId = setTimeout(() => (aborter as AbortController).abort(), timeout);
    }
    let response = (await request) as unknown as ResponseType;
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
    }

    // Allow user to transform response
    for (const rspInt of this.responseInterceptors) {
      response = await rspInt(response);
    }
    return response;
  }

  interceptResponse(interceptor: ResponseInterceptor<ResponseType>) {
    this.responseInterceptors.push(interceptor);
  }

  interceptRequest(interceptor: RequestInterceptor) {
    this.requestInterceptors.push(interceptor);
  }
}
