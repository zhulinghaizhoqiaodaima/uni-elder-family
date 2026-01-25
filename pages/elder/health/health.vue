<template>
	<view class="page">
		<!-- <HeaderBar title="健康档案" /> -->

		<!-- 趋势图 -->
		<view class="chart-section" style="padding:12px">
			<view class="section-title">近期血压趋势</view>
			<HealthChart :records="records" />
		</view>

		<!-- 健康记录列表 -->
		<view class="health-list" style="padding:12px">
			 <DailyHealth v-for="r in records" :key="r.date" :record="r" />
		</view>
	</view>
</template>

<script setup>
	import {
		ref,
		onMounted
	} from 'vue'
	import HeaderBar from '../../../components/HeaderBar.vue'
	import HealthChart from '@/components/HealthChart.vue'
	import DailyHealth from '@/components/DailyHealth.vue'
	import {
		fetchHealthRecords
	} from '../../../api/mock'

	const records = ref([])
	const dailyRecords = ref([])

	onMounted(async () => {
		// 获取健康记录
		records.value = await fetchHealthRecords(1)

		// // 按天聚合数据
		// const grouped = {}
		// records.value.forEach(r => {
		// 	const date = r.time
		// 	if (!grouped[date]) grouped[date] = {}
		// 	if (r.type === '血压') grouped[date].bp = r
		// 	else if (r.type === '心率') grouped[date].heart = r
		// 	else if (r.type === '步数') grouped[date].steps = r
		// })
		

		// dailyRecords.value = Object.entries(grouped).map(([date, values]) => ({
		// 	date,
		// 	...values
		// }))
		// console.log(dailyRecords.value)
	})
</script>

<style scoped>
	.chart-section {
		background: #fff;
		border-radius: 12px;
		padding: 12px;
		margin-bottom: 18px;
		box-shadow: 0 3px 6px rgba(0, 0, 0, 0.08);
	}

	.section-title {
		font-size: 18px;
		font-weight: 600;
		margin-bottom: 6px;
	}

	.health-list {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	.record-card {
		background: #fff;
		border-radius: 12px;
		padding: 10px 12px;
		box-shadow: 0 3px 6px rgba(0, 0, 0, 0.08);
	}

	.record-header {
		display: flex;
		justify-content: space-between;
		margin-bottom: 6px;
	}

	.record-header .date {
		color: #666;
		font-size: 14px;
	}

	.record-header .type {
		color: #333;
		font-weight: 500;
		font-size: 14px;
	}

	.record-value {
		display: flex;
		align-items: center;
		font-size: 16px;
		color: #333;
	}

	.record-value .icon {
		font-size: 20px;
		margin-right: 6px;
	}
</style>