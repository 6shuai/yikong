import { postKeyValueRequest, get, post, put, del } from '@/utils/request'

//商户管理  获取所有场所
export function merchantPlaceList(data) { return get('/merchant/place/', data) }

//商户管理  添加商户
export function merchantCreated(data) { return post('/merchant/', data) }

//商户管理  删除商户
export function merchantDelete(data) { return del(`/merchant/${data}`) }

//商户管理  商户列表
export function merchantList(data) { return get('/merchant/', data) }

//商户管理  商户详情
export function merchantDetail(data) { return get(`/merchant/merchantDetail?id=${data}`) }

//商户管理  添加 或 取消 收藏
export function MerchantFavorite(data) { return put(`/merchant/isFavorite/${data}`) }



//查询商户 与 群组 相关联列表
export function merchantAuthority(data) { return get('/merchant/groupMerchant', data) }

//添加商户 与 群组关联
export function merchantAuthorityUpdate(data) { return post('/merchant/groupMerchant', data) }

//删除商户 与 群组关联
export function merchantAuthorityDelete(data) { return del(`/merchant/groupMerchant${data}`) }

