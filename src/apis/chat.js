import {httpInstance} from '@/apis/http.js';

// 获取聊天消息列表
const getMessages = (token, page, size) => {
    return httpInstance({
        method: 'GET',
        url: '/service-chat/messages',
        params: {
            page: page,
            size: size
        },
        headers: {
            'token': token
        }
    });
};

// 发送消息
const sendMessage = (token, message, receiverId) => {
    return httpInstance({
        method: 'POST',
        url: '/service-chat/messages',
        data: {
            message: message,
            receiverId: receiverId
        },
        headers: {
            'Content-Type': 'application/json',
            'token': token
        }
    });
};

export {getMessages, sendMessage};