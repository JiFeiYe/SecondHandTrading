import {httpInstance} from '@/apis/http.js';

// 分页查询当前用户已发布商品接口
const getGoods = (token, page, size) => {
    return httpInstance({
        method: 'GET',
        url: '/front/goods/',
        params: {
            page: page,
            size: size
        },
        headers: {
            'token': token
        }
    });
};

// 发布商品接口
// 传json格式：
// formData.append("skuInfo", new Blob([JSON.stringify(product)], {type: 'application/json'}))
const saveGoods = (token, formData) => {
    return httpInstance({
        method: 'POST',
        url: '/front/goods/',
        data: formData,
        headers: {
            'Content-Type': 'multipart/form-data',
            'token': token
        }
    });
};

// 更新商品信息接口
const updateGoods = (token, skuInfo) => {
    return httpInstance({
        method: 'PUT',
        url: '/front/goods/',
        data: skuInfo,
        headers: {
            'Content-Type': 'application/json',
            'token': token
        }
    });
};

// 删除商品接口
const deleteGoods = (token, skuId) => {
    return httpInstance({
        method: 'DELETE',
        url: '/front/goods/',
        params: {
            skuId: skuId
        },
        headers: {
            'token': token
        }
    });
};

// 获取单一商品接口
const getGoodById = (token, skuId) => {
    return httpInstance({
        method: 'GET',
        url: '/front/goods/getone',
        params: {
            skuId: skuId
        },
        headers: {
            'token': token
        }
    });
};

export {getGoods, saveGoods, updateGoods, deleteGoods, getGoodById};