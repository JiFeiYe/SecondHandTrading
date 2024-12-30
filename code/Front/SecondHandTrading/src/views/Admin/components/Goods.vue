<template>
  <el-table :data="currentPageData()" stripe
            style="width: 100%; overflow-y: auto; background-color: #ffffff; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1); border-radius: 8px;">
    <!-- 根据你的数据库表结构定义每一列 -->
    <el-table-column fixed prop="id" label="Id"></el-table-column>
    <el-table-column prop="userId" label="UserID"></el-table-column>
    <el-table-column prop="title" label="商品标题"></el-table-column>
    <el-table-column prop="price" label="价格"></el-table-column>
    <el-table-column prop="status" label="商品状态">
      <template #default="scope">
        <el-tag :type="scope.row.status === 1 ? 'success' : 'danger'">{{ scope.row.status === 1 ? '上架' : '下架' }}</el-tag>
      </template>
    </el-table-column>
    <el-table-column fixed="right" label="操作" min-width="120">
      <template #default="scope">
        <el-button link type="primary" size="default" @click="openDetails(scope.row)">详情</el-button>
      </template>
    </el-table-column>
  </el-table>
  <el-pagination
      background
      layout="prev, pager, next"
      :total="totalItems"
      :current-page.sync="currentPage"
      :page-size="pageSize"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      style="margin-top: 20px; text-align: center;"
  />
  <el-dialog v-model="dialogVisible" width="50%" :before-close="handleClose">
    <template #title>
      <span>商品详情</span>
    </template>
    <el-form :model="selectedItem" label-width="120px">
      <el-form-item label="Id">
        <el-input v-model="selectedItem.id" disabled></el-input>
      </el-form-item>
      <el-form-item label="UserID">
        <el-input v-model="selectedItem.userId" disabled></el-input>
      </el-form-item>
      <el-form-item label="商品标题">
        <el-input v-model="selectedItem.title"></el-input>
      </el-form-item>
      <el-form-item label="商品描述">
        <el-input type="textarea" v-model="selectedItem.description"></el-input>
      </el-form-item>
      <el-form-item label="价格">
        <el-input v-model="selectedItem.price"></el-input>
      </el-form-item>
      <el-form-item label="商品状态">
        <el-radio-group v-model="selectedItem.status">
          <el-radio :label="1">上架</el-radio>
          <el-radio :label="0">下架</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="分类ID">
        <el-input v-model="selectedItem.categoryId"></el-input>
      </el-form-item>
      <el-form-item label="创建时间">
        <el-input v-model="selectedItem.createTime" disabled></el-input>
      </el-form-item>
      <el-form-item label="修改时间">
        <el-input v-model="selectedItem.updateTime" disabled></el-input>
      </el-form-item>
      <el-form-item label="商品图片">
        <div v-if="selectedItem.skuImgList && selectedItem.skuImgList.length">
          <el-image
            v-for="(img, index) in selectedItem.skuImgList"
            :key="index"
            :src="img.url"
            style="width: 100px; height: 100px; margin-right: 10px;"
            fit="cover"
          />
        </div>
        <div v-else>
          <span>暂无图片</span>
        </div>
      </el-form-item>
      <el-form-item label="商品属性">
        <div>
          <el-tag
            v-for="attr in selectedItem.skuAttributeValueList"
            :key="attr.id"
            style="margin-right: 5px; margin-bottom: 5px;"
          >
            {{ attr.attrName }}: {{ attr.attrValueName }}
          </el-tag>
        </div>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">关闭</el-button>
        <el-button type="primary" @click="saveDetails">保存</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import {ElTable, ElTableColumn, ElPagination, ElTag, ElDialog, ElForm, ElFormItem, ElInput, ElRadioGroup, ElRadio, ElImage} from "element-plus";
import {onMounted, ref, watch} from 'vue'
import {getSkuInfoList} from '@/apis/admin.js'
import {useCounterStore} from '@/stores/counter.js'

const counterStore = useCounterStore()

const tableData = ref([])     // 数据列表
const totalItems = ref(0)     // 总共多少条数据
const currentPage = ref(1)     // 当前页码
const pageSize = ref(20)    // 每页显示数量
const dialogVisible = ref(false)
const selectedItem = ref({}) // 被选中元素

const getSkuInfo = async () => {
  const res = await getSkuInfoList(counterStore.token, currentPage.value, pageSize.value)
  console.log(res.data.data.records[0])
  tableData.value = res.data.data.records
  totalItems.value = res.data.data.total
  pageSize.value = res.data.data.size
  currentPage.value = res.data.data.current
  // console.log('tableData.value', tableData.value)
}
onMounted(() => {
  getSkuInfo()
})
watch(currentPage, () => {
  getSkuInfo();
})
const currentPageData = () => {
  return tableData.value
}
const handleSizeChange = (val) => {
  pageSize.value = val
}

function handleCurrentChange(val) {
  currentPage.value = val;
}
// 设置选中元素
const openDetails = (item) => {
  selectedItem.value = { ...item }
  dialogVisible.value = true
}

const handleClose = () => {
  dialogVisible.value = false
}
const handlePreview = (file) => {
  console.log('preview:', file);
}

const handleRemove = (file, fileList) => {
  console.log('remove:', file, fileList);
}

const saveDetails = () => {
  // 保存逻辑
  console.log('保存:', selectedItem.value);
  dialogVisible.value = false
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

.dialog-footer {
  text-align: right;
}
</style>