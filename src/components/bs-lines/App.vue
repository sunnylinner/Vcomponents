<template>
    <div>
        <div v-if="initData.length === 0">
<!--          空-->
        </div>
        <bs-lines v-if="initData.length !== 0" :init-data="initData" ref="bsLines"></bs-lines>
    </div>
</template>

<script>
import BsLines from './BsLines.vue';

export default {
  name: 'App.vue',
  components: { BsLines },
  props: {
    initData: {
      type: Array,
      default: () => [],
    },
  },
  methods: {
    dataAdd(data) {
      this.$refs.bsLines.dataAdd(data);
    },
  },
};
</script>

<style scoped>

</style>
