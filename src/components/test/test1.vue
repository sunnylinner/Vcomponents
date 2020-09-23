<template>
  <div>
    <a-button type="primary" @click="fn">
      Primary
    </a-button>
  </div>
</template>

<script>
  export default {
    name: 'test1',
    methods: {
      fn() {
        this.$emit('btnclick', '我被点击了');
      }
    }
  };
</script>

<style scoped lang="less">
  div {
    button {
      background: green;
    }
  }
</style>
