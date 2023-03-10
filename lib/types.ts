/* eslint-disable @typescript-eslint/ban-types */
export type RequestInterceptor = (config: Object) => Promise<Object>;
export type ResponseInterceptor<T> = (response: T) => Promise<T>;

export type RequestParams =
  | string
  | URLSearchParams
  | string[][]
  | Record<string, string | string[] | number | number[] | undefined | unknown | null>
  | undefined;

export type ResolvedRequestParams =
  | string
  | URLSearchParams
  | string[][]
  | Record<string, string>
  | undefined;

export type RequestData = Object | FormData;

export interface FetchApiOptions<ResponseType = Response> {
  /**
   * API base URL prepended to requests
   * @default ''
   */
  baseUrl?: string;

  /**
   * Default request timeout
   * @default 10000
   */
  timeout?: number;

  /**
   * Request interceptors
   */
  requestInterceptors?: RequestInterceptor | RequestInterceptor[];

  /**
   * Response interceptors
   */
  responseInterceptors?:
    | ResponseInterceptor<ResponseType>
    | ResponseInterceptor<ResponseType>[];
}

export interface BasicAuth {
  /**
   * Basic Auth username
   */
  username: string;

  /**
   * Basic Auth password
   */
  password: string;
}

export interface FetchApiConfig {
  /**
   * The URL passed to `fetch`
   * @default ''
   */
  url?: string;

  /**
   * Ignore `baseUrl` in FetchApiOptions
   * e.g. for calling third party APIs
   * @default false
   */
  ignoreBaseUrl?: boolean;

  /**
   * If present, `data` is stringified and used as `body`
   * Headers for JSON data are automatically included:
   *  { Accept: 'application/json', 'Content-Type': 'application/json' }
   *
   * WARNING - if preset, `body`, `headers['Accept']`, and `headers['Content-Type']` are overridden
   */
  data?: RequestData;

  /**
   * URL parameters appended to `url` using URLSearchParams
   */
  params?: RequestParams;

  /**
   * Convenience option for providing Basic Auth headers
   * Overrides headers:
   * `headers['Authorization'] = \`Basic ${btoa(\`${auth.username}:${auth.password}\`)}\``
   * `
   */
  auth?: BasicAuth;

  /**
   * Timeout in milliseconds. Falls back to global config timeout
   * Overrides `signal`
   * @default 10000
   */
  timeout?: number;
}

export type FetchRequestConfig = FetchApiConfig & RequestInit;
