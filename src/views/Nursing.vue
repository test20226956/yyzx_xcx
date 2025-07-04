<template>
  <div class="framework">
    <van-search
        v-model="searchValue"
        placeholder="请输入内容"
        @search="searchPro"
    />
    <van-list
        v-model:finished="finished"
        finished-text="—— 我是有底线的 ——"
    >
      <van-cell
          v-for="item in proList"
          :key="item.id || item.userCode + item.name"
          :title="item.name"
          :label="item.description"
          is-link
          @click="goToRecord(item)"
      >
        <template #value>
          <van-tag
              plain
              :type="item.state === '数量正常' ? 'success' : 'primary'"
          >
            {{ item.state }}
          </van-tag>
          <van-tag
              plain
              :type="item.timeStatus === '数量正常' ? 'success' : 'primary'"
          >
            {{ item.timeStatus }}
          </van-tag>
        </template>
      </van-cell>
    </van-list>
  </div>
</template>

<script setup>
import { ref, reactive, computed, inject } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElLoading } from 'element-plus'
import qs from 'qs';

const router = useRouter();
const axios = inject('axios');

const finished = ref(false)
const proList = ref([
  {
    id: 1,
    name: '项目1',
    description: '项目描述1',
    state: '数量正常',
    timeStatus: '数量正常'
  },
  {
    id: 2,
    name: '项目2',
    description: '项目描述2',
    state: '数量正常',
    timeStatus: '数量正常'
  },
  {
    id: 3,
    name: '项目3',
    description: '项目描述3',
  }
]);
const searchValue = ref('');

const init = () => {
  let custId = 1 ;
  let url = 'UerController//clientShowCustPro';
  axios.get(url, {
    params: {
      customerId: custId
    }
  }).then(res => {
    let rb = res.data
    if (rb.code == 200) {
      let data = rb.data
      if(data.state == 500){
        proList.value = data.data
        finished.value = true
      }else{
        ElMessage.error(data.msg)
      }
    }
  })
};
init();

const searchPro = () => {
  let custId = 1 ;
  let url = 'UerController/clientSearchCustPro';
  axios.get(url, {
    params: {
      customerId: custId,
      name: searchValue.value
    }
  }).then(res => {
    let rb = res.data
    if (rb.code == 200) {
      let data = rb.data
      if(data.state == 500){
        proList.value = data.data
        finished.value = true
      }else {
        ElMessage.error(data.msg)
      }
    }
  })
}

const goToRecord = (item) => {
  router.push({
    path: '/Framework/Nursing/Record',
    query: {
      item: encodeURIComponent(JSON.stringify(item))
    }
  })
}
</script>

<style scoped>
.framework {
  padding: 10px;
  background: #f5f7fa;
  height: 748px;
}

.van-cell {
  height: 100px;
  box-sizing: border-box;
  margin-bottom: 10px;
  padding: 10px !important; /* 强制覆盖默认 padding */
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 2px rgba(0, 0, 0, 0.05);
  width: calc(100% - 20px); /* 减去 padding 左右 10px */
  margin-left: 10px;
  margin-right: 10px;
}

.van-search{
  padding: 10px;
  width: calc(100% - 20px); /* 减去 padding 左右 10px */
  margin-left: 10px;
  margin-right: 10px;
  margin-top: 10px;
  margin-bottom: 15px;
}
</style>