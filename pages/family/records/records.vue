<template>
<view class="page">
<HeaderBar title="服务记录" />
<view style="padding:12px">
<view v-for="o in orders" :key="o.id">{{o.order_no}} - {{o.service_name}} - {{o.status}}</view>
</view>
</view>
</template>


<script setup>
import HeaderBar from '../../../components/HeaderBar.vue'
import { ref, onMounted } from 'vue'
import { fetchOrders } from '../../../api'
const orders = ref([])
onMounted(async ()=> orders.value = await fetchOrders())
</script>