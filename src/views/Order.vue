<template>
  <div class="page">
    <div class="top-tab">
      <!-- 上面是选择早中晚 -->
      <van-tabs v-model:active="activeTimeType" @change="onTimeTypeChange" class="tab-bar">
        <van-tab v-for="item in timeTypes">
          <template #title>{{item.name}}</template>
        </van-tab>
      </van-tabs>
      <!-- 搜索部分 -->
      <van-search
          v-model="searchedMealName"
          shape="round"
          placeholder="请输入菜品关键词"
          @search="onSearchMeal"
          @cancel="onCancelSearch"
      />
      <div class="main-content">
        <!-- 侧边导航栏 -->
        <div class="meal-sidebar">
          <van-sidebar v-model="activeMealType" @change="onMealTypeChange">
            <van-sidebar-item
                v-for="(item, index) in mealTypes"
                :title="item.name"
                :key="item.value"
            >
            </van-sidebar-item>
          </van-sidebar>
        </div>

        <!-- 右侧菜品列表 -->
        <div class="meal-card" ref="scrollWrapper">
          <div
              v-for="(sortedList, index) in sortedMealList"
              :key="sortedList.type"
              :ref="el => { if (el) sectionRefs[index] = el }"
              class="meal-section"
          >
            <!--                <h3>{{mealTypes[sortedMealList.type].name}}</h3>-->
            <van-card
                v-for="(meal, index) in sortedList.meals"
                :key="index"
                :title="meal.name"
                class="card"
            >
            </van-card>
          </div>
        </div>
      </div>

      <!-- ai助手浮动气泡 -->
      <van-floating-bubble
          v-model:offset="floatOffset"
          axis="xy"
          icon="chat"
          magnetic="x"
          @offset-change="floatOffsetChange"
      />
    </div>

    <div class="bottom-bar">
      <!-- 点单的actionbar -->
      <van-action-bar class="action-bar">
        <van-action-bar-button type="primary" text="选好了" @click="onClickButton" class="action-bar-button"/>
      </van-action-bar>
    </div>
  </div>

</template>

<script setup>
import {inject, nextTick, onMounted, ref, watch} from "vue";
import {dayjs} from "element-plus";
import {showToast} from "vant";
import BScroll from "@better-scroll/core";

//======================变量============================

  // axios
  const axios = inject('axios');

  // 启用的早中晚
  const activeTimeType = ref(0);

  // 早中晚对应
  const timeTypes = ref([
    {
      value: 0,
      name: '早餐',
    },
    {
      value: 1,
      name: '午餐',
    },
    {
      value: 2,
      name: '晚餐',
    },
  ]);

  // 菜品类型对应
  const mealTypes = ref([
    {
      value: 0,
      name: '主食',
    },
    {
      value: 1,
      name: '荤菜',
    },
    {
      value: 2,
      name: '素菜',
    },
    {
      value: 3,
      name: '水果',
    },
    {
      value: 4,
      name: '汤',
    },
    {
      value: 5,
      name: '点心',
    },
  ])

  // 搜索的菜品名称
  const searchedMealName = ref('');

  // 启用的侧边栏
  const activeMealType = ref(0);

  // 悬浮气泡的位置
  const floatOffset = ref({x: 318, y: 675});

  // 当日膳食（分早中晚）
  const mealList = ref([
    {
      name: '肉三鲜饺子',
      img: '',
      type: 2,
      state: 1,
    },
    {
      name: '肉三鲜饺子',
      img: '',
      type: 2,
      state: 1,
    },
    {
      name: '肉三鲜饺子',
      img: '',
      type: 2,
      state: 1,
    }
  ]);

  const sortedMealList = ref([
    {
      type: 0,
      meals: [
        {
          name: '肉三鲜饺子',
          img: '',
          type: 0,
          state: 1,
        },
        {
          name: '肉三鲜饺子',
          img: '',
          type: 0,
          state: 1,
        },
        {
          name: '肉三鲜饺子',
          img: '',
          type: 0,
          state: 1,
        }
      ]
    },
    {
      type: 1,
      meals: [
        {
          name: '肉三鲜饺子',
          img: '',
          type: 1,
          state: 1,
        },
        {
          name: '肉三鲜饺子',
          img: '',
          type: 1,
          state: 1,
        },
        {
          name: '肉三鲜饺子',
          img: '',
          type: 1,
          state: 1,
        }
      ]
    },
  ])

  let scrollWrapper = ref(null);
  const sectionRefs = ref([]);
  let bScroll;

