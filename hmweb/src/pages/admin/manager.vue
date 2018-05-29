<template>
  <div class="manager">
    <el-table
      :data="data"
      stripe
      style="width: 100%">
      <el-table-column
        prop="id"
        label="id"
        width="80">
      </el-table-column>
      <el-table-column
        prop="name"
        label="姓名"
        width="80">
      </el-table-column>
      <el-table-column
        prop="number"
        label="试验台编号">
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        width="100">
        <template slot-scope="scope">
          <el-button @click="deleteUser(scope.row)" type="text" size="small">删除</el-button>
          <el-button @click="editUser(scope.row)" type="text" size="small">修改</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-button type="primary" @click="dialogVisible = true" style="margin-top: 8px">添加学生</el-button>
    <el-dialog
      title="添加学生"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="dialogVisibleClose"
    >
      <div class="step1" v-if="step == 1">
        <span class="d-inline-block" style="margin-bottom: 8px">请输入学生信息</span>
        <el-input
          placeholder="学生姓名"
          v-model="name"
          style="margin-bottom: 8px"
          clearable>
        </el-input>
        <el-input
          placeholder="试验台编号"
          v-model="number"
          type="number"
          clearable>
        </el-input>
      </div>
      <div class="step2 text-center" v-if="step > 1">
        <p>
          <span class="d-inline-block" style="margin-bottom: 8px">录入指纹</span>
        </p>
        <p>
          <span class="d-inline-block" style="width: 40px;height: 40px">
          <fingerIcon :color="fingerIconColor"></fingerIcon>
        </span>
        </p>
        <p>
          <span class="d-inline-block" style="margin-top: 8px">{{addMessage}}</span>
        </p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="add">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  import fingerIcon from '../img/fingerIcon'

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
    name: 'manager',
    data () {
      return {
        dialogVisible: false,
        name: '',
        number: '',
        step: 1,
        userId: 0,
        fingerStatus: 2,
        addMessage: '',
        edit: false,
      }
    },
    props: {
      data: {
        default: () => [{}],
      },
      sourceData: {},
      maxId: {},
    },
    watch: {
      dialogVisible () {
        console.log('dialogVisible', this.dialogVisible)
        if (this.dialogVisible) {
          window.localStorage.setItem('stop', 1)
        } else {
          window.localStorage.setItem('stop', 0)
        }
      },
    },
    computed: {
      fingerIconColor () {
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
      },
    },
    components: {
      fingerIcon,
    },
    methods: {
      editUser (data) {
        this.name = data.name
        this.number = data.number
        this.userId = data.id
        this.edit = true
        this.dialogVisible = true
      },
      async add () {
        if (this.edit == true) {
          this.$message('修改成功')
          this.sourceData[this.userId] = {
            name: this.name,
            number: this.number,
          }
          window.localStorage.setItem('userData', JSON.stringify(this.sourceData))
          this.dialogVisible = false
          this.edit = false
          return
        }
        if (this.step === 1) {
          if (this.name !== '' && this.number !== '') {
            this.step = 2
            this.addFinger()
          } else {
            this.$message.error('请填写完整学生信息！')
          }
        } else if (this.step === 2) {
          this.$message.warning('还未录入指纹！')
        } else if (this.step === 3) {
          let id = this.maxId - (-1)
          let {data} = await
            this.axios.post('/apiStorefinger', {fingerId: id})
          if (data.status == 0) {
            this.$message('添加成功')
            this.sourceData[id] = {
              name: this.name,
              number: this.number,
            }
            window.localStorage.setItem('userData', JSON.stringify(this.sourceData))
            this.dialogVisible = false
          } else {
            this.$message('添加失败,', codeList[data.status])
          }
        }
      },
      dialogVisibleClose () {
        this.step = 1
        this.name = ''
        this.number = ''
      },
      async addFinger () {
        if (!this.dialogVisible) return
        this.addMessage = '请把手指放在传感器上以录入指纹'
        await this.apiGetImage()
        let {data: {status: testCode1}} = await this.axios.get('/apiImage2Tz1')
        this.fingerStatus = testCode1
        if (testCode1 !== 0) {
          this.addMessage = '提取特征值失败，请重试'
          await sleep(2000)
          return this.addFinger()
        }
        this.addMessage = '请抬起手指，然后放回再录入一次'
        await sleep(1000)
        this.fingerStatus = 2
        await this.apiGetImage()
        let {data: {status: testCode2}} = await this.axios.get('/apiImage2Tz2')
        this.fingerStatus = testCode2
        if (testCode2 !== 0) {
          this.addMessage = '提取特征值失败，请重试'
          await sleep(2000)
          return this.addFinger()
        }
        this.addMessage = '校验成功，点击确定按钮保存'
        this.step = 3
      },
      async apiGetImage (cb) {
        let {data} = await this.axios.get('/apiGetImage')
        if (data.status != 0) {
          await this.apiGetImage(cb)
        } else {
          return 0
        }
      },
      async deleteUser ({id}) {
        let {data} = await this.axios.post('/apiDeletefinger', {fingerId: id})
        if (data.status == 0) {
          this.$message('删除成功')
          delete this.sourceData[id]
          window.localStorage.setItem('userData', JSON.stringify(this.sourceData))
        } else {
          this.$message('删除失败,', codeList[data.status])
        }
      },
    },
  }

  function sleep (delay = 0) {
    return new Promise(resolve => setTimeout(resolve, delay))
  }
</script>
<style lang="less" scoped>

</style>