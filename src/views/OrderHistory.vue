<script setup>
import {inject, onMounted, ref, watch} from "vue";
const axios = inject('axios');
import { ArrowLeft } from '@element-plus/icons-vue'
import {ElMessage,ElMessageBox} from "element-plus";
import dayjs from 'dayjs'
import {showConfirmDialog, showToast} from 'vant'
import { useRouter } from 'vue-router'
// -----------------------------获取订单记录-----------------------------

const cardList = ref([
  {
    orderId: 101,
    date: '2025-07-08',
    type: 0, // 早餐
    request: '少糖、温热',
    meals: [
      {
        mealId: 1,
        mealName: '八宝粥',
        count: 1,
        mealImg: 'https://zytd-yyzx.oss-cn-beijing.aliyuncs.com/2025-07-08-00-58-12330c79661aff9c915705e65b95af1ad.jpg'
      },
      {
        mealId: 2,
        mealName: '小笼包',
        count: 2,
        mealImg: 'https://zytd-yyzx.oss-cn-beijing.aliyuncs.com/2025-07-08-01-03-58ff8941a9c644533b5979f652b65faba.jpg'
      }
    ]
  },
  {
    orderId: 102,
    date: '2025-07-08',
    type: 1, // 午餐
    request: '不吃辣',
    meals: [
      {
        mealId: 3,
        mealName: '番茄炒蛋',
        count: 1,
        mealImg: 'https://zytd-yyzx.oss-cn-beijing.aliyuncs.com/2025-07-10-14-11-39微信图片_20250710140531.jpg'
      },
      {
        mealId: 4,
        mealName: '米饭',
        count: 1,
        mealImg: 'https://zytd-yyzx.oss-cn-beijing.aliyuncs.com/2025-07-08-01-03-36f41681ab0a683a2dd5f54d92f383e38.jpg'
      },
      {
        mealId: 5,
        mealName: '红烧肉',
        count: 1,
        mealImg: 'https://zytd-yyzx.oss-cn-beijing.aliyuncs.com/2025-07-10-14-12-55微信图片_20250710141117.jpg'
      }
    ]
  },
  {
    orderId: 103,
    date: '2025-07-08',
    type: 2, // 晚餐
    request: '忌油炸',
    meals: [
      {
        mealId: 6,
        mealName: '梅菜扣肉',
        count: 1,
        mealImg: 'https://zytd-yyzx.oss-cn-beijing.aliyuncs.com/2025-07-10-14-12-43微信图片_20250710141113.jpg'
      },
      {
        mealId: 7,
        mealName: '脆炒生菜',
        count: 1,
        mealImg: 'https://zytd-yyzx.oss-cn-beijing.aliyuncs.com/2025-07-10-14-06-06微信图片_20250710140519.jpg'
      }
    ]
  },
  {
    orderId: 104,
    date: '2025-07-11',
    type: 0, // 早餐
    request: '少糖、温热',
    meals: [
      {
        mealId: 1,
        mealName: '八宝粥',
        count: 1,
        mealImg: 'https://zytd-yyzx.oss-cn-beijing.aliyuncs.com/2025-07-08-00-58-12330c79661aff9c915705e65b95af1ad.jpg'
      },
      {
        mealId: 2,
        mealName: '小笼包',
        count: 2,
        mealImg: 'https://zytd-yyzx.oss-cn-beijing.aliyuncs.com/2025-07-08-01-03-58ff8941a9c644533b5979f652b65faba.jpg'
      }
    ]
  },
])
const timeTypes = ref([
  { value: 0, name: '早餐' },
  { value: 1, name: '午餐' },
  { value: 2, name: '晚餐' },
])

const selectedDate = ref('');

const fetchDietData = async () => {
  try {
    // const params = selectedDate.value ? { date: selectedDate.value } : {}
    // const res = await axios.get('/OrderController/listOrder', { params:{
    //     customerId: sessionStorage.getItem('userId'),
    //     date: selectedDate.value
    //   }})
    const res = await  axios.get(`OrderController/listOrder?customerId=${sessionStorage.getItem('userId')}`)

    if (res.data.status === 200) {
      cardList.value = res.data.data || []
      console.log(cardList.value)
    } else {
      cardList.value = []
      ElMessage.warning(res.data.msg || '查询失败')
    }
  } catch (e) {
    ElMessage.error('系统错误：' + e.message)
  }

cardList.value.sort((a,b)=>{
  const timeA = dayjs(a.date).valueOf() * 10 + a.type
  const timeB = dayjs(b.date).valueOf() * 10 + b.type
  return timeB - timeA
})

}

onMounted(() => {
  fetchDietData()
})

// 日期变化监听查询
watch(selectedDate, () => {
  //fetchDietData()
  searchOrder();
})

