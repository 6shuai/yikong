import { postKeyValueRequest, get, post, put, del } from '@/utils/request'

//时间轴 时间轴容器 添加或修改
export function timelineContainerCreated(data) { return post('/timeline/timelineContainer', data) }

//时间轴 时间轴容器 详情
export function timelineContainerDetail(data) { return get(`/timeline/timelineContainerDetail/${data}`) }

//时间轴 时间轴容器 列表
export function timelineContainerList(data) { return get('/timeline/timelineContainer', data) }

//时间轴 时间轴容器 删除
export function timelineContainerDelete(data) { return del(`/timeline/timelineContainer/${data}`) }

//时间轴 详情页 - 资源选择 - 获取所有资源
export function timelineContentList(data) { return get('/timeline/content', data) }

//时间轴 详情页 - 投放屏幕 - 获取所有的屏幕列表
export function timelineScreenList(data) { return get('/timeline/screen', data) }

//时间轴 详情页 - 投放屏幕 - 已投放的屏幕列表
export function timelinePutScreenList(data) { return get(`/timeline/findScreenByContainerId/${data}`) }

//时间轴 详情页 - 投放屏幕 - 添加屏幕
export function timelineAddScreen(data) { return post(`/timeline/screenToTimelineContainer${data}`) }

//时间轴 详情页 - 投放屏幕 - 删除屏幕
export function timelineDeleteScreen(data) { return del(`/timeline/screenToTimelineContainer/${data}`) }

//时间轴 详情页 - 屏幕布局 - 添加或修改逻辑区域
export function timelineAddlayout(data) { return post('/timeline/logicRegion', data) }

//时间轴 详情页 - 屏幕布局 - 根据时间轴容器ID查询逻辑区域集合
export function timelineLayoutList(data) { return get(`/timeline/logicRegion/${data}`) }

//时间轴 详情页 - 屏幕布局 - 删除
export function timelineLayoutDelete(data) { return del(`/timeline/logicRegion/${data}`) }


//时间轴 添加或修改时间轴
export function timelineCreated(data) { return post('/timeline/', data) }

//时间轴 根据逻辑区域ID查询时间轴集合
export function timelineList(data) { return get(`/timeline/${data}`) }

//时间轴 删除
export function timelineDelete(data) { return del(`/timeline/${data}`) }

//时间轴 发布到终端
export function pubToScreen(data) { return get(`/timeline/sendTimelineDataToScreen/${data}`) }
