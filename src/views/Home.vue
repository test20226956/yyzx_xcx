<template>
  <van-swipe
    class="my-swipe"
    :loop="false"
    indicator-color="white"
	:width="358"
  >
    <van-swipe-item>1</van-swipe-item>
    <van-swipe-item>2</van-swipe-item>
    <van-swipe-item>3</van-swipe-item>
    <van-swipe-item>4</van-swipe-item>
  </van-swipe>

  <div class="button-group">
    <van-row :gutter="20" justify="center">
		<van-col :span="6">
			<van-button plain hairline type="primary">细边框按钮</van-button>
		</van-col>
		<van-col :span="6">
			<van-button plain hairline type="primary">细边框按钮</van-button>
		</van-col>
		<van-col :span="6">
			<van-button plain hairline type="primary">细边框按钮</van-button>
		</van-col>
		<van-col :span="6">
			<van-button plain hairline type="primary">细边框按钮</van-button>
		</van-col>
	</van-row>
  </div>
</template>

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
	padding: 12px 12px;
}
</style>
