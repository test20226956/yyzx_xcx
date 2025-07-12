<script setup>
import { ref, reactive, computed, inject } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElLoading } from 'element-plus'

const router = useRouter();
const axios = inject('axios');
const route = useRoute();

const titleItem = JSON.parse(decodeURIComponent(route.query.item))
const recordList = ref([])
const finished = ref(false)

const init = () => {
  let url = 'NursingServiceController/clientShowCustRec';
  const data = {
    nursingServiceId: titleItem.nursingServiceId
  };
  axios.get(url,{ params: data }).then(res => {
    let rb = res.data
    if (rb.status == 200) {
      recordList.value = rb.data
      console.log(recordList.value)
      finished.value = true
    }else{
      ElMessage.error(rb.msg)
    }
  })
};
init();
</script>

<template>
  <div class="frame">
<!-- 固定顶部的 cell -->
  <div class="fixed-header">
    <van-cell :key="titleItem.name" :title="titleItem.name" class="cell-header">
      <template #label>
        <div class="label-block">
          <div class="desc">{{ titleItem.description }}</div>
          <div class="line">
            <span>剩余次数：{{ titleItem.amount }}</span>
            <van-tag
                plain
                :type="titleItem.state === '数量正常' ? 'success' : 'danger'"
            >
              {{ titleItem.state }}
            </van-tag>
          </div>
          <div class="line">
            <span>到期时间：{{ titleItem.time }}</span>
            <van-tag
                plain
                :type="titleItem.timeStatus === '未到期' ? 'success' : 'danger'"
            >
              {{ titleItem.timeStatus }}
            </van-tag>
          </div>
        </div>
      </template>
    </van-cell>
  </div>

  <!-- 可滚动列表 -->
  <div class="scrollable-list">
    <van-list v-model:finished="finished" finished-text="—— 我是有底线的 ——">
      <van-cell
          v-for="item in recordList"
          :key="item.name"
          class="cell-record"
          :title="item.name"
          :value="item.time"
      >
        <template #label>
          护理人: {{ item.userName }}
        </template>
      </van-cell>
    </van-list>
  </div>
  </div>

</template>

<style scoped>
.fixed-header {
  position: sticky;
  top: 0;
  z-index: 10;
  background-color: #f5f7fa;
}

.cell-header {
  height: 120px;
  padding: 10px !important;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 2px rgba(0, 0, 0, 0.05);
  margin-left: 10px;
  margin-top: 15px;
  margin-right: 10px;
  width: 360px;
}

.scrollable-list {
  padding: 0 10px;
  margin-top: 10px;
}

.cell-record {
  height: 80px;
  box-sizing: border-box;
  margin-bottom: 10px;
  padding: 10px !important;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 2px rgba(0, 0, 0, 0.05);
  width: 360px;
}

/* 通用样式保留 */
.label-block {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.desc {
  margin-bottom: 4px;
  color: #333;
}

.line {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.frame{
  width: 375px;
  margin-left: 5px;
  margin-top: 10px;
}
</style>