import { FetchRequestConfig } from '../dist/fetch-api';
import { fetch, FetchApi, TestApiResponse } from './utils';

describe('test request interceptors', () => {
  it('converts certain requests to POST', async () => {
    const api = new FetchApi<TestApiResponse>({
      baseUrl: 'https://cool.api/',
      requestInterceptors: [
        async (config: FetchRequestConfig) => {
          if (config.url?.startsWith('old')) {
            config.method = 'POST';
          }
          return config;
        },
      ],
    });

    await api.request({ url: 'old/stuff/' });
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith('https://cool.api/old/stuff/', {
      method: 'POST',
    });

    jest.resetAllMocks();

    await api.request({ url: 'new/stuff/' });
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith('https://cool.api/new/stuff/', {});
  });
});
