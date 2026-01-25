<template>
  <view class="page">
    <view class="avatar-section" @click="changeAvatar">
      <view class="avatar-wrapper">
        <image 
          :src="form.avatar || '/static/images/default-avatar.jpg'" 
          class="avatar" 
          mode="aspectFill"
        ></image>
        <view class="camera-icon">
          <uni-icons type="camera-filled" size="20" color="#fff"></uni-icons>
        </view>
      </view>
      <text class="avatar-tip">点击更换头像</text>
    </view>

    <view class="form-card">
      
      <view class="form-item">
        <text class="label">姓名</text>
        <input 
          class="input" 
          v-model="form.name" 
          placeholder="请输入您的姓名" 
          placeholder-class="placeholder"
        />
      </view>

      <view class="form-item">
        <text class="label">手机号</text>
        <text class="value disabled">{{ userStore.userInfo.phone || '-' }}</text>
        <uni-icons type="locked" size="16" color="#ccc" style="margin-left: 5px;"></uni-icons>
      </view>

      <view class="form-item">
        <text class="label">性别</text>
        <radio-group @change="onGenderChange" class="gender-group">
          <label class="radio-label">
            <radio value="1" :checked="form.gender == 1" color="#4b8df8" style="transform:scale(0.8)"/>男
          </label>
          <label class="radio-label">
            <radio value="0" :checked="form.gender == 0" color="#4b8df8" style="transform:scale(0.8)"/>女
          </label>
        </radio-group>
      </view>

      <view class="form-item no-border">
        <text class="label">出生日期</text>
        <picker 
          mode="date" 
          :value="form.birthday" 
          start="1900-01-01" 
          :end="endDate" 
          @change="bindDateChange"
        >
          <view class="picker-value">
            {{ form.birthday || '请选择日期' }}
            <uni-icons type="forward" size="16" color="#999"></uni-icons>
          </view>
        </picker>
      </view>
    </view>

    <view class="btn-area">
      <button class="save-btn" :loading="loading" @click="handleSave">保存修改</button>
    </view>

  </view>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useUserStore } from '@/store/user.js'
import { updateUserApi } from '@/api/user.js'

const userStore = useUserStore()
const loading = ref(false)

// 表单数据
const form = reactive({
  id: '',
  name: '',
  gender: 1,
  birthday: '',
  avatar: ''
})

// 计算当前日期作为 Picker 结束日期
const endDate = computed(() => {
  const date = new Date()
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
})

// 初始化数据
onMounted(() => {
  const info = userStore.userInfo
  if (info) {
    form.id = info.id
    form.name = info.name
    form.gender = info.gender !== undefined ? info.gender : 1
    form.birthday = info.birthday || ''
    form.avatar = info.avatar || ''
  }
})

// 性别选择
const onGenderChange = (e) => {
  form.gender = parseInt(e.detail.value)
}

// 日期选择
const bindDateChange = (e) => {
  form.birthday = e.detail.value
}

