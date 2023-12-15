import { BasicAuth, FetchRequestConfig } from '../types.js';

export function authConfig(config: FetchRequestConfig): FetchRequestConfig {
  return {
    ...config,
    credentials: 'include',
  };
}

export function basicAuth(auth: BasicAuth, config: RequestInit): RequestInit {
  const { headers, ...rest } = config;
  const authData = btoa(`${auth.username}:${auth.password}`);
  return {
    ...rest,
    headers: {
      ...headers,
      Authorization: `Basic ${authData}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  };
}
