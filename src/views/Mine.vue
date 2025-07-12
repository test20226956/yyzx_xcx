<template>
  <div class="profile-page">
    <!-- 1. 头部卡片：自定义头像插槽、姓名、查看历史订单 -->
    <van-card class="profile-card">
      <template #thumb>
        <!-- 点击头像触发文件选择 -->
        <img
            :src="avatarPreview"
            alt="头像"
            class="avatar"
            @click="onAvatarClick"
        />
        <input
            ref="fileInput"
            type="file"
            accept="image/*"
            style="display: none"
            @change="onFileChange"
        />
      </template>
      <template #title>
        <div class="user-name">{{ user.name }}</div>
      </template>
      <template #footer>
        <van-button
            size="small"
            type="primary"
            plain
            block
            @click="viewOrders"
        >
          查看历史订单
        </van-button>
      </template>
    </van-card>

    <!-- 2. 个人信息栏 -->
    <van-cell-group inset>
      <van-field label="姓名" v-model="user.name" disabled />
      <van-field
          label="联系方式"
          v-model="user.tel"
          placeholder="请输入联系方式"
          type="tel"
          required
      />
      <van-field label="护工名称" v-model="user.userName" disabled />
      <van-field label="护理等级" v-model="user.nursingLevel" disabled />
      <van-field label="居住信息" v-model="user.address" disabled />
      <van-field label="入住时间" v-model="user.checkInTime" disabled />
      <van-field label="合同到期" v-model="user.endTime" disabled />
    </van-cell-group>

    <!-- 提交修改按钮 -->
    <div class="button-wrap">
      <van-button type="primary" block @click="submitUpdate">
        提交修改
      </van-button>
    </div>
  </div>
</template>

<script setup>
import {reactive, computed, ref, inject} from 'vue'
import { useRouter } from 'vue-router'
import {
  Card as VanCard,
  Button as VanButton,
  Field as VanField,
  CellGroup as VanCellGroup, showToast
} from 'vant'

// 示例用户数据
const user = ref({})

// 头像如果为空则使用默认图
const avatarSrc = computed(() => {
  return user.avatar || require('@/assets/default-avatar.png')
})

const router = useRouter()
const axios = inject('axios')

// 用于预览的临时 URL
const avatarPreview = ref(avatarSrc.value)

const init = () => {
  // 获取用户信息
  const url = `CustomerController/clientShowCust`
  const custId = 25;
  const data = {
    customerId: custId
  }
  axios.get(url,{ params: data }).then(res => {
    let rb = res.data
    if (rb.status == 200) {
      user.value = rb.data
      user.value.avatar = rb.data.image
    }else{
      showToast(rb.msg)
    }
  })
}
init()

// 点击头像，触发文件选择
const fileInput = ref(null)
function onAvatarClick() {
  fileInput.value?.click()
}

async function onFileChange(event) {
  const customerId = 25;
  const file = event.target.files?.[0]
  if (!file) return

  // 1. 生成预览 URL
  avatarPreview.value = URL.createObjectURL(file)

  // 2. 构建 FormData
  const form = new FormData()
  form.append('file', file)

  try {
    // 3. 直接上传 file 类型
    const { data } = await axios.post('/FileController/upload', form, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    // 假设后端返回了新头像URL
    let newAvatarUrl = data.data
    console.log(newAvatarUrl)
    user.value.avatar = newAvatarUrl
    let url = `CustomerController/editCustImage?customerId=${customerId}&image=${newAvatarUrl}`
    axios.post(url).then(res => {
      let rb = res.data
      if(rb.status === 200){
        showToast("修改成功");
      }else{
        showToast(rb.msg);
      }
    }).catch(err => {
      console.log(err)
    })
  } catch (err) {
    console.error(err)
    // 上传失败时可回退预览
    avatarPreview.value = avatarSrc.value
  }
}

function viewOrders() {
  router.push({path: '/Framework/OrderHistory'})
}

function submitUpdate() {
  const customerId = 25;
  const url = `CustomerController/editCustTel?customerId=${customerId}&tel=${user.value.tel}`
  axios.post(url).then(res => {
    let rb = res.data;
    if(rb.status === 200){
      showToast("修改成功");
      init()
    }else{
      showToast(rb.msg);
    }
  }).catch(err => {
    console.log(err)
  })
}
</script>

<style scoped>
.profile-page {
  padding: 16px;
  background: #f5f7fa;
  box-sizing: border-box;
}

/* 卡片可见范围 */
.profile-card {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 16px;
  margin-left: 15px;
  margin-right: 15px;
}

/* 预览图片也用同样类名 */
.avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  object-fit: cover;
  cursor: pointer;
}

/* 姓名样式微调 */
.user-name {
  font-size: 22px;
  font-weight: 500;
  line-height: 60px; /* 与头像同高，垂直居中 */
}

/* 提交按钮容器 */
.button-wrap {
  margin: 24px 16px 0;
}
</style>
