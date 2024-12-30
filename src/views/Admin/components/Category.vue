<template>
  <el-tree
      :data="currentPageData()"
      default-expand-all
      :expand-on-click-node="false"
      style="background-color: #ffffff; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1); border-radius: 8px; padding: 20px 10px;"
  >
    <template #default="{ node, data }">
        <span class="custom-tree-node">
          <p v-if="node.level === 1">一级分类：</p>
          <p v-if="node.level === 2">二级分类：</p>
          <p v-if="node.level === 3">三级分类：</p>
          <span>{{ node.data.label }}</span>
          <span style="text-align: right">
            <a style="margin-left: 50px; color: #42a5f5;" v-if="node.level === 1"
               @click="remove(node, data)">删除一级分类</a>
            <a style="margin-left: 50px; color: #42a5f5;" v-if="node.level === 2"
               @click="remove(node, data)">删除二级分类</a>
            <a style="margin-left: 50px; color: #42a5f5;" v-if="node.level === 3"
               @click="remove(node, data)">删除三级分类</a>
          </span>
        </span>
    </template>
  </el-tree>
  <div class="flex flex-wrap gap-4 items-center" style="margin-top: 20px;">
    <div class="category-input-group">
      <el-select
          clearable
          v-model="chooseCategory1Id"
          placeholder="选择一级分类"
          size="large"
          style="width: 200px"
          @clear="getCategory11; chooseCategory1Id=''"
          @change="getCategory11"
          @click="getCategory11">
        <el-option v-for="item in category1" :key="item.id" :label="item.name" :value="item.id"/>
      </el-select>
      <el-input
          v-model="inputNewCategory1Name"
          style="width: 300px"
          :placeholder="inputPlaceholder1"
          @keyup.enter="addNewCategory"
      ></el-input>
      <el-button @click="addNewCategory" :disabled="banButton1.disabled">确定</el-button>
    </div>
    <div class="category-input-group">
      <el-select
          clearable
          v-model="chooseCategory2Id"
          placeholder="选择二级分类"
          size="large"
          style="width: 200px"
          @clear="getCategory22; chooseCategory2Id=''"
          @change="getCategory22"
          @click="getCategory22">
        <el-option v-for="item in category2" :key="item.id" :label="item.name" :value="item.id"/>
      </el-select>
      <el-input
          v-model="inputNewCategory2Name"
          style="width: 300px"
          :placeholder="inputPlaceholder2"
          @keyup.enter="addNewCategory"
      ></el-input>
      <el-button @click="addNewCategory" :disabled="banButton2.disabled">确定</el-button>
    </div>
    <div class="category-input-group">
      <el-select
          clearable
          v-model="chooseCategory3Id"
          placeholder="选择三级分类"
          size="large"
          style="width: 200px"
          @clear="getCategory33; chooseCategory3Id=''"
          @change="getCategory33"
          @click="getCategory33">
        <el-option v-for="item in category3" :key="item.id" :label="item.name" :value="item.id"/>
      </el-select>
      <el-input
          v-model="inputNewCategory3Name"
          style="width: 300px"
          :placeholder="inputPlaceholder3"
          @keyup.enter="addNewCategory"
      ></el-input>
      <el-button @click="addNewCategory" :disabled="banButton3.disabled">确定</el-button>
    </div>
  </div>
</template>

<script setup>
import {onMounted, ref, watch, watchEffect} from 'vue';
import {deleteCategory, getCategory1, getCategory2, getCategory3, getCategoryList, setCategory} from '@/apis/admin.js';
import {useCounterStore} from '@/stores/counter.js';

const counterStore = useCounterStore();

const tableData = ref([]); // 数据列表

const getCategory = async () => {
  const res = await getCategoryList(counterStore.token);
  // console.log(res.data);
  tableData.value = res.data.data;
};

onMounted(() => {
  getCategory();
});

const currentPageData = () => {
  return tableData.value;
};
const remove = async (node, data) => {
  const categoryView = {
    category1Id: '',
    category2Id: '',
    category3Id: '',
  }
  // console.log(node.data)
  getId(categoryView, node.data)
  if (node.parent !== null && !Array.isArray(node.parent)) {
    // console.log(node.parent.data)
    getId(categoryView, node.parent.data)
    if (node.parent.parent !== null && !Array.isArray(node.parent.parent)) {
      // console.log(node.parent.parent.data)
      getId(categoryView, node.parent.parent.data)
    }
  }
  // console.log("///////////////////", categoryView)
  await deleteCategory(counterStore.token, categoryView).catch(err => {
    console.log(err)
  })
  await getCategory()
}
const getId = (categoryView, data) => {
  // console.log("getId:data:", data)
  // console.log(data.category1Id)
  // console.log(data.category2Id)
  // console.log(data.category3Id)
  if (data.category1Id !== undefined)
    categoryView.category1Id = data.category1Id
  if (data.category2Id !== undefined)
    categoryView.category2Id = data.category2Id
  if (data.category3Id !== undefined)
    categoryView.category3Id = data.category3Id
}

