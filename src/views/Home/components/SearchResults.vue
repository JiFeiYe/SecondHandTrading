<template>
  <!-- 顶部导航栏 -->
  <header class="navbar">
    <div class="logo">
      <img src="@/assets/logo1.png" alt="" class="logoImg">
    </div>
    <nav class="nav-links">
      <el-link href="/">首页</el-link>
      <el-link href="/persons">我</el-link>
      <el-link href="#">联系我们</el-link>
    </nav>
    <div>
      <el-input v-model="input" placeholder="搜索商品" class="search-bar" @keyup.enter="jump"></el-input>
    </div>
  </header>

  <div class="product-list">
    <!-- 面包屑导航 -->
<!--    <el-breadcrumb separator-class="el-icon-arrow-right" class="breadcrumb">-->
<!--      <el-breadcrumb-item>首页</el-breadcrumb-item>-->
<!--      <el-breadcrumb-item>居家</el-breadcrumb-item>-->
<!--      <el-breadcrumb-item>居家生活用品</el-breadcrumb-item>-->
<!--    </el-breadcrumb>-->

    <!-- 筛选条件框 -->
    <div class="filter-container">
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="属性">
          <el-input v-model="formInline.attribute" placeholder="请输入商品属性"></el-input>
        </el-form-item>
        <el-form-item label="排序规则">
          <el-select v-model="formInline.sortBy" placeholder="请选择排序规则">
            <el-option label="价格升序" value="price:asc"></el-option>
            <el-option label="价格降序" value="price:desc"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="search" @click="applyFilters">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 产品展示区域 -->
    <section class="products">
      <div class="product-grid">
        <div class="product-card" v-for="product in searchList" :key="product.id">
          <img :src="product.imgUrlList[0]" alt="" class="product-image"/>  <!--todo: 不加载图片，没钱了-->
          <h3 class="product-name">{{ product.title }}</h3>
          <p class="product-price">¥{{ product.price }}</p>
          <el-button type="success" class="add-to-cart" @click="jumpDetail(product.id)">详情</el-button>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import {onMounted, ref} from 'vue';
import {ElButton, ElInput, ElLink} from 'element-plus'
import {useRoute}from 'vue-router'
import {search} from '@/apis/search.js'
import {useCounterStore}from '@/stores/counter.js'
import router from '@/router/index.js'

const counterStore = useCounterStore()
const route = useRoute()

const formInline = ref({
  attribute: [],
  sortBy: '',
});

const applyFilters = () => {
  getSearchList()
};

const searchList = ref([])
const getSearchList = async () => {
  // console.log(route.params.keytext)
  const searchParam = {
    keyText: route.params.keytext,
    attrs: formInline.value.attribute,
    orders: [
      formInline.value.sortBy,
      'createTime:desc'
    ],
    page: 1,
    size: 500
  }
  console.log(searchParam)
  await search(counterStore.token, searchParam).then(res => {
    // console.log(res.data.data)
    searchList.value = res.data.data.goodList
  })
}
onMounted(() => {
  getSearchList()
})
const input = ref('')
const jump = () => {
  searchList.value = []
  router.push({
    name: 'searchresults',
    params: {
      keytext: input.value
    }
  }).then(() => {
    location.reload()
  })
}

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
/* 顶部导航栏 */
.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 2rem;
  background-color: #fff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.logo {
  font-size: 1.5rem;
  font-weight: bold;
  color: #333;
}

.logoImg {
  width: 110px;
  height: auto;
}

.nav-links {
  display: flex;
  gap: 2rem;
  margin-right: 0;
  color: #333;
}

.search-bar {
  max-width: 300px;
}

/*筛选条件框*/
.filter-container {
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 1.5rem;
}

.demo-form-inline .el-form-item {
  margin-bottom: 1rem;
}

.demo-form-inline .el-form-item label {
  width: auto;
  color: #333;
  font-weight: bold;
}

.demo-form-inline .el-input,
.demo-form-inline .el-select {
  width: 200px;
}

.demo-form-inline .el-button {
  margin-left: 10px;
}

/*商品*/
.products {
  padding: 2rem;
  background-color: #fff;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1.5rem;
}

.product-card {
  background-color: #fff;
  padding: 1.5rem;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
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

/* 面包屑导航 */
.breadcrumb {
  padding: 1rem 2rem;
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 1rem;
}

.breadcrumb .el-breadcrumb__inner {
  font-size: 1rem;
  color: #333;
}

.breadcrumb .el-breadcrumb__separator {
  margin: 0 0.5rem;
  color: #999;
}
</style>