// -----------------------------取消订单--------------------
// const cancelOrder = async (orderId) => {
//   try {
//     await ElMessageBox.confirm(
//         '确定要取消该订单吗？取消后将无法恢复。',
//         '确认取消',
//         {
//           confirmButtonText: '确认',
//           cancelButtonText: '取消',
//           type: 'warning',
//         }
//     )
//
//     // 用户点击了“确认”，发送取消请求
//     const res = await axios.post('/OrderController/deleteOrder', { orderId })
//
//     if (res.data.status === 200) {
//       ElMessage.success('订单取消成功')
//       fetchDietData() // 重新刷新订单
//     } else {
//       ElMessage.warning(res.data.msg || '取消失败')
//     }
//   } catch (e) {
//     // 用户取消时 ElMessageBox 会抛出异常，不用提示
//     if (e !== 'cancel') {
//       ElMessage.error('取消失败：' + e.message)
//     }
//   }
// }
const cancelOrder = (orderId) => {
  showConfirmDialog({
    title: '取消订单',
    message: '确定要取消该订单吗？取消后将无法恢复。',
  })
      .then(async () => {
        // 用户点击确认
        try {
          // const res = await axios.post('/OrderController/deleteOrder', { orderId })
          const res = await axios.post(`OrderController/deleteOrder?orderId=${orderId}`);
          if (res.data.status === 200) {
            ElMessage.success('订单取消成功')
            fetchDietData()
          } else {
            ElMessage.warning(res.data.msg || '取消失败')
          }
        } catch (e) {
          ElMessage.error('取消失败：' + e.message)
        }
      })
      .catch(() => {
        // 用户点击取消，什么都不做
      })
}

const searchOrder = () => {
    let url = `OrderController/searchOrder?customerId=${sessionStorage.getItem('userId')}&date=${selectedDate.value}`;
    axios.get(url).then(response => {
      let rb = response.data;
      if(rb.status === 200){
        cardList.value = rb.data;
      }else{
        showToast(rb.msg);
      }
    }).catch(error => {
      console.log(error);
    })
}

// ----------------------返回我的-------------------------
const router = useRouter()

const handleBack = () => {
  router.push('/Framework/Mine')
}

</script>

<template>
<!-- <h1>历史订单</h1>-->
  <div class="layout">
    <div class="searchBar">
      <el-button @click="handleBack" circle plain class="back-btn" style="background-color: transparent; border: 0px">
        <el-icon size="20px"><ArrowLeft /></el-icon>
      </el-button>
      <el-date-picker
          v-model="selectedDate"
          type="date"
          placeholder="查找订单记录"
          style="margin: 10px; border-radius: 20px; overflow: hidden;"
          value-format="YYYY-MM-DD"
          clearable
      />
    </div>
    <div class="cards">
      <el-empty description="暂无订单记录" v-if="cardList.length === 0" />

      <el-col :gutter="16" v-else>
        <el-row  v-for="order in cardList" :key="order.orderId">
          <el-card class="order-card" shadow="hover">
            <div class="order-header">
              <div class="order-date">{{ order.date }}</div>
<!--              <div class="order-type">{{ timeTypes[order.type]?.name || '未知餐段' }}</div>-->
              <div class="order-type">{{ timeTypes[order.mealType]?.name || '未知餐段' }}</div>
            </div>
            <div class="order-request">
              备注：{{ order.request || '无' }}
            </div>
            <div class="meal-list">
<!--              <div class="meal-item" v-for="meal in order.meals" :key="meal.mealId">-->
              <div class="meal-item" v-for="meal in order.orderDetails" :key="meal.mealId">
                <img
                    class="meal-img"
                    :src="meal.mealImg || 'https://via.placeholder.com/80x60?text=No+Image'"
                    alt="meal image"
                />
                <div class="meal-info">
                  <div class="meal-name">{{ meal.mealName }}</div>
                  <div class="meal-count">数量：{{ meal.count }}</div>
                </div>
              </div>
            </div>
            <div class="order-footer">
              <el-button
                  v-if="order.date === dayjs().add(1, 'day').format('YYYY-MM-DD')"
                  type="primary"
                  plain
                  @click="cancelOrder(order.orderId)"
                  class="cancel_button"
              >
                取消订单
              </el-button>
              <el-tag v-else style="background-color: transparent;border: none; font-size: 14px;color:#666666">
                订单已完成
              </el-tag>
            </div>
          </el-card>
        </el-row>
      </el-col>
    </div>
  </div>

</template>

<style scoped>
  .layout {
    background-color: white;
    height: 100%;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }
  .searchBar{
    background-color: #B6CCF5;
    flex: 0 0 10%;
    align-content: center;
  }
  .cards{
    background-color: #F4F5FB;
    flex: 1;
    display: flex;
    flex-direction: row;
    overflow: auto;
    padding: 10px;
  }
  .order-card {
    width: 100%;
    border-radius: 12px;
    padding: 12px;
    margin-bottom: 20px;
  }

  .order-header {
    display: flex;
    justify-content: space-between;
    font-weight: bold;
    font-size: 15px;
    margin-bottom: 6px;
    margin-left: 0px;
  }

  .order-request {
    font-size: 13px;
    color: #666;
    margin-bottom: 8px;
  }

  .meal-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .meal-item {
    display: flex;
    gap: 10px;
    align-items: center;
    background-color: #f8f8f8;
    border-radius: 8px;
    padding: 6px 10px;
  }

  .meal-img {
    width: 80px;
    height: 60px;
    object-fit: cover;
    border-radius: 6px;
  }

  .meal-info {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  .meal-name {
    font-size: 14px;
    font-weight: 500;
  }
  .meal-count {
    font-size: 13px;
    color: #888;
  }
  .order-footer {
    margin-top: 12px;
    text-align: right;
  }

  .cancel_button{
    border-radius: 20px;
  }
</style>