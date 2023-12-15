import {
  RequestInterceptor,
  ResponseInterceptor,
  FetchApiOptions,
  FetchApiConfig,
  FetchRequestConfig,
} from './types.js';
import {
  prepareBody,
  basicAuth,
  encodeParams,
  resolveSearchParams,
  toArray,
} from './util/index.js';

export class FetchApi<ResponseType = Response> {
  readonly baseUrl: string;
  readonly timeout: number;
  requestInterceptors: RequestInterceptor[];
  responseInterceptors: ResponseInterceptor<ResponseType>[];

  constructor(options: FetchApiOptions<ResponseType>) {
    const { timeout, baseUrl } = options;
    this.responseInterceptors = toArray<ResponseInterceptor<ResponseType>>(
      options.responseInterceptors,
    );
    this.requestInterceptors = toArray<RequestInterceptor>(options.requestInterceptors);

    this.baseUrl = baseUrl || '';
    this.timeout = timeout === undefined ? 10000 : timeout;
  }

  async request(config: FetchRequestConfig): Promise<ResponseType> {
    // Allow user to transform request config before we do anything
    for (const reqInt of this.requestInterceptors) {
      config = await reqInt(config);
    }

    // Transform FetchApiConfig into RequestInit for fetch
    const {
      url,
      data,
      params,
      auth,
      timeout,
      ignoreBaseUrl,
      requestJson,
      ...rest
    }: FetchApiConfig & RequestInit = config;

    let finalConfig = rest;

    if (data) {
      finalConfig = prepareBody(data, finalConfig, requestJson ?? true);
    }
    if (auth) {
      finalConfig = basicAuth(auth, finalConfig);
    }
    const abortTimeout = timeout || this.timeout;

    let aborter: AbortController | null = null;
    if (abortTimeout) {
      aborter = new AbortController();
      config.signal = (aborter || {}).signal;
    }
    const resolvedParams = resolveSearchParams(params);

    // Make `fetch` request, without timeout if configured
    const baseUrl = ignoreBaseUrl ? '' : this.baseUrl;
    const finalUrl = encodeParams(`${baseUrl}${url}`, resolvedParams).toString();
    const request = fetch(finalUrl, finalConfig);

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
