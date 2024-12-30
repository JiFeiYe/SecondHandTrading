<template>
  <el-tree
      :data="currentPageData()"
      default-expand-all
      :expand-on-click-node="false"
      style="background-color: #ffffff; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1); border-radius: 8px; padding: 20px 10px;"
  >
    <template #default="{ node, data }">
        <span class="custom-tree-node">
          <p v-if="node.level === 1">分类：</p>
          <p v-if="node.level === 2">属性：</p>
          <p v-if="node.level === 3">属性值：</p>
          <span>{{ node.data.label }}</span>
          <span style="text-align: right">
            <a style="margin-left: 20px; color: #42a5f5;" v-if="node.level === 2"
               @click="remove(node, data)">删除属性</a>
            <a style="margin-left: 20px; color: #42a5f5;" v-if="node.level === 3"
               @click="remove(node, data)">删除属性值</a>
          </span>
        </span>
    </template>
  </el-tree>
  <div class="flex flex-col gap-4 items-start" style="margin-top: 20px;">
    <el-select clearable v-model="chooseCategoryId" placeholder="选择分类" size="large" style="width: 200px"
               @clear="getCategory; chooseCategoryId = ''" @change="getCategory">
      <el-option v-for="item in tableData" :key="item.categoryId" :label="item.categoryName"
                 :value="item.categoryId"/>
    </el-select>
    <div class="attribute-input-group">
      <el-select clearable v-model="chooseAttrId" placeholder="选择属性" size="large" style="width: 200px"
                 @clear="getAttribute; chooseAttrId = ''" @change="getAttribute">
        <el-option v-for="item in attribute" :key="item.id" :label="item.name" :value="item.id"/>
      </el-select>
      <el-input
          v-model="inputNewAttr"
          style="width: 300px"
          :placeholder="inputPlaceholder1"
          @keyup.enter="setAttr"
      ></el-input>
      <el-button @click="setAttr" :disabled="banButton1.disabled">确定</el-button>
    </div>
    <div class="attribute-input-group">
      <el-select clearable v-model="chooseAttrValueId" placeholder="选择属性值" size="large" style="width: 200px"
                 @clear="getAttributeValue; chooseAttrValueId = ''" @change="getAttributeValue">
        <el-option v-for="item in attributeValue" :key="item.id" :label="item.name" :value="item.id"/>
      </el-select>
      <el-input
          v-model="inputNewAttrValue"
          style="width: 300px"
          :placeholder="inputPlaceholder2"
          @keyup.enter="setAttr"
      ></el-input>
      <el-button @click="setAttr" :disabled="banButton2.disabled">确定</el-button>
    </div>
  </div>
</template>

<script setup>
import {onMounted, ref, watch, watchEffect} from 'vue'
import {useCounterStore} from '@/stores/counter.js'
import {
  deleteAttributeAndValue,
  getAttributeAndValueList,
  getAttrListByCategoryId,
  getAttrValueByAttrId,
  setAttributeAndValue
} from '@/apis/admin.js'

const counterStore = useCounterStore()

const tableData = ref([])     // 数据列表
const getAttributes = async () => {
  const res = await getAttributeAndValueList(counterStore.token)
  tableData.value = res.data.data
  // console.log(tableData.value)
}
onMounted(() => {
  getAttributes()
})
const currentPageData = () => {
  return tableData.value
}
const remove = async (node, data) => {
  // console.log(node.data)
  const attributeView = {
    attrId: '',
    attrValueId: '',
  }
  if (node.level === 2) {
    attributeView.attrId = node.data.attrId
  }
  if (node.level === 3) {
    attributeView.attrValueId = node.data.attrValueId
    // console.log(node.parent)
    attributeView.attrId = node.parent.data.attrId
  }
  // console.log("attributeView", attributeView)
  const res = await deleteAttributeAndValue(counterStore.token, attributeView)
  // console.log(res)
  await getAttributes()
}

const attribute = ref([])
const attributeValue = ref([])
const chooseCategoryId = ref('')
const chooseAttrId = ref('')
const chooseAttrValueId = ref('')
const getCategory = () => {
  getAttribute()
  chooseAttrId.value = ''
  chooseAttrValueId.value = ''
  inputNewAttr.value = ''
  inputNewAttrValue.value = ''
}
const getAttribute = async () => {
  // console.log(chooseCategoryId.value)
  chooseAttrValueId.value = ''
  inputNewAttr.value = ''
  inputNewAttrValue.value = ''
  await getAttrListByCategoryId(counterStore.token, chooseCategoryId.value).then(res => {
    // console.log(res.data)
    attribute.value = res.data.data
  })
  await getAttributeValue()
}
const getAttributeValue = async () => {
  inputNewAttrValue.value = ''
  await getAttrValueByAttrId(counterStore.token, chooseAttrId.value).then(res => {
    attributeValue.value = res.data.data
  })
}
const inputPlaceholder1 = ref('新增属性')
const inputPlaceholder2 = ref('新增属性值')
const banButton1 = ref({
  disabled: true,
  flag1: false,
  flag2: false,
  flag3: false,
})
const banButton2 = ref({
  disabled: true,
  flag1: false,
  flag2: false,
  flag3: false,
})
const inputNewAttr = ref('')
const inputNewAttrValue = ref('')
watchEffect(() => {
  if (chooseCategoryId.value !== '') {
    banButton1.value.flag1 = true
    banButton2.value.flag1 = true
  } else {
    banButton1.value.flag1 = false
    banButton2.value.flag1 = false
  }

  banButton2.value.flag2 = chooseAttrId.value !== '';

  banButton1.value.flag3 = inputNewAttr.value !== '';
  banButton2.value.flag3 = inputNewAttrValue.value !== '';
})
watch([banButton1, banButton2], ([new1, new2], [old1, old2]) => {
  banButton1.value.disabled = !(new1.flag1 === true && new1.flag3 === true);
  banButton2.value.disabled = !(new2.flag1 === true && new2.flag2 === true && new2.flag3 === true);
}, {deep: true})
watch(chooseAttrId, (newValue, oldValue) => {
  if (newValue === '') {
    inputPlaceholder1.value = '新增属性'
  } else {
    inputPlaceholder1.value = '修改选中属性'
  }
})
watch(chooseAttrValueId, (newValue, oldValue) => {
  if (newValue === '') {
    inputPlaceholder2.value = '新增属性值'
  } else {
    inputPlaceholder2.value = '修改选中属性值'
  }
})
const setAttr = async () => {
  const attributeView = {
    attrId: chooseAttrId.value,
    attrName: inputNewAttr.value,
    categoryId: chooseCategoryId.value,
    attrValueId: chooseAttrValueId.value,
    attrValueName: inputNewAttrValue.value
  }
  if (attributeView.attrId !== '' && attributeView.attrName === '') {
    const option = attribute.value.find(item => item.id === attributeView.attrId)
    attributeView.attrName = option.name
  }
  // console.log('attributeView:', attributeView)
  const res = await setAttributeAndValue(counterStore.token, attributeView)
  // console.log(res.data)
  await getAttribute()
  await getAttributes()
}
</script>

<style lang="scss" scoped>
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}

.el-tree {
  border-radius: 8px;
  overflow: hidden;
}

.el-select, .el-input, .el-button {
  margin-bottom: 10px;
}

.attribute-input-group {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}
</style>