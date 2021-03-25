const { URL, URLSearchParams } = require('url');
const { fetchMock, FetchApi, jsonInterceptor } = require('./utils');
const btoa = require('btoa');
global.btoa = btoa;

const errors = {
  forbidden: 'FORBIDDEN',
  server: 'SERVER_ERROR',
};

describe('test response interceptors', () => {
  let api;

  beforeAll(async () => {
    api = new FetchApi({
      baseUrl: 'https://cool.api/',
      timeout: 1000,
      responseInterceptors: [jsonInterceptor],
    });
  });

  it('tests request timeout', async () => {
    jest.useFakeTimers();
    fetchMock.get('https://cool.api/status/', { delay: 1100 });
    
    const rsp = expect(api.request({ url: 'status/' })).rejects;
    jest.advanceTimersByTime(1100);
  });

  it('tests request data', async () => {
    const data = { a: ['1', '2'], b: '3' };
    fetchMock.post('https://cool.api/data/', (_url, options) =>
      ({ status: 200, body: options.body }));

    // The endpoint echos stringified JSON, transformed by `jsonInterceptor`
    const rsp = await api.request({ url: 'data/', method: 'POST', data });
    expect(rsp.data).toEqual(data);
  });

  it('tests request parameters', async () => {
    const params = { a: '1', b: '2' };
    const paramsWidthUndef = { ...params, c: undefined };
    const endpoint = 'https://cool.api/data/';
    fetchMock.get(`begin:${endpoint}`, (url, _options) =>
      ({ status: 200, body: JSON.stringify(url) }));

    // The endpoint echos the URL rendered with parameters
    const rsp = await api.request({ url: 'data/', params: paramsWidthUndef });

    const targetUrl = new URL(endpoint);
    targetUrl.search = new URLSearchParams(params).toString();
    expect(rsp.data).toEqual(targetUrl.toString());
  });

  it('tests request auth', async () => {
    const name = 'tester';
    const pw = 'tester123';
    fetchMock.post('https://cool.api/login/', async (_url, options) => {
      const { headers } = options;
      expect(headers['Authorization']).toEqual(`Basic ${btoa(`${name}:${pw}`)}`);
      expect(headers['Content-Type']).toEqual('application/x-www-form-urlencoded');
      return { status: 204 };
    });

    await api.request({ url: 'login/', method: 'POST', auth: { username: name, password: pw } });
  });
});
