<template>
  <div class="framework login-page">
    <div class="login-card">
      <h2 class="title">疗养中心登录</h2>
      <el-form :model="formData" :rules="formRules" ref="formRef" class="login-form">
        <el-form-item prop="username">
          <el-input
              v-model="formData.tel"
              placeholder="请输入电话号码"
          />
        </el-form-item>
        <el-form-item prop="password">
          <el-input
              v-model="formData.password"
              type="password"
              placeholder="请输入密码"
              autocomplete="off"
              show-password
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="login-btn" @click="login">
            登录
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import {ref, reactive, inject} from 'vue'
import {useRouter} from 'vue-router'
import {ElMessage, ElLoading} from 'element-plus'
import qs from 'qs'

const router = useRouter()
const axios = inject('axios')

// 保留 formData 为 ref
const formData = ref({
  tel: '',
  password: ''
})

// 校验规则 reactive
const formRules = reactive({
  tel: [
    {required: true, message: '请输入联系电话', trigger: 'blur'},
    {
      validator: (rule, value, callback) => {
        if (!value) {
          callback(new Error('请输入联系电话'));
        } else if (value.length != 11) {
          callback(new Error('电话号码长度为11位'));
        } else {
          callback();
        }
      }
    }
  ],
  password: [
    {required: true, message: '请输入密码', trigger: 'blur'},
    {min: 6, max: 16, message: '密码长度需为6-16位', trigger: 'blur'}
  ]
})

// 拿到 el-form 实例
const formRef = ref(null)

function login() {
  // 调用 validate 进行表单校验
  formRef.value.validate(valid => {
    if (!valid) {
      ElMessage.warning('请检查输入内容')
      return
    }

    // 校验通过后再发送请求
    const url = 'CustomerController/login'
    const data = {
      tel: formData.value.tel,
      password: formData.value.password
    }

    // 可选：显示 loading
    const loading = ElLoading.service({text: '登录中...'})

    axios
        .post(url, qs.stringify(data))
        .then(response => {
          loading.close()
          const rb = response.data
          if (rb.status === 200) {
            const responseUser = rb.data
            // 保存必要的 session
            //没有type！！！
            sessionStorage.setItem('type', responseUser.type)
            sessionStorage.setItem('userName', responseUser.name)
            sessionStorage.setItem('userId', responseUser.customerId)
            sessionStorage.setItem('token', rb.jwt)
            ElMessage.success('登录成功')
            router.push('/Framework/Home')
          } else {
            ElMessage.error(rb.msg || '登录失败')
          }
        })
        .catch(err => {
          loading.close()
          console.error(err)
          ElMessage.error('网络或服务器错误')
        })
  })
}
</script>

<style scoped>
.framework.login-page {
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f7fa;
}

.login-card {
  width: 320px;
  padding: 32px 24px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.title {
  margin-bottom: 24px;
  font-size: 20px;
  color: #303133;
}

.login-form {
  width: 100%;
}

.el-form-item {
  margin-bottom: 16px;
}

.login-btn {
  width: 100%;
}
</style>