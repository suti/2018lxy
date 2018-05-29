<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>
<script>

  export default {
    name: 'app',
    data () {
      return {}
    },
  }
</script>
<style>
  @import "~element-ui/lib/theme-chalk/index.css";
  @import "~bootstrap/dist/css/bootstrap.css";
</style>
<style lang="less" scoped>
  #app {
    width: 100%;
    height: 100%;
  }
</style>