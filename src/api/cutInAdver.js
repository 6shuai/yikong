import { postKeyValueRequest, get, post, put, del } from '@/utils/request'

// 插播广告列表
export function cutInAdverList(data) { return get('/spot/', data) }

//插播广告  添加
export function cutInAdverCreate(data) { return post('/spot/', data) }

//插播广告  删除
export function cutInAdverDelete(data) { return del(`/spot/${data}`) }

// 插播广告  详情
export function cutInAdverDetail(data) { return get('/spot/detail', data) }


// 插播广告  删除轮次
export function cutInAdverRoundDelete(data) { return del(`spot/spotStageMap/${data}`) }





//分页查询时间轴容器列表
export function cutInAdverTimelineList(data) { return get('/spot/timelineContainer', data) }

//根据时间轴容器 查询阶段
export function cutInAdverTimelineStage(data) { return get('/spot/timelinePhase', data) }





//查询资源 与 群组 相关联列表
export function cutInAdverAuthority(data) { return get('/spot/groupSpot', data) }

//添加资源 与 群组关联
export function cutInAdverAuthorityUpdate(data) { return post('/spot/groupSpot', data) }

//删除资源 与 群组关联
export function cutInAdverAuthorityDelete(data) { return del(`/spot/groupSpot${data}`) }

