<template>
  <div id="design" ref="dom">
    <canva></canva>
    <colorPicker></colorPicker>
    <!--<hue></hue>-->
  </div>
</template>
<script>
  import canva from '../../components/canva/canva'
  import hue from '../../tools/createColors/hueWheel'
  import colorPicker from '../../tools/colorPicker/colorPicker'
  import Dropdrag from '../../lib/Dropdrag'
  import _FileReader from '../../utils/_FileReader'

  export default {
    name: 'design',
    data () {
      return {
        app: 'hello world',
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

      drag.setFunc({
        dragover (e) {
          e.dataTransfer.dropEffect = 'copy'
        },
        async drop (e) {
          let files = e.dataTransfer.files
          let fr = new _FileReader
          await fr.blob(files[0])
          let md5 = await fr.MD5()
          console.log(md5)
        },
      }).start(['dragenter', 'dragleave', 'dragover', 'drop'])
    },
    components: {
      canva, colorPicker, hue,
    },
  }
</script>
<style lang="less" scoped>
  @import "./design.less";
</style>