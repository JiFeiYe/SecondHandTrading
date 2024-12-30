<template>
  <Header/>

  <div class="payment-success-container">
    <!-- 成功提示 -->
    <el-card class="success-card">
      <div class="success-icon">
        <el-icon>
          <Check/>
        </el-icon>
      </div>
      <h1 class="success-title">支付成功！</h1>
      <p class="success-message">您的订单已支付成功，感谢您的购买！</p>
    </el-card>

    <!-- 按钮操作 -->
    <div class="action-buttons">
      <el-button type="primary" size="large" @click="goToHome">返回首页</el-button>
      <el-button type="success" size="large" @click="viewOrder">查看订单</el-button>
    </div>
  </div>
</template>

<script setup>
import Header from '@/components/Header.vue'
import {ElIcon} from 'element-plus'
import {Check} from '@element-plus/icons-vue'
import {useRoute, useRouter} from 'vue-router'
import {onMounted} from 'vue'

const route = useRoute()

const router = useRouter()

onMounted(() => {
  // console.log(route.query)
})

// 按钮事件
const goToHome = () => {
  router.push('/') // 跳转到首页
}

const viewOrder = () => {
  router.push('/persons') // 跳转到订单详情页
}
</script>

<style scoped>
/* 页面容器 */
.payment-success-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #f7f9fc;
}

/* 成功提示卡片 */
.success-card {
  text-align: center;
  padding: 2rem 3rem;
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}

.success-icon {
  font-size: 3rem;
  color: #67c23a; /* 成功绿色 */
  margin-bottom: 1rem;
}

.success-title {
  font-size: 2rem;
  font-weight: bold;
  color: #333;
  margin: 0;
}

.success-message {
  font-size: 1.2rem;
  color: #666;
  margin-top: 0.5rem;
}

/* 按钮操作 */
.action-buttons {
  margin-top: 2rem;
  display: flex;
  gap: 1rem;
}

.action-buttons el-button {
  min-width: 150px;
  font-size: 1rem;
}
</style>