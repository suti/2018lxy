<template>
  <div class="colorpicker">
    <div class="colorpicker-inner" :style="{background:color}"></div>
  </div>
</template>
<script>
  export default {
    name: 'colorpicker',
    data () {
      return {
        color: '#00ffcc',
      }
    },
  }
</script>
<style lang="less" scoped>

  .colorpicker {
    width: 200px;
    height: 200px;

    border-radius: 50%;
    box-shadow: 0 0 0 1px rgba(0, 0, 0, .16);
    position: absolute;

    .colorpicker-inner {
      width: 180px;
      height: 180px;
      border-radius: 50%;
      position: absolute;
      top: 10px;
      left: 10px;
      box-shadow: inset 0 0 0 1px rgba(0, 0, 0, .16);
    }
  }
</style>