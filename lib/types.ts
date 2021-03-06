

export type RequestInterceptor = (config: Object) => Promise<Object>;
export type ResponseInterceptor = (response: Response) => Promise<Response>;

export type RequestParams = string | URLSearchParams | string[][] | Record<string, string> | undefined;

export interface FetchApiOptions {
  /**
   * API base URL prepended to requests
   * @default ''
   */
  baseUrl?: string

  /**
   * Default request timeout
   * @default 10000
   */
  timeout?: number

  /**
   * Request interceptors
   */
  requestInterceptors?: RequestInterceptor | RequestInterceptor[]

  /**
   * Response interceptors
   */
  responseInterceptors?: ResponseInterceptor | ResponseInterceptor[]
}

export interface BasicAuth {
  /**
   * Basic Auth username
   */
  username: string

  /**
   * Basic Auth password
   */
  password: string
}

export interface FetchApiConfig {
  /**
   * The URL passed to `fetch`
   * @default ''
   */
  url?: string

  /**
   * If present, `data` is stringified and used as `body`
   * Headers for JSON data are automatically included:
   *  { Accept: 'application/json', 'Content-Type': 'application/json' }
   * 
   * WARNING - if preset, `body`, `headers['Accept']`, and `headers['Content-Type']` are overridden
   */
  data?: Object

  /**
   * URL parameters appended to `url` using URLSearchParams
   */
  params?: RequestParams,

  /**
   * Convenience option for providing Basic Auth headers
   * Overrides headers:
   * `headers['Authorization'] = \`Basic ${btoa(\`${auth.username}:${auth.password}\`)}\``
   * `
   */
  auth?: BasicAuth

  /**
   * Timeout in milliseconds. Falls back to global config timeout
   * Overrides `signal`
   * @default 10000
   */
  timeout?: number
}

export type FetchRequestConfig = FetchApiConfig & RequestInit;
