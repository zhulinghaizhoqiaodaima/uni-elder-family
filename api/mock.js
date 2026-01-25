export async function fetchRecommendations() {
  return [
    {
      id: 1,
      name: '健康讲座',
      code: 'HEALTH_LECTURE',
      desc: '邀请专家分享健康管理知识，学习如何预防老年疾病。',
      time: '2025-12-01 14:00 - 16:00',
      location: '社区服务中心'
    },
    {
      id: 2,
      name: '书法班',
      code: 'CALLIGRAPHY_CLASS',
      desc: '书法爱好者聚集一堂，展示才艺，交流心得。',
      time: '2025-12-03 10:00 - 12:00',
      location: '社区活动中心'
    },
    {
      id: 3,
      name: '节日聚会',
      code: 'FESTIVAL_GATHERING',
      desc: '庆祝传统节日，大家一起分享美食，玩游戏。',
      time: '2025-12-10 18:00 - 20:00',
      location: '社区大堂'
    }
  ]
}


export async function createOrderApi(payload){
// 模拟写入
return { ok:true }
}


// 模拟获取老人的健康档案数据
export async function fetchHealthRecords(elderId) {
  return [
    { date: '2025-11-01', bpSystolic: 130, bpDiastolic: 80, heart: 72, steps: 4000 },
    { date: '2025-11-02', bpSystolic: 128, bpDiastolic: 82, heart: 75, steps: 5200 },
    { date: '2025-11-03', bpSystolic: 135, bpDiastolic: 85, heart: 70, steps: 4800 },
    { date: '2025-11-04', bpSystolic: 132, bpDiastolic: 81, heart: 74, steps: 5300 },
    { date: '2025-11-05', bpSystolic: 129, bpDiastolic: 79, heart: 71, steps: 5000 },
    { date: '2025-11-06', bpSystolic: 134, bpDiastolic: 83, heart: 73, steps: 4900 },
    { date: '2025-11-07', bpSystolic: 131, bpDiastolic: 80, heart: 72, steps: 5100 }
  ]
}
export async function fetchUserData (){
  // 模拟用户信息数据
  return {
    id: 1,
    name: '张大爷',
    phone: '13812345678',
    avatar: 'https://www.example.com/avatar.jpg',
    gender: 1,  // 男性
    birthday: '1950-06-15',
    status: 1,
    created_at: '2020-01-01',
    updated_at: '2022-08-01'
  }
}
