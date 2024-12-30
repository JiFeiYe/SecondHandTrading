<template>
  <Header/>

  <div class="order-confirmation">
    <!-- 页面标题 -->
    <h2>确认订单</h2>

    <!-- 收货地址区域 -->
    <div class="address-section">
      <el-card>
        <div class="section-title">收货地址</div>
        <div class="address-scroll-container">
          <el-radio-group v-model="selectedAddressId" class="address-list" style="flex-wrap: nowrap">
            <el-radio
                v-for="address in addressList"
                :label="address.id"
                :key="address.id"
                class="address-item"
                @change="selectAddress(address)"
            >
              <div>
                <p>{{ address.name }} - {{ address.phone }}</p>
                <p>{{ address.province }} {{ address.city }} {{ address.district }} {{ address.detailAddress }}</p>
              </div>
            </el-radio>
          </el-radio-group>
        </div>
        <br>
        <el-button type="primary" @click="editAddress">管理地址</el-button>
      </el-card>
    </div>

    <!-- 商品信息区域 -->
    <div class="goods-section">
      <el-card>
        <div class="section-title">商品信息</div>
        <el-table :data="skuInfo" border>
          <el-table-column label="图片">
            <template #default="scope">
              <img :src="scope.row.skuImgList[0].url" alt="" style="max-height: 70px">
            </template>
          </el-table-column>
          <el-table-column prop="title" label="商品名称"></el-table-column>
          <el-table-column prop="price" label="价格（¥）"></el-table-column>
          <el-table-column
              label="小计（¥）"
              :formatter="(row) => row.price"
          ></el-table-column>
        </el-table>
      </el-card>
    </div>

    <!-- 支付方式区域 -->
    <div class="payment-section">
      <el-card>
        <div class="section-title">支付方式</div>
        <el-radio-group v-model="selectedPaymentMethod">
          <el-radio label="wechat">微信支付</el-radio>
          <el-radio label="alipay">支付宝</el-radio>
          <el-radio label="bank">银行卡支付</el-radio>
        </el-radio-group>
      </el-card>
    </div>

    <!-- 订单备注区域 -->
    <div class="remarks-section">
      <el-card>
        <div class="section-title">订单备注</div>
        <el-input
            v-model="orderRemarks"
            placeholder="选填，可以告诉商家您的特殊要求"
            type="textarea"
            rows="3"
        ></el-input>
      </el-card>
    </div>

    <!-- 确认订单区域 -->
    <div class="footer">
      <el-card>
        <div class="total-info">
          <p>商品总价：¥{{ totalPrice }}</p>
          <p>运费：¥{{ shippingFee }}</p>
          <p>应付总额：<strong>¥{{ totalPrice + shippingFee }}</strong></p>
        </div>
        <el-button type="primary" @click="confirmOrder">提交订单</el-button>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import {ref, computed, onMounted} from "vue"
import {ElMessage} from "element-plus"
import Header from '@/components/Header.vue'
import {getBeforeOrderInfo, submitOrder} from '@/apis/order.js'
import {useCounterStore} from '@/stores/counter.js'
import {useRoute, useRouter} from 'vue-router'

const counterStore = useCounterStore()
const route = useRoute()
const router = useRouter()

// 收货地址列表
const addressList = ref([
  {
    id: 1,
    name: "张三",
    phone: "13800000000",
    province: "北京市",
    city: "北京市",
    district: "朝阳区",
    detailAddress: "国贸大厦 8楼",
  },
  {
    id: 2,
    name: "李四",
    phone: "13900000000",
    province: "上海市",
    city: "上海市",
    district: "浦东新区",
    detailAddress: "陆家嘴 88号",
  },
])
const userInfo = ref({})

// 选中的收货地址 ID
const selectedAddressId = ref('')
const selectedAddress = computed({
  get: () => {
    return addressList.value.find(address => address.id === selectedAddressId.value) || null;
  },
  set: (value) => {
    selectedAddressId.value = value.id;
  }
});
const selectAddress = (address) => {
  selectedAddressId.value = address.id;
};

// 商品列表
const skuInfo = ref([])

// 准备数据
const prepareData = async () => {
  const res = await getBeforeOrderInfo(counterStore.token, route.params.skuId)
  // console.log(res.data)
  skuInfo.value[0] = res.data.data.skuInfo
  addressList.value = res.data.data.userAddressList
  selectedAddressId.value = addressList.value[0].id
  userInfo.value = res.data.data.userInfo
}

onMounted(() => {
  prepareData()
})

// 支付方式
const selectedPaymentMethod = ref("wechat")

// 订单备注
const orderRemarks = ref("")

// 运费
const shippingFee = ref(0)

// 计算总价
const totalPrice = computed(() =>
    skuInfo.value.reduce(
        (sum, item) => sum + item.price,
        0
    )
)

// 管理地址功能
const editAddress = () => {
  // console.log("打开地址管理页面")
  ElMessage.info("跳转到地址管理页面")
}

// 提交订单功能
const confirmOrder = async () => {
  const orderInfo = {
    orderAddress: selectedAddress.value,
    skuInfo: skuInfo.value[0],
    paymentMethod: selectedPaymentMethod.value,
    remark: orderRemarks.value,
    status: 0, // 未付款
    autoConfirmDay: 7,
    totalPrice: totalPrice.value,
  }
  orderInfo.orderAddress.id = ''
  // console.log("提交订单", orderInfo)
  await submitOrder(counterStore.token, orderInfo).then(res => {
    // console.log(res.data)
    if (res.data.code === 200) {
      ElMessage.success("订单已提交成功！")
      const subject = res.data.data.skuInfo.title
      const totalAmount = res.data.data.totalPrice
      const traceNo = res.data.data.id
      location.href =
          `http://47.115.130.230/app/front/order/alipay/pay?subject=${subject}&totalAmount=${totalAmount}&traceNo=${traceNo}`
      // router.push('/persons')
    }
  }).catch(err => {
    console.log(err)
  })
}
</script>
<style scoped>
.order-confirmation {
  padding: 20px;
}

.section-title {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 10px;
}

.address-section,
.goods-section,
.payment-section,
.remarks-section,
.footer {
  margin-bottom: 20px;
}

.address-scroll-container {
  max-width: 100%; /* 根据需要设置宽度限制 */
  overflow-x: auto; /* 添加水平滚动条 */
  white-space: nowrap; /* 防止元素换行 */
  padding-bottom: 65px; /* 增加滚动条与内容的距离 */
}

.address-item {
  display: inline-block; /* 使每个地址项横向排列 */
  min-width: 300px; /* 根据需要设置最小宽度 */
  margin-right: 10px; /* 每个地址之间的间距 */
  vertical-align: top; /* 垂直对齐方式 */
}

/*.address-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}*/

.total-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

.total-info p {
  margin: 0;
}

.total-info strong {
  color: #f56c6c;
}

.el-button {
  margin-top: 10px;
}
</style>