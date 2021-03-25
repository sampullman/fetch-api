import { FetchRequestConfig, BasicAuth, RequestParams } from './types';

type Filterable = {
  [key: string]: any
}

export function filterUndefined(obj: RequestParams) {
  if(typeof obj === 'object') {
    const filteredObj: Filterable = {};
    Object.entries(obj).forEach(([key, val]) => {
      if(val !== undefined) {
        filteredObj[key] = val;
      }
    });
    return filteredObj;
  }
  return obj;
}

export function toArray<T>(arr: void | T | T[]): any[] {
  if(!arr) {
    return [];
  }
  if(Array.isArray(arr)) {
    return arr;
  }
  return [arr];
}

export function authConfig(config: FetchRequestConfig): FetchRequestConfig {
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

export function encodeParams(url: string, params: RequestParams) {
  const encodedUrl = new URL(url);
  if(params) {
    encodedUrl.search = new URLSearchParams(params).toString();
  }
  return encodedUrl;
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