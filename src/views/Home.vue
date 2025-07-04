<template>
  <!-- 滑动 -->
  <van-swipe
      class="my-swipe"
      indicator-color="white"
      :width="358"
  >
    <van-swipe-item>1</van-swipe-item>
    <van-swipe-item>2</van-swipe-item>
    <van-swipe-item>3</van-swipe-item>
    <van-swipe-item>4</van-swipe-item>
  </van-swipe>

  <!-- 下面按钮组 -->
  <div class="button-group">
    <van-row :gutter="20" justify="center">
      <van-col :span="6">
        <van-button plain hairline type="primary" class="icon-button">
          <div class="button-content">
            <el-icon class="button-icon" size="24"><Food /></el-icon>
            <span class="button-text">点餐</span>
          </div>
        </van-button>
      </van-col>
      <van-col :span="6">
        <van-button plain hairline type="primary" class="icon-button">
          <div class="button-content">
            <el-icon class="button-icon" size="24"><Phone /></el-icon>
            <span class="button-text">呼叫</span>
          </div>
        </van-button>
      </van-col>
      <van-col :span="6">
        <van-button plain hairline type="primary" class="icon-button">
          <div class="button-content">
            <el-icon class="button-icon" size="24"><Tickets /></el-icon>
            <span class="button-text">护理</span>
          </div>
        </van-button>
      </van-col>
      <van-col :span="6">
        <van-button plain hairline type="primary" class="icon-button">
          <div class="button-content">
            <el-icon class="button-icon" size="24"><Food /></el-icon>
            <span class="button-text">点餐</span>
          </div>
        </van-button>
      </van-col>
    </van-row>
  </div>

  <!-- 新闻资讯之类的 -->
  <div class="news">
    <van-card
        v-for="(item, index) in activities"
        :key="index"
        :title="item.title"
        class="card"
    >
      <template #desc>
        <div class="card-description">
          {{item.description}}
        </div>
      </template>
      <template #num>
        <div class="card-time">
          {{item.location}}
        </div>
      </template>
      <template #price>
        <div class="card-location">
          {{item.time}}
        </div>
      </template>
    </van-card>
  </div>
</template>

<script setup>
  import { ref } from 'vue'
  import { Food, Phone, Tickets } from '@element-plus/icons-vue'

  const activities = ref([
        {
          title: "健康养生讲座",
          description: "由专业医生主讲，分享夏季养生知识与高血压、糖尿病日常管理方法，提升健康意识。",
          time: "2025-07-10 14:00",
          location: "多功能厅A"
        },
        {
          title: "书画赏析与创作",
          description: "邀请书法老师现场教学，居民可自由创作、展示书画作品，提升艺术修养与成就感。",
          time: "2025-07-12 09:30",
          location: "艺术教室"
        },
        {
          title: "手工制作时光",
          description: "制作香囊、编织布艺、折纸等趣味手工，锻炼动手能力，享受安静的手作时光。",
          time: "2025-07-15 15:00",
          location: "活动室B"
        },
        {
          title: "太极养身晨练",
          description: "每天早晨7:30在中心花园举行太极锻炼，强身健体，调节心气，增强身体协调性。",
          time: "每天 07:30",
          location: "中心花园"
        },
        {
          title: "庆生活动会",
          description: "每月为当月过生日的长者举办集体生日会，蛋糕、礼物和表演一个不少，温馨满满。",
          time: "2025-07-20 10:00",
          location: "宴会厅"
        },
        {
          title: "怀旧电影放映",
          description: "每周五晚播放经典老电影，配有热茶点心，唤醒记忆中的美好时光。",
          time: "每周五 19:00",
          location: "多媒体厅"
        },
        {
          title: "智能手机课堂",
          description: "教授基础手机操作、视频通话、使用健康码等实用技巧，让长者与时代接轨。",
          time: "2025-07-18 14:00",
          location: "计算机教室"
        },
        {
          title: "歌咏与乐器小组",
          description: "组建歌唱与乐器兴趣小组，提供排练空间与乐器，展现风采，陶冶情操。",
          time: "每周三 16:00",
          location: "音乐室"
        }
      ])
</script>

<style>

.my-swipe {
  margin: 16px;
  box-sizing: border-box;
  border-radius: 8px;
  overflow: hidden;
}

.my-swipe .van-swipe-item {
  color: #fff;
  font-size: 20px;
  line-height: 150px;
  text-align: center;
  background-color: #39a9ed;
}

.button-group {
	background-color: white;
  border-radius: 6px;
	padding: 12px 12px;
  margin: 16px;
}

.icon-button {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 8px 0;
  height: 65px !important; /* 自行调整高度 */
  width: 100%;
}

.button-content {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.button-icon {
  margin-bottom: 5px;
}

.button-text {
  font-size: 18px;
}

.news {
  background-color: white;
  border-radius: 6px;
  padding: 12px;
  margin: 16px;
}

.news .card {
  --van-card-font-size: 20px;
  --van-card-title-line-height: 24px;
}

.news .card .card-description {
  margin-top: 8px;
  font-size: 16px;
}

.news .card .card-time{
  margin-top: 5px;
  font-size: 14px;
}

.news .card .card-location{
  margin-top: 5px;
  font-size: 14px;
}
</style>
