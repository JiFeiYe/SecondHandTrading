<template>
  <!-- 顶部导航栏 -->
  <Header/>
  <br>

  <div class="profile-container">
    <!-- 左侧导航 -->
    <aside class="sidebar">
      <el-menu default-active="1" class="el-menu-vertical">
        <el-menu-item index="1" @click="currentView = 'profile'">个人资料</el-menu-item>
        <el-menu-item index="2" @click="currentView = 'address'">地址管理</el-menu-item>
        <el-menu-item index="3" @click="currentView = 'order'">我的订单</el-menu-item>
        <el-menu-item index="4" @click="currentView = 'published'">我发布的商品</el-menu-item>
      </el-menu>
    </aside>

    <!-- 主体内容区 -->
    <main class="content">
      <!-- 个人信息 -->
      <section v-if="currentView === 'profile'" class="user-info">
        <h2>个人资料</h2>
        <div class="profile-section">
          <div class="avatar-container">
            <img :src="user.picture" alt="头像" class="user-avatar"/>
            <el-upload
                class="avatar-uploader"
                limit=1
                action="string"
                :http-request="uploadPicture"
                :show-file-list="false"
                :before-upload="beforeAvatarUpload"
            >
              <el-button size="small" type="primary">修改头像</el-button>
            </el-upload>
          </div>
          <div class="user-details">
            <p><strong>用户名：</strong>{{ user.name }}</p>
            <p><strong>邮箱：</strong>{{ user.email }}</p>
            <p><strong>手机号：</strong>{{ user.phone }}</p>
            <p><strong>性别：</strong>{{ user.gender === 1 ? '男' : (user.gender === 0 ? '女' : '') }}</p>
            <p><strong>生日：</strong>{{ user.birthdate }}</p>

            <el-button type="primary" @click="showEditProfileDialog">编辑资料</el-button>
            <el-button type="warning" @click="showChangePasswordDialog">修改密码</el-button>
            <el-button type="danger" @click="isExitLoginDialogVisible = true">退出登录</el-button>
          </div>
        </div>
      </section>

      <!-- 地址管理 -->
      <section v-if="currentView === 'address'" class="address-management">
        <h2>地址管理</h2>
        <el-table :data="addresses" border>
          <el-table-column prop="province" label="省份"/>
          <el-table-column prop="city" label="城市"/>
          <el-table-column prop="district" label="区"/>
          <el-table-column prop="detailAddress" label="详细地址"/>
          <el-table-column label="操作">
            <template #default="scope">
              <el-button size="small" type="primary" @click="showEditAddressDialog(scope.row)">编辑</el-button>
              <el-button size="small" type="danger" @click="deleteAddress(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-button type="success" @click="showAddAddressDialog">添加新地址</el-button>
      </section>

      <!-- 我的订单展示 -->
      <section v-if="currentView === 'order'">
        <div class="orders-container">
          <!-- 订单选项卡 -->
          <el-tabs v-model="activeTab">
            <el-tab-pane label="我卖出的订单" name="soldOrders">
              <div class="order-grid">
                <div
                    v-for="order in soldOrders"
                    :key="order.id"
                    class="order-card"
                    @click="showOrderDetails(order)"
                >
                  <img :src="order.skuInfo.skuImgList[0]?.url" alt="商品图片" class="order-image"/>
                  <div class="order-info">
                    <h3>{{ order.skuInfo.title }}</h3>
                    <p>订单价格: {{ order.orderItem.price }}</p>
                    <p>状态: {{ getOrderStatus(order.status) }}</p>
                  </div>
                </div>
              </div>
            </el-tab-pane>
            <el-tab-pane label="我买到的订单" name="boughtOrders">
              <div class="order-grid">
                <div
                    v-for="order in boughtOrders"
                    :key="order.id"
                    class="order-card"
                    @click="showOrderDetails(order)"
                >
                  <img :src="order.skuInfo.skuImgList[0]?.url" alt="商品图片" class="order-image"/>
                  <div class="order-info">
                    <h3>{{ order.skuInfo.title }}</h3>
                    <p>订单价格: {{ order.orderItem.price }}</p>
                    <p>状态: {{ getOrderStatus(order.status) }}</p>
                  </div>
                </div>
              </div>
            </el-tab-pane>
          </el-tabs>

          <!-- 弹窗显示订单详情 -->
          <el-dialog
              v-if="selectedOrder"
              v-model="orderDetailDialogVisible"
              title="订单详情"
              width="50%"
          >
            <div class="order-detail">
              <img :src="selectedOrder.skuInfo.skuImgList[0]?.url" alt="商品图片" class="detail-image"/>
              <div class="detail-info">
                <p><strong>商品名称:</strong> {{ selectedOrder.skuInfo.title }}</p>
                <p><strong>描述:</strong> {{ selectedOrder.skuInfo.description }}</p>
                <p><strong>商品价格:</strong> {{ selectedOrder.skuInfo.price }}</p>
                <p><strong>属性:</strong></p>
                <ul>
                  <li
                      v-for="attr in selectedOrder.skuInfo.skuAttributeValueList"
                      :key="attr.id"
                  >
                    {{ attr.attrName }}: {{ attr.attrValueName }}
                  </li>
                </ul>
                <p><strong>订单状态:</strong> {{ getOrderStatus(selectedOrder.status) }}</p>
                <p><strong>创建时间:</strong> {{ selectedOrder.createTime }}</p>
              </div>
            </div>
            <template #footer>
              <el-button @click="orderDetailDialogVisible = false">关闭</el-button>
            </template>
          </el-dialog>
        </div>
      </section>

      <!-- 我发布的商品展示 -->
      <section v-if="currentView === 'published'">
        <div class="orders-container">
          <div class="order-grid">
            <div
                v-for="product in publishedProducts"
                :key="product.id"
                class="order-card"
                @click="showProductDetails(product)"
            >
              <img :src="product.skuImgList[0]?.url" alt="商品图片" class="order-image"/>
              <div class="order-info">
                <h3>{{ product.title }}</h3>
                <p>价格: {{ product.price }}</p>
                <p>状态: {{ getProductStatus(product.status) }}</p>
                <el-button size="default" type="primary" @click.stop="toggleProductStatus(product)">
                  {{ product.status === 1 ? '下架' : '上架' }}
                </el-button>
              </div>
            </div>
          </div>

          <!-- 弹窗显示商品详情 -->
          <el-dialog
              v-if="selectedProduct"
              v-model="productDetailDialogVisible"
              title="商品详情"
              width="50%"
          >
            <div class="order-detail">
              <img :src="selectedProduct.skuImgList[0]?.url" alt="商品图片" class="detail-image"/>
              <div class="detail-info">
                <p><strong>商品名称:</strong> {{ selectedProduct.title }}</p>
                <p><strong>描述:</strong> {{ selectedProduct.description }}</p>
                <p><strong>价格:</strong> {{ selectedProduct.price }}</p>
                <p><strong>属性:</strong></p>
                <ul>
                  <li
                      v-for="attr in selectedProduct.skuAttributeValueList"
                      :key="attr.id"
                  >
                    {{ attr.attrName }}: {{ attr.attrValueName }}
                  </li>
                </ul>
                <p><strong>商品状态:</strong> {{ getProductStatus(selectedProduct.status) }}</p>
                <p><strong>创建时间:</strong> {{ selectedProduct.createTime }}</p>
              </div>
            </div>
            <template #footer>
              <el-button @click="productDetailDialogVisible = false">关闭</el-button>
            </template>
          </el-dialog>
        </div>
      </section>
    </main>
    <!-- 编辑个人资料弹窗 -->
    <el-dialog v-model="isEditProfileDialogVisible" title="编辑个人资料">
      <el-form :model="editUser">
        <el-form-item label="用户名">
          <el-input v-model="editUser.name"></el-input>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="editUser.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="editUser.phone"></el-input>
        </el-form-item>
        <el-form-item label="性别">
          <el-radio-group v-model="editUser.gender">
            <el-radio :label="1">男</el-radio>
            <el-radio :label="0">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="生日">
          <el-date-picker v-model="editUser.birthdate" type="date" placeholder="选择生日"></el-date-picker>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="isEditProfileDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveProfile">保存</el-button>
      </template>
    </el-dialog>
    <!-- 修改密码弹窗 -->
    <el-dialog v-model="isChangePasswordDialogVisible" title="修改密码">
      <el-form :model="passwordData" :rules="passwordRules" ref="form">
        <el-form-item label="邮箱">
          <el-input v-model="user.email" disabled></el-input>
        </el-form-item>
        <!-- 发送验证码 -->
        <el-form-item label="验证码">
          <el-input v-model="passwordData.verificationCode" placeholder="请输入验证码"></el-input>
          <el-button
              type="primary"
              @click="sendVerificationCode"
              :disabled="isSendingCode"
              style="margin-left: 10px;"
          >
            {{ isSendingCode ? `已发送(${countdown}s)` : '发送验证码' }}
          </el-button>
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
          <el-input v-model="passwordData.newPassword" type="password"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input v-model="passwordData.confirmPassword" type="password"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="isChangePasswordDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="changePassword">确认</el-button>
      </template>
    </el-dialog>
    <!-- 退出登录确认弹窗 -->
    <el-dialog v-model="isExitLoginDialogVisible" title="退出登录" width="500">
      <span>确认要退出登录吗？</span>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="isExitLoginDialogVisible = false">取消</el-button>
          <el-button type="primary"
                     @click="() => {counterStore.token = ''; router.push('/login')}">
            确认
          </el-button>
        </div>
      </template>
    </el-dialog>
    <!-- 编辑地址弹窗 -->
    <el-dialog v-model="isEditAddressDialogVisible" title="编辑地址">
      <el-form :model="editAddressData">
        <el-form-item label="省份">
          <el-input v-model="editAddressData.province"></el-input>
        </el-form-item>
        <el-form-item label="城市">
          <el-input v-model="editAddressData.city"></el-input>
        </el-form-item>
        <el-form-item label="区">
          <el-input v-model="editAddressData.district"></el-input>
        </el-form-item>
        <el-form-item label="详细地址">
          <el-input v-model="editAddressData.detailAddress"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="isEditAddressDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="setAddr">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import {onMounted, reactive, ref} from 'vue'
