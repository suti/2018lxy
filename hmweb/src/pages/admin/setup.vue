<template>
  <div class="setup">
    <p>请设置上课时间：</p>
    <el-time-picker
      is-range
      v-model="value"
      range-separator="至"
      start-placeholder="开始时间"
      end-placeholder="结束时间"
      placeholder="选择时间范围">
    </el-time-picker>
    <el-button type="primary" @click="confirm">确定</el-button>
  </div>
</template>
<script>
  export default {
    name: 'setup',
    data () {
      return {
        value: [new Date(2016, 9, 10, 8, 40), new Date(2016, 9, 10, 9, 40)],
      }
    },
    methods: {
      confirm () {
        let data = {
          start: [this.value[0].getHours(), this.value[0].getMinutes()],
          end: [this.value[1].getHours(), this.value[1].getMinutes()],
        }
        console.log(data)
        window.localStorage.setItem('timeSet', JSON.stringify(data))
      },
    },
    mounted () {
      let timeSet = window.localStorage.getItem('timeSet')
      if (timeSet == null) {
        this.value = [new Date(2016, 9, 10, 8, 40), new Date(2016, 9, 10, 9, 40)]
      } else {
        this.value = [
          new Date(2016, 9, 10, JSON.parse(timeSet).start[0], JSON.parse(timeSet).start[1]),
          new Date(2016, 9, 10, JSON.parse(timeSet).end[0], JSON.parse(timeSet).end[1]),
        ]
      }
    },
  }
</script>
<style lang="less" scoped>

</style>