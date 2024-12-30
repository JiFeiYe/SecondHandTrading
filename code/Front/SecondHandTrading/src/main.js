import {createApp} from 'vue'
import '@/style.scss'
import {createPinia} from 'pinia'
//从 pinia-plugin-persistedstate 模块中导入 piniaPluginPersistedstate
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import App from './App.vue'

import 'element-plus/dist/index.css'
import ElementPlus from 'element-plus'

import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import router from '@/router'

// 创建实例
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
const app = createApp(App)

// 引入icon
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}

// 将封装好的api请求的接口，定义为app这个应用的全局属性
//app.config.globalProperties.api = api

// 使用ElementPlus
app.use(ElementPlus)

//使用pinia
app.use(pinia)

//使用router
app.use(router)

// 视图挂载
app.mount('#app')
