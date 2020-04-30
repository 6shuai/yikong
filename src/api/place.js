import { postKeyValueRequest, get, post, put, del } from '@/utils/request'

//场所管理  获取所有场所
export function placeList(data) { return get('/place/', data) }

//场所管理  添加场所
export function placeCreated(data) { return post('/place/', data) }

//场所管理  更新场所信息
export function placeUpdate(data) { return put('/place/', data) }

//场所管理  删除场所
export function placeDelete(data) { return del(`/place/${data}`) }

//场所管理  获取所有省
export function placeProvincesData(data) { return get('/place/provinces', data) }

//场所管理  根据省代码获取市列表
export function placeCitysData(data) { return get(`/place/citys/${data}`) }

//场所管理  根据市代码获取区县列表
export function placeAreasData(data) { return get(`/place/areas/${data}`) }

//场所管理  根据区县代码获取省市区数据
export function adcodeFindData(data) { return get(`/place/areaData/${data}`) }