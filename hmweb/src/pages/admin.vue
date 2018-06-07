<template>
  <el-container>
    <el-aside width="200px">
      <el-tree
        :data="asideData" :props="defaultProps" @node-click="handleNodeClick"
        :default-expand-all="true" :highlight-current="true"
      ></el-tree>
    </el-aside>
    <el-container>
      <!--<el-header>-->
      <!--<span>{{tabData[tabIndex].label}}</span>-->
      <!--</el-header>-->
      <el-main>
        <el-tabs v-model="tabIndex" @tab-click="handleClick">
          <el-tab-pane v-for="(elem,index) in tabData" :label="elem.label" :name="elem.target" :key="index">
            <!--{{elem.label}}-->
            <attendance v-if="index === 0" :sourceData="userData"></attendance>
            <history v-if="index === 1" :history="historyData"></history>
            <manager v-if="index === 2" :data="historyData" :sourceData="userData" :maxId="maxId"></manager>
            <setup v-if="index === 3"></setup>
          </el-tab-pane>
        </el-tabs>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
  import attendance from './admin/attendance'
  import history from './admin/history'
  import manager from './admin/manager'
  import setup from './admin/setup'
  import axios from 'axios'

  const codeList = [
    'OK',
    '表示数据包接收错误',
    '表示传感器上没有手指',
    '表示录入指纹图像失败',
    '表示指纹图像太干、太淡而生不成特征',
    '表示指纹图像太湿、太糊而生不成特征',
    '表示指纹图像太乱而生不成特征',
    '表示指纹图像正常，但特征点太少(或面积太小)而生不成特征',
    '表示指纹不匹配',
    '表示没搜索到指纹',
    '表示特征合并失败',
    '表示访问指纹库时地址序号超出指纹库范围',
    '表示从指纹库读模板出错或无效',
    '表示上传特征失败',
    '表示模块不能接受后续数据包',
    '表示上传图像失败',
    '表示删除模板失败',
    '表示清空指纹库失败',
    '表示不能进入低功耗状态',
    '表示口令不正确',
    '表示系统复位失败',
    '表示缓冲区内没有有效原始图而生不成图像',
    '表示在线升级失败',
    '表示残留指纹或两次采集之间手指没有移动过',
    '表示读写FLASH 出错',
    '有后续数据包的指令，正确接收后用0xf0 应答',
    '有后续数据包的指令，命令包用0xf1 应答',
    '表示烧写内部FLASH 时，校验和错误',
    '表示烧写内部FLASH 时，包标识错误',
    '表示烧写内部FLASH 时，包长度错误',
    '表示烧写内部FLASH 时，代码长度太长',
    '表示烧写内部FLASH 时，烧写FLASH 失败',
    '未定义错误',
    '无效寄存器号',
    '寄存器设定内容错误号',
    '记事本页码指定错误',
    '端口操作失败',
    '自动注册(enroll)失败',
    '指纹库',
    'Reserve',
  ]
  const tabData = [
    {
      label: '考勤',
      target: 'attendance',
    },
    {
      label: '考勤记录',
      target: 'history',
    },
    {
      label: '学生管理',
      target: 'manager',
    },
    {
      label: '考勤设置',
      target: 'setup',
    },
  ]

  export default {
    name: 'app',
    data () {
      return {
        tabIndex: 'attendance',
        tabData,
        defaultProps: {
          children: 'children',
          label: 'label',
        },
        asideData: [
          {
            label: '管理员',
            children: tabData,
          },
        ],
        userData: {},
        timeSet: {},
      }
    },
    components: {attendance, history, manager, setup},
    computed: {
      historyData () {
        let arr = []
        Object.keys(this.userData).forEach(id => {
          let startTime = '无记录'
          let endTime = '无记录'
          if (this.userData[id].startTime) {
            startTime = (new Date(this.userData[id].startTime)).toString().split(' GMT')[0]
            if (this.userData[id].endTime)
              endTime = (new Date(this.userData[id].endTime)).toString().split(' GMT')[0]
          }
          arr.push({id, ...this.userData[id], startTime, endTime})
        })
        return arr
      },
      maxId () {
        let maxId = 0
        Object.keys(this.userData).forEach(id => {
          if (id > maxId)
            maxId = id
        })
        return maxId
      },
    },
    methods: {
      handleNodeClick ({target}) {
        this.tabIndex = target
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
      },
    },
    watch:{
      userData(){
        Object.keys(this.userData).forEach(key => {
          let user = this.userData[key]
          axios.post('/apiBlink', {id: user.number, value: ~~user.isOnline})
        })
      }
    },
    mounted () {
      this.getStorage()
      window.addEventListener('storage', this.getStorage)
      Object.keys(this.userData).forEach(key => {
        let user = this.userData[key]
        axios.post('/apiBlink', {id: user.number, value: ~~user.isOnline})
      })
    },
  }
</script>
<style lang="less" scoped>

</style>