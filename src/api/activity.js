import { postKeyValueRequest, getKeyValueRequest, get, post, put, del } from '@/utils/request'

//活动管理  列表
export function activityList(data) { return get('/promotion/', data) }

//活动管理  创建活动
export function activityCreated(data) { return post('/promotion/', data) }

//活动管理  商场模块
export function activityPlaceModule(data) { return get('/promotion/promotionModule', data) }

//活动管理  商户列表
export function activityMerchantList(data) { return get('/promotion/merchant', data) }

//活动管理  根据商场模块id 获取活动门票列表  支付方式列表
export function activityPayWayList(data) { return get('/promotion/promotionTicket', data) }



//活动管理  删除活动
export function activityDelete(data) { return del(`/promotion/${data}`) }

//活动管理  活动详情
export function activityDetail(data) { return get('/promotion/detail', data) }

//活动管理  收藏 或 取消收藏
export function activityFavorite(data) { return put(`/promotion/isFavorite${data}`) }





//活动管理  根据活动查询 奖池列表
export function activityPondList(data) { return get('/promotion/awardPool', data) }

//活动管理  添加奖池
export function activityPondCreated(data) { return post('/promotion/awardPool', data) }

//活动管理  删除奖池
export function activityPondDelete(data) { return del(`/promotion/awardPool${data}`) }



//活动管理  根据奖池查询 奖品列表
export function activityPrizeList(data) { return get('/promotion/awardItem', data) }

//活动管理  添加奖品
export function activityPrizeCreated(data) { return post('/promotion/awardItem', data) }

//活动管理  删除奖品
export function activityPrizeDelete(data) { return del(`/promotion/awardItem${data}`) }


//活动管理  奖品数据
export function activityCurrencyList(data) { return get('/promotion/currency', data) }


//活动管理  发奖条件列表
export function activityConditionList(data) { return get('/promotion/awardCondition', data) }

//活动管理  创建发奖条件
export function activityConditionCreated(data) { return post('/promotion/awardCondition', data) }

//活动管理  发奖条件 删除
export function activityConditionDelete(data) { return del(`/promotion/awardCondition${data}`) }


//活动管理  发奖条件  获取所有游戏
export function activityConditionGameList(data) { return get('/promotion/applicationContent', data) }

//活动管理  发奖条件  获取排行榜模板列表
export function activityConditionRankTemp(data) { return get('/promotion/rankingListTemp', data) }


//查询活动与 群组 相关联列表
export function activityAuthority(data) { return get('/promotion/groupPromotion', data) }

//添加活动与 群组关联
export function activityAuthorityUpdate(data) { return post('/promotion/groupPromotion', data) }

//删除活动与 群组关联
export function activityAuthorityDelete(data) { return del(`/promotion/groupPromotion${data}`) }





//统计数据  列表
export function activityStatisticsList(data) { return get('/promotion/statistics', data) }

//统计数据  详情
export function activityStatisticsDetail(data) { return get('/promotion/statisticsDetail', data) }


//统计数据  场所列表
export function activityPlaceList(data) { return get('/promotion/place', data) }

//统计数据  屏幕列表
export function activityScreenList(data) { return get('/promotion/screen', data) }



//生成邀请链接
export function activityGenerateLink(data) { return postKeyValueRequest('/promotion/generateLink', data) }

//统计数据  屏幕列表
export function activityGenerateLinkList(data) { return get('promotion/generateLink', data) }
