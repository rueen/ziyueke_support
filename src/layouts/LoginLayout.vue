<template>
  <div class="login-layout">
    <router-view />
  </div>
</template>

<script>
/**
 * 登录布局组件
 */
export default {
  name: 'LoginLayout'
}
</script>

<style scoped>
.login-layout {
  height: 100vh;
  width: 100vw;
}
</style>
