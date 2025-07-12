<template>
  <div class="page">
    <div class="top-tab">
      <!-- 上面是选择早中晚 -->
      <van-tabs v-model:active="activeTimeType" @change="onTimeTypeChange" class="tab-bar" sticky>
        <van-tab v-for="item in timeTypes">
          <template #title>{{item.name}}</template>
        </van-tab>
      </van-tabs>

      <!-- 搜索部分 -->
      <div class="search-box">
        <van-search
            v-model="searchedMealName"
            shape="round"
            show-action
            placeholder="请输入菜品关键词"
            @search="onSearchMeal"
            @cancel="onCancelSearch"
            class="search"
        />
      </div>
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
          <div ref="scrollWrapperContent">
            <div
                v-for="(sortedList, index) in sortedMealList"
                :key="sortedList.type"
                :ref="el => setSectionRef(el, index, sortedList.type)"
                class="meal-section"
            >
              <h3 style="margin-left: 70px; margin-bottom: 10px; margin-top: 10px" v-if="mealTypes && mealTypes[sortedList?.type]">{{mealTypes[sortedList.type].name}}</h3>
              <van-card
                  v-for="(meal, index) in sortedList.meals"
                  :key="index"
                  class="card"
              >
                <template #title style="height: 20px">
                  <div class="card-title" style="font-size: 16px; margin: 10px 0 0 0; padding: 0;">
                    {{meal.name}}
                  </div>
                </template>
                <template #desc>
                  <div class="card-button" style="margin-left: 70px; margin-top: 30px">
                    <van-button type="primary" round size="small" @click="addToCart(meal)" v-if="meal.inCart === false" :disabled="!isCurrentTimeCanOrder">加入购物车</van-button>
                    <van-stepper v-else theme="round" v-model="meal.quantity" integer min="0" button-size="22" @change="(val) => handleQuantityChange(meal, val)"></van-stepper>
                  </div>
                </template>
                <template #thumb>
                  <div class="card-img">
                    <van-image width="80" height="80" :src="meal.img"></van-image>
                  </div>
                </template>
              </van-card>
            </div>
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
          @click="openDrawer"
      />
    </div>

    <div class="bottom-bar">
      <!-- 点单的actionbar -->
      <van-action-bar class="action-bar">
<!--        <van-action-bar-button type="primary" text="选好了" @click="onClickButton" class="action-bar-button" icon="shopping-cart-o"/>-->
        <van-action-bar-button type="primary" @click="onClickButton" class="action-bar-button" :disabled="mealCount === 0">
          <template #default>
            <van-badge :content="mealCount" :show-zero="false">
              <van-icon name="shopping-cart-o"></van-icon>
              <span style="margin-left: 5px;">选好了</span>
            </van-badge>

          </template>
        </van-action-bar-button>
      </van-action-bar>
    </div>

    <div class="action-sheet">
      <van-action-sheet v-model:show="showActionSheet" title="确认订单">
        <div class="action-sheet-content">
          <div class="order-header">
            已选菜品
          </div>
          <div class="order-list">
            <van-list>
              <van-cell v-for="item in selectedMeals" :key="item.mealId">
                <template #title>
                  <div style="margin-left: 10px">
                    {{item.name}}
                  </div>
                </template>
                <template #label>
                  <div style="margin-left: 10px">
                    <van-tag type="primary">{{mealTypes[item.type].name}}</van-tag>
                  </div>
                </template>
                <template #icon>
                  <van-image height="60px" width="60px" :src="item.img"></van-image>
                </template>
                <template #extra>x{{item.quantity}}</template>
              </van-cell>
            </van-list>
          </div>
          <van-cell title="备注" is-link :value="request" arrow-direction="down" :replace="false" @click="showRequest"></van-cell>
          <!-- 展开输入框区域 -->
          <transition name="slide-fade">
            <div v-show="requestVisible" class="input-area">
              <van-field
                  v-model="request"
                  type="textarea"
                  rows="3"
                  placeholder="请输入备注"
                  show-word-limit
                  maxlength="100"
              />
            </div>
          </transition>
          <div class="order-submit">
            <van-button type="primary" round class="order-button" @click="submitOrder">提交订单</van-button>
          </div>
        </div>
      </van-action-sheet>
    </div>
  </div>

