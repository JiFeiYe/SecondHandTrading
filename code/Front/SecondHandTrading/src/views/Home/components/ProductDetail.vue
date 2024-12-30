<template>
  <Header/>

  <div class="product-details-container">
    <!-- 产品信息区域 -->
    <section class="product-info">
      <!-- 产品图片 -->
      <div class="product-image">
        <img :src="product.image" alt="商品图片"/>
      </div>

      <!-- 产品基本信息 -->
      <div class="product-details">
        <h1 class="product-title">{{ product.title }}</h1>
        <p class="product-description">{{ product.description }}</p>
        <div class="product-price">¥{{ product.price }}</div>

        <!-- 商品规格（列表样式） -->
        <div class="product-options">
          <h3>商品规格</h3>
          <ul class="option-list">
            <li
                v-for="option in product.skuAttributeValueList"
                :key="option"
                :class="{ 'selected': selectedOption === option }"
            >
              {{ option.attrName + '：' + option.attrValueName }}
            </li>
          </ul>
        </div>

        <!-- 购买数量 -->
        <div v-if="banBuyMySku" class="product-quantity">
          <h3>购买数量</h3>
          <el-input-number v-model="quantity" :min="1" :max="1"/>
        </div>
        <br>

        <!-- 操作按钮 -->
        <div class="action-buttons">
          <!--          <el-button type="success" class="add-to-cart">加入购物车</el-button>-->
          <el-button v-if="banBuyMySku" type="primary" class="buy-now" @click="buy">立即购买</el-button>
        </div>
      </div>
    </section>

    <!-- 产品详情描述区域 -->
    <section
        v-if="product.skuImgList.length !== 0 || product.features.length !== 0"
        class="product-description-section"
    >
      <h2>商品详情</h2>

      <!-- 图片展示区域 -->
      <div v-if="product.skuImgList.length !== 0" class="image-gallery">
        <el-carousel height="300px">
          <el-carousel-item v-for="(image, index) in product.skuImgList" :key="index">
            <img :src="image.url" alt="详情图片" class="gallery-image"/>
          </el-carousel-item>
        </el-carousel>
      </div>

      <!-- 文字展示区域 -->
      <div v-if="product.features.length !== 0" class="text-description">
        <p>{{ product.longDescription }}</p>
        <h3>产品特点</h3>
        <ul>
          <li v-for="(feature, index) in product.features" :key="index">{{ feature }}</li>
        </ul>
      </div>
    </section>

    <!-- 商品发布者区域 -->
    <section class="product-seller-section">
      <h2>商品发布者信息</h2>
      <div class="seller-info">
        <img :src="seller.picture" alt="发布者头像" class="seller-avatar"/>
        <div class="seller-details">
          <h3 class="seller-name">{{ seller.name }}</h3>
          <p class="seller-description">
            邮箱：{{ seller.email }}
            <br>
            微信：{{ seller.wechat }}
          </p>
          <el-button type="primary" class="contact-seller" @click="copyWechat">联系发布者</el-button>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import {onMounted, ref} from 'vue'
import {ElButton, ElInputNumber, ElCarousel, ElCarouselItem} from 'element-plus'
import Header from '@/components/Header.vue'
import {useCounterStore} from '@/stores/counter.js'
import {useRoute} from 'vue-router'
import {getGoodById} from '@/apis/goods.js'
import {getUserInfo} from '@/apis/user.js'
import router from '@/router/index.js'

const counterStore = useCounterStore()
const product = ref({
  id: '',
  userId: '',
  title: '', // 商品名称
  description: '', // 这是一个简短的商品描述。
  price: 399,
  longDescription: '', // 这里是商品的详细描述内容，包括规格、材料、用途等。
  skuImgList: [
    {
      id: '',
      name: '',
      url: 'https://via.placeholder.com/600',
    },
    {
      id: '',
      name: '',
      url: 'https://via.placeholder.com/600',
    },
    {
      id: '',
      name: '',
      url: 'https://via.placeholder.com/600',
    },
  ],
  image: 'https://via.placeholder.com/400',
  skuAttributeValueList: [],
  features: [],
})
const seller = ref({
  account: '',
  email: '',
  name: '',
  password: '',
  phone: '',
  picture: 'https://via.placeholder.com/100',
  userId: '',
  wechat: '',
})
const selectedOption = ref(product.value.skuImgList[0])
const quantity = ref(1)

