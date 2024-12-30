<template>
  <el-table :data="currentPageData()" style="width: 100%; overflow-y: auto; background-color: #ffffff; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1); border-radius: 8px;">
    <el-table-column fixed prop="userId" label="Id" align="center"></el-table-column>
    <el-table-column prop="phone" label="手机号" align="center"></el-table-column>
    <el-table-column prop="email" label="邮箱" align="center"></el-table-column>
    <el-table-column prop="name" label="用户名" align="center"></el-table-column>
    <el-table-column prop="gender" label="性别(0女, 1男)" align="center"></el-table-column>
    <el-table-column prop="birthdate" label="出生日期" align="center">
      <template #default="{row}">
        {{ formatDate(row.birthdate) }}
      </template>
    </el-table-column>
    <el-table-column prop="picture" label="头像(OSS)" align="center">
      <template #default="{row}">
        <img :src="row.picture" v-show="row.picture !== null" alt="Avatar"
        style="width: 50px; height: 50px; border-radius: 50%; border: 2px solid #42a5f5;">
      </template>
    </el-table-column>
    <el-table-column prop="wechat" label="微信号" align="center"></el-table-column>
    <el-table-column prop="status" label="用户状态(0正常, 1封禁)" align="center"></el-table-column>
    <el-table-column prop="createTime" label="创建时间" align="center"></el-table-column>
    <el-table-column prop="updateTime" label="修改时间" align="center"></el-table-column>
    <el-table-column fixed="right" label="操作" min-width="120" align="center">
      <template #default="{row}">
        <el-button link type="primary" size="default" @click="openEditDialog(row)">编辑</el-button>
      </template>
    </el-table-column>
  </el-table>
  <el-pagination
      background
      layout="prev, pager, next"
      :total="totalItems"
      :page-size="pageSize"
      :current-page="currentPage"
      @current-change="handleCurrentChange"
      style="margin-top: 20px; text-align: center;"
  ></el-pagination>
  <el-dialog v-model="editDialogVisible" title="编辑用户信息" width="600px" :close-on-click-modal="false">
    <el-form :model="editForm" label-width="100px" class="edit-form">
      <el-form-item label="账号">
        <el-input v-model="editForm.account" placeholder="添加账号后该用户将成为管理员"></el-input>
      </el-form-item>
      <el-form-item label="手机号">
        <el-input v-model="editForm.phone"></el-input>
      </el-form-item>
      <el-form-item label="邮箱">
        <el-input v-model="editForm.email"></el-input>
      </el-form-item>
      <el-form-item label="用户名">
        <el-input v-model="editForm.name"></el-input>
      </el-form-item>
      <el-form-item label="微信号">
        <el-input v-model="editForm.wechat"></el-input>
      </el-form-item>
      <el-form-item label="性别">
        <el-radio-group v-model="editForm.gender">
          <el-radio :label="0">女</el-radio>
          <el-radio :label="1">男</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="出生日期">
        <el-date-picker v-model="editForm.birthdate" type="date" format="YYYY-MM-DD"></el-date-picker>
      </el-form-item>
      <el-form-item label="用户状态">
        <el-radio-group v-model="editForm.status">
          <el-radio :label="0">正常</el-radio>
          <el-radio :label="1">封禁</el-radio>
        </el-radio-group>
      </el-form-item>

    </el-form>
    <div class="dialog-footer">
      <el-button type="primary" @click="submitEdit">提交</el-button>
      <el-button @click="editDialogVisible = false">取消</el-button>
    </div>
  </el-dialog>
</template>

<script setup>
import {onMounted, ref, watch} from 'vue';
import {getUserInfoByPage, updateUserInfo} from '@/apis/admin.js'
import {useCounterStore} from '@/stores/counter.js'
import dayjs from 'dayjs'

const countStore = useCounterStore()

// 示例数据
const userInfo = ref([])
const totalItems = ref(1); // 总条数
const pageSize = ref(20); // 页面大小
const currentPage = ref(1); // 当前页面

const getUserInfo = async () => {
  const res = await getUserInfoByPage(countStore.token, 0, currentPage.value, pageSize.value)
  userInfo.value = res.data.data.records
  totalItems.value = res.data.data.total
  pageSize.value = res.data.data.size
  currentPage.value = res.data.data.current
}
onMounted(() => {
  getUserInfo()
})
watch(currentPage, () => {
  getUserInfo();
});
const currentPageData = () => {
  return userInfo.value
};

function handleCurrentChange(val) {
  // console.log('val:', val)
  currentPage.value = val;
}

const editDialogVisible = ref(false);
const editForm = ref({
  account: '',
  phone: '',
  email: '',
  name: '',
  gender: '',
  birthdate: '',
  status: '',
  wechat: ''
});

const openEditDialog = (row) => {
  editForm.value = { ...row };
  editDialogVisible.value = true;
};

// 提交修改用户信息数据
const submitEdit = async () => {
  // console.log('Edited data:', editForm.value);
  await updateUserInfo(countStore.token, editForm.value).then(res => {
    console.log(res.data)
    getUserInfo()
  })
  editDialogVisible.value = false;
};

const formatDate = (date) => {
  return dayjs(date).format('YYYY-MM-DD');
}
</script>

<style scoped>
/* 添加自定义样式 */
.el-table {
  border-radius: 8px;
  overflow: hidden;
}

.el-table th, .el-table td {
  text-align: center;
}

.el-pagination {
  margin-top: 20px;
  text-align: center;
}

.edit-form {
  padding: 20px;
}

.dialog-footer {
  text-align: right;
  padding: 10px 20px;
  border-top: 1px solid #ebeef5;
}

.el-form-item {
  text-align: left;
}
</style>