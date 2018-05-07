<template>
  <div
    id="operator"
    :style="operatorStyle"
    v-if="focusElemIndex > -1"
    @mousedown.seft.left="moveMouseDown"
  >
    <div class="rect-show pos-ab">{{rectStr}}</div>
    <!-- 东西操作点 -->
    <div class="w-resize-point pos-ab resize-point"
         title="拉伸"
         @mousedown.stop.prevent="resizeMouseDown(4,$event)"
         @click.stop
         :class="{active:point === 4}"
    ></div>
    <div class="e-resize-point pos-ab resize-point"
         title="拉伸"
         @mousedown.stop.prevent="resizeMouseDown(0,$event)"
         @click.stop
         :class="{active:point === 0}"
    ></div>
    <!-- 东西锚点 -->
    <div class="w-point pos-ab" ref="start0"></div>
    <div class="e-point pos-ab" ref="end0"></div>
    <!-- 南北操作点 -->
    <div class="n-resize-point pos-ab resize-point"
         title="拉伸"
         @mousedown.stop.prevent="resizeMouseDown(2,$event)"
         @click.stop
         :class="{active:point === 2}"
    ></div>
    <div class="s-resize-point pos-ab resize-point"
         title="拉伸"
         @mousedown.stop.prevent="resizeMouseDown(6,$event)"
         @click.stop
         :class="{active:point === 6}"
    ></div>
    <!-- 南北锚点 -->
    <div class="n-point pos-ab" ref="start1"></div>
    <div class="s-point pos-ab" ref="end1"></div>
    <!-- 东南、西北操作点 -->
    <div class="nw-resize-point pos-ab resize-point"
         title="调整大小"
         :class="{active:point === 3}"
         @click.stop
         @mousedown.stop.prevent="resizeMouseDown(3,$event)"></div>
    <div class="se-resize-point pos-ab resize-point"
         title="调整大小"
         :class="{active:point === 7}"
         @click.stop
         @mousedown.stop.prevent="resizeMouseDown(7,$event)"></div>
    <!-- 东南、西北锚点-->
    <div class="nw-point pos-ab" ref="start2"></div>
    <div class="se-point pos-ab" ref="end2"></div>
    <!-- 西南、东北操作点 -->
    <div class="ne-resize-point pos-ab resize-point"
         title="调整大小"
         :class="{active:point === 1}"
         @click.stop
         @mousedown.stop.prevent="resizeMouseDown(1,$event)"></div>
    <div class="sw-resize-point pos-ab resize-point"
         title="调整大小"
         :class="{active:point === 5}"
         @click.stop
         @mousedown.stop.prevent="resizeMouseDown(5,$event)"></div>
    <!-- 西南、东北锚点 -->
    <div class="ne-point pos-ab" ref="start3"></div>
    <div class="sw-point pos-ab" ref="end3"></div>
    <!-- 中心锚点 -->
    <div class="mid-point" ref="mid"></div>
    <!-- 旋转操作点 -->
    <div class="rotate-btn"
         title="旋转"
         @mousedown.stop.prevent="rotateMouseDown"
         @click.stop
    >
      <div class="rotate-text" v-show="showRotate" :style="rotateTextStyle">{{rotateValue}}°</div>
    </div>

  </div>
