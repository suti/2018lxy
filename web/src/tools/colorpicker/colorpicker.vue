<template>
  <div class="colorpicker">
    <div class="colorpicker-1" v-if="!state">
      <div
        class="colorpicker-inner"
        @click="change"
      >
        <div
          class="colorpicker-colors"
          v-for="color in colors"
          :style="{background:color}"
        ></div>
      </div>
      <div class="colorpicker-angle"></div>
      <div class="colorpicker-exit"></div>
    </div>
    <div class="colorpicker-2" v-else>

    </div>
  </div>
</template>
<script>
  export default {
    name: 'colorpicker',
    data () {
      return {
        state: 0,
        colors: ['#ff00cc', '#ffcc00', '#00ccff', '#00ffcc'],
      }
    },
    methods: {
      change () {
        this.state = 1
      },
    },
  }
</script>
<style lang="less" scoped>
  @import "./colorpicker";
</style>