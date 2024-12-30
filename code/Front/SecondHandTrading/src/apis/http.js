// 封装axios
import axios from 'axios'

axios.defaults.withCredentials = true;
// axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';

const httpInstance = axios.create({ // 发给nginx(listen 8080)
    baseURL: "http://47.115.130.230/app", // 不行
    // baseURL: "http://127.0.0.1/app",
    // baseURL: "http://192.168.136.134:8080",
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
    },
    timeout: 10 * 1000 // 10秒
})

// 拦截器
httpInstance.interceptors.request.use(function (config) {
    // 在发送请求之前做些什么
    return config;
}, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
});

// 添加响应拦截器
httpInstance.interceptors.response.use(function (response) {
    // 2xx 范围内的状态码都会触发该函数。
    // 对响应数据做点什么
    if (response.data.code === 4001) { // 直接跳转登录
        location = '/login'
        return Promise.reject(new Error('尚未登录'))
    }
    return response;
}, function (error) {
    // 超出 2xx 范围的状态码都会触发该函数。
    // 对响应错误做点什么
    return Promise.reject(error);
});

export {httpInstance}
