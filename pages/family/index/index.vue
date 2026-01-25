<template>
<view class="page">
<HeaderBar title="家属端" />
<view style="padding:12px">
<button @click="go('/src/pages/family/monitor')">健康监控</button>
<button @click="go('/src/pages/family/records')">服务记录</button>
<button @click="go('/src/pages/family/alerts')">异常报警</button>
</view>
</view>
</template>


<script setup>
import HeaderBar from '../../../components/HeaderBar.vue'
function go(url){ uni.navigateTo({ url }) }
</script>