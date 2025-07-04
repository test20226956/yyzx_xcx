<template>
    <div id="app">
      <div id="preview-wrapper">
        <router-view />
      </div>
    </div>
</template>

<style>

html, body, #app {
  margin: 0;
  padding: 0;
  height: 100vh;
  width: 100%;
}
</style>
<script setup>
import axios from 'axios';
import { provide } from 'vue';

axios.defaults.baseURL = 'http://localhost:9000/'
provide('axios', axios);
</script>