<template>
<view class="page">
<HeaderBar title="健康监控" />
<view style="padding:12px">
<view v-for="r in records" :key="r.measured_at">{{r.measured_at}} - {{r.type}} - {{r.value.systolic}}/{{r.value.diastolic}}</view>
</view>
</view>
</template>


<script setup>
import HeaderBar from '../../../components/HeaderBar.vue'
import { ref, onMounted } from 'vue'
import { fetchHealthRecords } from '../../../api'
const records = ref([])
onMounted(async ()=> records.value = await fetchHealthRecords())
</script>