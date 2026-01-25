<template>
<view class="service-item">
<text>{{item.name}} - ¥{{item.price}}</text>
</view>
</template>


<script setup>
import { defineProps } from 'vue'
const props = defineProps({ item:{ type:Object, default: ()=>({}) } })
</script>


<style scoped>
.service-item{ background:#fff; padding:8px; margin:6px 0; border-radius:6px }
</style>