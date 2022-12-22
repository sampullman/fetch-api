import { RequestData, RequestParams, ResolvedRequestParams } from '../types';
import { arrayToQuery } from './array';

type Filterable = {
  [key: string]: any;
};

export function resolveSearchParams(obj: RequestParams): ResolvedRequestParams {
  if (typeof obj === 'object') {
    const filteredObj: Filterable = {};
    Object.entries(obj).forEach(([key, val]) => {
      if (val !== undefined) {
        filteredObj[key] = val.toString();
      }
    });
    return filteredObj;
  }
  return obj;
}

export function prepareJson(data: RequestData, config: RequestInit): RequestInit {
  const { headers, ...rest } = config;
  if (data instanceof FormData) {
    return {
      ...config,
      body: data,
    };
  }
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

export function encodeParams(url: string, params: ResolvedRequestParams) {
  const encodedUrl = new URL(url);
  if (params) {
    encodedUrl.search = new URLSearchParams(params).toString();
  }
  return encodedUrl;
}

export const transformRequestParams = (
  params?: RequestParams,
): RequestParams | undefined => {
  if (!params || typeof params !== 'object') {
    return params;
  }
  const entries = Object.entries(params);
  if (entries.length === 0) {
    return params;
  }
  let queryString = '';
  for (const [key, value] of entries) {
    if (Array.isArray(value)) {
      queryString += `&${arrayToQuery(key, value)}`;
    } else if (value !== undefined) {
      queryString += `&${key}=${encodeURIComponent(value.toString())}`;
    }
  }
  return `?${queryString.slice(1)}`;
};
