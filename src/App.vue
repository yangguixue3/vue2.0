<template>
  <div id="app">
    <div>
      <!-- <el-button>el-button</el-button> -->
      <router>home</router>
      <router-view></router-view>
    </div>

  </div>
</template>

<script>
import router from './components/Router.vue'

export default {
  name: 'app',
  components: {
    router
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
