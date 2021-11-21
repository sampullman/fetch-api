import { expectedTestInfo, fetch, FetchApi, TestApiResponse } from './utils';

const errors = {
  forbidden: 'FORBIDDEN',
  server: 'SERVER_ERROR',
};

describe('test response interceptors', () => {
  let api: FetchApi<TestApiResponse>;

  beforeAll(async () => {
    api = new FetchApi<TestApiResponse>({
      baseUrl: 'https://cool.api/',
      responseInterceptors: [
        async (res) => {
          const { status } = res;

          if (status === 403) {
            throw new Error(errors.forbidden);
          } else if (status === 500) {
            throw new Error(errors.server);
          }
          res.data = await res.json();
          return res;
        },
      ],
    });
  });

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('transforms json response', async () => {
    const statusData = { status: 'OK' };
    const requestConfig = { url: 'status/', data: statusData };
    const { expectedResponse, expectedRequest } = expectedTestInfo(requestConfig);
    (fetch as any).mockReturnValue(expectedResponse);

    const rsp = await api.request(requestConfig);
    expect(rsp.data).toEqual(statusData);
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith('https://cool.api/status/', expectedRequest);
  });

  it('throws errors', async () => {
    (fetch as any).mockReturnValue({ status: 403 });
    await expect(api.request({ url: 'stuff/', method: 'POST' })).rejects.toThrow(
      errors.forbidden,
    );

    (fetch as any).mockReturnValue({ status: 500 });
    await expect(api.request({ url: 'stuff2/', method: 'POST' })).rejects.toThrow(
      errors.server,
    );
  });

  it('can add response interceptors', async () => {
    const errorList = ['BAD_NAME', 'BAD_PASSWORD'];
    api.interceptResponse(async (res: TestApiResponse) => {
      const d = res.data as any;
      if (d.errors) {
        throw new Error(d.errors[0]);
      }
      return res;
    });

    const statusData = { status: 'OK' };
    const requestConfig = { url: 'login/', method: 'POST', data: { errors: errorList } };
    const { expectedResponse } = expectedTestInfo(requestConfig);
    (fetch as any).mockReturnValue(expectedResponse);

    await expect(api.request({ url: 'login/', method: 'POST' })).rejects.toThrow(
      errorList[0],
    );
  });
});
