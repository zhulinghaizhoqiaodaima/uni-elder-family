<template>
<view class="page">
<HeaderBar title="我的预约" />
<view style="padding:12px">
<view v-for="o in orders" :key="o.id" class="order-item">
<text>{{o.order_no}} - {{o.service_name}} - {{o.status}}</text>
</view>
</view>
</view>
</template>


<script setup>
import { ref, onMounted } from 'vue'
import HeaderBar from '../../../components/HeaderBar.vue'
import { fetchOrders } from '../../../api'
const orders = ref([])
onMounted(async ()=> orders.value = await fetchOrders())
</script>