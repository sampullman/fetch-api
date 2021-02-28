require('abort-controller/polyfill');

const fetchMock = require('fetch-mock-jest');
const { FetchApi } = require('../dist/fetch-api.umd');

const jsonInterceptor = async (res: Response) => (
  { ...res, data: res.body ? await res.json() : null }
);

module.exports = {
  fetchMock,
  FetchApi,
  jsonInterceptor,
};