import {
  deleteUserAddress, getRecoverCode,
  getUserAddress,
  getUserInfo,
  setAddress, updateUserInfo,
  verifyCode
} from '@/apis/user.js'
import {useCounterStore} from '@/stores/counter.js'
import {ElInput, ElMessage} from 'element-plus'
import {getBuyerOrders, getSellerOrders} from '@/apis/order.js'
import Header from '@/components/Header.vue'
import {useRouter} from 'vue-router'
import {getGoods, saveGoods} from '@/apis/goods.js'
import {lowerGoods} from '@/apis/search.js'

const router = useRouter()
const counterStore = useCounterStore()
// 用户模拟数据
const user = ref({
  userId: '',
  account: '',
  phone: '',
  email: '',
  name: '',
  gender: '',
  birthdate: '',
  picture: 'https://via.placeholder.com/100',
})
// 地址模拟数据
const addresses = ref([
  {id: 1, province: '广东省', city: '广州市', district: '天河区', detailAddress: '某小区101号'},
  {id: 2, province: '北京市', city: '北京市', district: '朝阳区', detailAddress: '某大厦A座'},
])
const soldOrders = ref([])
const boughtOrders = ref([])
const publishedProducts = ref([])

// 当前视图控制
const currentView = ref('profile')
const activeTab = ref('soldOrders'); // 默认显示卖出的订单

