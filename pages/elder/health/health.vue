<template>
  <view class="page">
    
    <view class="action-card">
      <view class="card-header">
        <text class="title">今日健康打卡</text>
        <button class="add-btn" @click="openPopup">
          <uni-icons type="plusempty" color="#fff" size="14"></uni-icons> 记录数据
        </button>
      </view>
      <view class="summary">
        <view class="item">
          <text class="num">{{ latest.sbp || '-' }}/{{ latest.dbp || '-' }}</text>
          <text class="label">最近血压</text>
        </view>
        <view class="item">
          <text class="num">{{ latest.bloodSugar || '-' }}</text>
          <text class="label">血糖</text>
        </view>
        <view class="item">
          <text class="num">{{ latest.heartRate || '-' }}</text>
          <text class="label">心率</text>
        </view>
      </view>
    </view>

    <view class="chart-container">
      <view class="section-title">近7次血压趋势</view>
      <view class="charts-box">
        <qiun-data-charts 
          type="line"
          :opts="chartOpts"
          :chartData="chartData"
        />
      </view>
    </view>

    <view class="history-list">
      <view class="section-title">历史记录</view>
      <view class="record-item" v-for="(item, index) in list" :key="item.id">
        <view class="time-col">
          <text class="date">{{ formatDate(item.measureTime).split(' ')[0] }}</text>
          <text class="time">{{ formatDate(item.measureTime).split(' ')[1] }}</text>
        </view>
        <view class="data-col">
          <view class="data-row">血压: {{ item.sbp }}/{{ item.dbp }} mmHg</view>
          <view class="data-row">心率: {{ item.heartRate }} bpm</view>
          <view class="data-row" v-if="item.bloodSugar">血糖: {{ item.bloodSugar }}</view>
        </view>
        <view class="del-col" @click="handleDelete(item.id)">
          <uni-icons type="trash" size="18" color="#ff4d4f"></uni-icons>
        </view>
      </view>
    </view>

    <uni-popup ref="popup" type="bottom" background-color="#fff">
      <view class="popup-content">
        <view class="popup-header">
          <text>记录健康数据</text>
          <uni-icons type="closeempty" size="20" @click="closePopup"></uni-icons>
        </view>
        
        <view class="form-item">
          <text class="label">收缩压(高压)</text>
          <input class="input" type="number" v-model="form.sbp" placeholder="如 120" />
        </view>
        <view class="form-item">
          <text class="label">舒张压(低压)</text>
          <input class="input" type="number" v-model="form.dbp" placeholder="如 80" />
        </view>
        <view class="form-item">
          <text class="label">心率(次/分)</text>
          <input class="input" type="number" v-model="form.heartRate" placeholder="如 75" />
        </view>
        <view class="form-item">
          <text class="label">血糖(mmol/L)</text>
          <input class="input" type="digit" v-model="form.bloodSugar" placeholder="选填" />
        </view>

        <button class="submit-btn" @click="submitRecord">保存记录</button>
      </view>
    </uni-popup>

  </view>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { getHealthList, addHealthRecord, deleteHealthRecord } from '@/api/health.js'
import { useUserStore } from '@/store/user.js'
import { formatDate } from '@/utils/format.js'

const userStore = useUserStore()
const popup = ref(null)
const list = ref([])
// 最新一条数据
const latest = computed(() => list.value.length > 0 ? list.value[0] : {})

// 表单数据
const form = reactive({
  sbp: '',
  dbp: '',
  heartRate: '',
  bloodSugar: ''
})

// 图表配置
const chartData = ref({})
const chartOpts = ref({
  color: ["#1890FF","#91CB74"],
  padding: [15,10,0,15],
  legend: {},
  xAxis: { disableGrid: true },
  yAxis: { data: [{ min: 0 }] },
  extra: { line: { type: "straight" } }
})

const openPopup = () => popup.value.open()
const closePopup = () => popup.value.close()

// 获取数据
const loadData = async () => {
  const userId = userStore.userInfo.id
  if(!userId) return

  const res = await getHealthList(userId)
  list.value = res
  updateChart(res)
}

// 更新图表数据
const updateChart = (data) => {
  // 取最近7条，并按时间正序排列用于图表展示
  const recentData = data.slice(0, 7).reverse()
  
  const categories = recentData.map(item => formatDate(item.measureTime).substring(5, 10)) // 取 MM-dd
  const sbpData = recentData.map(item => item.sbp)
  const dbpData = recentData.map(item => item.dbp)

  chartData.value = {
    categories: categories,
    series: [
      { name: "高压", data: sbpData },
      { name: "低压", data: dbpData }
    ]
  }
}

