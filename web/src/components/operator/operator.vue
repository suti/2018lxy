<template>
  <div
    id="operator"
    :style="operatorStyle"
    v-if="focusElemIndex > -1"
  >

  </div>
</template>
<script>
  import { mapGetters, mapActions } from 'vuex'

  export default {
    name: 'operator',
    data () {
      return {}
    },
    computed: {
      ...mapGetters({
        focusElemIndex: 'getFocusElemIndex',
        focusElemJson: 'getFocusElemJson',
      }),
      elemData () {
        return this.focusElemJson ? this.focusElemJson.data : {}
      },
      operatorStyle () {
        return {
          left: this.elemData.transform.translate[1] + 'px',
          top: this.elemData.transform.translate[1] + 'px',
          width: this.elemData.width + 'px',
          height: this.elemData.height + 'px',
          transform: `rotate(${this.elemData.transform.rotate[0]}deg)`,
        }
      },
    },

  }
</script>
<style lang="less" scoped>
  #operator {
    position: absolute;

    &:before {
      content: "";
      position: absolute;
      left: 0;
      top: 0;
      right: 0;
      bottom: 0;
      border: 1px solid rgba(255, 255, 255, .67);
    }
  }
</style>