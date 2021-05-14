import { postKeyValueRequest, get, post, put, del } from '@/utils/request'

//内容管理 资源类型列表
export function getContentTypeList(data) { return get('/public/contentType', data) }

//内容管理 资源列表
export function contentList(data) { return get('/content/', data) }

//内容管理 添加资源
export function contentCreated(data) { return post('/content/', data) }

//内容管理  获取所有直播协议
export function contentLiveAgreement(data) { return get('/public/streamProtocol', data) }


//内容管理  删除
export function contentDelete(data) { return del(`/content/${data}`) }

//内容管理  收藏 或 取消收藏
export function contentFavorite(data) { return put(`/content/isFavorite${data}`) }

//内容管理  查询资源详情
export function contentDetail(data) { return get(`/content/contentDetail/${data}`) }

//内容管理  添加或修改播放限制
export function contentPlayLimitCreated(data) { return post('/content/playbackRestriction', data) }

//内容管理  添加或修改播放限制
export function contentPlayLimitDelete(data) { return del(`/content/playbackRestriction/${data}`) }

//内容管理  添加或修改播放计划
export function contentPlayPlanCreated(data) { return post('/content/playPlan', data) }

//内容管理 添加图集 分页查询所有资源
export function contentListPage(data) { return get('/content/queryForPage', data) }

//内容管理 删除图集 资源引用
export function atlasDeleteContent(data) { return del(`/content/atlas/${data}`) }

//内容管理  游戏预览
export function contentGamePreview(data) { return get('/content/previewGame', data) }




//查询资源 与 群组 相关联列表
export function contentAuthority(data) { return get('/content/groupContent', data) }

//添加资源 与 群组关联
export function contentAuthorityUpdate(data) { return post('/content/groupContent', data) }

//删除资源 与 群组关联
export function contentAuthorityDelete(data) { return del(`/content/groupContent${data}`) }



//查询所有场所列表
export function contentPlaceList(data) { return get('/content/place', data) }

//查询所有屏幕列表
export function contentScreenList(data) { return get('/content/screen', data) }

//统计列表
export function contentStatistics(data) { return get('/content/statistics', data) }

//统计详情
export function contentStatisticsDetail(data) { return get('/content/statisticsDetail', data) }


//游戏奖励统计列表
export function contentAwardStatistics(data) { return get('/content/awardCashStatistics', data) }

//游戏奖励统计详情
export function contentAwardStatisticsDetail(data) { return get('/content/awardCashStatisticsDetail', data) }



//玩家行为统计
export function contentPlayerBehaviralData(data) { return get('/content/playerBehaviralData', data) }

//游戏奖励统计详情
export function contentPlayerTimelineData(data) { return get('/content/statisticsDataByPlayer', data) }

//玩家留存统计
export function contentPlayerKeepData(data) { return get('/content/playerKeep', data) }

