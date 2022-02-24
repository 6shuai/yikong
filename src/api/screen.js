import { get, post, put, del } from '@/utils/request'

//屏幕管理  获取所有点距规格数据
export function screenDotPitchList(data) { return get('/public/dotPitch', data) }

//屏幕管理  获取所有场所ID和名称
export function screenPlaceList(data) { return get('/screen/place', data) }

//屏幕管理  获取所有宽高比
export function screenAspectRatioList(data) { return get('/public/aspectRatio', data) }

//屏幕管理  列表
export function screenList(data) { return get('/screen/', data) }

//屏幕管理  创建屏幕
export function screenCreated(data) { return post('/screen/', data) }

//屏幕管理  删除屏幕
export function screenDelete(data) { return del(`/screen/${data}`) }

//屏幕管理  屏幕详情
export function screenDetail(data) { return get(`/screen/screenDetail${data}`) }

//屏幕管理  收藏 或 取消收藏
export function screenFavorite(data) { return put(`/screen/isFavorite${data}`) }

//屏幕管理  删除实景图片
export function screenShowDelete(data) { return del(`/screen/screenShow/${data}`) }

//屏幕管理  删除联系人
export function screenContactDelete(data) { return del(`/screen/screenContact/${data}`) }

//屏幕管理  设置图片为列表 封面默认图片
export function screenShowDefault(data) { return put(`/screen/screenShow/${data}`) }

//屏幕管理  设置音量
export function screenSetVolume(data) { return put(`/screen/volume/${data}`) }

//屏幕管理  设置静音
export function screenSetMute(data) { return put(`/screen/mute/${data}`) }

//屏幕管理  更新截图  
export function screenshotUpdate(data) { return put(`/screen/screenshot/${data}`) }

//屏幕管理  硬件绑定  
export function bindScreen(data) { return put(`/screen/bindScreen/${data}`) }

//屏幕管理  解除硬件绑定  
export function unboundScreen(data) { return del(`/screen/bindScreen/${data}`) }



//查询内容 与 群组 相关联列表
export function screenAuthority(data) { return get('/screen/groupScreen', data) }

//添加内容 与 群组关联
export function screenAuthorityUpdate(data) { return post('/screen/groupScreen', data) }

//删除内容 与 群组关联
export function screenAuthorityDelete(data) { return del(`/screen/groupScreen${data}`) }




//查询所有游戏列表
export function screenGameList(data) { return get('/screen/applicationContent', data) }

//统计列表
export function screenStatistics(data) { return get('/screen/statistics', data) }

//统计详情
export function screenStatisticsDetail(data) { return get('/screen/statisticsDetail', data) }


//游戏奖励统计列表
export function screenAwardStatistics(data) { return get('/screen/awardCashStatistics', data) }

//游戏奖励统计详情
export function screenAwardStatisticsDetail(data) { return get('/screen/awardCashStatisticsDetail', data) }


//玩家行为统计
export function screenPlayerBehavioralData(data) { return get('/screen/playerBehavioralData', data) }

//游戏奖励统计详情
export function screenPlayerTimelineData(data) { return get('/screen/statisticsDataByPlayer', data) }


//玩家留存统计
export function screenPlayerKeepData(data) { return get('/screen/playerKeep', data) }



//探针数据
export function screenProbeData(data) { return get('/screen/screenFootTraffic', data) }


//优惠券统计列表
export function screenCouponStatistics(data) { return get('/screen/couponStatistics', data) }

//优惠券统计详情
export function screenCouponStatisticsDetail(data) { return get('/screen/couponStatisticsDetail', data) }


//内容统计  当前屏幕所选日期 都播放了哪些内容
export function screenPlayContentData(data) { return get('/screen/playStatisticsGroupByContentId', data) }

//内容统计  内容播放详情
export function screenPlayContentPlayDetail(data) { return get('/screen/playStatisticsDetail', data) }

//内容统计  查询屏幕下的时间轴数据
export function screenTimelineData(data) { return get('/screen/timeline', data) }


// 按照时段查询屏幕 刊挂率
export function screenOccupyRate(data) { return get('/screen/occupancyRate', data) }

