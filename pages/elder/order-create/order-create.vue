<template>
  <view class="page">
    <HeaderBar title="预约服务" />

    <view style="padding:12px">

      <!-- picker 不能使用 v-model，需改为 :value + @change -->
      <picker 
        mode="selector" 
        :range="services" 
        range-key="name"
        :value="selectedIndex"
        @change="onPickerChange"
      >
        <view>
          选择服务：{{ services[selectedIndex]?.name || '请选择' }}
        </view>
      </picker>

      <input v-model="address" placeholder="请输入上门地址" />

      <button @click="create">提交预约</button>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import HeaderBar from '../../../components/HeaderBar.vue'
import { fetchServiceCatalog, createServiceOrder } from '../../../api'

const services = ref([])
const selectedIndex = ref(0)
const address = ref('')

// 加载服务分类
onMounted(async () => {
  services.value = await fetchServiceCatalog()
})

// picker change 回调
function onPickerChange(e) {
  selectedIndex.value = e.detail.value
}

// 创建预约订单
async function create() {
  const svc = services.value[selectedIndex.value]
  if (!svc) {
    return uni.showToast({ title: '请选择服务', icon: 'none' })
  }

  const res = await createServiceOrder({
    serviceId: svc.id,
    address: address.value
  })

  if (res.success) {
    uni.showToast({ title: '预约成功: ' + res.order_no })
  }
}
</script>
