<template>
  <div class="address-container">
    <h2>地址管理</h2>
    <el-table :data="addresses" border>
      <el-table-column prop="province" label="省份" />
      <el-table-column prop="city" label="城市" />
      <el-table-column prop="region" label="区" />
      <el-table-column prop="detail_address" label="详细地址" />
      <el-table-column label="操作">
        <template #default="scope">
          <el-button size="small" type="primary" @click="editAddress(scope.row)">编辑</el-button>
          <el-button size="small" type="danger" @click="deleteAddress(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-button type="success" @click="addAddress">添加新地址</el-button>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const addresses = ref([
  {
    id: 1,
    province: '广东省',
    city: '广州市',
    region: '天河区',
    detail_address: '某街道某小区101号',
  },
  {
    id: 2,
    province: '北京市',
    city: '北京市',
    region: '朝阳区',
    detail_address: '某街道某大厦A座',
  },
])

const editAddress = (address) => {
  alert(`编辑地址：${JSON.stringify(address)}`)
}

const deleteAddress = (address) => {
  alert(`删除地址：${JSON.stringify(address)}`)
}

const addAddress = () => {
  alert('添加新地址')
}
</script>

<style scoped>
.address-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

h2 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
}

.el-button {
  margin-top: 1rem;
}
</style>