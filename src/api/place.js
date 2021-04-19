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
export function placeProvincesData(data) { return get('/public/provinces', data) }

//场所管理  根据省代码获取市列表
export function placeCitysData(data) { return get(`/public/cities/${data}`) }

//场所管理  根据市代码获取区县列表
export function placeAreasData(data) { return get(`/public/areas/${data}`) }

//场所管理  根据区县代码获取省市区数据
export function adcodeFindData(data) { return get(`/public/areaData/${data}`) }

//场所管理  查询所有场所类型
export function placeTypeList(data) { return get('/place/placeType', data) }

//场所管理  查询场所所属组织下所有用户信息
export function placeGroupUserList(data) { return get(`/place/organizationUserInfo/${data}`) }

//场所管理  收藏 或 取消收藏
export function placeFavorite(data) { return put(`/place/isFavorite${data}`) }

//场所管理  查询场所详情
export function placeDetail(data) { return get(`/place/placeDetail/${data}`) }

//场所管理  删除场所图片
export function placeShowDelete(data) { return del(`/place/placeShow/${data}`) }

//场所管理  删除场所联系人
export function placeContactDelete(data) { return del(`/place/placeContact/${data}`) }

//场所管理  设置图片为列表 封面默认图片
export function placeShowDefault(data) { return put(`/place/placeShow/${data}`) }



//查询资源 与 群组 相关联列表
export function placeAuthority(data) { return get('/place/groupPlace', data) }

//添加资源 与 群组关联
export function placeAuthorityUpdate(data) { return post('/place/groupPlace', data) }

//删除资源 与 群组关联
export function placeAuthorityDelete(data) { return del(`/place/groupPlace${data}`) }

//查询所有游戏列表
export function placeGameList(data) { return get('/place/applicationContent', data) }

//查询所有屏幕列表
export function placeScreenList(data) { return get('/place/screen', data) }


//统计列表
export function placeStatistics(data) { return get('/place/statistics', data) }

//统计详情
export function placeStatisticsDetail(data) { return get('/place/statisticsDetail', data) }




//游戏奖励统计列表
export function placeAwardStatistics(data) { return get('/place/awardCashStatistics', data) }

//游戏奖励统计详情
export function placeAwardStatisticsDetail(data) { return get('/place/awardCashStatisticsDetail', data) }


