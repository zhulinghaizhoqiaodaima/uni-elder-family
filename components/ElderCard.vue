<template>
<view class="elder-card">
<text>{{elder.name}}（{{elder.age}}）</text>
<text>标签：{{elder.tags?.join(',')}}</text>
</view>
</template>


<script setup>
import { defineProps } from 'vue'
const props = defineProps({ elder:{ type:Object, default: ()=>({}) } })
</script>


<style scoped>
.elder-card{ background:#fff; padding:12px; border-radius:6px }
</style>