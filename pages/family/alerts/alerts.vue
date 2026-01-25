<template>
<view class="page">
<HeaderBar title="异常报警" />
<view style="padding:12px">
<view v-for="a in alerts" :key="a.id">{{a.elder_name}} - {{a.type}} - {{a.level}} - {{a.created_at}}</view>
</view>
</view>
</template>


<script setup>
import HeaderBar from '../../../components/HeaderBar.vue'
import { ref, onMounted } from 'vue'
import { fetchFamilyAlerts } from '../../../api'
const alerts = ref([])
onMounted(async ()=> alerts.value = await fetchFamilyAlerts())
</script>