</template>
<script>
  import { mapGetters, mapActions } from 'vuex'

  export default {
    name: 'operator',
    data () {
      return {
        point: -1,
        showRotate: false,
      }
    },
    computed: {
      ...mapGetters({
        focusElemIndex: 'getFocusElemIndex',
        focusElemJson: 'getFocusElemJson',
      }),
      elemData () {
        return this.focusElemJson ? this.focusElemJson.data : {}
      },
      operatorStyle () {
        return {
          left: this.elemData.transform.translate[0] + 'px',
          top: this.elemData.transform.translate[1] + 'px',
          width: this.elemData.width + 'px',
          height: this.elemData.height + 'px',
          transform: `rotate(${this.elemData.transform.rotate[0]}deg)`,
        }
      },
      rotateValue () {
        return this.elemData.transform.rotate[0]
      },
      rectStr () {
        return `${this.elemData.width},${this.elemData.height}`
      },
      rotateTextStyle () {
        return {}
      },
    },
    methods: {
      moveMouseDown (event) {
        let startPoint = {x: event.clientX, y: event.clientY}
        let [elX, elY] = this.elemData.transform.translate

        let mousemove = event => {
          let {x, y} = startPoint
          let change = {x: event.clientX - x, y: event.clientY - y}
          this.elemData.transform.translate = [elX + change.x, elY + change.y]
        }
        let mouseup = () => {
          document.removeEventListener('mousemove', mousemove)
          document.removeEventListener('mouseup', mouseup)
        }
        document.addEventListener('mousemove', mousemove)
        document.addEventListener('mouseup', mouseup)
      },

      resizeMouseDown (point, event) {
        this.point = point
        let startPoint = {x: event.clientX, y: event.clientY}
        let [elX, elY] = this.elemData.transform.translate
        let rotate = this.elemData.transform.rotate
        let width = this.elemData.width
        let height = this.elemData.height
        let ratio = Math.atan2(height, width) * 180 / Math.PI

        let mousemove = event => {
          let {x, y} = startPoint
          let change = {x: event.clientX - x, y: event.clientY - y}
          let deg = Math.atan2(change.y, x - event.clientX) * 180 / Math.PI + 180
          if (deg < 0) deg += 360
          let chLen = (change.x ** 2 + change.y ** 2) ** (1 / 2)
          let cpDeg = 0, cpLen = 0, cpX = 0, cpY = 0
          let newValue = {transform: {...this.elemData.transform}}

          switch (point) {
            case 0:
              break
            case 1:
              cpDeg = Math.abs(deg <= (180 + ratio) ? (deg - 90 - ratio) : (360 + ratio - 90 - deg))
              cpLen = chLen * Math.sin(cpDeg / 180 * Math.PI)
              cpX = cpLen * Math.cos(ratio / 180 * Math.PI)
              cpY = cpLen * Math.sin(ratio / 180 * Math.PI)
              if (deg >= 90 + ratio && deg <= 360 + ratio - 90) {
                newValue.width = width - cpX
                newValue.height = height - cpY
                newValue.transform.translate = [elX, elY + cpY]
                newValue.transform.rotate = rotate

              } else {
                newValue.width = width + cpX
                newValue.height = height + cpY
                newValue.transform.translate = [elX, elY - cpY]
                newValue.transform.rotate = rotate
              }
              break
            case 2:
              break
            case 3:
              cpDeg = Math.abs(deg <= (90 + ratio) ? (ratio - deg) : (deg - 180 - ratio))
              cpLen = chLen * Math.sin(cpDeg / 180 * Math.PI)
              cpX = cpLen * Math.cos(ratio / 180 * Math.PI)
              cpY = cpLen * Math.sin(ratio / 180 * Math.PI)
              if (deg >= ratio && deg <= 180 + ratio) {
                newValue.width = width + cpX
                newValue.height = height + cpY
                newValue.transform.translate = [elX - cpX, elY - cpY]
                newValue.transform.rotate = rotate
              } else {
                newValue.width = width - cpX
                newValue.height = height - cpY
                newValue.transform.translate = [elX + cpX, elY + cpY]
                newValue.transform.rotate = rotate
              }
              break
            case 4:

              break
            case 5:
              cpDeg = Math.abs(deg <= (180 + ratio) ? (deg - 90 - ratio) : (360 + ratio - 90 - deg))
              cpLen = chLen * Math.sin(cpDeg / 180 * Math.PI)
              cpX = cpLen * Math.cos(ratio / 180 * Math.PI)
              cpY = cpLen * Math.sin(ratio / 180 * Math.PI)
              if (deg >= 90 + ratio && deg <= 360 + ratio - 90) {
                newValue.width = width + cpX
                newValue.height = height + cpY
                newValue.transform.translate = [elX - cpX, elY]
                newValue.transform.rotate = rotate
              } else {
                newValue.width = width - cpX
                newValue.height = height - cpY
                newValue.transform.translate = [elX + cpX, elY]
                newValue.transform.rotate = rotate
              }
              break
            case 6:
              break
            case 7:
              cpDeg = Math.abs(deg <= (90 + ratio) ? (ratio - deg) : (deg - 180 - ratio))
              cpLen = chLen * Math.sin(cpDeg / 180 * Math.PI)
              cpX = cpLen * Math.cos(ratio / 180 * Math.PI)
              cpY = cpLen * Math.sin(ratio / 180 * Math.PI)
              if (deg >= ratio && deg <= 180 + ratio) {
                newValue.width = width - cpX
                newValue.height = height - cpY
              } else {
                newValue.width = width + cpX
                newValue.height = height + cpY
              }
              break
          }

          if (this.focusElemJson.type.indexOf('svg') > -1) {

          } else {
            newValue.imgWidth = newValue.width
            newValue.imgHeight = newValue.height
          }
          Object.assign(this.elemData, newValue)
        }
        let mouseup = () => {
          this.point = -1
          document.removeEventListener('mousemove', mousemove)
          document.removeEventListener('mouseup', mouseup)
        }
        document.addEventListener('mousemove', mousemove)
        document.addEventListener('mouseup', mouseup)
      },

      rotateMouseDown (event) {
        this.showRotate = true
        let startPoint = {x: event.clientX, y: event.clientY}
        let [rotate, originX, originY] = this.elemData.transform.rotate
        let width = this.elemData.width
        let height = this.elemData.height

        let mouseup = () => {
          this.showRotate = false
          document.removeEventListener('mousemove', mousemove)
          document.removeEventListener('mouseup', mouseup)
        }
        document.addEventListener('mousemove', mousemove)
        document.addEventListener('mouseup', mouseup)
      },
    },

  }
