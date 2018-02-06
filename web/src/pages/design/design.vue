<template>
  <div id="design">
    <canva></canva>
    <colorPicker></colorPicker>
  </div>
</template>
<script>
  import canva from '../../components/canva/canva'
  import colorPicker from '../../tools/colorpicker/colorpicker'

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
      canva,colorPicker
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