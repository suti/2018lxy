<template>
  <div class="hslShadow" :style="{width: width + 'px', height: width + 'px'}">
    <button @click="create">render</button>
    <canvas
      ref="canvas"
      :width="width"
      :height="width"
      style="background: red;"
    ></canvas>
  </div>
</template>
<script>
  export default {
    name: 'hslShadow',
    props: {
      width: {
        default: 512,
      },
    },
    methods: {
      create () {
        let ctx = this.$refs.canvas.getContext('2d')
        let {width: w} = this
        ctx.clearRect(0, 0, w, w)
        let xpix = 1 / (w * 2 ** (1 / 2))
        console.log(xpix)
        for (let l = 0; l < w; l++) {
          for (let t = 0; t < w; t++) {
            let c = Math.round(128 + (l - t) * 128 / w)
            let p = ((w - t) ** 2 + (w - l) ** 2) ** (1 / 2) * xpix
            ctx.fillStyle = `rgba(${c},${c},${c},${p*1.2})`
            ctx.fillRect(l, t, 1, 1)
          }
        }
      },
    },
  }
</script>
<style lang="less" scoped>

</style>