// 功能操作
const getMyUserInfo = async () => {
  const res = await getUserInfo(counterStore.token)
  // console.log(res.data)
  user.value = res.data.data
}
const getMyAddress = async () => {
  const res = await getUserAddress(counterStore.token, 1, 100)
  // console.log(res.data)
  addresses.value = res.data.data.records
  // console.log("addresses", addresses.value)
}
// 订单操作
const getMyOrders = async () => {
  await getSellerOrders(counterStore.token, 1, 500).then(res => {
    // console.log(res.data.data.records[0])
    soldOrders.value = res.data.data.records
  }).catch(err => {
    console.error(err)
  })
  await getBuyerOrders(counterStore.token, 1, 500).then(res => {
    // console.log(res.data.data.records)
    boughtOrders.value = res.data.data.records
  }).catch(err => {
    console.error(err)
  })
};
// 获取我发布的商品数据
const getMyPublishedProducts = async () => {
  const res = await getGoods(counterStore.token, 1, 500);
  // console.log(res.data)
  publishedProducts.value = res.data.data.records;
};
onMounted(() => {
  getMyUserInfo()
  getMyAddress()
  getMyOrders()
  getMyPublishedProducts()
})

// 弹窗状态
const isEditProfileDialogVisible = ref(false)
const isChangePasswordDialogVisible = ref(false)
const isEditAddressDialogVisible = ref(false)
const isExitLoginDialogVisible = ref(false)
const orderDetailDialogVisible = ref(false);
const selectedOrder = ref({});
const productDetailDialogVisible = ref(false);
const selectedProduct = ref({});

