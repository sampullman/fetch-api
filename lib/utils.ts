import { FetchApiOptions, FetchRequestConfig, BasicAuth } from './types';


export function toArray<T>(arr: void | T | T[]): any[] {
  if(!arr) {
    return [];
  }
  if(Array.isArray(arr)) {
    return arr;
  }
  return [arr];
}

export function authConfig(config: RequestInit): RequestInit {
  return {
    ...config,
    credentials: 'include',
  };
}

export function prepareJson(data: any, config: RequestInit): RequestInit {
  const { headers, ...rest } = config;
  return {
    ...rest,
    headers: {
      ...headers,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  };
}

export function basicAuth(auth: BasicAuth, config: RequestInit): RequestInit {
  const { headers, ...rest } = config;
  const authData = btoa(`${auth.username}:${auth.password}`);
  return {
    ...rest,
    headers: {
      ...headers,
      'Authorization': `Basic ${authData}`, 
      'Content-Type': 'application/x-www-form-urlencoded',
    }
  }
}