<template>
  <div class="colorPicker" ref="colorPicker">
    <div class="colorPicker-1" v-if="!state">
      <div
        class="colorPicker-inner"
        @mousedown="pickerDown"
      >
        <div
          class="colorPicker-colors"
          v-for="color in colorList"
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
          v-for="color in colorList"
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
        state: 0,
        colorList: ['#00ccff', '#00ccff', '#00ccff', '#00ccff'],
        curHue: 192,
        curHsl: {h: 192, s: 1, l: .5},

        // hslsp: {},
      }
    },
    methods: {
      pickerDown () {
        let now = Date.now()
        let moveFlag = false
        let startPoint = null

        const mousemove = e => {
          if (startPoint === null) {
            startPoint = {x: e.clientX, y: e.clientY}
            return
          }
          let mo = {x: e.clientX, y: e.clientY}
          if ((startPoint.x - mo.x) ** 2 > 25 || (startPoint.y - mo.xy) ** 2 > 25) {
            moveFlag = true
            let cp = {
              x: this.$refs.colorPicker.offsetLeft + 60,
              y: this.$refs.colorPicker.offsetTop + 60,
            }

            let hue = Math.atan2(cp.y - mo.y, mo.x - cp.x) * 180 / Math.PI
            if (cp.y < mo.y)
              hue += 360
          }

          // this.curHue = hue
        }
        const mouseup = () => {
          document.removeEventListener('mousemove', mousemove)
          document.removeEventListener('mouseup', mouseup)
          if (Date.now() - now < 400 && !moveFlag) {
            this.state = ~~!this.state
          } else if (moveFlag) {
            this.colorList = [this.curHex, this.curHex, this.curHex, this.curHex]
          }
        }
        document.addEventListener('mousemove', mousemove)
        document.addEventListener('mouseup', mouseup)
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
          this.curHsl.h = hue / 360
        }
        const mouseup = () => {
          document.removeEventListener('mousemove', mousemove)
          document.removeEventListener('mouseup', mouseup)
          this.colorList = [this.curHex, this.curHex, this.curHex, this.curHex]
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
          let deg = Math.atan2(cp.y - mo.y, mo.x - cp.x) * 180 / Math.PI - 45
          let ll = ((cp.y - mo.y) ** 2 + (mo.x - cp.x) ** 2) ** (1 / 2)
          let x = ll * Math.cos(deg * Math.PI / 180) + 17
          let y = 17 - ll * Math.sin(deg * Math.PI / 180)
          // positionLimit
          if (x < -6) x = -6
          if (x > 40) x = 40
          if (y < -6) y = -6
          if (y > 40) y = 40

          let h, s, l
          h = this.curHue / 360
          x += 6
          y += 6
          s = y / (46 - x + y)
          l = (46 - y + x) / 92
          this.curHsl = {h, s, l}
        }
        const mouseup = () => {
          document.removeEventListener('mousemove', mousemove)
          document.removeEventListener('mouseup', mouseup)
          this.colorList = [this.curHex, this.curHex, this.curHex, this.curHex]
        }
        document.addEventListener('mousemove', mousemove)
        document.addEventListener('mouseup', mouseup)
      },
    },
    watch: {
      curHex () {
        this.$set(this.colorList, 1, this.curHex)
        this.$set(this.colorList, 3, this.curHex)
      },
      state () {
        if (this.state) {

        }
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
        let x, y
        let {s, l} = this.curHsl
        x = 92 * (1 - l) * s + 92 * l - 46
        y = 46 + x - 92 * l
        return {
          top: y - 6 + 'px',
          left: x - 6 + 'px',
        }
      },
      curHex () {
        return '#' + colors.HSL2Hex(this.curHsl)
      },

    },
  }
</script>
<style lang="less" scoped>
  @import "colorPicker";
</style>