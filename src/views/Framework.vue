<template>
	<!-- 这是框架界面 -->
	<!-- 顶部导航栏 -->
	<!-- 首页导航栏 -->
	  <!-- 首页导航栏 -->
	  <van-nav-bar v-if="isHome" fixed placeholder>
	    <!-- 中间标题插槽 -->
<!-- 	    <template #title>
	      <span style="font-weight: bold;">首页</span>
	    </template> -->
	
	    <!-- 左侧插槽：放图标和客户名称 -->
	    <template #left>
	      <van-image
			width="50px"
			height="30px"
			fit="cover"
			:src="logo"
		  ></van-image>
		  客户名称
	    </template>
	
	    <!-- 右侧插槽（可放多个按钮） -->
	    <template #right>
	      <van-icon name="search" size="20" style="margin-right: 12px;" @click="onSearch" />
	      <van-icon name="setting-o" size="20" @click="onSettings" />
	    </template>
	  </van-nav-bar>
	<!-- 其他导航栏 -->
	<van-nav-bar v-else :title="pageTitle" />
	<!-- router -->
	<div class="router">
		<router-view></router-view>
	</div>
	<!-- 下方菜单 -->
	<van-tabbar route v-model="active">
	  <van-tabbar-item icon="home-o" name="Home" replace to="/Framework/Home">首页</van-tabbar-item>
	  <van-tabbar-item icon="shopping-cart-o" name="Order" replace to="/Framework/Order">点餐</van-tabbar-item>
	  <van-tabbar-item icon="records-o" name="Nursing" replace to="/Framework/Nursing">护理信息</van-tabbar-item>
	  <van-tabbar-item icon="contact-o" name="Mine" replace to="/Framework/Mine">个人信息</van-tabbar-item>
	</van-tabbar>

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

const isHome = computed(() => route.name === 'Home')

// 根据当前路由 name 显示标题
const pageTitle = computed(() => {
  return titleMap[route.name] || '标题'
})
</script>

<style>
	.router{
		background-color: #f3f4f6;
	}
</style>