// 头像上传
const uploadPicture = (options) => {
  const {file, onSuccess, onError} = options;

  const formData = new FormData()
  formData.append('pictureFile', file)
  formData.append('userInfo', new Blob([JSON.stringify(user.value)], {type: 'application/json'}))

  // 发起 HTTP 请求
  updateUserInfo(counterStore.token, formData).then((response) => {
    getMyUserInfo()
    ElMessage.success('头像上传成功！');
    onSuccess(response.data); // 通知 el-upload 上传成功
  }).catch((error) => {
    ElMessage.error('头像上传失败，请重试！');
    onError(error); // 通知 el-upload 上传失败
  });
};
const beforeAvatarUpload = (file) => {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  const isLt2M = file.size / 1024 / 1024 < 2;

  if (!isJpgOrPng) {
    ElMessage.error('上传头像图片只能是 JPG 或 PNG 格式!');
    return false;
  }
  if (!isLt2M) {
    ElMessage.error('上传头像图片大小不能超过 2MB!');
    return false;
  }
  return true;
};

// 显示订单详情
const showOrderDetails = (order) => {
  // console.log("显示订单详情")
  selectedOrder.value = order;
  orderDetailDialogVisible.value = true;
};
// 订单状态转换
const getOrderStatus = (status) => {
  const statusMap = {
    0: '待支付',
    1: '待发货',
    2: '待收货',
    3: '已完成',
    4: '已取消',
  };
  return statusMap[status] || '未知状态';
};

// 显示商品详情
const showProductDetails = (product) => {
  selectedProduct.value = product;
  productDetailDialogVisible.value = true;
};
// 商品状态转换
const getProductStatus = (status) => {
  const statusMap = {
    0: '未上架',
    1: '已上架',
  };
  return statusMap[status] || '未知状态';
};

// 切换商品状态
const toggleProductStatus = async (product) => {
  if (product.status === 1) {
    await lowerGoods(counterStore.token, product.id).then(res => {
      console.log(res.data)
      if (res.data.code === 200) {
        product.status = 0
      }
    })
  } else if (product.status === 0) {
    const formData = new FormData()
    formData.append("skuInfo", new Blob([JSON.stringify(product)], {type: 'application/json'}))
    await saveGoods(counterStore.token, formData).then(res => {
      console.log(res.data)
      if (res.data.code === 200) {
        product.status = 1
      }
    })
  }
};

