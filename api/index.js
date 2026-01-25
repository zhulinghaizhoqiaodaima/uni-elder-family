const sleep = (ms=200) => new Promise(r=>setTimeout(r, ms))


export async function fetchElderList(){ await sleep(); return [{ id:101, name:'张大爷', age:78, tags:['hypertension'] }] }
export async function fetchHealthRecords(elderId){ await sleep(); return [{ type:'blood_pressure', measured_at:'2025-11-15 09:00', value:{systolic:150,diastolic:95} }] }
export async function fetchServiceCatalog(){ await sleep(); return [{ id:1, name:'送餐', price:20 },{ id:2, name:'理发', price:30 }] }
export async function createServiceOrder(payload){ await sleep(); return { success:true, order_no:'OD'+Date.now() } }
export async function fetchOrders(elderId){ await sleep(); return [{ id:1, order_no:'OD2025110001', service_name:'送餐', status:'待分配'}] }
export async function fetchFamilyAlerts(familyId){ await sleep(); return [{ id:1, elder_name:'张大爷', type:'blood_pressure', level:'高', created_at:'2025-11-15 09:05' }] }