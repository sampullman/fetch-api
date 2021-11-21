jest.mock('node-fetch');
import fetch from 'node-fetch';
const { Response } = jest.requireActual('node-fetch');
import 'abort-controller/polyfill';

(global as any).fetch = fetch;

import { FetchApi } from '../dist/fetch-api';

export class TestApiResponse extends Response {
  data!: unknown;
}

export const expectedTestInfo = (reqConfig: any) => {
  return {
    expectedResponse: {
      body: JSON.stringify(reqConfig.data),
      json() {
        return new Promise((resolve) => resolve(reqConfig.data));
      },
    },
    expectedRequest: {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      method: reqConfig.method,
      body: JSON.stringify(reqConfig.data),
    },
  };
};

const jsonInterceptor = async (res: TestApiResponse): Promise<TestApiResponse> =>
  ({
    ...res,
    data: res.body ? await res.json() : null,
  } as unknown as TestApiResponse);

export { FetchApi, jsonInterceptor, Response, fetch };
