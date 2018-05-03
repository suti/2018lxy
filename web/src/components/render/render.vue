<template>
  <svg
    :viewBox="viewBox"
    :width="canvasWidth"
    :height="canvasHeight"
    id="render"
    version='1.1'
    xmlns='http://www.w3.org/2000/svg'
    xmlns:xlink='http://www.w3.org/1999/xlink'
    @click.self.left="setFocusElemIndex(-1)"
  >
    <g
      v-for="(element, index) in elementsData"
      :key="index"
      :data-index="index"
      :transform="computeTransform(element.data.transform)"
      @click.left="elementClick($event, index)"
      @mousedown.left="elementDown($event, index)"
    >
      <svg-render
        v-if="element.type === 'svg'"
        :element="element"
      ></svg-render>
      <image-render
        v-if="element.type === 'image'"
        :element="element"
      ></image-render>
    </g>
  </svg>
</template>
<script>
  import { mapActions, mapGetters } from 'vuex'
  import svgRender from './randers/svg'
  import imageRender from './randers/image'

  export default {
    name: 'render',
    data () {
      return {}
    },
    methods: {
      ...mapActions([
        'setFocusElemIndex',
      ]),
      computeTransform (transform) {
        let {translate, rotate} = transform
        return `translate(${translate.join(',')}),rotate(${rotate.join(',')})`
      },
      elementClick (event, elemIndex) {
        this.setFocusElemIndex(elemIndex)
      },
      elementDown (event, elemIndex) {
        let startPoint = {x: event.clientX, y: event.clientY}
        let [elX, elY] = this.elementsData[elemIndex].data.transform.translate

        let mousemove = event => {
          let {x, y} = startPoint
          let change = {x: event.clientX - x, y: event.clientY - y}
          this.elementsData[elemIndex].data.transform.translate = [elX + change.x, elY + change.y]
        }
        let mouseup = () => {
          document.removeEventListener('mousemove', mousemove)
          document.removeEventListener('mouseup', mouseup)
        }
        document.addEventListener('mousemove', mousemove)
        document.addEventListener('mouseup', mouseup)
      },
    },
    computed: {
      ...mapGetters({
        canvasData: 'getCanvasData',
      }),
      elementsData () {
        return this.canvasData.elements
      },
      canvasHeight () {
        return this.canvasData ? this.canvasData.height || 0 : 0
      },
      canvasWidth () {
        return this.canvasData ? this.canvasData.width || 0 : 0
      },
      viewBox () {
        return `0 0 ${this.canvasWidth} ${this.canvasHeight}`
      },
    },
    components: {
      svgRender,
      imageRender,
    },
  }
</script>
<style lang="less" scoped>

</style>