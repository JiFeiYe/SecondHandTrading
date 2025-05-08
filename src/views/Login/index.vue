<template>
  <Header/>

  <UserLogin @custom="change" v-if="value === '用户登录'"></UserLogin>
  <AdminLogin @custom="change" v-if="value === '管理员登录'"></AdminLogin>
</template>

<script setup>
import UserLogin from '@/views/Login/components/UserLogin.vue'
import AdminLogin from '@/views/Login/components/AdminLogin.vue'
import {onMounted, ref} from 'vue'
import Header from '@/components/Header.vue'
import {useCounterStore} from '@/stores/counter.js'
import {useRouter} from 'vue-router'

const counterStore = useCounterStore()
const router = useRouter()

// onMounted(() => {
//   if (counterStore.token !== '')
//     router.push('/')
// })

const value = ref('用户登录')
const change = () => {
  if (value.value === '用户登录')
    value.value = '管理员登录'
  else
    value.value = '用户登录'
}
</script>

<style scoped>

</style>