<!-----------------------智能推荐-------------------------->
<!--  <el-drawer-->
<!--      v-model="drawerVisible"-->
<!--      direction="btt"-->
<!--      size="50%"-->
<!--      :with-header="false"-->
<!--      class="recommend-drawer"-->
<!--  >-->
<!--    <div v-loading="loading" class="drawer-content">-->
<!--      <el-text>-->
<!--        智能推荐助手-->
<!--      </el-text>-->
<!--      <div v-if="recommendation.recommendedDishes.length">-->
<!--        <p><strong>推荐菜品：</strong>{{ recommendation.recommendedDishes.join('、') }}</p>-->
<!--        <p style="margin-top: 8px; line-height: 1.6;">-->
<!--          <strong>推荐理由：</strong>{{ recommendation.reasoning }}-->
<!--        </p>-->
<!--      </div>-->
<!--      <el-empty v-else description="暂无推荐结果" />-->
<!--    </div>-->
<!--  </el-drawer>-->

  <el-drawer
      v-model="drawerVisible"
      direction="btt"
      size="50%"
      :with-header="false"
      class="recommend-drawer"
  >
    <div v-loading="loading" class="drawer-content">
      <!-- 顶部标题栏 -->
      <div class="drawer-header">
        <el-image style="width: 50px;" src="https://zytd-yyzx.oss-cn-beijing.aliyuncs.com/3556e069c575247341e60ac63839177.png" />
        <el-text class="drawer-title">颐养中心智能点菜推荐助手为您服务</el-text>
      </div>

      <!-- 推荐内容 -->
      <div class="drawer-body">
        <div v-if="recommendation.recommendedDishes.length">
          <div class="dish-list">
            <el-icon style="margin-right: 4px; vertical-align: middle;">
              <DishDot />
            </el-icon>
            <el-text><strong>推荐菜品：</strong>{{ recommendation.recommendedDishes.join('、') }}</el-text>
          </div>
          <div class="dish-reason" style="margin-top: 12px;">
            <el-icon style="margin-right: 4px; vertical-align: middle;">
              <Document />
            </el-icon>
            <el-text style="line-height: 1.6;"><strong>推荐理由：</strong>{{ formatReasoning(recommendation.reasoning) }}</el-text>
          </div>
        </div>
        <el-empty v-else description="暂无推荐结果" />
      </div>
    </div>
  </el-drawer>


</template>

<script setup>
import {computed, inject, nextTick, onMounted, ref, watch} from "vue";
import {dayjs, ElMessage} from "element-plus";
import {showToast} from "vant";
import BScroll from "@better-scroll/core";
import MouseWheel from '@better-scroll/mouse-wheel'
import { Document,DishDot } from '@element-plus/icons-vue'

// 注册插件
BScroll.use(MouseWheel)

