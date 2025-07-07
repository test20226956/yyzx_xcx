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
          :key="item.name"
          :title="item.name"
          :label="item.description"
          is-link
          @click="goToRecord(item)"
      >
        <template #value>
          <van-tag
              plain
              :type="item.state === '数量正常' ? 'success' : 'danger' "
          >
            {{ item.state }}
          </van-tag>
          <van-tag
              plain
              :type="item.timeStatus === '未到期' ? 'success' : 'danger'"
          >
            {{ item.timeStatus }}
          </van-tag>
        </template>
      </van-cell>
    </van-list>
    <router-view />
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
const proList = ref([]);
const searchValue = ref('');

const init = () => {
  let custId = 25 ;
  let url = 'UserController/clientShowCustPro';
  const data = {
    customerId: custId
  };
  axios.get(url,{ params: data }).then(res => {
    let rb = res.data
    if (rb.status == 200) {
      proList.value = rb.data
      console.log(proList.value)
      finished.value = true
    }else{
      ElMessage.error(rb.msg)
    }
  })
};
init();

const searchPro = () => {
  let custId = 25 ;
  let url = 'UserController/clientSearchCustPro';
  axios.get(url, {
    params: {
      customerId: custId,
      name: searchValue.value
    }
  }).then(res => {
    let rb = res.data
    if (rb.status == 200) {
      proList.value = rb.data
      finished.value = true
    }else {
      ElMessage.error(rb.msg)
    }
  })
}

const goToRecord = (item) => {
  router.push({
    path: '/Framework/Record',
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