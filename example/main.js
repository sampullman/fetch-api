import { FetchApi } from '@sampullman/fetch-api';
import fetchMock from 'fetch-mock/esm/client.js';
import './style.css';

const jsonInterceptor = async (res) => {
  res.data = res.body ? await res.json() : null;
  return res;
};

const api = new FetchApi({
  responseInterceptors: [jsonInterceptor],
});

const apiUrl = 'https://fetching.com/data/';
const dataStore = {};
let currentId = 1;

fetchMock
  .get(apiUrl, () => ({
    status: 200,
    body: Object.entries(dataStore).map(([id, data]) => ({ id, data })),
  }))
  .post(apiUrl, (_url, options) => {
    const { data } = JSON.parse(options.body);
    if (typeof data === 'string') {
      dataStore[currentId] = data;
      currentId += 1;
      return 201;
    }
    return 400;
  })
  .put(apiUrl, (_url, options) => {
    const { data, id } = JSON.parse(options.body);
    if (id in dataStore && typeof data === 'string') {
      dataStore[id] = data;
      return 200;
    }
    return 400;
  })
  .delete(apiUrl, (_url, options) => {
    const { id } = JSON.parse(options.body);
    if (id in dataStore) {
      delete dataStore[id];
      return 204;
    }
    return 400;
  });

const getText = (id) => document.getElementById(id).value;

const result = (req) => {
  req.then((rsp) => {
    document.getElementById('data').innerHTML = `Result: ${rsp.status}`;
  });
};

function getData() {
  api
    .request({
      url: getText('url-input'),
    })
    .then((rsp) => {
      document.getElementById('data').innerHTML = rsp.data
        .map((d) => `ID: ${d.id}, Data: ${d.data}`)
        .join('<br>');
    });
}
window.getData = getData;

function postData() {
  result(
    api.request({
      url: getText('url-input'),
      method: 'POST',
      data: { data: getText('data-input') },
    }),
  );
}
window.postData = postData;

function putData() {
  result(
    api.request({
      url: getText('url-input'),
      method: 'PUT',
      data: {
        data: getText('data-input'),
        id: getText('id-input'),
      },
    }),
  );
}
window.putData = putData;

function deleteData() {
  result(
    api.request({
      url: getText('url-input'),
      method: 'DELETE',
      data: { id: getText('id-input') },
    }),
  );
}
window.deleteData = deleteData;