//======================变量============================

  // axios
  const axios = inject('axios');

  //当前三餐哪个可点
  const orderType = ref(null);

  //当前是否可点
  const isCurrentTimeCanOrder = ref(false);

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

  //动作面板：确认订单
  const showActionSheet = ref(false);

  //确认订单时显示的已选内容列表
  const selectedMeals = computed(() => {
    return sortedMealList.value
        .flatMap(category => category.meals)
        .filter(meal => meal.inCart)
        .map(meal => ({
          id: meal.id,
          type: meal.type,
          img: meal.img,
          name: meal.name,
          quantity: meal.quantity,
        }));
  });

  //选择的总数量
  const mealCount = computed(() =>
      selectedMeals.value.reduce((sum, item) => sum + (item.quantity || 0), 0)
  );

  //订单备注
  const request = ref('');

  //备注
  const requestVisible = ref(false);

  // 当日膳食（分早中晚）
  const mealList = ref([]);

  // const sortedMealList = ref([
  //   {
  //     type: 0,
  //     meals: [
  //       {
  //         mealId:0,
  //         name: '肉三鲜饺子',
  //         img: 'https://zytd-yyzx.oss-cn-beijing.aliyuncs.com/a72804451f0e9825.jpg',
  //         type: 0,
  //         state: 1,
  //         quantity: 0,
  //         inCart: false,
  //       },
  //       {
  //         mealId:0,
  //         name: '肉三鲜饺子',
  //         img: '',
  //         type: 0,
  //         state: 1,
  //         quantity: 0,
  //         inCart: false,
  //       },
  //       {
  //         mealId:0,
  //         name: '肉三鲜饺子',
  //         img: '',
  //         type: 0,
  //         state: 1,
  //         quantity: 0,
  //         inCart: false,
  //       },
  //
  //     ]
  //   },
  //   {
  //     type: 1,
  //     meals: [
  //       {
  //         mealId:0,
  //         name: '肉三鲜饺子',
  //         img: '',
  //         type: 1,
  //         state: 1,
  //         quantity: 0,
  //         inCart: false,
  //       },
  //       {
  //         mealId:0,
  //         name: '肉三鲜饺子',
  //         img: '',
  //         type: 1,
  //         state: 1,
  //         quantity: 0,
  //         inCart: false,
  //       },
  //       {
  //         mealId:0,
  //         name: '肉三鲜饺子',
  //         img: '',
  //         type: 1,
  //         state: 1,
  //         quantity: 0,
  //         inCart: false,
  //       },
  //       {
  //         mealId:0,
  //         name: '肉三鲜饺子',
  //         img: '',
  //         type: 1,
  //         state: 1,
  //         quantity: 0,
  //         inCart: false,
  //       },
  //       {
  //         mealId:0,
  //         name: '肉三鲜饺子',
  //         img: '',
  //         type: 1,
  //         state: 1,
  //         quantity: 0,
  //         inCart: false,
  //       },
  //       {
  //         mealId:0,
  //         name: '肉三鲜饺子',
  //         img: '',
  //         type: 1,
  //         state: 1,
  //         quantity: 0,
  //         inCart: false,
  //       },
  //       {
  //         mealId:0,
  //         name: '肉三鲜饺子',
  //         img: '',
  //         type: 1,
  //         state: 1,
  //         quantity: 0,
  //         inCart: false,
  //       },
  //     ]
  //   },
  //   {
  //     type: 5,
  //     meals: [
  //       {
  //         mealId:0,
  //         name: '肉三鲜饺子',
  //         img: '',
  //         type: 1,
  //         state: 1,
  //         quantity: 0,
  //         inCart: false,
  //       },
  //       {
  //         mealId:0,
  //         name: '肉三鲜饺子',
  //         img: '',
  //         type: 1,
  //         state: 1,
  //         quantity: 0,
  //         inCart: false,
  //       },
  //       {
  //         mealId:0,
  //         name: '肉三鲜饺子',
  //         img: '',
  //         type: 1,
  //         state: 1,
  //         quantity: 0,
  //         inCart: false,
  //       },
  //       {
  //         mealId:0,
  //         name: '肉三鲜饺子',
  //         img: '',
  //         type: 1,
  //         state: 1,
  //         quantity: 0,
  //         inCart: false,
  //       },
  //       {
  //         mealId:0,
  //         name: '肉三鲜饺子',
  //         img: '',
  //         type: 1,
  //         state: 1,
  //         quantity: 0,
  //         inCart: false,
  //       },
  //       {
  //         mealId:0,
  //         name: '肉三鲜饺子',
  //         img: '',
  //         type: 1,
  //         state: 1,
  //         quantity: 0,
  //         inCart: false,
  //       },
  //       {
  //         mealId:0,
  //         name: '肉三鲜饺子',
  //         img: '',
  //         type: 1,
  //         state: 1,
  //         quantity: 0,
  //         inCart: false,
  //       },
  //     ]
  //   },
  // ])

  const sortedMealList = ref([]);

  watch(mealList, () => {
    console.log("更新sortedMealList");
    sortedMealList.value = groupMealsByType(mealList.value);
    console.log(sortedMealList.value);
  }, {deep: true});

  //添加到购物车的菜品
  const addedMeals = ref([]);

  let scrollWrapper = ref(null);
  let scrollWrapperContent = ref(null);
  const typeToIndex = ref([]);
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
    console.log(scrollWrapper.value);
    try {
      bScroll = new BScroll(scrollWrapper.value, {
        scrollY: true,
        probeType: 3,
        mouseWheel: true
      })
      console.log('BScroll初始化成功')
      console.log(bScroll)
    }catch(error) {
      console.error('BScroll初始化失败:', error)
    }
    //console.log('容器高度:', scrollWrapper.value.offsetHeight);
    //console.log('内容高度:', scrollWrapper.value.scrollHeight);
    bScroll.on('scroll', (pos) => {
      const scrollY = Math.abs(pos.y)
      let currentIndex = 0
      // 使用value访问响应式数组
      for (let i = 0; i < sectionRefs.value.length; i++) {
        const el = sectionRefs.value[i]
        if (!el) continue;

        if (el.offsetTop <= scrollY ) {
          //currentIndex = i;
          // 找到对应的左侧菜单index
          currentIndex = sortedMealList.value[i].type;
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
  if(sortedMealList.value.length !== 0){
    activeMealType.value = sortedMealList?.value[0].type;
  }else{
    activeMealType.value = 0;
  }

  nextTick(() => {
    initBScroll()
  })
}, { deep: true })

onMounted(() => {
  setTimeout(initBScroll, 100)
  //initBScroll();
})

const setSectionRef = (el, index, type) => {
  if(el){
    sectionRefs.value[index] = el;
    typeToIndex.value[type] = index;
  }
}

//****************初始化部分：获取当天有的菜品****************
  //获取，然后按照菜品类型来分类
  const init = async()=> {
    await checkOrder();
    getMealList();
  }

  //看早中晚都点没点
  const checkOrder = async () => {
    let customerId = sessionStorage.getItem('userId')
    let date = dayjs().add(1, 'day').format('YYYY-MM-DD');
    let url = `OrderController/status?customerId=${customerId}&date=${date}`;
    try{
      let response = await axios.get(url);
      let rb = response.data;
      if(rb.status === 200){
        orderType.value = rb.data;
        console.log("获取到的order数据：");
        console.log(orderType.value);
        let type = timeTypes.value[activeTimeType.value].name;
        console.log(orderType.value[type]);
      }else{
        showToast(rb.msg);
      }
    }catch (error){
      console.log(error);
    }
  }

  const getMealList = () => {
    //先获取date和type
    let date = dayjs().add(1, 'day').format('YYYY-MM-DD');
    let type = timeTypes.value[activeTimeType.value].name;
    console.log("获取菜品列表！当前日期为："+date+"，当前获取的是："+type);

    if(orderType.value[type] !== false){
      //说明这单点过了
      isCurrentTimeCanOrder.value = false;
      showToast('该时段已点！');
      //mealList.value = [];
    }else{
      isCurrentTimeCanOrder.value = true;
    }

    let url = `DietController/listDietByType?date=${date}&type=${activeTimeType.value}`;
    console.log("发送请求："+url);
    axios.get(url).then(response => {
      let rb = response.data;
      if(rb.status === 200){
        console.log(mealList.value);
        mealList.value = rb.data.map(item => {
          return {
            ...item,
           mealType: item.mealType - 1
          }
        })
        console.log(mealList.value);
        console.log(sortedMealList.value);
      }else{
        showToast(rb.msg);
      }
    }).catch(error => {
      console.log(error);
    })
  }

  //分类函数
  const groupMealsByType = (meals) => {
    if(meals.length === 0){
      return [];
    }
    const grouped = meals.reduce((acc, meal) => {
      const type = meal.mealType;
      if (!acc[type]) acc[type] = [];

      acc[type].push({
        mealId: meal.mealId,
        name: meal.mealName,
        img: meal.mealImg,
        type: meal.mealType,  // 修正：使用 mealType 而不是 type
        state: meal.state,
        quantity: meal.quantity || 0,      // 保留原有值
        inCart: meal.inCart || false       // 保留原有值
      });

      return acc;
    }, {});

    return Object.entries(grouped).map(([type, meals]) => ({
      type: Number(type),
      meals
    }));
  };

  init();

//****************上面tab：早中晚变化 左边sidebar：菜品类型变化 悬浮气泡bubble：上下左右移动****************

  // 早中晚变化
  const onTimeTypeChange = () => {
    console.log("时间类型变化，当前时间类型为：" + timeTypes.value[activeTimeType.value].name);
    getMealList();
    // 还要重置之前点了什么
    addedMeals.value = [];
    request.value = '';
    //重置滚动
    if(bScroll){
      bScroll.scrollTo(0, 0, 500);
    }
  }

  // 菜品类型变化
  const onMealTypeChange = () => {
    console.log("菜品类型变化，当前菜品类型为：" + mealTypes.value[activeMealType.value].name);
    //此时要根据菜品类型来滚动右边
    //找到真正的sectionRef的index
    const sectionIndex = typeToIndex.value[activeMealType.value];

    console.log("当前的sectionIndex是："+sectionIndex);
    if(!BScroll || !sectionRefs.value[sectionIndex]){
      return;
    }

    bScroll.scrollToElement(
        sectionRefs.value[sectionIndex],
        800,
        -50,
        0
    );
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
    let date = dayjs().add(1, 'day').format('YYYY-MM-DD');
    let url = `DietController/searchFoodByName?name=${searchedMealName.value}&type=${activeTimeType.value}&date=${date}`;
    axios.get(url).then(response => {
      let rb = response.data;
      if(rb.status === 200){
        mealList.value = rb.data.map(item => {
          return {
            ...item,
            mealType: item.mealType - 1
          }
        })
      }else{
        showToast(rb.msg);
      }
    }).catch(error => {
      console.log(error);
    })
  }

  // 菜品搜索取消
  const onCancelSearch = () => {
    getMealList();
  }

//****************添加购物车****************
  const addToCart = (meal) => {
    meal.inCart = true;
    meal.quantity = 1;
    console.log(`将${meal.name}加入到购物车！`);

  };

  //步进器变化
  const handleQuantityChange = (meal, newQuantity) => {
    if(newQuantity === 0){
      meal.inCart = false;
      meal.quantity = 0;
    }
    console.log(newQuantity);
  }


//****************提交部分****************
  // 选好了：弹出动作面板
  const onClickButton = () => {
      showActionSheet.value = true;
  }

  //显示备注
  const showRequest = () => {
    requestVisible.value = requestVisible.value === false;
  }

  //提交订单
  const submitOrder = () => {
    let customerId = sessionStorage.getItem('userId');
    let orderDetails = sortedMealList.value
        .flatMap(category => category.meals)
        .filter(meal => meal.inCart)
        .map(meal => ({
          mealId: meal.mealId,
          count: meal.quantity,
        }));
    console.log(orderDetails);
    let orderRequest = {
      customerId: customerId,
      mealType: activeTimeType.value,
      date: dayjs().add(1, 'day').format('YYYY-MM-DD'),
      request: request.value,
      orderDetails: orderDetails,
    }
    console.log(orderRequest);
    let url = `OrderController/addOrder`;
    axios.post(url, orderRequest).then(response => {
      let rb = response.data;
      if(rb.status === 200){
        showToast('添加订单成功！');
        init();
      }else{
        showToast(rb.msg);
      }
    }).catch(error => {
      console.log(error);
    })
  }

//   ------------------------------------智能推荐------------------------------------------------
const drawerVisible = ref(false)
const loading = ref(false)

// const customerId = sessionStorage.getItem('userId')
const customerId = ref(25)
const selectedDate = dayjs().add(1, 'day').format('YYYY-MM-DD')
const selectedMealType = activeTimeType.value ?? 1

const recommendation = ref({
  recommendedDishes: [],
  reasoning: '',
})

const formatReasoning = (text) => {
  return text.replace(/^推荐理由[:：]\s*/, '')
}

const openDrawer = async () => {
  if (!customerId.value || !selectedDate || selectedMealType === null) {
    ElMessage.warning('请填写完整信息')
    return
  }

  drawerVisible.value = true
  loading.value = true
  try {
    const res = await axios.get('/RecommendController/dishes', {
      params: {
        customerId: customerId.value,
        date: selectedDate,
        mealType: selectedMealType,
      },
    })

    if (res.data.status === 200) {
      recommendation.value = res.data.data
    } else {
      recommendation.value = { recommendedDishes: [], reasoning: '' }
      ElMessage.warning(res.data.msg || '推荐失败')
    }
    // recommendation.value ={
    //   "recommendedDishes": [
    //     "番茄炒蛋",
    //     "大酱汤"
    //   ],
    //   "reasoning": "推荐理由：结合老人饮食偏好（口味清淡、易消化）和当前餐型（午餐需营养均衡），番茄炒蛋口味清淡、酸甜适中，鸡蛋和番茄均为易消化食材，提供优质蛋白质和维生素，适合午餐补充能量；大酱汤作为汤类菜品，易消化且能促进食欲，但需选择清淡版本以避免过咸，搭配番茄炒蛋可确保午餐营养均衡、不油腻。",
    //   "promptUsed": "{\n    \"recommendedDishes\": [\"番茄炒蛋\", \"大酱汤\"],\n    \"reasoning\": \"推荐理由：结合老人饮食偏好（口味清淡、易消化）和当前餐型（午餐需营养均衡），番茄炒蛋口味清淡、酸甜适中，鸡蛋和番茄均为易消化食材，提供优质蛋白质和维生素，适合午餐补充能量；大酱汤作为汤类菜品，易消化且能促进食欲，但需选择清淡版本以避免过咸，搭配番茄炒蛋可确保午餐营养均衡、不油腻。\"\n}"
    // }
  } catch (e) {
    ElMessage.error('系统错误：' + e.message)
  } finally {
    loading.value = false
  }
}
</script>

<style>
.page{
  height: calc(100vh - 50px - 46px);
  display: flex;
  flex-direction: column;
}
.top-tab{
  height: 698px;
  position: relative;
}
.top-tab .tab-bar{
  position: fixed;
  top: 46px;
  width: 390px;
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
  height: 678px;
  display: flex;
  overflow-y: auto;
}
.meal-sidebar{
  flex-shrink: 0;
  position: fixed;
  width: 60px;
  top: 156px;
  z-index: 100;
}
.meal-card{
  flex: 1;
  padding: 0 16px 0 16px;
  overflow-y: auto;
  height: 560px;
  margin-top: 106px;
}
.meal-card .card{
  margin-left: 70px;
  width: 290px;
  background-color: white;
  border-radius: 12px;
}
:deep(.card .van-card__header .van-card__content){
  height: 30px;
}

.search-box{
  position: fixed;
  top: 96px;
}

.search{
  position: sticky;
  width: 390px;
  z-index: 100;
}

.action-sheet{
  position: fixed;
  bottom: 50px;
  height: 200px;
  z-index: 120;
}

.action-sheet.action-sheet-content{
  height: 200px;
}

.order-header{
  font-size: 18px;
  margin-left: 20px;
}

.order-list{
  margin-left: 20px;
}

.order-button{
  margin-left: 200px;
  width: 100px;
  height: 50px;
}

.order-submit{
  margin-left: 270px;
  width: 100px;
  height: 50px;
}
.recommend-drawer {
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
  overflow: hidden;

}

.drawer-content {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.drawer-header {
  flex: 0 0 15%;
  display: flex;
  box-sizing: border-box;
  padding-left: 16px;
  padding-right: 16px;
  gap: 16px;
  background-color: #A1D2F7;
  text-align: center;
  align-items: center;
  border-radius: 16px;
}

.drawer-title {
  font-size: 18px;
  font-weight: bold;
  color: #333;
}

.drawer-body {
  flex: 1;
  padding: 16px;
  background-color: white;
}

.dish-list {
  font-size: 15px;
}

.dish-reason {
  font-size: 14px;
  color: #666;
}

</style>