import { postKeyValueRequest, get, post, put, del } from '@/utils/request'

//资源管理 资源类型列表
export function getContentTypeList(data) { return get('/content/contentType', data) }

//资源管理 资源列表
export function contentList(data) { return get('/content/', data) }

//资源管理 添加资源
export function contentCreated(data) { return post('/content/', data) }

//资源管理  删除
export function contentDelete(data) { return del(`/content/${data}`) }

//资源管理  收藏 或 取消收藏
export function contentFavorite(data) { return put(`/content/isFavorite${data}`) }

//资源管理  查询资源详情
export function contentDetail(data) { return get(`/content/contentDetail/${data}`) }

//资源管理  添加或修改播放限制
export function contentPlayLimitCreated(data) { return post('/content/playbackRestriction', data) }

//资源管理  添加或修改播放限制
export function contentPlayLimitDelete(data) { return del(`/content/playbackRestriction/${data}`) }

//资源管理  添加或修改播放计划
export function contentPlayPlanCreated(data) { return post('/content/playPlan', data) }