<template>
  <div class="colorPicker" ref="colorPicker">
    <div class="colorPicker-1" v-if="!state">
      <div
        class="colorPicker-inner"
        @click="change"
      >
        <div
          class="colorPicker-colors"
          v-for="color in colors"
          :style="{background:color}"
        ></div>
      </div>
      <div class="colorPicker-angle"></div>
      <div class="colorPicker-exit"></div>
    </div>
    <div class="colorPicker-2" v-else>
      <div class="colorPicker-inner">
        <div
          class="colorPicker-colors"
          v-for="color in colors"
          :style="{background:color}"
        ></div>
        <div
          class="colorPicker-hueWheel"
          @mousedown="hueWheelDown"
        >
          <div class="colorPicker-hueWheel-selector selector" :style="huesp"></div>
        </div>
        <div class="colorPicker-hsl-shadow">
          <div
            class="colorPicker-hsl"
            :style="{background:colorByHue}"
            @mousedown.stop="hslPickerDown"
          >
            <div class="colorPicker-hsl-selector selector" :style="hslsp"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import { colorTranform } from '../../lib/colorTranform'

  const colors = colorTranform()

  export default {
    name: 'colorPicker',
    data () {
      return {
        state: 1,
        colors: ['#00ccff', '#00ccff', '#00ccff', '#00ccff'],
        curHue: 0,
        curHslDeg: 0,
        curHslRadii: 0,
      }
    },
    methods: {
      change () {
        this.state = ~~!this.state
      },
      hueWheelDown () {
        const mousemove = e => {
          let cp = {
            x: this.$refs.colorPicker.offsetLeft + 60,
            y: this.$refs.colorPicker.offsetTop + 60,
          }
          let mo = {x: e.clientX, y: e.clientY}
          let hue = Math.atan2(cp.y - mo.y, mo.x - cp.x) * 180 / Math.PI
          if (cp.y < mo.y)
            hue += 360
          this.curHue = hue
        }
        const mouseup = () => {
          document.removeEventListener('mousemove', mousemove)
          document.removeEventListener('mouseup', mouseup)
        }
        document.addEventListener('mousemove', mousemove)
        document.addEventListener('mouseup', mouseup)
      },
      hslPickerDown () {
        const mousemove = e => {
          let cp = {
            x: this.$refs.colorPicker.offsetLeft + 60,
            y: this.$refs.colorPicker.offsetTop + 60,
          }
          let mo = {x: e.clientX, y: e.clientY}
          this.curHslDeg = Math.atan2(cp.y - mo.y, mo.x - cp.x) * 180 / Math.PI
          this.curHslRadii = ((cp.y - mo.y) ** 2 + (mo.x - cp.x) ** 2) ** (1 / 2)
        }
        const mouseup = () => {
          document.removeEventListener('mousemove', mousemove)
          document.removeEventListener('mouseup', mouseup)
        }
        document.addEventListener('mousemove', mousemove)
        document.addEventListener('mouseup', mouseup)
      },
    },
    computed: {
      colorByHue () {
        return '#' + colors.HSL2Hex({h: this.curHue / 360, s: 1, l: 0.5})
      },
      huesp () {
        let hue = this.curHue
        if (hue > 180)
          hue -= 360
        let ll = 32 * 2 ** (1 / 2)
        let x = ll * Math.cos(hue * Math.PI / 180) + 48
        let y = 48 - ll * Math.sin(hue * Math.PI / 180)
        return {
          top: y + 'px',
          left: x + 'px',
        }
      },
      hslsp () {
        let deg = this.curHslDeg - 45
        let ll = this.curHslRadii
        let x = ll * Math.cos(deg * Math.PI / 180) + 17
        let y = 17 - ll * Math.sin(deg * Math.PI / 180)
        if (x < -6) x = -6
        if (x > 40) x = 40
        if (y < -6) y = -6
        if (y > 40) y = 40
        return {
          top: y + 'px',
          left: x + 'px',
        }
      },

    },
  }
</script>
<style lang="less" scoped>
  @import "colorPicker";
</style>