const route = useRoute()
const searchOne = async () => {
  await getGoodById(counterStore.token, route.params.skuId).then(res => {
    // console.log(res.data)
    product.value = res.data.data
    product.value.image = product.value.skuImgList.shift().url
    product.value.features = []
  })
}
const getSeller = async () => {
  const res = await getUserInfo(counterStore.token, product.value.userId)
  // console.log(res.data)
  seller.value = res.data.data
}
// 禁止自己购买自己的商品
const banBuyMySku = ref(true)
const handleMySku = async () => {
  const res = await getUserInfo(counterStore.token, '')
  // console.log(res.data.data.userId)
  // console.log(seller.value.userId)
  if (seller.value.userId === res.data.data.userId) {
    // console.log("这是自己的发布的商品，不支持购买。")
    banBuyMySku.value = false
  }
}
const prepareData = async () => { // 保证异步函数执行顺序
  await searchOne()
  await getSeller()
  await handleMySku()
}
onMounted(() => {
  prepareData()
})

const buy = () => {
  router.push({
    name: 'order',
    params: {
      skuId: product.value.id
    }
  })
}

const copyWechat = () => {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(seller.value.wechat).then(() => {
      alert('微信号已复制到剪贴板');
    }).catch(err => {
      console.error('无法复制微信号: ', err);
    });
  } else {
    console.error('当前浏览器不支持剪贴板功能');
  }
}

</script>

<style scoped>
/* 页面布局 */
.product-details-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  background-color: #f1f3f9;
}

/* 产品信息区域 */
.product-info {
  display: flex;
  gap: 2rem;
  background-color: #fff;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.1);
}

.product-image img {
  width: 400px;
  border-radius: 8px;
}

.product-details {
  flex: 1;
}

.product-title {
  font-size: 1.8rem;
  font-weight: bold;
  color: #333;
  margin-bottom: 1rem;
}

.product-description {
  font-size: 1rem;
  color: #777;
  margin-bottom: 1rem;
}

.product-price {
  font-size: 1.5rem;
  color: #1e8e8e;
  margin-bottom: 1.5rem;
}

/* 商品规格（列表样式） */
.product-options h3 {
  font-size: 1rem;
  color: #555;
  margin-bottom: 0.5rem;
}

.option-list {
  list-style-type: none;
  padding: 0;
  display: flex;
  gap: 1rem;
}

.option-list li {
  padding: 0.5rem 1rem;
  background-color: #f0f0f0;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.option-list li.selected {
  background-color: #1e8e8e;
  color: #fff;
  font-weight: bold;
}

.option-list li:hover {
  background-color: #1e8e8e;
  color: #fff;
}

/* 操作按钮 */
.action-buttons {
  display: flex;
  gap: 1rem;
}

.add-to-cart {
  background-color: #1e8e8e;
  color: #fff;
}

.buy-now {
  background-color: #1e8e8e;
  color: #fff;
}

/* 商品详情描述区域 */
.product-description-section {
  background-color: #fff;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.1);
}

.product-description-section h2 {
  font-size: 1.5rem;
  color: #333;
  margin-bottom: 1rem;
}

/* 图片展示区域 */
.image-gallery {
  margin-bottom: 1.5rem;
}

.gallery-image {
  width: 100%;
  height: auto;
  border-radius: 8px;
}

/* 文字展示区域 */
.text-description p {
  color: #777;
  font-size: 1rem;
  line-height: 1.6;
  margin-bottom: 1rem;
}

.text-description h3 {
  font-size: 1.2rem;
  color: #333;
  margin-bottom: 0.5rem;
}

.text-description ul {
  padding-left: 1.5rem;
}

.text-description li {
  color: #555;
  font-size: 1rem;
  margin-bottom: 0.5rem;
}

/* 商品发布者区域 */
.product-seller-section {
  background-color: #fff;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.1);
}

.product-seller-section h2 {
  font-size: 1.5rem;
  color: #333;
  margin-bottom: 1rem;
}

.seller-info {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.seller-avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
}

.seller-details {
  display: flex;
  flex-direction: column;
  gap: 0rem;
}

.seller-name {
  font-size: 1.2rem;
  font-weight: bold;
  color: #333;
}

.seller-description {
  color: #555;
  font-size: 1rem;
}

.contact-seller {
  background-color: #1e8e8e;
  color: #fff;
  margin-top: 0.5rem;
}
</style>