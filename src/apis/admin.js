import {httpInstance} from '@/apis/http.js';

// 查询全部属性、属性值列表
const getAttributeAndValueList = (token) => {
    return httpInstance({
        method: 'GET',
        url: '/service-admin/back/admin/attrAndValue',
        headers: {
            'token': token
        }
    });
};

// 新增或修改属性、属性值
const setAttributeAndValue = (token, attributeView) => {
    return httpInstance({
        method: 'POST',
        url: '/service-admin/back/admin/attribute',
        data: attributeView,
        headers: {
            'token': token,
            'Content-Type': 'application/json'
        }
    });
};

// 删除属性、属性值
const deleteAttributeAndValue = (token, attributeView) => {
    return httpInstance({
        method: 'DELETE',
        url: '/service-admin/back/admin/attribute',
        data: attributeView,
        headers: {
            'token': token,
            'Content-Type': 'application/json'
        }
    });
};

// 通过二级分类id查询全部属性列表
const getAttrListByCategoryId = (token, categoryId) => {
    return httpInstance({
        method: 'GET',
        url: '/service-admin/back/admin/attribute',
        params: {
            categoryId: categoryId
        },
        headers: {
            'token': token
        }
    });
};

// 根据属性id获取其属性值列表
const getAttrValueByAttrId = (token, attrId) => {
    return httpInstance({
        method: 'GET',
        url: '/service-admin/back/admin/attrValueByAttr',
        params: {
            attrId: attrId
        },
        headers: {
            'token': token
        }
    });
};

// 查询全部属性值列表
const getAttrValueList = (token) => {
    return httpInstance({
        method: 'GET',
        url: '/service-admin/back/admin/attributevalue',
        headers: {
            'token': token
        }
    });
};

// 新增或修改分类信息
const setCategory = (token, categoryView) => {
    return httpInstance({
        method: 'POST',
        url: '/service-admin/back/admin/category',
        data: categoryView,
        headers: {
            'token': token,
            'Content-Type': 'application/json'
        }
    });
};

// 删除分类信息
const deleteCategory = (token, categoryView) => {
    return httpInstance({
        method: 'DELETE',
        url: '/service-admin/back/admin/category',
        data: categoryView,
        headers: {
            'token': token,
            'Content-Type': 'application/json'
        }
    });
};

// 获取一级分类
const getCategory1 = (token) => {
    return httpInstance({
        method: 'GET',
        url: '/service-admin/back/admin/category1',
        headers: {
            'token': token
        }
    });
};

// 获取二级分类
const getCategory2 = (token, category1Id) => {
    return httpInstance({
        method: 'GET',
        url: '/service-admin/back/admin/category2',
        params: {
            category1Id: category1Id
        },
        headers: {
            'token': token
        }
    });
};

// 获取三级分类
const getCategory3 = (token, category2Id) => {
    return httpInstance({
        method: 'GET',
        url: '/service-admin/back/admin/category3',
        params: {
            category2Id: category2Id
        },
        headers: {
            'token': token
        }
    });
};

// 根据ID获取三级分类信息
const getCategory3ById = (token, category3Id) => {
    return httpInstance({
        method: 'GET',
        url: '/service-admin/back/admin/category3ById',
        params: {
            category3Id: category3Id
        },
        headers: {
            'token': token
        }
    });
};

// 获取全部分类信息
const getCategoryList = (token) => {
    return httpInstance({
        method: 'GET',
        url: '/service-admin/back/admin/categorylist',
        headers: {
            'token': token
        }
    });
};

// 查询所有商品
const getSkuInfoList = (token, page, size) => {
    return httpInstance({
        method: 'GET',
        url: '/service-admin/back/admin/goods',
        params: {
            page: page,
            size: size
        },
        headers: {
            'token': token
        }
    });
};

// 删除商品
const deleteSkuInfo = (token, skuId) => {
    return httpInstance({
        method: 'DELETE',
        url: `/back/admin/goods/${skuId}`,
        headers: {
            'token': token
        }
    });
};

// 商品下架
const lowerGoods = (token, skuId) => {
    return httpInstance({
        method: 'POST',
        url: '/service-admin/back/admin/goods/lower',
        data: skuId,
        headers: {
            'token': token
        }
    });
};

// 商品上架
const upperGoods = (token, skuInfo) => {
    return httpInstance({
        method: 'POST',
        url: '/service-admin/back/admin/goods/upper',
        data: skuInfo,
        headers: {
            'token': token,
            'Content-Type': 'application/json'
        }
    });
};

// 管理员登录
const adminLogin = (account, password) => {
    return httpInstance({
        method: 'POST',
        url: '/service-admin/back/admin/login',
        data: {
            account: account,
            password: password
        }
    });
};

// 分页查询所有用户or管理员列表
const getUserInfoByPage = (token, identity, page, size) => {
    return httpInstance({
        method: 'GET',
        url: '/service-admin/back/admin/user',
        params: {
            identity: identity,
            page: page,
            size: size
        },
        headers: {
            'token': token
        }
    });
};

// 修改用户或管理员信息
const updateUserInfo = (token, userInfo) => {
    return httpInstance({
        method: 'PUT',
        url: '/service-admin/back/admin/user',
        data: userInfo,
        headers: {
            'token': token,
            'Content-Type': 'application/json'
        }
    });
};

export {
    getAttributeAndValueList,
    setAttributeAndValue,
    deleteAttributeAndValue,
    getAttrListByCategoryId,
    getAttrValueByAttrId,
    getAttrValueList,
    setCategory,
    deleteCategory,
    getCategory1,
    getCategory2,
    getCategory3,
    getCategory3ById,
    getCategoryList,
    getSkuInfoList,
    deleteSkuInfo,
    lowerGoods,
    upperGoods,
    adminLogin,
    getUserInfoByPage,
    updateUserInfo
};