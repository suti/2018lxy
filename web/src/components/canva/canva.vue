<template>
  <div class="canva">
    <div class="render">
      <render></render>
    </div>
    <div class="operator">
      <operator></operator>
    </div>
  </div>
</template>
<script>
  import render from '../render/render'
  import operator from '../operator/operator'

  export default {
    name: 'canva',
    data () {
      return {}
    },
    components: {
      render,
      operator,
    },
  }
</script>
<style lang="less" scoped>
  .canva {
    background: #ffffff;
    display: block;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 80%;
    height: 80%;
  }
</style>