</script>
<style lang="less" scoped>
  #operator {
    position: absolute;

    .pos-ab {
      position: absolute;
    }

    &:before {
      content: "";
      position: absolute;
      left: 0;
      top: 0;
      right: 0;
      bottom: 0;
      border: 1px solid rgba(255, 255, 255, .67);
    }

    &:after {
      content: "";
      position: absolute;
      left: 0;
      top: 0;
      right: 0;
      bottom: 0;
      border: 1px dashed rgba(0, 0, 0, .5);
    }

    .rect-show {
      height: 20px;
      font-size: 10px;
      line-height: 20px;
      padding: 0 6px;
      color: #fff;
      background: #464F57;
      opacity: 0.3;
      top: 0;
      right: 100%;
      margin-right: 5px;
    }

    .resize-point {
      width: 20px;
      height: 20px;
      padding: 3px;
      z-index: 1;
      &:before {
        content: " ";
        display: block;
        width: 10px;
        height: 10px;
        background: #626262;
        border-radius: 50%;
        border: 2px solid #fff;
        box-shadow: 0px 0px 3px 1px rgba(0, 0, 0, 0.15);
      }
      &:hover, &[class~='active'] {
        &:before {
          background: #07aefc;
        }
      }
    }
    .point-bg {
      padding: 0;
      &:before {
        width: 16px;
        height: 16px;
        background: #07aefc;
      }
    }
    .e-resize-point {
      top: 50%;
      margin-top: -10px;
      right: -10px;
      cursor: ew-resize;
      z-index: 2;

      &[class~='editing']:before {
        width: 6px;
        margin-left: 6px;
        border-radius: 0 10px 10px 0;
        border-left: none;
      }
    }
    .e-point {
      right: 0;
      top: 50%;
    }
    .w-resize-point {
      cursor: ew-resize;
      top: 50%;
      margin-top: -10px;
      left: -10px;
      z-index: 2;

      &[class~='editing']:before {
        width: 6px;
        border-radius: 10px 0 0 10px;
        border-right: none;
      }
    }
    .w-point {
      left: 0;
      top: 50%;
    }
    .s-resize-point {
      cursor: ns-resize;
      bottom: -10px;
      left: 50%;
      margin-left: -10px;
      z-index: 2;
    }
    .s-point {
      bottom: 0;
      left: 50%;
    }
    .n-resize-point {
      cursor: ns-resize;
      top: -10px;
      left: 50%;
      margin-left: -10px;
      z-index: 2;
    }
    .n-point {
      top: 0;
      left: 50%;
    }
    .se-resize-point, .lock-point {
      cursor: nwse-resize;
      right: -10px;
      bottom: -10px;
    }
    .se-point {
      right: 0;
      bottom: 0;
    }
    .nw-resize-point {
      cursor: nwse-resize;
      left: -10px;
      top: -10px;
    }
    .nw-point {
      left: 0;
      top: 0
    }
    .ne-resize-point {
      cursor: nesw-resize;
      right: -10px;
      top: -10px;
    }
    .ne-point {
      right: 0;
      top: 0;
    }
    .sw-resize-point {
      cursor: nesw-resize;
      left: -10px;
      bottom: -10px;
    }
    .sw-point {
      left: 0;
      bottom: 0;
    }
    .rotate-btn {
      width: 0px;
      height: 40px;
      margin: 0 auto;
      position: relative;
      top: 100%;
      &:hover {
        &:before {
          background-position-y: -20px;
        }
      }
      &:before {
        content: "";
        position: absolute;
        top: 16px;
        left: -10px;
        width: 20px;
        height: 20px;
        border-radius: 10px;
        box-shadow: 0 1px 4px rgba(0, 0, 0, 0.24);
        background: url(./img/rotate_new.svg) 0 0;
        cursor: pointer;
      }
      &:after {
        content: "";
        display: block;
        position: absolute;
        left: 50%;
        height: 16px;
        border-left: 1px dashed rgb(155, 155, 155);
      }
      .rotate-text {
        width: 40px;
        position: absolute;
        left: -20px;
        top: 50px;
        text-align: center;
        color: #FFF;
        background-color: #979797;
      }
    }
    .rotate-btn-active {
      &:before {
        background-position-y: -20px;
      }
    }
    .mid-point {
      position: absolute;
      width: 0;
      height: 0;
      left: 50%;
      top: 50%;
    }
    .rect-show {
      height: 20px;
      font-size: 10px;
      line-height: 20px;
      padding: 0 6px;
      color: #fff;
      background: #464F57;
      opacity: 0.3;
      top: 0;
      right: 100%;
      margin-right: 5px;
    }
  }
</style>