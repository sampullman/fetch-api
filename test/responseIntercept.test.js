const { fetchMock, FetchApi } = require('./utils');

const errors = {
  forbidden: 'FORBIDDEN',
  server: 'SERVER_ERROR',
};

describe('test response interceptors', () => {
  let api;

  beforeAll(async () => {
    api = new FetchApi({
      baseUrl: 'https://cool.api/',
      responseInterceptors: [async res => {
        const { status } = res;
    
        if(status === 403) {
          throw new Error(errors.forbidden);
        } else if(status === 500) {
          throw new Error(errors.server);
        }
        res.data = await res.json();
        return res;
      }],
    });
  });

  it('transforms json response', async () => {
    const statusData = { status: 'OK' };
    fetchMock.get('https://cool.api/status/', { body: statusData });
    
    const { data } = await api.request({ url: 'status/' });
    expect(data).toEqual(statusData);
  });

  it('throws errors', async () => {
    fetchMock.post('https://cool.api/stuff/', 403);
    fetchMock.post('https://cool.api/stuff2/', 500);

    await expect(api.request({ url: 'stuff/', method: 'POST' }))
      .rejects.toThrow(errors.forbidden);

      await expect(api.request({ url: 'stuff2/', method: 'POST' }))
        .rejects.toThrow(errors.server);
  });

  it('can add response interceptors', async () => {
    const errorList = ['BAD_NAME', 'BAD_PASSWORD'];
    api.interceptResponse(async res => {
      if(res.data.errors) {
        throw new Error(res.data.errors[0]);
      }
      return res;
    });
    fetchMock.post('https://cool.api/login/', { body: { errors: errorList } });

    await expect(api.request({ url: 'login/', method: 'POST' }))
      .rejects.toThrow(errorList[0]);
  });
});
