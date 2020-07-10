<template>
  <div id="app">
    <router-view  v-if="isRouterAlive" />
  </div>
</template>

<script>
export default {
  name: 'App',
  data(){
    return {
      isRouterAlive: true
    }
  },
  provide () {
    return {
      reload: this.reload
    }
  },
  methods: {
    // 声明reload方法,控制router-view模块的显示或者隐藏,从而控制页面的再次加载.
    reload () {
      this.isRouterAlive = false
      this.$nextTick(function () {
        this.isRouterAlive = true
      })
    }
  },
}
</script>
<style lang="scss">
  @import './assets/fonts/font.css';
</style>