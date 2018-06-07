<template>
  <el-container>
    <el-header>
      <h3 class="text-center">实验室考勤系统</h3>
    </el-header>
    <el-main>
      <h6 class="text-center">
        现在时间：{{`${hours}:${minutes}:${seconds}`}}
      </h6>
      <h6 class="text-center">
        <span class="finger-icon">
          <fingerIcon :color="fingerIconColor"></fingerIcon>
        </span>
      </h6>
      <h6 class="text-center">{{online?'请按指纹登录':'现在不是上课时间'}}</h6>
      <h6 class="text-center" v-if="online">{{codeList[fingerStatus]}}</h6>
    </el-main>
  </el-container>
</template>
<script>
  import fingerIcon from './img/fingerIcon'

  const codeList = [
    '指纹验证成功',
    '数据包接收错误',
    '传感器上没有手指',
    '录入指纹图像失败',
    '指纹图像太干、太淡而生不成特征',
    '指纹图像太湿、太糊而生不成特征',
    '指纹图像太乱而生不成特征',
    '指纹图像正常，但特征点太少(或面积太小)而生不成特征',
    '指纹不匹配',
    '没搜索到指纹',
    '特征合并失败',
    '访问指纹库时地址序号超出指纹库范围',
    '从指纹库读模板出错或无效',
    '上传特征失败',
    '模块不能接受后续数据包',
    '上传图像失败',
    '删除模板失败',
    '清空指纹库失败',
    '不能进入低功耗状态',
    '口令不正确',
    '系统复位失败',
    '缓冲区内没有有效原始图而生不成图像',
    '在线升级失败',
    '残留指纹或两次采集之间手指没有移动过',
    '读写FLASH 出错',
    '有后续数据包的指令，正确接收后用0xf0 应答',
    '有后续数据包的指令，命令包用0xf1 应答',
    '烧写内部FLASH 时，校验和错误',
    '烧写内部FLASH 时，包标识错误',
    '烧写内部FLASH 时，包长度错误',
    '烧写内部FLASH 时，代码长度太长',
    '烧写内部FLASH 时，烧写FLASH 失败',
    '未定义错误',
    '无效寄存器号',
    '寄存器设定内容错误号',
    '记事本页码指定错误',
    '端口操作失败',
    '自动注册(enroll)失败',
    '指纹库',
    'Reserve',
  ]
  export default {
    name: 'attendance',
    data () {
      return {
        time: Date.now(),
        interval: null,
        listUpdateInterval: null,
        fingerStatus: 2,
        fingerStatusGet: true,
        online: false,
        codeList,
        userId: -1,
        userData: {},
        stopFlag: false,
      }
    },
    props: {},
    components: {
      fingerIcon,
    },
    computed: {
      fingerIconColor () {
        if (this.online) {
          switch (this.fingerStatus) {
            case 0:
              return '#67C23A'
            case 2:
              return '#409EFF'
            case 9:
              return '#F56C6C'
            default:
              return '#E6A23C'
          }
        }
        return '#cccccc'
      },
      hours () {
        let time = (new Date(this.time)).getHours() + ''
        if (time.length == 1) time = '0' + time
        return time
      },
      minutes () {
        let time = (new Date(this.time)).getMinutes() + ''
        if (time.length == 1) time = '0' + time
        return time
      },
      seconds () {
        let time = (new Date(this.time)).getSeconds() + ''
        if (time.length == 1) time = '0' + time
        return time
      },
    },
    watch: {},
    methods: {
      async loop () {
        this.time = Date.now()
        if (this.timeSet) {
          if (testTime(this.timeSet)&& !this.stopFlag) {
            this.online = true
            if (this.fingerStatusGet) {
              this.fingerStatusGet = false
              let {data} = await this.axios.get('/apiRun')
              this.fingerStatus = data.fingerStatus
              if (this.fingerStatus == 0) {
                this.$message('扫描成功，请拿开手指')
                let {data} = await this.axios.get('/apiLastId')
                this.userId = data.id + ''
                if (this.userData[this.userId]) {
                  if (this.userData[this.userId].isOnline) {
                    this.$message(`${this.userData[this.userId].name}同学离开实验室`)
                    this.userData[this.userId].isOnline = false
                    this.userData[this.userId].endTime = Date.now()
                  } else {
                    this.$message(`欢迎${this.userData[this.userId].name}同学进入实验室`)
                    this.userData[this.userId].isOnline = true
                    this.userData[this.userId].startTime = Date.now()
                    this.userData[this.userId].endTime = null
                  }
                  window.localStorage.setItem('userData', JSON.stringify(this.userData))
                  await sleep(1000)
                }
              }
              this.fingerStatusGet = true
            }
          } else {
            this.online = false
          }
        }
      },
      getStorage () {
        let timeSet = window.localStorage.getItem('timeSet')
        if (timeSet == null) {
          this.$message({
            showClose: true,
            message: '未设置实验时间，请联系导师设置',
            type: 'error',
          })
          return
        }
        this.timeSet = JSON.parse(timeSet)
        this.interval = setInterval(this.loop, 200)
        let userData = window.localStorage.getItem('userData')
        if (userData == null) {
          this.$message({
            showClose: true,
            message: '未设置学生人数，请联系导师设置',
            type: 'error',
          })
          return
        }
        this.userData = JSON.parse(userData)
        this.stopFlag = ~~window.localStorage.getItem('stop')
      },
    },
    mounted () {
      this.getStorage()
      window.addEventListener('storage', this.getStorage)
    },
    beforeDestroy () {
      clearInterval(this.interval)
    },
  }

  function testTime ({start, end}) {
    let hours = (new Date()).getHours()
    let minutes = (new Date()).getMinutes()
    if (hours > start[0] && hours < end[0])
      return true
    if (hours == start[0] && hours < end[0] && minutes > start[1] - 15)
      return true
    if (hours == start[0] && hours == end[0] && minutes > start[1] - 15 && minutes < end[1] + 15)
      return true
    if (hours > start[0] && hours == end[0] && minutes < end[1] + 15)
      return true
    return false
  }

  function sleep (delay = 0) {
    return new Promise(resolve => setTimeout(resolve, delay))
  }
</script>
<style lang="less" scoped>
  .finger-icon {
    width: 40px;
    height: 40px;
    display: inline-block;
    /*background: url("./img/fingerIcon.svg") no-repeat;*/
  }
</style>