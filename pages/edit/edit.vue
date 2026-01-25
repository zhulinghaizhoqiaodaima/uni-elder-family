<template>
  <view class="page">
    <view class="content">
      <!-- 头像上传 -->
      <view class="avatar">
        <image :src="avatarUrl" class="avatar-img" />
        <button class="upload-btn" @click="uploadAvatar">上传头像</button>
      </view>

      <!-- 用户资料编辑 -->
      <view class="input-group">
        <label class="label">姓名</label>
        <input v-model="user.name" class="input" placeholder="请输入姓名" />
      </view>

      <view class="input-group">
        <label class="label">性别</label>
        <!-- 使用 picker 代替 select -->
        <picker mode="selector" :range="genderOptions" class="input" @change="onGenderChange">
          <view class="picker-text">
            {{ user.gender === 1 ? '男' : '女' }}
          </view>
        </picker>
      </view>

      <view class="input-group">
        <label class="label">生日</label>
        <input v-model="user.birthday" class="input" placeholder="请输入生日" type="date" />
      </view>

      <view class="input-group">
        <label class="label">手机号</label>
        <input v-model="user.phone" class="input" placeholder="请输入手机号" type="tel" />
      </view>

      <!-- 保存按钮 -->
      <button @click="saveProfile" class="save-btn">保存资料</button>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'

// 用户信息对象
const user = ref({
  name: '',
  gender: 1,  // 默认男
  birthday: '',
  phone: '',
})

const avatarUrl = ref('https://img.yzcdn.cn/vant/cat.jpeg')  // 默认头像路径

// 性别选项
const genderOptions = ['男', '女']

// 上传头像的方法
const uploadAvatar = () => {
  uni.chooseImage({
    count: 1,
    success(res) {
      avatarUrl.value = res.tempFilePaths[0]
    }
  })
}

// 处理性别变化
const onGenderChange = (event) => {
  user.value.gender = event.detail.value + 1  // `picker` 的值从 0 开始，所以需要加 1
}

// 保存资料的方法
const saveProfile = () => {
  console.log('保存资料', user.value)
  uni.showToast({
    title: '资料已保存',
    icon: 'success'
  })
}
</script>

<style scoped>
/* 样式保持不变 */
.page {
  padding: 20px;
  background-color: #f5f7fa;
  min-height: 100vh;
}

.content {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.avatar {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
}

.avatar-img {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  margin-bottom: 10px;
}

.upload-btn {
  background-color: #4b8df8;
  color: white;
  padding: 8px 20px;
  border-radius: 20px;
  border: none;
  cursor: pointer;
}

.input-group {
  width: 100%;
  margin-bottom: 16px;
}

.label {
  font-weight: 600;
  margin-bottom: 6px;
  color: #333;
}

.input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 16px;
}

.save-btn {
  width: 100%;
  padding: 12px;
  background-color: #4b8df8;
  color: white;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  font-size: 18px;
  transition: all 0.3s;
}

.save-btn:active {
  transform: scale(0.95);
}
</style>
