<template>
  <Header/>

  <div class="register-container">
    <div class="register-card">
      <div class="register-header">
        <h2>易电脑</h2>
        <p></p>
      </div>
      <el-form :model="form" ref="formRef" :rules="rules" label-width="auto" style="max-width: 600px">
        <el-form-item label="邮箱" prop="email">
          <el-input placeholder="请输入邮箱" v-model="form.email" class="input-field" style="width: calc(100% - 120px); display: inline-block;"/>
          <el-button type="info" @click="sendCode" class="send-code-button">获取验证码</el-button>
        </el-form-item>
        <el-form-item label="验证码" prop="code">
          <el-input placeholder="请输入验证码" v-model="form.code" class="input-field"/>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input placeholder="请输入密码" v-model="form.password" type="password" class="input-field"/>
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input placeholder="请再次输入密码" v-model="form.confirmPassword" type="password" class="input-field"/>
        </el-form-item>
      </el-form>
      <el-button type="primary" class="register-button" @click="submitForm">注册</el-button>
      <div class="register-footer">
        <router-link to="/login">返回登录</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref} from 'vue';
import {useRouter} from 'vue-router';
import {getRegisterCode, verifyCode} from '@/apis/user.js'
import {useCounterStore} from '@/stores/counter.js'
import {ElMessage} from 'element-plus'
import Header from '@/components/Header.vue'

const router = useRouter();
const formRef = ref(null);
const form = ref({
  email: '',
  password: '',
  confirmPassword: '',
  code: '',
});
const counterStore = useCounterStore()

const rules = {
  email: [
    {required: true, message: '请输入邮箱', trigger: 'blur'},
    {pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, message: '邮箱格式不正确', trigger: 'blur'}
  ],
  code: [
    {required: true, message: '请输入验证码', trigger: 'blur'}
  ],
  password: [
    {required: true, message: '请输入密码', trigger: 'blur'},
    {min: 6, message: '密码长度不能少于 6 个字符', trigger: 'blur'}
  ],
  confirmPassword: [
    {required: true, message: '请再次输入密码', trigger: 'blur'},
    {validator: validateConfirmPassword, trigger: 'blur'}
  ]
};

function validateConfirmPassword(rule, value, callback) {
  if (value !== form.value.password) {
    callback(new Error('两次输入的密码不一致'));
  } else {
    callback();
  }
}

let tempToken = ''
async function sendCode() {
  const res = await getRegisterCode(counterStore.token, form.value.email)
  // console.log(res.data.code)
  if (res.data.code === 200) {
    ElMessage('验证码发送成功')
    tempToken = res.data.data.token
  } else {
    console.error(res.data)
    ElMessage.error(res.data.message)
  }
}

async function submitForm() {
  formRef.value.validate(async (valid) => {
    if (valid) {
      const res = await verifyCode(counterStore.token, form.value.code, form.value.password);
      if (res.data.code === 200) {
        ElMessage('注册成功');
        counterStore.token = tempToken
        await router.push('/login');
      } else {
        console.error(res.data);
        ElMessage.error(res.data.message);
      }
    } else {
      ElMessage.error('请填写正确的表单信息');
    }
  });
}
</script>

<style scoped>
/* Background styling */
.register-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: #f1f3f9;
}

/* Card styling */
.register-card {
  width: 400px;
  padding: 2rem;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.register-header h2 {
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.register-header p {
  color: #777;
  font-size: 0.9rem;
  margin-bottom: 1.5rem;
}

.input-field {
  margin-bottom: 1rem;
  width: 100%;
}

.send-code-button {
  width: 100px;
  margin-left: 10px;
  display: inline-block;
  vertical-align: top;
  background-color: #1e8e8e;
}

.register-button {
  width: 100%;
  background-color: #1e8e8e;
  color: white;
  margin-top: 1rem;
  border-radius: 5px;
}

/* Footer and language styling */
.register-footer {
  margin-top: 1.5rem;
  font-size: 0.9rem;
  color: #555;
}

.register-footer a {
  color: #1e8e8e;
  text-decoration: none;
}

.language-option el-icon {
  margin-right: 0.3rem;
}
</style>
