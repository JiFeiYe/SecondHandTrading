<template>
  <header class="navbar">
    <div class="logo">
      <img src="@/assets/logo1.png" alt="" class="logoImg">
    </div>
    <nav class="nav-links">
      <el-link href="/">首页</el-link>
      <el-link href="/persons">我的</el-link>
      <el-link href="#">联系我们</el-link>
    </nav>
  </header>
</template>

<script setup>

import {ElLink} from 'element-plus'
</script>

<style lang="scss" scoped>
/* 顶部导航栏 */
.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 2rem;
  background-color: #fff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.logo {
  font-size: 1.5rem;
  font-weight: bold;
  color: #333;
}

.logoImg {
  width: 110px;
  height: auto;
}

.nav-links {
  display: flex;
  gap: 2rem;
  margin-right: 0;
  color: #333;
}
</style>