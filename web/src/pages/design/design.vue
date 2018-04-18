<template>
  <div id="design" ref="dom">
    <canvas-comp></canvas-comp>
    <colorPicker></colorPicker>
  </div>
</template>
<script>
  import canvasComp from '../../components/canvas/canvas'
  import hue from '../../tools/createColors/hueWheel'
  import colorPicker from '../../tools/colorPicker/colorPicker'
  import Dropdrag from '../../lib/Dropdrag'
  import _FileReader from '../../utils/_FileReader'
  import element from '../../control/element'

  export default {
    name: 'design',
    data () {
      return {
        app: 'hello world',
        svgStr: '',
      }
    },
    methods: {
      async test () {
        let time = Date.now()
        let {data: {body}} = await this.axios.get('/')
        this.app = 'ok' + (Date.now() - time)
      },
    },
    mounted () {
      let drag = new Dropdrag(this.$refs.dom)
      let _this = this
      drag.setFunc({
        dragover (e) {
          e.dataTransfer.dropEffect = 'copy'
        },
        async drop (e) {
          let files = e.dataTransfer.files
          let fr = new _FileReader
          let blob = await fr.blob(files[0])
          let tempData = null, type = ''
          if (fr.type.indexOf('svg') > -1) {
            type = 'svg'
            tempData = await fr.readAsText(blob)
          } else if (fr.type.indexOf('image') > -1) {
            type = 'image'
            tempData = await fr.base64()
          }
          if (tempData) {
            let md5 = await fr.MD5()
            element.addElement({
              type,
              data: {
                transform: {
                  translate: [40, 40],
                  rotate: [0, 0, 0],
                },
                viewBox: [],
              },
              hash: md5,
              temp: tempData,
            })
          }
        },
      }).start(['dragenter', 'dragleave', 'dragover', 'drop'])
    },
    components: {
      canvasComp, colorPicker, hue,
    },
  }
</script>
<style lang="less" scoped>
  @import "./design.less";
</style>