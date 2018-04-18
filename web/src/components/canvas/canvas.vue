<template>
  <div class="canvas" :style="style">
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
  import { mapActions, mapGetters } from 'vuex'

  export default {
    name: 'canvas',
    data () {
      return {}
    },
    computed: {
      ...mapGetters({
        canvasData: 'getCanvasData',
      }),
      style () {
        return {
          height: this.canvasData.height + 'px',
          width: this.canvasData.width + 'px',
        }
      },
    },
    components: {
      render,
      operator,
    },
  }
</script>
<style lang="less" scoped>
  .canvas {
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