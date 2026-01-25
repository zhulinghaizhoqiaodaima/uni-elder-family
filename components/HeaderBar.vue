<template>
<view class="header">
<text class="title">{{title}}</text>
</view>
</template>


<script setup>
import { defineProps } from 'vue'
const props = defineProps({ title:{ type:String, default:'社区服务' } })
const title = props.title
</script>


<style scoped>
.header{ height:48px; display:flex; align-items:center; padding:0 12px; background:#fff; border-bottom:1px solid #eee }
.title{ font-size:16px; font-weight:600 }
</style>