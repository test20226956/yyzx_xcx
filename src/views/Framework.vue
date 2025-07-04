<template>
	<!-- 这是框架界面 -->
  <div class="framework">
    <!-- 顶部导航栏 -->
    <div class="navigator">
      <van-nav-bar :title="pageTitle" fixed style="height: 46px">
        <!-- 中间标题插槽 -->
        <template #title>
          <span style="font-weight: bold;">{{pageTitle}}</span>
        </template>

        <!-- 左侧插槽：放图标和客户名称 -->
        <template #left>
          <van-image
              width="60px"
              height="30px"
              fit="cover"
              :src="logo"
          ></van-image>
        </template>

        <!-- 右侧插槽（可放多个按钮） -->
        <template #right>
          <!--  AI聊天 -->
          <van-icon name="comment-o" size="20" style="margin-right: 12px"/>
          <!-- 呼叫 -->
          <van-icon name="service-o" size="20" />
        </template>
      </van-nav-bar>
    </div>

    <div style="height: 3rem; background-color: #f3f4f6;"></div>

    <!-- router -->
    <div class="router-view-wrapper">
      <router-view />
    </div>

    <div style="height: 3rem; background-color: #f3f4f6;"></div>

    <!-- 下方菜单 -->
    <div class="tab-bar">
      <van-tabbar route v-model="active" style="height: 50px">
        <van-tabbar-item icon="home-o" name="Home" replace to="/Framework/Home">首页</van-tabbar-item>
        <van-tabbar-item icon="shopping-cart-o" name="Order" replace to="/Framework/Order">点餐</van-tabbar-item>
        <van-tabbar-item icon="records-o" name="Nursing" replace to="/Framework/Nursing">护理信息</van-tabbar-item>
        <van-tabbar-item icon="contact-o" name="Mine" replace to="/Framework/Mine">个人信息</van-tabbar-item>
      </van-tabbar>
    </div>
  </div>

</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import logo from '@/assets/Logo.png'

const active = ref(0)
const route = useRoute()

// 动态标题映射
const titleMap = {
  Home: '首页',
  Order: '点餐',
  Nursing: '护理信息',
  Mine: '个人信息'
}

// 根据当前路由 name 显示标题
const pageTitle = computed(() => {
  return titleMap[route.name] || '标题'
})
</script>

<style>
  .framework {
    width: 390px;
    height: 844px;
    box-sizing: border-box;
  }

	.router-view-wrapper{
		background-color: #f3f4f6;
    /*height: calc(100vh - 50px - 46px);*/
    overflow-y: auto;
    /*margin-top: 46px;*/
    height: 748px;
	}
</style>