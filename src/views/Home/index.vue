<template>
  <div class="home-container">
    <Header/>
    <Category/>

    <!-- 横幅区域 -->
    <section class="banner">
      <div class="banner-text">
        <h1>易电脑</h1>
        <p>发现最优质的商品和独家优惠</p>
        <el-button type="primary" class="explore-button" @click="router.push('/publish')">发布商品</el-button>
      </div>
      <!-- 轮播图 -->
      <div class="autoplay">
        <el-carousel autoplay height="467px">
          <el-carousel-item v-for="(image, index) in images" :key="index">
            <img :src="image" alt="轮播图" class="carousel-image">
          </el-carousel-item>
        </el-carousel>
      </div>
    </section>

    <!-- 产品展示区域 -->
    <section class="products">
      <h2 class="section-title">推荐商品</h2>
      <div class="product-grid">
        <div class="product-card" v-for="product in skuInfoList" :key="product.id">
          <img :src="product.imgUrlList[0]" alt="产品图" class="product-image"/>
          <h3 class="product-name">{{ product.title }}</h3>
          <p class="product-price">¥{{ product.price }}</p>
          <el-button type="success" class="add-to-cart" @click="jumpDetail(product.id)">详情</el-button>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import {onMounted, ref} from 'vue'
import {ElButton} from 'element-plus'
import {search} from '@/apis/search.js'
import {useCounterStore} from '@/stores/counter.js'
import Header from '@/views/Home/components/Header.vue'
import Category from '@/views/Home/components/Category.vue'
import {useRouter} from 'vue-router'

import a from '@/assets/111.png'
// import b from '@/assets/222.jpg'
// import c from '@/assets/333.jpg'

const router = useRouter()
const counterStore = useCounterStore()
const skuInfoList = ref([])
const images = ref([
  a/*, b, c*/
])

const getSkuInfoList = async () => {
  const searchParam = {
    keyText: '',
    orders: [
      'price:desc',
      'createTime:desc'
    ],
    page: 1,
    size: 500
  }
  const res = await search(counterStore.token, searchParam)
  // console.log(res.data)
  if (res.data.code === 200) {
    skuInfoList.value = res.data.data.goodList;
  }
}

onMounted(() => {
  getSkuInfoList()
})

const jumpDetail = (skuId) => {
  router.push({
    name: 'productDetail',
    params: {
      skuId: skuId
    }
  })
}
</script>

<style scoped>
/* 页面整体背景 */
.home-container {
  font-family: Arial, sans-serif;
  background-color: #f1f3f9;
  padding: 0;
  margin: 0;
}

/* 横幅区域 */
.banner {
  position: relative;
  background-color: #e1ecf4;
  text-align: center;
  z-index: 98;
  height: 467px;
  overflow: hidden; /* 确保轮播图不会溢出 */
}

.autoplay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1; /* 让轮播图处于底层 */
}

.carousel-image {
  width: 100%;
  height: 100%;
  object-fit: cover; /* 使图片填满容器，避免拉伸变形 */
}

.banner-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%); /* 居中 */
  z-index: 2; /* 保证文字在轮播图上层 */
  padding: 1rem;
}

.banner-text h1 {
  font-size: 2.5rem;
  font-weight: bold;
  color: #333; /* 文字颜色稍微加深 */
  margin-bottom: 0.5rem;
}

.banner-text p {
  font-size: 1.2rem;
  color: #555;
  margin-bottom: 1rem;
}

.explore-button {
  margin-top: 1rem;
  background-color: #1e8e8e;
  color: #fff;
  border-radius: 5px;
}

/* 产品展示区域 */
.products {
  padding: 2rem;
  background-color: #fff;
}

.section-title {
  font-size: 1.8rem;
  font-weight: bold;
  color: #333;
  text-align: center;
  margin-bottom: 1.5rem;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 2rem;
}

.product-card {
  background-color: #fff;
  padding: 1.5rem;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
  transition: transform 0.3s, box-shadow 0.3s;
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
}

.product-image {
  width: 100%;
  height: 150px; /* 限制图片高度 */
  object-fit: cover; /* 保持图片比例 */
  margin-bottom: 1rem;
  border-radius: 8px;
}

.product-name {
  font-size: 1.2rem;
  color: #333;
  margin: 0.5rem 0;
  white-space: nowrap; /* 防止文本换行 */
  overflow: hidden; /* 超出部分隐藏 */
  text-overflow: ellipsis; /* 添加省略号 */
}

.product-price {
  color: #1e8e8e;
  font-size: 1rem;
  margin-bottom: 1rem;
}

.add-to-cart {
  width: 100%;
  background-color: #1e8e8e;
  color: #fff;
  border-radius: 5px;
  font-size: 0.9rem; /* 调整按钮字体大小 */
  padding: 0.5rem; /* 调整按钮内边距 */
}
</style>