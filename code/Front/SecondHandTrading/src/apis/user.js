import {httpInstance} from '@/apis/http.js';

// 分页获取用户地址列表
const getUserAddress = (token, page, size) => {
    return httpInstance({
        method: 'GET',
        url: '/front/user/address',
        params: {
            page: page,
            size: size
        },
        headers: {
            'token': token
        }
    });
};

// 新增或更新用户地址
const setAddress = (token, userAddress) => {
    return httpInstance({
        method: 'POST',
        url: '/front/user/setAddress',
        data: userAddress,
        headers: {
            'token': token,
            'Content-Type': 'application/json'
        }
    });
};

// 新增用户地址
const saveUserAddress = (token, userAddress) => {
    return httpInstance({
        method: 'POST',
        url: '/front/user/address',
        headers: {
            'token': token,
            'Content-Type': 'application/json'
        },
        data: userAddress
    });
};

// 更新用户地址
const updateUserAddress = (token, userAddress) => {
    return httpInstance({
        method: 'PUT',
        url: '/front/user/address',
        headers: {
            'token': token,
            'Content-Type': 'application/json'
        },
        data: userAddress
    });
};

// 删除用户地址
const deleteUserAddress = (token, userAddressId) => {
    return httpInstance({
        method: 'DELETE',
        url: '/front/user/address',
        params: {
            userAddressId: userAddressId
        },
        headers: {
            'token': token
        }
    });
};

// 用户登录
const login = (email, password) => {
    return httpInstance({
        method: 'POST',
        url: '/front/user/login',
        params: {
            email: email,
            password: password
        },
        headers: {
            'Content-Type': 'application/json'
        }
    });
};

// 生成邮箱验证码并发送给用户（找回密码）
const getRecoverCode = (token, email) => {
    return httpInstance({
        method: 'GET',
        url: '/front/user/recover/code',
        params: {
            email: email
        },
        headers: {
            'token': token
        }
    });
};

// 生成邮箱验证码并发送给用户（注册）
const getRegisterCode = (token, email) => {
    return httpInstance({
        method: 'GET',
        url: '/front/user/register/code',
        params: {
            email: email
        },
        headers: {
            'token': token
        }
    });
};

// 校验验证码，记录用户注册、更新密码信息
const verifyCode = (token, code, password) => {
    return httpInstance({
        method: 'POST',
        url: '/front/user/verify',
        params: {
            code: code,
            password: password
        },
        headers: {
            'token': token,
            'Content-Type': 'application/json'
        }
    });
};

// 修改个人信息
// formData.append("skuInfo", new Blob([JSON.stringify(product)], {type: 'application/json'}))
const updateUserInfo = (token, formData) => {
    return httpInstance({
        method: 'PUT',
        url: '/front/user/info',
        headers: {
            'token': token,
            'Content-Type': 'multipart/form-data',
        },
        data: formData
    });
};

// 根据ID获取用户信息
const getUserInfo = (token, userId) => {
    return httpInstance({
        method: 'GET',
        url: '/front/user/userInfo',
        params: {
            userId: userId
        },
        headers: {
            'token': token
        }
    });
};

// 导出所有方法
export {
    getUserAddress,
    setAddress,
    saveUserAddress,
    updateUserAddress,
    deleteUserAddress,
    login,
    getRecoverCode,
    getRegisterCode,
    verifyCode,
    updateUserInfo,
    getUserInfo
};