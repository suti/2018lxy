<template>
  <div class="hueWheel" :style="{width: width + 'px', height: height + 'px'}">
    <button @click="create">render</button>
    <button @click="test">test</button>
    <input type="text" v-model="h">
    <input type="text" v-model="s">
    <input type="text" v-model="l">
    <span>rgb::{{testColor}}</span>
    <canvas
      ref="canvas"
      :width="width"
      :height="height"
    ></canvas>
  </div>
</template>
<script>
  import { colorTranform } from '../../lib/colorTranform'

  const colors = colorTranform()
  export default {
    name: 'hueWheel',
    data () {
      return {
        testColor: '',
        h: 0,
        s: 1,
        l: .5,
      }
    },
    props: {
      width: {
        default: 800,
      },
      height: {
        default: 800,
      },
      wheelWidth: {
        default: 320,
      },
    },
    methods: {
      test () {
        let {h, s, l} = this
        this.testColor = colors.HSL2RGB({h, s, l})
      },
      create () {
        let ctx = this.$refs.canvas.getContext('2d')
        let {width: w, height: h, wheelWidth: ww} = this

        for (let l = 0; l < w; l++) {
          for (let t = 0; t < h; t++) {
            let s1 = l - w / 2
            let s2 = h / 2 - t
            let s3 = (s1 ** 2 + s2 ** 2) ** (1 / 2)

            if (s3 > w / 2)
              continue

            let Hue = Math.atan2(s2, s1) * 180 / Math.PI
            if (s2 < 0)
              Hue += 360
            let {r, g, b} = colors.HSB2RGB({h: Hue, s: s3 * 200 / w, b: 100})
            ctx.fillStyle = `rgb(${r},${g},${b})`
            ctx.fillRect(l, t, 1, 1)
          }
        }
        console.log('ok')
      },
    },
  }
</script>
<style lang="less" scoped>

</style>