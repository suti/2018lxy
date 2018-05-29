<template>
  <el-table
    :data="history"
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
      prop="startTime"
      label="签到时间">
    </el-table-column>
    <el-table-column
      prop="endTime"
      label="离开时间">
    </el-table-column>
  </el-table>
</template>
<script>
  export default {
    name: 'history',
    data () {
      return {}
    },
    props: {
      history: {
        default: () => [{}],
      },
    },
  }
</script>
<style lang="less" scoped>

</style>