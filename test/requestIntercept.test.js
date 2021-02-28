const { fetchMock, FetchApi } = require('./utils');

describe('test request interceptors', () => {

  it('converts certain requests to POST', async () => {
    const api = new FetchApi({
      baseUrl: 'https://cool.api/',
      requestInterceptors: [async config => {
        if(config.url.startsWith('old')) {
          config.method = 'POST';
        }
        return config;
      }],
    });
    fetchMock.get('https://cool.api/old/stuff/', 400);
    fetchMock.post('https://cool.api/old/stuff/', 200);
    fetchMock.get('https://cool.api/new/stuff/', 200);
    fetchMock.post('https://cool.api/new/stuff/', 400);

    let rsp = await api.request({ url: 'old/stuff/' });
    expect(rsp.status).toEqual(200);

    rsp = await api.request({ url: 'new/stuff/' });
    expect(rsp.status).toEqual(200);
  });
});