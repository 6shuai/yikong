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

//时间轴 详情页 - 资源选择 - 获取所有图集资源
export function timelineAtlasContentList(data) { return get('/timeline/atlasContent', data) }

//时间轴 详情页 - 资源选择 - 获取所有游戏 列表
export function timelineGameList(data) { return get('/timeline/applicationContent', data) }

//时间轴 详情页 - 投放屏幕 - 获取所有的屏幕列表
export function timelineScreenList(data) { return get('/timeline/screen', data) }

//时间轴 详情页 - 投放屏幕 - 已投放的屏幕列表
export function timelinePutScreenList(data) { return get(`/timeline/findScreenByContainerId/${data}`) }

//时间轴 详情页 - 投放屏幕 - 添加屏幕
export function timelineAddScreen(data) { return post(`/timeline/screenToTimelineContainer${data}`) }

//时间轴 详情页 - 投放屏幕 - 删除屏幕
export function timelineDeleteScreen(data) { return del(`/timeline/screenToTimelineContainer/${data}`) }


//时间轴 添加或修改时间轴
export function timelineCreated(data) { return post('/timeline/', data) }

//时间轴 根据逻辑区域ID查询时间轴集合
export function timelineList(data) { return get(`/timeline/${data}`) }

//时间轴 删除
export function timelineDelete(data) { return del(`/timeline/${data}`) }

//时间轴 发布到终端
export function pubToScreen(data) { return get(`/timeline/sendTimelineDataToScreen/${data}`) }

//时间轴  导入时间轴
export function importTimelineContainer(data) { return post(`/timeline/importTimelineContainer${data}`) }

//时间轴  复制当前时间轴阶段内容  到其他时间轴
export function copyTimelineContainer(data) { return post(`/timeline/copyTimelineContainer${data}`) }

//保存游戏配置
export function timelineSaveGameConfig(data) { return post('/timeline/assembly', data) }



//定时发布 屏幕列表
export function timeIntervalList(data) { return get(`/timeline/timing/${data}`) }

//定时发布 某个屏幕的对应的 定时时间轴列表
export function timeIntervalScreentTimelineList(data) { return get(`/timeline/timingsByScreenId/${data}`) }

//定时发布 选择屏幕 和 时间  发布
export function timeIntervalPub(data) { return post('/timeline/timing', data) }

//定时发布 删除
export function timeIntervalDelete(data) { return del(`/timeline/timing/${data}`) }



//时间轴调度  创建
export function timelineRuleCreated(data) { return post('/timeline/timelineScheduleStep', data) }

//时间轴调度  获取详情
export function timelineRuleDetail(data) { return get('/timeline/timelineScheduleStep', data) }

//时间轴调度  删除步骤
export function timelineRuleDelete(data) { return del(`/timeline/timelineScheduleStep/${data}`) }

//时间轴调度  删除步骤里的屏幕区域
export function timelineRuleRegionDelete(data) { return del(`/timeline/stepRegion/${data}`) }



//时间轴阶段  创建
export function timelineStageCreated(data) { return post('/timeline/timelinePhase', data) }

//时间轴阶段  删除阶段
export function timelineStageDelete(data) { return del(`/timeline/timelinePhase/${data}`) }

//时间轴阶段  屏幕布局模板列表
export function timelineStageTempList(data) { return get('/timeline/logicRegionTemp/', data) }


//时间轴阶段  创建 步骤
export function timelineStageStepCreated(data) { return post('/timeline/timelineStep', data) }

//根据时间轴容器id 查询阶段数据
export function timelineStageData(data) { return get(`/timeline/phase/${data}`) }

//修改逻辑区域  是否轮播 
export function timelineRegionUpdate(data) { return put('/timeline/timelineRegion', data) }



//查询资源 与 群组 相关联列表
export function timelineAuthority(data) { return get('/timeline/groupTimeline', data) }

//添加资源 与 群组关联
export function timelineAuthorityUpdate(data) { return post('/timeline/groupTimeline', data) }

//删除资源 与 群组关联
export function timelineAuthorityDelete(data) { return del(`/timeline/groupTimeline${data}`) }


//删除轮播轴 或者 插播轴
export function timelineClearDelete(data) { return del(`/timeline/rotateOrCutInPhase${data}`) }
