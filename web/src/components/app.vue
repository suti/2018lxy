<template>
  <div id="app">
    {{app}}
  </div>
</template>
<script>
  export default {
    name: 'app',
    data () {
      return {
        app:'hello world'
      }
    },
  }
</script>
<style lang="less" scoped>
  #app{
    width: 500px;
    height: 600px;
    font-size: 26px;
    line-height: 600px;
    margin: 0 auto;
    color: #00ffcc;

    &:hover{
      color: #00ccff;
    }
  }
</style>