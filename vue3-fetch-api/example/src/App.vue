<template>
<div class="vue3-example">
  <h1>Fetch Api Example</h1>
  <h4>
    This demo provides a fake API at <span>https://fetching.com/data/</span>
  </h4>
  <div>Try to GET, POST, PUT, or DELETE some data. Other endpoints will time out.</div>
  <div class="inputs">
    <div>URL: <input v-model="url" type="text"></div>
    <div>ID:  <input v-model="objectId" type="text" placeholder="Not needed for GET/POST"></div>
    <div>Data: <input v-model="data" type="text"></div>
  </div>
  <div class="buttons">
    <button @click="getData">GET</button>
    <button @click="postData">POST</button>
    <button @click="putData">PUT</button>
    <button @click="deleteData">DELETE</button>
  </div>
  <div class="data" v-html="display" />
</div>
</template>

<script lang="ts">
import { defineComponent, ref, inject } from 'vue';

type Data = {
  [key: number]: string
}

const apiUrl = 'https://fetching.com/data/';
const dataStore: Data = {};
let currentId = 1;
import fetchMock from 'fetch-mock/esm/client.js';

fetchMock
  .get(apiUrl, () => ({
    status: 200,
    body: Object.entries(dataStore).map(([id, data]) => ({ id, data }))
  }))
  .post(apiUrl, (_url, options) => {
    const { data } = JSON.parse(options.body);
    if(typeof data === 'string') {
      dataStore[currentId] = data;
      currentId += 1;
      return 201;
    }
    return 400;
  })
  .put(apiUrl, (_url, options) => {
    const { data, id } = JSON.parse(options.body);
    if(id in dataStore && typeof data === 'string') {
      dataStore[id] = data;
      return 200;
    }
    return 400;
  })
  .delete(apiUrl, (_url, options) => {
    const { id } = JSON.parse(options.body);
    if(id in dataStore) {
      delete dataStore[id];
      return 204;
    }
    return 400;
  });

export default defineComponent({
  name: 'App',
  setup() {
    const url = ref(apiUrl);
    const objectId = ref('');
    const data = ref('');
    const api = inject('$api');
    let display = ref('API data displayed here: try to GET https://fetching.com/data/');

    const result = async (req: any) => {
      const rsp = await req;
      display.value = `Result: ${rsp.status}`;
    };

    const postData = () => (
      result(api.request({
        url: url.value,
        method: 'POST',
        data: { data: data.value },
      }))
    );
    const putData = () => {
      result(api.request({
        url: url.value,
        method: 'PUT',
        data: { data: data.value, id: objectId.value },
      }))
    };
    const deleteData = () => (
      result(api.request({
        url: url.value,
        method: 'DELETE',
        data: { id: objectId.value },
      }))
    );
    return { url, objectId, data, putData, postData, deleteData, display };
  },
  methods: {
    async getData() {
      const rsp = await this.$api.request({
        url: this.url,
      });
      this.display = rsp.data.map(d => `ID: ${d.id}, Data: ${d.data}`).join('<br>');
    }
  }
})
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

body {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

.inputs {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.inputs > div, .buttons, .data {
  margin-top: 16px;
}
input {
  width: 240px;
}
.data {
  background-color: #EEE;
  width: 400px;
  display: inline-block;
  padding: 12px 16px;
}
</style>