import { postKeyValueRequest, get, post, put, del } from '@/utils/request'


//屏幕布局模板 - 添加
export function layoutTempCreated(data) { return post('/logicRegionTemp/', data) }

//屏幕布局模板 - 列表
export function layoutTempList(data) { return get('/logicRegionTemp/', data) }

//屏幕布局模板 - 删除模板
export function layoutTempDelete(data) { return del(`/logicRegionTemp/${data}`) }

//屏幕布局模板 - 详情
export function layoutTempDetail(data) { return get('/logicRegionTemp/detail', data) }

//屏幕布局模板 - 删除模板 逻辑区域
export function layoutTempSubDelete(data) { return del(`/logicRegionTemp/sub${data}`) }


