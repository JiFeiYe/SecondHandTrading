<template>
  <div class="revenue">
    <h1 class="title">收益监控曲线:</h1>
    <div id="mychart" style="width: 1500px; height: 500px; margin: auto"></div>
  </div>
</template>

<script>
import * as echarts from 'echarts'
import {onMounted} from 'vue'

export default {
  setup() {
    // 存储时间
    let timedatas = []
    let myChart = null

    // 获取起始以及结束时间
    function getLimit() {
      // 获取当前时间（毫秒）
      let currentTimestamp = Date.now()
      // 获取当前年月日
      let currentDate = new Date(currentTimestamp)
      let currentYear = currentDate.getFullYear()
      let currentMonth = currentDate.getMonth() + 1
      let currentDay = currentDate.getDate()
      // console.log("当前日期：", currentYear, currentMonth, currentDay)

      // 计算30天内的日期
      for (let i = 30; i > 0; i--) {
        let tempTimestamp = currentTimestamp - i * 24 * 60 * 60 * 1000
        let tempDate = new Date(tempTimestamp)
        let tempYear = tempDate.getFullYear()
        let tempMonth = tempDate.getMonth() + 1
        let tempDay = tempDate.getDate()
        let str = tempYear + '-' + tempMonth + '-' + tempDay
        timedatas.push(str)
      }

    }

    // 数据处理
    function culData() {
      // 调用绘图方法
      initEcharts()
    }

    function initEcharts() {
      getLimit()
      myChart = echarts.init(document.querySelector('#mychart'))
      myChart.setOption({
        title: {
          text: `(趋势图-日 时间: ${timedatas[0]}--${timedatas[29]})`,
          top: -5,
          textStyle: {
            //设置主标题文字样式，颜色，字体，阴影等
            color: '#ddd'
          }
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985'
            }
          }
        },
        legend: {
          data: [
            '每日总收益',
            '每日净收益',
            '每日活跃用户数',
            '每日新用户注册数',
            '每日总交易笔数'
          ],
          top: 20,
          textStyle: {
            color: '#fff'
          },
          selected: {
            每日总收益: true,
            每日净收益: false,
            每日活跃用户数: false,
            每日新用户注册数: true,
            每日总交易笔数: false
          }
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          //横坐标
          {
            type: 'category',
            boundaryGap: false,
            data: timedatas
          }
        ],
        yAxis: [
          //纵坐标
          {
            type: 'value'
          }
        ],
        series: [
          {
            name: '每日总收益',
            type: 'line',
            data: [120, 132, 101, 134, 90, 230, 120, 132, 101, 134, 90, 230, 120, 132, 101, 134, 90, 230, 120, 132, 101, 134, 90, 230, 120, 132, 101, 134, 90, 230]
          },
          {
            name: '每日净收益',
            type: 'line',
            data: [60, 100, 51, 34, 30, 130, 60, 100, 51, 34, 30, 130, 60, 100, 51, 34, 30, 130, 60, 100, 51, 34, 30, 130, 60, 100, 51, 34, 30, 130]
          },
          {
            name: '每日活跃用户数',
            type: 'line',
            data: [5, 20, 31, 24, 30, 35, 5, 20, 31, 24, 30, 35, 5, 20, 31, 24, 30, 35, 5, 20, 31, 24, 30, 35, 5, 20, 31, 24, 30, 35]
          },
          {
            name: '每日新用户注册数',
            type: 'line',
            data: [5, 6, 7, 3, 5, 15, 5, 6, 7, 3, 5, 15, 5, 6, 7, 3, 5, 15, 5, 6, 7, 3, 5, 15, 5, 6, 7, 3, 5, 15]
          },
          {
            name: '每日总交易笔数',
            type: 'line',
            data: [15, 16, 17, 13, 15, 25, 15, 16, 17, 13, 15, 25, 15, 16, 17, 13, 15, 25, 15, 16, 17, 13, 15, 25, 15, 16, 17, 13, 15, 25]
          }
        ]
      })
      window.onresize = function () {
        //自适应大小
        myChart.resize()
      }
      myChart.on('click', function (params) {
        // console.log('时间：' + params.name + '；种类：' + params.seriesName + '；数值：' + params.value)
        // window.open('https://www.baidu.com')  //若需要添加点击跳转功能请打开该功能
      })
    }

    onMounted(() => {
      culData()
    })

  }
}
</script>

<style scoped>
.revenue {
  width: 100%;
  height: 95%;
  border: 1px white solid;
}

.title {
  margin-left: 30px;
  font-size: 35px;
  color: #ddd;
}
</style>