const category1 = ref([])
const category2 = ref([])
const category3 = ref([])
const chooseCategory1Id = ref('')
const chooseCategory2Id = ref('')
const chooseCategory3Id = ref('')
const inputNewCategory1Name = ref('')
const inputNewCategory2Name = ref('')
const inputNewCategory3Name = ref('')
const inputPlaceholder1 = ref('新增一级分类')
const inputPlaceholder2 = ref('新增二级分类')
const inputPlaceholder3 = ref('新增三级分类')
const banButton1 = ref({
  disabled: true,
  flag1: false,
  flag2: false
})
const banButton2 = ref({
  disabled: true,
  flag1: false,
  flag2: false
})
const banButton3 = ref({
  disabled: true,
  flag1: false,
  flag2: false
})
const getCategory11 = async () => {
  const res = await getCategory1(counterStore.token)
  category1.value = res.data.data
  category2.value = []
  category3.value = []
  chooseCategory2Id.value = ''
  chooseCategory3Id.value = ''
}
const getCategory22 = async () => {
  const res = await getCategory2(counterStore.token, chooseCategory1Id.value)
  category2.value = res.data.data
  category3.value = []
  chooseCategory3Id.value = ''
}
const getCategory33 = async () => {
  const res = await getCategory3(counterStore.token, chooseCategory2Id.value)
  category3.value = res.data.data
}
watchEffect(() => {
  if (chooseCategory1Id.value !== '') {
    banButton2.value.flag1 = true
    inputPlaceholder1.value = '修改选中一级分类名称'
  } else {
    banButton2.value.flag1 = false
    inputPlaceholder1.value = '新增一级分类'
  }
  if (chooseCategory2Id.value !== '') {
    banButton3.value.flag1 = true
    inputPlaceholder2.value = '修改选中二级分类名称'
  } else {
    banButton3.value.flag1 = false
    inputPlaceholder2.value = '新增二级分类'
  }
  if (chooseCategory3Id.value !== '')
    inputPlaceholder3.value = '修改选中三级分类名称'
  else
    inputPlaceholder3.value = '新增三级分类'
  banButton1.value.flag2 = inputNewCategory1Name.value !== '';
  banButton2.value.flag2 = inputNewCategory2Name.value !== '';
  banButton3.value.flag2 = inputNewCategory3Name.value !== '';
  // console.log(banButton1.value.flag2)
})
watch([banButton1, banButton2, banButton3], ([new1, new2, new3], [old1, old2, old3]) => {
  banButton1.value.disabled = new1.flag2 !== true
  banButton2.value.disabled = !(new2.flag1 === true && new2.flag2 === true);
  banButton3.value.disabled = !(new3.flag1 === true && new3.flag2 === true);
}, {deep: true})
const addNewCategory = async () => {
  const categoryView = {
    category1Id: chooseCategory1Id.value,
    category1Name: inputNewCategory1Name.value,
    category2Id: chooseCategory2Id.value,
    category2Name: inputNewCategory2Name.value,
    category3Id: chooseCategory3Id.value,
    category3Name: inputNewCategory3Name.value,
  }
  if (categoryView.category1Name === '' && categoryView.category1Id !== '') {
    const option = category1.value.find(item => item.id === categoryView.category1Id)
    categoryView.category1Name = option.name
  }
  if (categoryView.category2Name === '' && categoryView.category2Id !== '') {
    const option = category2.value.find(item => item.id === categoryView.category2Id)
    categoryView.category2Name = option.name
  }
  if (categoryView.category3Name === '' && categoryView.category3Id !== '') {
    const option = category3.value.find(item => item.id === categoryView.category3Id)
    categoryView.category3Name = option.name
  }
  // console.log(categoryView)
  await setCategory(counterStore.token, categoryView).then(res => {
    // console.log(res.data)
    getCategory11()
    getCategory22()
    getCategory33()
    inputNewCategory1Name.value = ''
    inputNewCategory2Name.value = ''
    inputNewCategory3Name.value = ''
  }).catch(err => {
    console.log(err)
  })
  await getCategory()
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

.category-input-group {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}
</style>