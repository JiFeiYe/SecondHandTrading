import {httpInstance} from '@/apis/http.js';

// 搜索单一商品接口
const searchById = (token, skuId) => {
    return httpInstance({
        method: 'GET',
        url: '/front/search/search',
        params: {
            'skuId': skuId
        },
        headers: {
            'token': token
        }
    });
};

// 搜索接口
const search = (token, searchParam) => {
    return httpInstance({
        method: 'POST',
        url: '/front/search/search',
        data: searchParam,
        headers: {
            'Content-Type': 'application/json',
            'token': token
        }
    });
};

// 下架商品接口
const lowerGoods = (token, goodId) => {
    return httpInstance({
        method: 'POST',
        url: '/front/search/lower',
        params: {
            goodId: goodId
        },
        headers: {
            'Content-Type': 'application/json',
            'token': token
        }
    });
};

// 上架商品接口
const upperGoods = (token, skuInfo) => {
    return httpInstance({
        method: 'POST',
        url: '/front/search/upper',
        data: skuInfo,
        headers: {
            'Content-Type': 'application/json',
            'token': token
        }
    });
};

export {searchById, search, lowerGoods, upperGoods};