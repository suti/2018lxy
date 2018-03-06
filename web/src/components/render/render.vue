<template>
  <svg
    :viewBox="viewBox"
    :width="canvaWidth"
    :height="canvaHeight"
    id="render"
    version='1.1'
    xmlns='http://www.w3.org/2000/svg'
    xmlns:xlink='http://www.w3.org/1999/xlink'
  >
    <g
      v-for="(element, index) in elementsData"
      :key="index"
      :data-index="index"
    >
      <svg-render
        v-if="element.type === 'svg'"
        :data="element"
      ></svg-render>
      <image-render
        v-else-if="element.type === 'img'"
        :data="element"
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
    computed: {
      ...mapGetters({
        canvaData: 'getCanvaData',
      }),
      elementsData () {
        let data = this.canvaData ? this.canvaData.elements || [] : []
        return JSON.parse(JSON.stringify(data))
      },
      canvaHeight () {
        return this.canvaData ? this.canvaData.height || 0 : 0
      },
      canvaWidth () {
        return this.canvaData ? this.canvaData.width || 0 : 0
      },
      viewBox () {
        return `0 0 ${this.canvaWidth} ${this.canvaHeight}`
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