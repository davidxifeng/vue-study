<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png">
    <Demo msg="hello vue" />
  </div>
</template>

<script>
import Demo from './components/Demo.vue'

export default {
  name: 'app',
  components: {
    Demo
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
