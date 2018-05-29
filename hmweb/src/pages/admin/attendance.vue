<template>
  <div class="attendance">
    <el-button
      v-for="(item, index) in dataList"
      :type="item.isOnline?'success':'info'"
      :title="item.name"
      style="margin: 4px 10px;width: 102px;"
    >实验台{{index+1}}
    </el-button>
  </div>
</template>
<script>
  const count = 50
  export default {
    name: 'attendance',
    data () {
      return {}
    },
    props: {
      sourceData: {},
    },
    computed: {
      dataList () {
        let array = []
        let keys = []
        for (let key in this.sourceData) {
          keys.push({number: this.sourceData[key].number, key})
        }
        for (let i = 0; i < count; i++) {
          let data = {}
          let flag = -1
          keys.forEach((elem, index) => {
            if (elem.number == i + 1)
              flag = index
          })
          if (flag !== -1)
            data = this.sourceData[keys[flag].key]
          array.push(data)
        }
        return array
      },
    },
  }
</script>
<style lang="less" scoped>

</style>