// 编辑用户资料
const editUser = reactive({...user.value})
const showEditProfileDialog = () => {
  Object.assign(editUser, user.value)
  editUser.gender = user.value.gender === 1 ? '男' : (user.value.gender === 0 ? '女' : '');
  isEditProfileDialogVisible.value = true
}
// 保存用户资料
const saveProfile = async () => {
  const formData = new FormData()
  formData.append('userInfo', new Blob([JSON.stringify(editUser)], {type: 'application/json'}))
  // 发起 HTTP 请求
  updateUserInfo(counterStore.token, formData).then((res) => {
    // console.log(res.data)
    if (res.data.code === 200) {
      Object.assign(user.value, editUser)
      isEditProfileDialogVisible.value = false
      ElMessage.success('保存成功！');
    }
  }).catch((error) => {
    ElMessage.error('保存失败！');
  });

}
// 修改密码数据
const passwordData = reactive({
  verificationCode: '',
  newPassword: '',
  confirmPassword: '',
})
const showChangePasswordDialog = () => (isChangePasswordDialogVisible.value = true)
// 表单校验规则
const passwordRules = {
  verificationCode: [{required: true, message: '请输入验证码', trigger: 'blur'}],
  newPassword: [{required: true, message: '请输入新密码', trigger: 'blur'}],
  confirmPassword: [
    {required: true, message: '请确认新密码', trigger: 'blur'},
    {validator: (rule, value, callback) => value === passwordData.newPassword ? callback() : callback(new Error('两次密码不一致'))},
  ],
}
// 发送验证码功能
const isSendingCode = ref(false)
const countdown = ref(60) // 两次发送间隔
const sendVerificationCode = async () => {
  if (isSendingCode.value)
    return
  isSendingCode.value = true
  // 发送验证码
  await getRecoverCode(counterStore.token, user.value.email)
      .then(res => {
        // console.log(res)
      }).catch(err => {
        console.error(err)
      })
  const timer = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) {
      clearInterval(timer)
      isSendingCode.value = false
      countdown.value = 60
    }
  }, 1000)
}
// 保存修改密码
const form = ref('passwordForm')
const changePassword = () => {
  form.value.validate(async (valid) => {
    if (valid) { // 表单验证通过
      const res = await verifyCode(
          counterStore.token, passwordData.verificationCode, passwordData.confirmPassword
      ).catch(err => {
        console.error(err)
        ElMessage.error('密码修改失败！')
      })
      if (res.data.code === 200) {
        isChangePasswordDialogVisible.value = false
        ElMessage.success('密码修改成功！')
      }
    }
  })
}
// 编辑地址
const editAddressData = reactive({})
const showEditAddressDialog = (address) => {
  Object.assign(editAddressData, address)
  isEditAddressDialogVisible.value = true
}
const setAddr = async () => {
  const res = await setAddress(counterStore.token, editAddressData)
  // console.log(res.data)
  if (res.data.code === 200) {
    await getMyAddress()
    isEditAddressDialogVisible.value = false
  }
}

// 添加地址
const showAddAddressDialog = () => {
  Object.assign(editAddressData, {province: '', city: '', district: '', detailAddress: ''})
  isEditAddressDialogVisible.value = true
}

// 删除地址
const deleteAddress = async (address) => {
  await deleteUserAddress(counterStore.token, address.id).catch(err => {
    console.log(err)
  })
  await getMyAddress()
}
</script>

<style scoped>
/* 主容器布局 */
.profile-container {
  display: flex;
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  font-family: Arial, sans-serif;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  background-color: #fff;
}

/* 左侧导航栏 */
.sidebar {
  width: 250px;
  margin-right: 2rem;
}

.el-menu-vertical {
  border: 1px solid #dcdfe6;
  border-radius: 8px;
  overflow: hidden;
}

/* 右侧内容区域 */
.content {
  flex: 1;
  padding: 1.5rem;
  background-color: #f9f9f9;
  border-radius: 8px;
}

/* 用户资料布局 */
.user-info {
  display: flex;
  flex-direction: column;
}

.profile-section {
  display: flex;
  align-items: center;
}

/* 头像与修改按钮布局 */
.avatar-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-right: 2rem;
}

.user-avatar {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 1rem;
}

.avatar-uploader {
  text-align: center;
}

/* 地址管理 */
.address-management {
  margin-top: 1.5rem;
}

/* 订单管理 */
.orders-container {
  padding: 1rem;
}

.order-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.order-card {
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 1rem;
  cursor: pointer;
  transition: box-shadow 0.3s;
}

.order-card:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.order-image {
  width: 100%;
  height: 120px;
  object-fit: cover;
  border-radius: 4px;
}

.order-info {
  margin-top: 0.5rem;
}

.detail-image {
  width: 150px;
  height: 150px;
  object-fit: cover;
  border-radius: 8px;
  margin-right: 1rem;
}

.order-detail {
  display: flex;
}

.detail-info {
  flex: 1;
}
</style>