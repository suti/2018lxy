<template>
  <svg
    :viewBox="viewBox"
    :width="canvasWidth"
    :height="canvasHeight"
    id="render"
    version='1.1'
    xmlns='http://www.w3.org/2000/svg'
    xmlns:xlink='http://www.w3.org/1999/xlink'
  >
    <g
      v-for="(element, index) in elementsData"
      :key="index"
      :data-index="index"
      :transform="computeTransform(element.data.transform)"
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
      computeTransform (transform) {
        let {translate, rotate} = transform
        return `translate(${translate.join(',')}),rotate(${rotate.join(',')})`
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