const changeAvatar = () => {
  uni.showActionSheet({
    itemList: ['从相册选择', '拍照'],
    success: (res) => {
      // 1. 选择图片
      uni.chooseImage({
        count: 1,
        success: (chooseImageRes) => {
          const tempFilePath = chooseImageRes.tempFilePaths[0]
          
          // 提示用户正在上传
          uni.showLoading({ title: '上传中...' })

          // 2. 上传文件到后端
          uni.uploadFile({
            url: 'http://localhost:8080/api/common/upload', // 你的后端接口地址
            filePath: tempFilePath,
            name: 'file', // 后端 Controller 参数名 (MultipartFile file)
            header: {
                // 如果需要鉴权，这里记得带上 token
                // 'Authorization': userStore.token 
            },
            success: (uploadFileRes) => {
              // uni.uploadFile 返回的 data 是字符串，需要 JSON.parse
              const response = JSON.parse(uploadFileRes.data)
              
              if (response.code === 0) {
                // 3. 上传成功，获取永久 URL
                const realUrl = response.data
                form.avatar = realUrl // 赋值给表单
                uni.showToast({ title: '头像上传成功', icon: 'success' })
              } else {
                uni.showToast({ title: '上传失败: ' + response.message, icon: 'none' })
              }
            },
            fail: (err) => {
              console.error(err)
              uni.showToast({ title: '网络错误', icon: 'none' })
            },
            complete: () => {
              uni.hideLoading()
            }
          })
        }
      })
    }
  })
}
// 提交保存
const handleSave = async () => {
  if (!form.name) return uni.showToast({ title: '姓名不能为空', icon: 'none' })

  loading.value = true
  try {
    const res = await updateUserApi(form)
    
    // 如果后端返回 code=0 或直接返回数据
    // 根据你的 Result 封装，通常成功会进入这里
    uni.showToast({ title: '保存成功', icon: 'success' })
    
    // !!! 关键：更新本地 Store，这样返回个人中心时数据才会变 !!!
    // 假设后端接口返回的是更新后的 user 对象
    // 如果 res 是 { code:0, data: {...} } 结构，已经在 request.js 处理过 data 了吗？
    // 根据之前的 request.js，成功直接 resolve(data)
    
    // 更新 Store 中的 userInfo
    // 我们需要把 token 保留住，只更新 info
    const currentUser = { ...userStore.userInfo, ...res }
    userStore.userInfo = currentUser
    uni.setStorageSync('userInfo', currentUser)

    setTimeout(() => {
      uni.navigateBack()
    }, 1000)

  } catch (error) {
    console.error(error)
    // request.js 已经有错误提示了，这里可以不写
  } finally {
    loading.value = false
  }
}
</script>

<style scoped lang="scss">
.page {
  min-height: 100vh;
  background-color: #f5f7fa;
  padding-top: 20px;
}

/* 头像区域 */
.avatar-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 30px;
}

.avatar-wrapper {
  position: relative;
  width: 100px;
  height: 100px;
  margin-bottom: 10px;
}

.avatar {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 4px solid #fff;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.camera-icon {
  position: absolute;
  bottom: 0;
  right: 0;
  background-color: #4b8df8;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid #fff;
}

.avatar-tip {
  font-size: 12px;
  color: #999;
}

/* 表单卡片 */
.form-card {
  background-color: #fff;
  margin: 0 16px;
  border-radius: 12px;
  padding: 0 20px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.02);
}

.form-item {
  display: flex;
  align-items: center;
  height: 56px;
  border-bottom: 1px solid #f0f0f0;
}

.form-item.no-border {
  border-bottom: none;
}

.label {
  width: 80px;
  font-size: 15px;
  color: #333;
  font-weight: 500;
}

.input {
  flex: 1;
  font-size: 15px;
  color: #333;
  text-align: right;
}

.value {
  flex: 1;
  font-size: 15px;
  color: #333;
  text-align: right;
}

.value.disabled {
  color: #999;
}

.placeholder {
  color: #ccc;
  text-align: right;
}

/* 性别单选 */
.gender-group {
  flex: 1;
  display: flex;
  justify-content: flex-end;
  gap: 20px;
}

.radio-label {
  font-size: 15px;
  color: #666;
  display: flex;
  align-items: center;
}

/* 日期选择器 */
.picker-value {
  flex: 1;
  text-align: right;
  font-size: 15px;
  color: #333;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 5px;
  min-width: 200px; /* 保证点击区域够大 */
}

/* 按钮区域 */
.btn-area {
  margin: 40px 20px;
}

.save-btn {
  background: linear-gradient(135deg, #4b8df8, #3a7bd5);
  color: #fff;
  border-radius: 25px;
  font-size: 16px;
  height: 48px;
  line-height: 48px;
  box-shadow: 0 4px 12px rgba(75, 141, 248, 0.3);
}

.save-btn:active {
  transform: scale(0.98);
  opacity: 0.9;
}
</style>