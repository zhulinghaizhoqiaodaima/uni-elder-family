<template>
  <view class="chart-container">
    <canvas
      canvas-id="healthChart"
      id="healthChart"
      class="chart-canvas"
    />
  </view>
</template>


<script setup>
import { onMounted, watch, nextTick, getCurrentInstance } from 'vue'
import uCharts from './u-charts/u-charts.min.js'

const props = defineProps({
  records: {
    type: Array,
    default: () => []
  }
})

let chart = null
const { proxy } = getCurrentInstance()

const renderChart = () => {
  if (!props.records.length) return

  // ✅ 1. 手动获取 canvas 上下文（关键）
  const context = uni.createCanvasContext('healthChart', proxy)

  const categories = props.records.map(r => r.date)
  const systolic = props.records.map(r => r.bpSystolic)
  const diastolic = props.records.map(r => r.bpDiastolic)
  const heartRate = props.records.map(r => r.heart)

  chart && chart.destroy()

  chart = new uCharts({
    type: 'line',
    canvasId: 'healthChart',
    context, // ⭐⭐⭐ 必须传
    categories,
    series: [
      { name: '收缩压', data: systolic },
      { name: '舒张压', data: diastolic },
      { name: '心率', data: heartRate }
    ],
    width: uni.upx2px(690),
    height: uni.upx2px(420),
    legend: { show: true },
    xAxis: { boundaryGap: 'justify' },
    yAxis: { gridType: 'dash' },
    extra: {
      line: {
        type: 'curve'
      }
    }
  })
}

onMounted(async () => {
  await nextTick()
  renderChart()
})

watch(
  () => props.records,
  () => {
    renderChart()
  },
  { deep: true }
)
</script>

<style scoped>
.chart-container {
  height: 240px;
  background: #fff;
  border-radius: 8px;
  padding: 8px;
}
</style>
