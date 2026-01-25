<template>
  <view class="page">
    <!-- 家属绑定 -->
    <view class="section">
      <view class="section-title">家属绑定</view>

      <!-- 输入家属信息 -->
      <view class="input-group">
        <label class="label">家属姓名</label>
        <input v-model="family.name" class="input" placeholder="请输入家属姓名" />
      </view>

      <view class="input-group">
        <label class="label">家属联系方式</label>
        <input v-model="family.contact" class="input" placeholder="请输入家属联系方式" />
      </view>

      <view class="input-group">
        <label class="label">关系</label>
        <input v-model="family.relationship" class="input" placeholder="请输入与老人的关系" />
      </view>

      <!-- 绑定家属按钮 -->
      <button class="bind-btn" @click="bindFamily">绑定家属</button>

      <!-- 已绑定家属列表 -->
      <view class="family-list">
        <view v-for="(family, index) in families" :key="index" class="family-item">
          <text>{{ family.family_name }} - {{ family.relationship }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'

const family = ref({
  name: '',
  contact: '',
  relationship: ''
})

const families = ref([
  { family_name: '张三', relationship: '儿子' },
  { family_name: '李四', relationship: '女儿' }
])

// 绑定家属方法
const bindFamily = () => {
  if (family.value.name && family.value.contact && family.value.relationship) {
    families.value.push({
      family_name: family.value.name,
      relationship: family.value.relationship
    })
    family.value.name = ''
    family.value.contact = ''
    family.value.relationship = ''
    uni.showToast({
      title: '家属绑定成功',
      icon: 'success'
    })
  } else {
    uni.showToast({
      title: '请填写完整信息',
      icon: 'none'
    })
  }
}
</script>

<style scoped lang="scss">
.page {
  padding: 14px;
  background: #f5f7fa;
  min-height: 100vh;
}

.section {
  background: #fff;
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1);
}

.section-title {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 16px;
  color: #333;
}

.input-group {
  margin-bottom: 16px;
}

.label {
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
}

.input {
  width: 100%;
  padding: 8px;
  font-size: 16px;
  border: 1px solid #ddd;
  border-radius: 8px;
}

.bind-btn {
  width: 100%;
  padding: 12px;
  background-color: #4b8df8;
  color: white;
  border-radius: 20px;
  font-size: 16px;
  margin-top: 16px;
}

.family-list {
  margin-top: 20px;
}

.family-item {
  padding: 8px 0;
  border-bottom: 1px solid #eee;
  font-size: 16px;
  color: #333;
}
</style>
