const fetch = jest.fn(() => {
  return Promise.resolve({
    body: 'mock-body',
    json: Promise.resolve('mock-json'),
  });
});
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(global as any).fetch = fetch;

import { FetchApi, FetchRequestConfig } from '../dist/cjs';

export class TestApiResponse extends Response {
  data!: unknown;
}

export const expectedTestInfo = (reqConfig: FetchRequestConfig) => {
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

export { FetchApi, jsonInterceptor, fetch, FetchRequestConfig };
