<template>
  <div class="qa-page">
    <!-- 答案内容区域（支持滚动、markdown） -->
    <div class="center-content">
      <div class="answer-box" v-html="answerHtml || defaultMessage"></div>
    </div>

    <!-- 输入框固定在底部 -->
    <div class="question-bar">
      <van-field
          v-model.trim="question"
          placeholder="请输入你的问题"
          class="question-input"
          @keyup.enter="askQuestion"
      >
        <template #button>
          <van-button icon="arrow-up" type="primary" class="send-btn" @click="askQuestion" />
        </template>
      </van-field>
      <div class="tip">内容由AI大模型生成，如有问题请反馈</div>
    </div>
  </div>
</template>


<<script setup>
import { ref, watch } from 'vue'
import { marked } from 'marked' // 引入 markdown 解析器
import { showToast } from "vant"

const question = ref('')
const answer = ref('')
const answerHtml = ref('') // 存储 markdown 渲染后的 html
let eventSource = null

watch(question, () => {
  if (eventSource) {
    eventSource.close()
    eventSource = null
  }
})

const askQuestion = () => {
  answer.value = ''
  answerHtml.value = ''
  let currentLine = ''

  eventSource = new EventSource(
      `http://127.0.0.1:9000/ChatController/chatStream?msg=${encodeURIComponent(question.value)}`
  )

  eventSource.onmessage = (event) => {
    const data = event.data
    for (let char of data) {
      currentLine += char
    }
    if (currentLine.length > 0) {
      answer.value += currentLine
      answerHtml.value = marked.parse(answer.value) // 实时解析 markdown
      currentLine = ''
    }
  }

  eventSource.onerror = (error) => {
    console.error('EventSource failed:', error)
    eventSource.close()
  }
}
</script>


<style scoped>
.qa-page {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #f5f7fa;
  padding-bottom: 120px; /* 给底部预留空间 */
  overflow-y: auto;
}

.center-content {
  flex: 1;
  display: flex;
  justify-content: center;
  padding: 20px;
  box-sizing: border-box;
  overflow-y: auto;
  margin-top: 100px;
}

.answer-box {
  background-color: #fff;
  border: 1px solid #ccc;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  border-radius: 8px;
  padding: 16px;
  width: 90%;
  font-size: 15px;
  line-height: 1.6;
  text-align: left;
  max-height: 60vh;
  overflow-y: auto;
}

/* Markdown 中基本样式支持 */
.answer-box h1, .answer-box h2 {
  margin: 10px 0;
  font-weight: bold;
}
.answer-box pre {
  background: #f0f0f0;
  padding: 8px;
  border-radius: 4px;
  overflow-x: auto;
}
.answer-box code {
  font-family: monospace;
  background-color: #eee;
  padding: 2px 4px;
  border-radius: 4px;
}
.answer-box ul {
  margin-left: 20px;
}

.question-bar {
  position: fixed;
  bottom: 46px;
  left: 0;
  right: 0;
  padding: 8px 12px;
  background: white;
  border-top: 1px solid #ddd;
}

.question-input {
  background-color: white;
  border-radius: 30px;
  padding-left: 16px;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
}

.send-btn {
  border-radius: 50%;
  width: 36px;
  height: 36px;
  padding: 0;
}

.tip {
  text-align: center;
  color: #999;
  font-size: 12px;
  margin-top: 8px;
}
</style>
