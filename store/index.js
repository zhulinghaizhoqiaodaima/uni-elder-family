// store/index.js
import { createPinia } from 'pinia'

// 小程序必须实例化
const pinia = createPinia()

// 导出给 main.js 使用
export default pinia