// 提交
const submitRecord = async () => {
  if(!form.sbp || !form.dbp) return uni.showToast({title:'请输入血压', icon:'none'})
  
  const data = {
    userId: userStore.userInfo.id,
    sbp: Number(form.sbp),
    dbp: Number(form.dbp),
    heartRate: form.heartRate ? Number(form.heartRate) : null,
    bloodSugar: form.bloodSugar ? Number(form.bloodSugar) : null,
    // 自动生成当前时间字符串 yyyy-MM-dd HH:mm
    measureTime: formatDate(new Date()).substring(0, 16)
  }

  const res = await addHealthRecord(data)
  if(res) {
    uni.showToast({title:'记录成功'})
    closePopup()
    // 清空表单
    form.sbp = ''
    form.dbp = ''
    form.heartRate = ''
    form.bloodSugar = ''
    loadData()
  }
}

// 删除
const handleDelete = async (id) => {
  uni.showModal({
    title: '确认删除?',
    success: async (res) => {
      if(res.confirm) {
        await deleteHealthRecord(id)
        loadData()
      }
    }
  })
}

onMounted(() => {
  loadData()
})
</script>

<style scoped lang="scss">
.page {
  padding: 16px;
  background-color: #f5f7fa;
  min-height: 100vh;
}

/* 顶部卡片 */
.action-card {
  background: linear-gradient(135deg, #4b8df8, #3a7bd5);
  border-radius: 16rpx;
  padding: 24rpx;
  color: #fff;
  margin-bottom: 24rpx;
  box-shadow: 0 4rpx 12rpx rgba(75, 141, 248, 0.3);
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30rpx;
}
.title { font-size: 32rpx; font-weight: bold; }
.add-btn {
  background: rgba(255,255,255,0.2);
  color: #fff;
  border: 1px solid rgba(255,255,255,0.4);
  font-size: 24rpx;
  border-radius: 30rpx;
  padding: 0 20rpx;
  height: 50rpx;
  line-height: 48rpx;
  margin: 0;
}
.summary { display: flex; justify-content: space-around; }
.item { display: flex; flex-direction: column; align-items: center; }
.num { font-size: 36rpx; font-weight: bold; margin-bottom: 8rpx; }
.label { font-size: 24rpx; opacity: 0.8; }

/* 图表容器 */
.chart-container {
  background: #fff;
  border-radius: 16rpx;
  padding: 20rpx;
  margin-bottom: 24rpx;
}
.section-title {
  font-size: 30rpx;
  font-weight: bold;
  border-left: 8rpx solid #4b8df8;
  padding-left: 16rpx;
  margin-bottom: 20rpx;
}
.charts-box { width: 100%; height: 400rpx; }

/* 列表 */
.history-list {
  background: #fff;
  border-radius: 16rpx;
  padding: 20rpx;
}
.record-item {
  display: flex;
  align-items: center;
  padding: 20rpx 0;
  border-bottom: 1px solid #f0f0f0;
}
.time-col {
  width: 140rpx;
  display: flex;
  flex-direction: column;
}
.date { font-size: 28rpx; color: #333; }
.time { font-size: 24rpx; color: #999; }
.data-col { flex: 1; margin-left: 20rpx; }
.data-row { font-size: 26rpx; color: #666; margin-bottom: 4rpx; }
.del-col { padding: 10rpx; }

/* 弹窗 */
.popup-content {
  background: #fff;
  padding: 30rpx;
  border-top-left-radius: 24rpx;
  border-top-right-radius: 24rpx;
}
.popup-header {
  display: flex;
  justify-content: space-between;
  font-size: 32rpx;
  font-weight: bold;
  margin-bottom: 30rpx;
}
.form-item {
  display: flex;
  align-items: center;
  margin-bottom: 24rpx;
  border-bottom: 1px solid #f0f0f0;
  padding-bottom: 10rpx;
}
.form-item .label { width: 200rpx; font-size: 28rpx; color: #333; }
.form-item .input { flex: 1; font-size: 28rpx; }
.submit-btn {
  background: #4b8df8;
  color: #fff;
  border-radius: 40rpx;
  margin-top: 40rpx;
}
</style>