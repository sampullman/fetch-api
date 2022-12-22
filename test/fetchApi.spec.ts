import btoa from 'btoa';
import { URL, URLSearchParams } from 'url';
import {
  FetchApi,
  jsonInterceptor,
  TestApiResponse,
  fetch,
  expectedTestInfo,
} from './utils';
global.btoa = btoa;

describe('test response interceptors', () => {
  let api: FetchApi<TestApiResponse>;

  beforeAll(async () => {
    api = new FetchApi<TestApiResponse>({
      baseUrl: 'https://cool.api/',
      timeout: 1000,
      responseInterceptors: [jsonInterceptor],
    });
  });

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('tests request timeout', async () => {
    jest.useFakeTimers();
    (fetch as jest.Mock).mockReturnValue(
      new Promise((resolve) => setTimeout(() => resolve(1), 1100)),
    );

    expect(api.request({ url: 'status/' })).rejects;
    jest.advanceTimersByTime(1100);
  });

  it('tests request data', async () => {
    const data = { a: ['1', '2'], b: '3' };

    const requestConfig = { url: 'data/', method: 'POST', data };
    const { expectedResponse, expectedRequest } = expectedTestInfo(requestConfig);
    (fetch as jest.Mock).mockReturnValue(expectedResponse);

    // The endpoint echos stringified JSON, transformed by `jsonInterceptor`
    const rsp = await api.request(requestConfig);
    expect(rsp.data).toEqual(data);
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith('https://cool.api/data/', expectedRequest);
  });

  it('tests request form data', async () => {
    const formData = new FormData();
    formData.append('a', '1');
    formData.append('b', new Blob(['12345']));
    const requestConfig = { url: 'data/', method: 'POST', data: formData };
    (fetch as jest.Mock).mockReturnValue({
      body: requestConfig.data,
      json() {
        return new Promise((resolve) => resolve(requestConfig.data));
      },
    });

    // The endpoint echos the URL rendered with parameters
    const rsp = await api.request(requestConfig);

    expect(rsp.data).toEqual(formData);
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith('https://cool.api/data/', {
      method: 'POST',
      body: formData,
    });
  });

  it('tests request parameters', async () => {
    const params = { a: '1', b: '2' };
    const paramsWidthUndef = { ...params, c: undefined };
    const endpoint = 'https://cool.api/data/';

    (fetch as jest.Mock).mockReturnValue({});

    // The endpoint echos the URL rendered with parameters
    await api.request({ url: 'data/', params: paramsWidthUndef });

    const targetUrl = new URL(endpoint);
    targetUrl.search = new URLSearchParams(params).toString();
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(targetUrl.toString(), {});
  });

  it('tests request auth', async () => {
    (fetch as jest.Mock).mockReturnValue({});

    const name = 'tester';
    const pw = 'tester123';

    await api.request({
      url: 'login/',
      method: 'POST',
      auth: { username: name, password: pw },
    });
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith('https://cool.api/login/', {
      headers: {
        Authorization: `Basic ${btoa(`${name}:${pw}`)}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      method: 'POST',
    });
  });

  it('tests ignoreBaseUrl', async () => {
    (fetch as jest.Mock).mockReturnValue({});

    await api.request({
      url: 'https://newroot/test',
      ignoreBaseUrl: true,
      method: 'GET',
    });
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith('https://newroot/test', { method: 'GET' });
  });
});
