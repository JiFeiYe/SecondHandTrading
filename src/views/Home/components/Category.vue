<template>
  <div class="home-category">
    <ul class="menu">
      <li v-for="item in categoryList" :key="item.id">
        <RouterLink to="">{{ item.category1Name }}</RouterLink>
        <RouterLink v-for="i in item.children.slice(0, 1000)" :key="i" to="">{{ i.name }}</RouterLink>
        <!-- 弹层layer位置 -->
        <div class="layer" :style="{ top: `${layerTop}px` }">
          <ul class="tpl">
            <li v-for="i in item.children" :key="i.id" @click="jumpDetail(i.category2Id, i.label)">
              <RouterLink to="/">
                <div class="info">
                  <p class="name ellipsis-2">
                    {{ i.label }}
                  </p>
                </div>
              </RouterLink>
            </li>
          </ul>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup>
import {onMounted, ref} from 'vue'
import {getCategory3, getCategoryList} from '@/apis/admin.js'
import {useCounterStore} from '@/stores/counter.js'
import {useRouter} from 'vue-router'

const categoryList = ref([])
const counterStore = useCounterStore()
const router = useRouter()
const layerTop = ref(0)

const getCategorys = async () => {
  await getCategoryList(counterStore.token).then(res => {
    // console.log(res.data)
    categoryList.value = res.data.data
  })
}

const updateLayerPosition = (event) => {
  layerTop.value = event.target.getBoundingClientRect().top
}

onMounted(() => {
  getCategorys()
  document.querySelectorAll('.menu li').forEach(item => {
    item.addEventListener('mouseover', updateLayerPosition)
  })
})

const jumpDetail = async (category2Id, label) => {
  // console.log(category2Id, label)
  await getCategory3(counterStore.token, category2Id).then(res => {
    // const names = res.data.data.map(item => item.name)
    // console.log(names.join(''))
    if (res.data.code === 200) {
      router.push({
        name: 'searchresults',
        params: {
          keytext: label
        }
      })
    }
  }).catch(err => {
    console.log(err)
  })
}
</script>

<style lang="scss" scoped>
a {
  text-decoration: none;
  color: inherit;
}

ul, li {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.tpl {
  display: flex;
  justify-content: space-between;
  width: 78%;
}

.tpl1 {
  display: block;
  width: 40px;
  height: 50px;
}

.home-category {
  width: 250px;
  height: 467px;
  background: rgba(0, 0, 0, 0.8);
  position: absolute;
  z-index: 99;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);

  .menu {
    li {
      padding-left: 40px;
      height: 55px;
      line-height: 55px;
      transition: background 0.3s;

      &:hover {
        background: rgba(0, 0, 0, 0.1);
      }

      a {
        margin-right: 4px;
        color: #fff;
        transition: color 0.3s;

        &:first-child {
          font-size: 16px;
          font-weight: bold;
        }

        &:hover {
          color: #1e8e8e;
        }
      }

      .layer {
        width: 950px;
        height: 450px;
        position: absolute;
        left: 250px;
        display: none;
        margin-top: 10px;
        padding-left: 100px;
        background: rgba(255, 255, 255, 0.9);
        border-radius: 8px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);

        h4 {
          font-size: 20px;
          font-weight: normal;
          line-height: 80px;

          small {
            font-size: 16px;
            color: #666;
          }
        }

        ul {
          margin-top: 30px;
          display: flex;
          flex-wrap: wrap;

          li {
            width: 310px;
            height: 120px;
            margin-right: 15px;
            margin-bottom: 15px;
            border: 1px solid #eee;
            border-radius: 4px;
            background: #fff;
            transition: background 0.3s, transform 0.3s;

            &:nth-child(3n) {
              margin-right: 0;
            }

            &:hover {
              background-color: rgba(30, 142, 142, 0.35);
              transform: translateY(-5px);
            }

            a {
              text-decoration: none;
              display: flex;
              width: 100%;
              height: 100%;
              align-items: center;
              padding: 10px;

              img {
                width: 95px;
                height: 95px;
                border-radius: 4px;
              }

              .info {
                padding-left: 10px;
                line-height: 24px;
                overflow: hidden;

                .name {
                  font-size: 16px;
                  color: #666;
                  font-weight: bold;
                }

                .desc {
                  color: #999;
                }

                .price {
                  font-size: 22px;
                  color: #CF4444FF;

                  i {
                    font-size: 16px;
                  }
                }
              }
            }
          }
        }
      }

      &:hover {
        .layer {
          display: block;
        }
      }
    }
  }
}
</style>