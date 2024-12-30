<template>
  <div class="login-container">
    <div class="login-card">
      <div class="login-header">
        <h2>易电脑</h2>
        <p>用户登录</p>
      </div>
      <el-form :model="form" :rules="rules" ref="loginForm">
        <el-form-item label="邮箱" prop="email">
          <el-input placeholder="请输入邮箱" v-model="form.email" class="input-field"/>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input placeholder="请输入密码" v-model="form.password" type="password" class="input-field"/>
        </el-form-item>
      </el-form>
      <el-button type="primary" class="login-button" @click="submitForm">登录</el-button>
      <div class="login-footer">
        <router-link to="/register">注册</router-link>
        |
        <router-link to="#">忘记密码</router-link>
        |
        <router-link to="" @click="changeLogin">管理员登录</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref} from 'vue'
import router from '@/router/index.js'
import {login} from '@/apis/user.js'
import {ElMessage} from 'element-plus'
import {useCounterStore} from '@/stores/counter.js'

const counterStore = useCounterStore()
const emits = defineEmits(['custom'])
const changeLogin = () => {
  emits('custom')
}

const form = ref({
  email: '',
  password: ''
});

const rules = {
  email: [
    {required: true, message: '请输入邮箱', trigger: 'blur'},
    {pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, message: '邮箱格式不正确', trigger: 'blur'}
  ],
  password: [
    {required: true, message: '请输入密码', trigger: 'blur'},
    {min: 6, message: '密码长度不能少于6个字符', trigger: ['blur', 'change']}
  ]
}

const loginForm = ref(null)

const submitForm = async () => {
  loginForm.value.validate(async (valid) => {
    if (valid) {
      const res = await login(form.value.email, form.value.password)
      if (res.data.code === 200) {
        ElMessage('登录成功!!!')
        counterStore.token = res.data.data.token
        await router.push('/')
      } else {
        console.error(res.data)
        ElMessage.error(res.data.message)
      }
    } else {
      ElMessage.error('表单验证失败，请检查输入内容')
    }
  })
}

</script>

<style scoped>
/* Background styling */
.login-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: #f1f3f9;
}

/* Card styling */
.login-card {
  width: 400px;
  padding: 2rem;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.login-header h2 {
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.login-header p {
  color: #777;
  font-size: 0.9rem;
  margin-bottom: 1.5rem;
}

.input-field {
  margin-bottom: 1rem;
  width: 100%;
}

.login-button {
  width: 100%;
  background-color: #1e8e8e;
  color: white;
  margin-top: 1rem;
  border-radius: 5px;
}

/* Footer and language styling */
.login-footer {
  margin-top: 1.5rem;
  font-size: 0.9rem;
  color: #555;
}

.login-footer a {
  color: #1e8e8e;
  text-decoration: none;
}

.login-footer button {
  color: #1e8e8e;
  text-decoration: none;
}

.language-option el-icon {
  margin-right: 0.3rem;
}
</style>
