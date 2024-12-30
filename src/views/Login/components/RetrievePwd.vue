<template>
  <el-container>
    <el-header>
      <div class="logo">
        <img src="../../../assets/logo1.png" alt="">
      </div>
    </el-header>
    <el-main>
      <el-form :model="form" ref="formRef" label-width="120px" class="registration-form">
        <el-form-item label="手机号" :rules="phoneRules">
          <el-input v-model="form.phone" placeholder="请输入手机号"/>
        </el-form-item>

        <el-form-item label="验证码" :rules="verificationCodeRules">
          <el-input v-model="form.verificationCode" placeholder="请输入验证码"/>
          <el-button @click="sendVerificationCode">发送验证码</el-button>
        </el-form-item>

        <el-form-item label="密码" :rules="passwordRules">
          <el-input type="password" v-model="form.password" placeholder="请输入密码"/>
        </el-form-item>

        <el-form-item label="再次输入密码" :rules="confirmPasswordRules">
          <el-input type="password" v-model="form.confirmPassword" placeholder="请再次输入密码"/>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitForm">找回密码</el-button>
          <div class="login-hint">
            <router-link to="/userlogin">返回首页</router-link>
          </div>
        </el-form-item>
      </el-form>
    </el-main>
  </el-container>
</template>

<script>
import {ref} from 'vue';
import {useRouter} from 'vue-router';

export default {
  setup() {
    const router = useRouter();
    const formRef = ref(null);
    const form = ref({
      phone: '',
      password: '',
      confirmPassword: '',
      verificationCode: ''
    });

    const phoneRules = [
      {required: true, message: '请输入手机号', trigger: 'blur'},
      {pattern: /^[1][3-9][0-9]{9}$/, message: '手机号格式不正确', trigger: 'blur'}
    ];

    const passwordRules = [
      {required: true, message: '请输入密码', trigger: 'blur'},
      {min: 6, message: '密码长度不能少于 6 个字符', trigger: 'blur'}
    ];

    const confirmPasswordRules = [
      {required: true, message: '请再次输入密码', trigger: 'blur'},
      {validator: validateConfirmPassword, trigger: 'blur'}
    ];

    const verificationCodeRules = [
      {required: true, message: '请输入验证码', trigger: 'blur'}
    ];

    function validateConfirmPassword(rule, value, callback) {
      if (value !== form.value.password) {
        callback(new Error('两次输入的密码不一致'));
      } else {
        callback();
      }
    }

    function sendVerificationCode() {
      // 发送验证码的逻辑（可以调用API）
      // console.log('发送验证码至:', form.value.phone);
    }

    function submitForm() {
      formRef.value.validate(async (valid) => {
        if (valid) {
          // 提交注册的逻辑（可以调用API）
          // console.log('注册信息:', form.value);
          // 注册成功后，转到登录页
          await router.push('/userlogin');
        } else {
          // console.log('注册信息不完整');
        }
      });
    }

    return {
      form,
      formRef,
      phoneRules,
      passwordRules,
      confirmPasswordRules,
      verificationCodeRules,
      sendVerificationCode,
      submitForm
    };
  }
};
</script>

<style scoped>
.registration-form {
  max-width: 400px;
  margin: auto;
}

.login-hint {
  margin-left: 5%;
}

.logo img {
  margin-left: 5%;
  width: 10%;
  height: 50px;
}
</style>