//======================函数==============================

//初始化bscroll
const initBScroll = () => {
  if(bScroll){
    bScroll.destroy();
    bScroll = null;
  }
  nextTick(() => {
    if (!scrollWrapper.value){
      console.log('scrollWrapper是空！');
      return
    }
    bScroll = new BScroll(scrollWrapper.value[0], {
      scrollY: true,
      probeType: 3,
    })

    bScroll.on('scroll', (pos) => {
      const scrollY = Math.abs(pos.y)
      let currentIndex = 0
      console.log("111");
      console.log(sectionRefs);
      // 使用value访问响应式数组
      for (let i = 0; i < sectionRefs.value.length; i++) {
        const el = sectionRefs.value[i]
        if (!el) continue

        if (el.offsetTop <= scrollY) {
          currentIndex = i
        } else {
          break
        }
      }
      activeMealType.value = currentIndex
    })
  })
}

// 监听sortedMealList变化重新初始化
watch(sortedMealList, () => {
  nextTick(() => {
    initBScroll()
  })
}, { deep: true })

onMounted(() => {
  initBScroll();
})

//****************初始化部分：获取当天有的菜品****************
  //获取，然后按照菜品类型来分类
  const init = () => {
    //getMealList();
  }

  const getMealList = () => {
    //先获取date和type
    let date = dayjs().format('YYYY-MM-DD');
    let type = timeTypes.value[activeTimeType.value].name;
    console.log("获取菜品列表！当前日期为："+date+"，当前获取的是："+type);
    let url = `OrderController/listDietByType?date=${date}&type=${type}`;
    console.log("发送请求："+url);
    axios.get(url).then(response => {
      let rb = response.data;
      if(rb.status === 200){
        mealList.value = rb.data;
      }else{
        showToast(rb.msg);
      }
    }).catch(error => {
      console.log(error);
    })
  }

  init();

//****************上面tab：早中晚变化 左边sidebar：菜品类型变化 悬浮气泡bubble：上下左右移动****************

  // 早中晚变化
  const onTimeTypeChange = () => {
    console.log("时间类型变化，当前时间类型为：" + timeTypes.value[activeTimeType.value].name);
    getMealList();
  }

  // 菜品类型变化
  const onMealTypeChange = () => {
    console.log("菜品类型变化，当前菜品类型为：" + mealTypes.value[activeMealType.value].name);
  }

  // 悬浮气泡变化
  const floatOffsetChange = (offset) => {
    const clampedY = Math.max(160, Math.min(675, offset.y));
    const clampedX = Math.max(10, Math.min(318, offset.x));
    console.log(clampedX)
    console.log(clampedY)
    floatOffset.value = { x: clampedX, y: clampedY }
    console.log(floatOffset.value);
  }

//****************搜索部分：搜索和重置****************

  // 菜品搜索
  const onSearchMeal = () => {

  }

  // 菜品搜索取消
  const onCancelSearch = () => {

  }

//****************提交部分****************
  // 选好了
  const onClickButton = () => {

  }
</script>

<style>
.page{
  height: 748px;
}
.top-tab{
  height: 698px;
}
.top-tab .tab-bar{
  position: fixed;
  top: 46px;
}
.bottom-bar{
  position: fixed;
  height: 60px;
  margin-bottom: 50px;
  z-index: 100;
}
.bottom-bar .action-bar{
  margin-bottom: 50px;
  height: 60px;
  --van-action-bar-button-width: 50px;
}

.bottom-bar .action-bar .action-bar-button{
  width: 100px;
  flex: none;
  position: fixed;
  bottom: 60px;
  left: 270px;
}

.main-content{
  height: 698px;
  display: flex;
  overflow-y: auto;
}
.meal-sidebar{
  flex-shrink: 0;
  position: fixed;
  width: 60px;
}
.meal-card{
  flex: 1;
  padding: 16px;
  overflow-y: auto;
}
.meal-card .card{
  margin-left: 70px;
  width: 300px;
}
</style>