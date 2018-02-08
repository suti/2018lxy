<template>
  <div id="design">
    <canva></canva>
    <colorPicker></colorPicker>
    <!--<hue></hue>-->
  </div>
</template>
<script>
  import canva from '../../components/canva/canva'
  import hue from '../../tools/createColors/hueWheel'
  import colorPicker from '../../tools/colorPicker/colorPicker'

  export default {
    name: 'design',
    data () {
      return{
        app:'hello world'
      }
    },
    methods:{
      async test (){
        let time = Date.now()
        let {data:{body}} = await this.axios.get('/')
        this.app = 'ok' + (Date.now() - time)
      }
    },
    async mounted(){
      await this.test()
    },
    components:{
      canva,colorPicker,hue
    }
  }
</script>
<style lang="less" scoped>
  #design{
    /*width: 500px;*/
    /*height: 600px;*/
    font-size: 26px;
    /*line-height: 600px;*/
    margin: 0 auto;
    color: #00ffcc;

    &:hover{
      color: #00ccff;
    }
  }
</style>