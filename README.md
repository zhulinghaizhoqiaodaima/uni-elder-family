## 使用说明
1. 环境准备：
- 安装 HBuilderX（推荐）或使用 CLI + vite-plugin-uni (高级)
- Node.js >= 14
2. 安装依赖：
```bash
npm install
```
3. 运行 H5：
```bash
npm run dev:h5
```
4. 运行微信小程序：
- 使用 HBuilderX => 运行到小程序模拟器
- 或 `npm run dev:mp-weixin`（如果配置了相应脚本）


# uni-app 社区老年服务（老人端 & 家属端）


这是一个 uni-app + Vue3 的前端模板，包含老人端与家属端的页面与组件。用于快速搭建 H5 与微信小程序两端。


建议：使用 HBuilderX 导入并运行，或在项目中根据你的后端 API 调整 `src/api/index.js`。


---


# 后续工作建议
- 集成真实语音接口（科大讯飞或小程序平台语音识别）并处理权限弹窗；
- 增加登录鉴权、token 存储与权限控制；
- 健康数据可视化（使用 ECharts 或 uCharts）；
- 与后端对接、完善错误处理、表单校验与国际化。