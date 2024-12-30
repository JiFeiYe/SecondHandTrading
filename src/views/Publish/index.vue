<template>
  <Header/>

  <el-card class="product-card">
    <el-form :model="form" label-width="100px" class="product-form">
      <!-- 商品图片上传 -->
      <el-form-item label="商品图片">
        <el-upload
            class="upload-demo"
            action="string"
            :file-list="fileList"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :before-upload="handleBeforeUpload"
            :http-request="uploadPicture"
            list-type="picture-card"
            :limit=5
            multiple
            :on-exceed="handleExceed"
        >
        </el-upload>
        <el-dialog v-model="dialogVisible">
          <img style="width: 100%; height: auto" :src="dialogImageUrl" alt="Preview Image"/>
        </el-dialog>
      </el-form-item>

      <!-- 商品名称 -->
      <el-form-item label="商品名称" required>
        <el-input v-model="form.title" placeholder="请输入商品名称"/>
      </el-form-item>

      <!-- 商品价格 -->
      <el-form-item label="商品价格" required>
        <el-input-number v-model="form.price" :min="0" :step="0.01" :precision="2"/>
      </el-form-item>

      <!-- 商品分类 -->
      <el-form-item label="商品分类">
        <el-cascader
            style="width: 30%"
            v-model="categoryIds"
            :options="categoryOptions"
            placeholder="请选择商品分类"
            clearable
            @change="getAttributeOptions"
            @clear="form.skuAttributeValueList=[]"
        />
      </el-form-item>

      <!-- 商品属性 -->
      <el-form-item label="商品属性">
        <el-cascader
            style="width: 30%"
            v-model="form.skuAttributeValueList"
            :options="attributeValueOptions"
            :props="{multiple: true, value: 'id', label: 'name'}"
            placeholder="请选择商品属性"
            clearable
            @change="handleCascaderChange"
        />
      </el-form-item>

      <!-- 商品描述 -->
      <el-form-item label="商品描述">
        <el-input type="textarea" v-model="form.description" placeholder="请输入商品描述"/>
      </el-form-item>

      <!-- 发布按钮 -->
      <el-form-item>
        <el-button type="primary" @click="submitForm">立即发布</el-button>
        <el-button @click="resetForm">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>

  <!--  <el-button type="danger" @click="console.log(form); console.log(fileList)">打印表单信息</el-button>-->

</template>

<script setup>
import {onMounted, ref, watch} from "vue"
import Header from '@/components/Header.vue'
import {ElMessage} from 'element-plus'
import {getAttrListByCategoryId, getAttrValueByAttrId, getCategoryList} from '@/apis/admin.js'
import {useCounterStore} from '@/stores/counter.js'
import {useRouter} from 'vue-router'
import {saveGoods} from '@/apis/goods.js'

const router = useRouter()
const counterStore = useCounterStore()
const form = ref({
  skuAttributeValueList: [],
  title: "",
  description: '',
  price: 0.00,
  categoryId: '',
})
const fileList = ref([]) // 存储上传文件的列表
// 商品分类
const categoryOptions = ref([])
// 商品属性
const attributeValueOptions = ref([])
const dialogVisible = ref(false)
const dialogImageUrl = ref('')
const categoryIds = ref([])
watch(categoryIds, (newValue, oldValue) => {
  if (Array.isArray(newValue) && newValue.length > 0) {
    form.value.categoryId = newValue[2]
  } else {
    form.value.categoryId = ''
  }
})
// 页面准备
const getCategoryOptions = async () => {
  const res = await getCategoryList(counterStore.token)
  // console.log(res.data.data)
  categoryOptions.value = res.data.data
}
const getAttributeOptions = async () => {
  if (Array.isArray(categoryIds.value) && categoryIds.value.length > 0) {
    const res = await getAttrListByCategoryId(counterStore.token, categoryIds.value[1])
    // console.log(res.data.data)
    attributeValueOptions.value = res.data.data
    for (const item of attributeValueOptions.value) {
      const res1 = await getAttrValueByAttrId(counterStore.token, item.id)
      // console.log(res1.data.data)
      item.children = res1.data.data
    }
  }
}
onMounted(() => {
  getCategoryOptions()
})

