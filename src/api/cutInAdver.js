import { postKeyValueRequest, get, post, put, del } from '@/utils/request'

// 插播广告列表
export function cutInAdverList(data) { return get('/spot/', data) }

//插播广告  添加
export function cutInAdverCreate(data) { return post('/spot/', data) }

//插播广告  删除
export function cutInAdverDelete(data) { return del(`/spot/${data}`) }

// 插播广告  详情
export function cutInAdverDetail(data) { return get('/spot/detail', data) }


// 插播广告  删除游戏阶段
export function cutInAdverRoundDelete(data) { return del(`spot/spotGameStageRelation?id=${data}`) }

//插播广告   添加游戏阶段
export function cutInAdverGameStageAdd(data) { return post('/spot/spotGameStageRelation', data) }


//插播广告   删除广告轴
export function cutInAdverTimelineDelete(data) { return del(`/spot/spotContainerRelation?id=${data}`) }

//插播广告   添加广告轴
export function cutInAdverTimelineAdd(data) { return post('/spot/spotContainerRelation', data) }


//分页查询时间轴容器列表
export function cutInAdverTimelineList(data) { return get('/spot/timelineContainer', data) }


//插播广告   查询 游戏所在的屏幕  和 插播广告轴对应的列表
export function cutInAdverScreenList(data) { return get(`/spot/spotStageMap?spotGameStageId=${data}`) }

//插播广告   修改游戏所在的屏幕 的 插播广告轴
export function updateScreenAdvTimeline(data) { return put('/spot/spotStageMap', data) }




//查询资源 与 群组 相关联列表
export function cutInAdverAuthority(data) { return get('/spot/groupSpot', data) }

//添加资源 与 群组关联
export function cutInAdverAuthorityUpdate(data) { return post('/spot/groupSpot', data) }

//删除资源 与 群组关联
export function cutInAdverAuthorityDelete(data) { return del(`/spot/groupSpot${data}`) }

