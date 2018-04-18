<template>
  <g
    v-html="svgStr"
  >

  </g>
</template>
<script>
  export default {
    name: '',
    data () {
      return {
        svgStr: '',
      }
    },
    props: {
      element: {
        type: Object,
      },
    },
    async created () {
      if (this.element.temp) {
        this.svgStr = this.element.temp
      }
    },
  }
</script>
<style lang="less" scoped>

</style>