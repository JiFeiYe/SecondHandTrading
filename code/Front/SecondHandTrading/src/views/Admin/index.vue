<template>
  <el-container class="layout-container-demo" style="height: 950px">
    <!-- 头部导航 -->
    <el-header class="hd" style="text-align: right; font-size: 12px; padding-right: 80px; background-color: #e3f2fd; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);">
      <div class="logo">
        <router-link to="/"><img src="../../assets/logo1.png" alt=""></router-link>
      </div>
      <div class="title" style="flex: 1; text-align: center;">易电脑后台管理系统</div>
    </el-header>
    <el-container>
      <!-- 侧导航 -->
      <el-aside width="200px" style="background-color: #e3f2fd; border-right: 1px solid #bbdefb;">
        <el-scrollbar>
          <el-menu :default-openeds="['1','1-1']" background-color="#ffffff" text-color="#333333" active-text-color="#42a5f5">
            <!-- 个人基本信息 -->
            <el-sub-menu index="1">
              <template #title>
                <el-icon style="font-size: 24px; color: #f4a460; margin-right: 10px">
                  <UserFilled/>
                </el-icon>
                <span style="font-size: 15px; color: #f4a460">个人基本信息</span>
              </template>
              <el-menu-item-group>
                <router-link to='/user' style="text-decoration: none">
                  <el-menu-item index="1-1">
                    <p style="color: #409Eff;">用户信息列表</p>
                  </el-menu-item>
                </router-link>
                <router-link to='/administrator' style="text-decoration: none">
                  <el-menu-item index="1-2">
                    <p style="color: #409Eff;">管理员信息列表</p>
                  </el-menu-item>
                </router-link>
              </el-menu-item-group>
            </el-sub-menu>

            <!-- 商品信息 -->
            <el-sub-menu index="2">
              <template #title>
                <el-icon style="
                          margin-right: 5px;
                          margin-top: 1px;
                          font-size: 20px;
                          cursor: pointer;
                          color: #f4a460;
                        ">
                  <Goods/>
                </el-icon>
                <span style="font-size: 15px; color: #f4a460">商品信息</span>
              </template>
              <el-menu-item-group>
                <router-link to='/goods' style="text-decoration: none">
                  <el-menu-item index="2-1-1">
                    <p style="color: #409Eff;">商品基本信息</p>
                  </el-menu-item>
                </router-link>
                <router-link to='/category' style="text-decoration: none">
                  <el-menu-item index="2-1-2">
                    <p style="color: #409Eff;">三级分类信息</p>
                  </el-menu-item>
                </router-link>
                <router-link to='/attribute' style="text-decoration: none">
                  <el-menu-item index="2-1-3">
                    <p style="color: #409Eff;">商品属性信息</p>
                  </el-menu-item>
                </router-link>
              </el-menu-item-group>
            </el-sub-menu>

            <!-- 统计信息 -->
            <el-sub-menu index="3">
              <template #title>
                <el-icon style="font-size: 24px; color: #f4a460; margin-right: 10px">
                  <Operation/>
                </el-icon>
                <span style="font-size: 15px; color: #f4a460">统计信息</span>
              </template>
              <el-menu-item-group>
                <router-link to='/revenuemonitor' style="text-decoration: none">
                  <el-menu-item index="3-1">
                    <p style="color: #409Eff;">收益监控曲线</p>
                  </el-menu-item>
                </router-link>
                <router-link to='#' style="text-decoration: none">
                  <el-menu-item index="3-2">
                    <p style="color: #409Eff;">地区交易分布</p>
                  </el-menu-item>
                </router-link>
              </el-menu-item-group>
            </el-sub-menu>
          </el-menu>
        </el-scrollbar>
      </el-aside>
      <!-- 内容主题部分 -->
      <el-main style="background-color: #ffffff; padding: 20px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);">
        <!-- // 解决路由跳转页面没有重新渲染问题 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>

import {Goods, Operation, UserFilled} from '@element-plus/icons-vue'
</script>

<style scoped>
.layout-container-demo .el-header {
  position: relative;
  background-color: #e3f2fd;
  color: var(--el-text-color-primary);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.layout-container-demo .el-aside {
  color: var(--el-text-color-primary);
  background-color: #e3f2fd;
  border-right: 1px solid #bbdefb;
}

.layout-container-demo .el-menu {
  background-color: #ffffff;
  border-right: none;
  text-color: #333333;
  active-text-color: #42a5f5;
}

.layout-container-demo .el-main {
  display: flex;
  justify-content: space-evenly;
  flex-wrap: wrap;
  padding: 20px;
  background-color: #ffffff;
  height: auto;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.hd {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #e3f2fd;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.hd .logo img {
  margin-left: 20px;
  margin-top: 5px;
  width: 150px;
  height: 50px;
}

.hd .title {
  margin-top: 5px;
  font-size: 30px;
  color: #000000;
  font-weight: 800;
  text-align: center;
  flex: 1;
}

a {
  text-decoration: none;
}

.layout-container-demo .toolbar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  right: 20px;
}
</style>
