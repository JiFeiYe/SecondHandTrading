import {createRouter, createWebHistory} from 'vue-router'
import Login from '@/views/Login/index.vue'
import Register from '@/views/Login/components/Register.vue'
import Home from '@/views/Home/index.vue'
import Admin from '@/views/Admin/index.vue'
import SearchResults from '@/views/Home/components/SearchResults.vue'
import ProductDetail from '@/views/Home/components/ProductDetail.vue'
import User from '@/views/User/index.vue'
import Address from '@/views/User/components/Address.vue'
import Order from '@/views/Order/index.vue'
import PaySuccess from '@/views/Order/components/PaySuccess.vue'
import Publish from '@/views/Publish/index.vue'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/login',
            component: Login,
        },
        {
            path: '/register',
            component: Register,
        },
        {
            path: '/',
            component: Home,
        },
        {
            path: '/searchresults/:keytext?',
            name: 'searchresults',
            component: SearchResults
        },
        {
            path: '/productDetail/:skuId?',
            name: 'productDetail',
            component: ProductDetail
        },
        {
            path: '/persons',
            name: 'persons',
            component: User,
            children: [
                {
                    path: '/address',
                    name: 'address',
                    component: Address
                }
            ]
        },
        {
            path: '/order/:skuId',
            name: 'order',
            component: Order
        },
        {
            path: '/order/paysuccess',
            name: 'paysuccess',
            component: PaySuccess
        },
        {
            path: '/publish',
            name: 'publish',
            component: Publish
        },
        {
            path: '/admin',
            component: Admin,
            children: [
                {
                    path: '/user',
                    name: 'user',
                    component: () => import('@/views/Admin/components/User.vue')
                },
                {
                    path: '/administrator',
                    name: 'administrator',
                    component: () => import('@/views/Admin/components/Admin.vue')
                },
                {
                    path: '/goods',
                    name: 'goods',
                    component: () => import('@/views/Admin/components/Goods.vue')
                },
                {
                    path: '/category',
                    name: 'category',
                    component: () => import('@/views/Admin/components/Category.vue')
                },
                {
                    path: '/attribute',
                    name: 'attribute',
                    component: () => import('@/views/Admin/components/Attribute.vue')
                },
                {
                    path: '/regionaltransaction',
                    name: 'regionaltransaction',
                    component: () => import('@/views/Admin/components/RegionalTransaction.vue')
                },
                {
                    path: '/revenuemonitor',
                    name: 'revenuemonitor',
                    component: () => import('@/views/Admin/components/RevenueMonitor.vue')
                }
            ]
        }
    ]
})

export default router
