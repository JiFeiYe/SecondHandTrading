<template>
  <div class="login-container">
    <div class="login-card">
      <div class="login-header">
        <h2>易电脑</h2>
        <p>管理员登录</p>
      </div>
      <el-form :model="form" :rules="rules" ref="loginForm">
        <el-form-item label="账号" prop="account">
          <el-input placeholder="请输入管理员账号" v-model="form.account" class="input-field"/>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input placeholder="请输入密码" v-model="form.password" type="password" class="input-field"/>
        </el-form-item>
      </el-form>
      <el-button type="primary" class="login-button" @click="login">登录</el-button>
      <div class="login-footer">
        <router-link to="" @click="changeLogin">用户登录</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref} from 'vue'
import {adminLogin} from '@/apis/admin.js'
import {ElMessage} from 'element-plus'
import {useCounterStore} from '@/stores/counter.js'
import {useRouter} from 'vue-router'

const router = useRouter()
const counterStore = useCounterStore()
const emits = defineEmits(['custom'])
const changeLogin = () => {
  emits('custom')
}

const form = ref({
  account: '',
  password: ''
})
const flag = ref(false)

const loginForm = ref(null)

const rules = {
  account: [
    {required: true, message: '请输入管理员账号', trigger: 'blur'},
    {pattern: /^[a-z]{5}$/, message: '请输入有效的账号', trigger: ['blur', 'change']}
  ],
  password: [
    {required: true, message: '请输入密码', trigger: 'blur'},
    {min: 6, message: '密码长度不能少于6个字符', trigger: ['blur', 'change']}
  ]
}

const login = async () => {
  loginForm.value.validate(async (valid) => {
    if (valid) {
      const res = await adminLogin(form.value.account, form.value.password)
      if (res.data.code === 200) {
        ElMessage('登录成功')
        counterStore.token = res.data.data.token
        await router.push('/admin')
      } else {
        ElMessage.error(res.data.message + '!')
      }
    } else {
      ElMessage.error('表单验证失败!')
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

.language-option el-icon {
  margin-right: 0.3rem;
}
</style>