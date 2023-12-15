import { RequestData, RequestParams, ResolvedRequestParams } from '../types.js';
import { arrayToQuery } from './array.js';
import { objectToQuery } from './object.js';

type Filterable = {
  [key: string]: string;
};

export function resolveSearchParams(obj: RequestParams): ResolvedRequestParams {
  if (typeof obj === 'object') {
    const filteredObj: Filterable = {};
    Object.entries(obj).forEach(([key, val]) => {
      if (val !== undefined) {
        filteredObj[key] = val;
      }
    });
    return filteredObj;
  }
  return obj;
}

export function prepareBody(
  data: RequestData,
  config: RequestInit,
  isJson: boolean,
): RequestInit {
  const { headers, ...rest } = config;
  if (!isJson || data instanceof FormData) {
    return {
      ...config,
      body: data as BodyInit,
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
  const transformedParams = transformRequestParams(params);
  if (transformedParams) {
    encodedUrl.search = transformedParams.toString();
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
    return '';
  }
  let queryString = '';
  for (const [key, value] of entries) {
    if (Array.isArray(value)) {
      queryString += `&${arrayToQuery(key, value)}`;
    } else if (typeof value === 'object' && value !== null) {
      queryString += `&${objectToQuery(key, value)}`;
    } else if (value !== undefined) {
      queryString += `&${key}=${encodeURIComponent(value.toString())}`;
    }
  }
  return `?${queryString.slice(1)}`;
};
