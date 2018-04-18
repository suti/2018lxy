<template>
  <g>
    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
         x="0px" y="0px"
         :width="data.width" :height="data.height"
         :viewBox="viewBox"
    >
      <image :xlink:href="imageSrc" x="0" y="0" :width="data.imgWidth" :height="data.imgHeight" :filter="data.filter"/>
    </svg>
  </g>
</template>

<script>

  /*
    imageData :{
      width: Number,
      height: Number,
      imgWidth: Number,
      imgHeight: Number,
      filter: Object,
      transform: Object,
      viewBox: Array
    }
   */
  export default {
    name: '',
    data () {
      return {
        imageSrc: '',
      }
    },
    props: {
      element: {
        type: Object,
      },
    },
    computed: {
      data () {
        return this.element.data
      },
      viewBox () {
        return this.data.viewBox.join(' ')
      },
    },
    async created () {
      if (this.element.temp) {
        this.imageSrc = this.element.temp
      }
    },
  }
</script>
<style lang="less" scoped>

</style>