// 图片上传前的处理
const handleBeforeUpload = (file) => {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
  const isLt2M = file.size / 1024 / 1024 < 2

  if (!isJpgOrPng) {
    ElMessage.error('上传头像图片只能是 JPG 或 PNG 格式!')
    return false
  }
  if (!isLt2M) {
    ElMessage.error('上传头像图片大小不能超过 2MB!')
    return false
  }

  // 手动保存文件信息到 fileList
  fileList.value.push({
    name: file.name,
    url: URL.createObjectURL(file), // 生成本地预览链接
    raw: file, // 保存原始文件
  });
  return true
}

// 图片上传数量超出限制时的处理
const handleExceed = (files, fileList) => {
  ElMessage.warning('最多只能上传5张图片！');
};

const handlePreview = (file) => {
  dialogImageUrl.value = file.url
  dialogVisible.value = true
}
const handleRemove = (file, fileListNew) => {
  fileList.value = fileListNew;
};
// 自定义上传逻辑（这里是占位函数，实际在 submitForm 中提交）
const uploadPicture = (options) => {
  const {file, onSuccess} = options
  setTimeout(() => {
    onSuccess("上传成功")
  }, 500)
}

// 监听选择变化并限制每个父类选择一个子类 -> attribute
const handleCascaderChange = (value) => {
  const selectedValues = value || [];
  // 重置所有的子项为未禁用状态
  resetChildOptions();
  // 禁用已选择父级下的其他子类
  selectedValues.forEach((selected) => {
    const parentId = selected[0];
    const childId = selected[1];
    // 找到对应父级
    const parent = attributeValueOptions.value.find(option => option.id === parentId);
    if (parent) {
      // 禁用同父级下其他子类
      parent.children.forEach((child) => {
        if (child.id !== childId) {
          child.disabled = true;
        }
      });
    }
  });

  // 更新表单数据
  // form.value.skuAttributeValueList = newSelection;
};

// 重置所有子项的禁用状态
const resetChildOptions = () => {
  attributeValueOptions.value.forEach(option => {
    option.children.forEach(child => {
      child.disabled = false;
    });
  });
};

// 重置表单
const resetForm = () => {
  form.value = {
    skuAttributeValueList: [],
    title: "",
    description: '',
    price: 0.00,
    categoryId: '',
  }
  fileList.value = []
  categoryIds.value = []
}
// 提交表单
const submitForm = () => {
  const formData = new FormData()

  form.value.skuAttributeValueList = form.value.skuAttributeValueList.map(subArray => {
    return {
      attrId: subArray[0],
      attrValueId: subArray[1]
    };
  });
  // console.log('提交时：', form.value)
  // 添加商品表单数据
  formData.append("skuInfo", new Blob([JSON.stringify(form.value)], {type: 'application/json'}))

  // 添加文件数据
  if (Array.isArray(fileList.value) && fileList.value.length > 0) {
    // 添加文件数据
    fileList.value.forEach((file) => {
      formData.append("imgFileList", file.raw)
    })
  }
  // 发起 HTTP 请求
  saveGoods(counterStore.token, formData).then((res) => {
    if (res.data.code === 200) {
      // console.log("发布成功", res.data)
      alert("商品发布成功！")
      resetForm()
      router.push('/productDetail/' + res.data.data)
    }
  }).catch((error) => {
    console.error("发布失败", error)
    alert("商品发布失败，请重试！")
  })
}
</script>

<style scoped>
.product-card {
  max-width: 1000px;
  margin: 20px auto;
  padding: 20px;
}

.upload-demo {
  margin-bottom: 20px;
}

.product-form {
  margin-top: 20px;
}
</style>