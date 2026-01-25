<template>
  <view class="page">
    <view class="header-bg"></view>
    
    <view class="content-container">
      <view class="page-title">我的活动</view>

      <view class="activity-list" v-if="activities.length > 0">
        <view 
          class="activity-card" 
          v-for="(item, index) in activities" 
          :key="item.id"
        >
          <view class="card-header">
            <text class="title">{{ item.title }}</text>
            <text class="status-tag" :class="getStatusClass(item.status)">
              {{ getStatusText(item.status) }}
            </text>
          </view>
          
          <view class="card-body">
            <view class="info-row">
              <uni-icons type="calendar" size="16" color="#666"></uni-icons>
              <text class="info-text">时间：{{ formatDate(item.startTime) }}</text>
            </view>
            <view class="info-row">
              <uni-icons type="location" size="16" color="#666"></uni-icons>
              <text class="info-text">地点：{{ item.location }}</text>
            </view>
            <view class="info-desc">
              {{ item.content }}
            </view>
          </view>
        </view>
      </view>

      <view class="empty-state" v-else>
        <uni-icons type="staff-filled" size="80" color="#e0e0e0"></uni-icons>
        <text class="empty-text">您还没有报名任何活动</text>
        <button class="go-btn" @click="goList">去报名</button>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { fetchMyActivities } from '@/api/activity.js'
import { useUserStore } from '@/store/user.js'
import { formatDate } from '@/utils/format.js'

const userStore = useUserStore()
const activities = ref([])

const getStatusText = (status) => {
  if (status === 0) return '报名中'
  if (status === 1) return '进行中'
  return '已结束'
}

const getStatusClass = (status) => {
  if (status === 0) return 'tag-green'
  if (status === 1) return 'tag-blue'
  return 'tag-gray'
}

const loadData = async () => {
  const userId = userStore.userInfo.id
  console.log(userStore.userInfo)
  if (!userId) return
  
  try {
    const data = await fetchMyActivities(userId)
    activities.value = data
  } catch (e) {
    console.error(e)
  }
}

const goList = () => {
  // 跳转到活动列表页，根据你实际路径修改
  uni.switchTab({ url: '/pages/activity/activity' })
}

onMounted(() => {
  loadData()
})
</script>

<style scoped lang="scss">
.page {
  min-height: 100vh;
  background-color: #f5f7fa;
  position: relative;
}
.header-bg {
  height: 100px;
  background: linear-gradient(135deg, #ff9a9e 0%, #fad0c4 100%); /* 暖色调 */
  position: absolute;
  width: 100%;
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;
}
.content-container {
  position: relative;
  padding: 20px 16px;
  z-index: 1;
}
.page-title {
  font-size: 24px;
  font-weight: bold;
  color: #fff;
  margin-bottom: 20px;
}
.activity-card {
  background: #fff;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 16px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  border-bottom: 1px solid #eee;
  padding-bottom: 10px;
}
.title {
  font-size: 18px;
  font-weight: bold;
  color: #333;
}
.status-tag {
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 4px;
}
.tag-green { background: #e6ffec; color: #52c41a; }
.tag-blue { background: #e6f7ff; color: #1890ff; }
.tag-gray { background: #f5f5f5; color: #999; }

.info-row {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}
.info-text {
  margin-left: 6px;
  color: #666;
  font-size: 14px;
}
.info-desc {
  margin-top: 10px;
  background: #f9f9f9;
  padding: 8px;
  border-radius: 6px;
  font-size: 13px;
  color: #888;
  line-height: 1.5;
}
.empty-state {
  margin-top: 100px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.empty-text {
  color: #999;
  margin: 10px 0 20px;
}
.go-btn {
  background: #ff9a9e;
  color: #fff;
  border-radius: 20px;
  font-size: 14px;
  padding: 0 30px;
}
</style>