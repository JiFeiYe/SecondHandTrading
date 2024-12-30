import {httpInstance} from '@/apis/http.js';

// 提交订单接口
const submitOrder = (token, orderInfo) => {
    return httpInstance({
        method: 'POST',
        url: '/front/order/',
        data: orderInfo,
        headers: {
            'Content-Type': 'application/json',
            'token': token
        }
    });
};

// 获取预备下订单时的页面信息接口
const getBeforeOrderInfo = (token, skuId) => {
    return httpInstance({
        method: 'POST',
        url: '/front/order/beforeOrder',
        params: {
            skuId: skuId
        },
        headers: {
            'Content-Type': 'application/json',
            'token': token
        }
    });
};

// 获取用户所有购买订单信息接口
const getBuyerOrders = (token, page, size) => {
    return httpInstance({
        method: 'GET',
        url: '/front/order/buyerorder',
        params: {
            page: page,
            size: size
        },
        headers: {
            'token': token
        }
    });
};

// 获取用户所有出售订单信息接口
const getSellerOrders = (token, page, size) => {
    return httpInstance({
        method: 'GET',
        url: '/front/order/sellerorder',
        params: {
            page: page,
            size: size
        },
        headers: {
            'token': token
        }
    });
};

// 发起支付请求
const easyPay = (token, subject, totalAmount, traceNo) => {
    return httpInstance({
        method: 'GET',
        url: '/front/order/alipay/pay',
        params: {
            subject: subject,
            totalAmount: totalAmount,
            traceNo: traceNo
        },
        headers: {
            'token': token
        }
    });
};
// 同上
const pay = (token, subject, totalAmount, traceNo) => {
    return httpInstance({
        method: 'GET',
        url: '/front/order/alipay/pay',
        params: {
            subject: subject,
            totalAmount: totalAmount,
            traceNo: traceNo
        },
        headers: {
            'token': token
        }
    });
};

// 处理支付通知
const payNotify = (token) => {
    return httpInstance({
        method: 'POST',
        url: '/front/order/alipay/notify',
        headers: {
            'token': token,
            'Content-Type': 'application/json'
        }
    });
};

export {submitOrder, getBeforeOrderInfo, getBuyerOrders, getSellerOrders, easyPay, pay, payNotify};