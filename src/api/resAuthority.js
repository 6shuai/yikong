import { postKeyValueRequest, get, post, put, del } from '@/utils/request'

//资源权限管理  权限父级列表
export function resAuthorityParentList(data) { return get('/resourceAuthority/', data) }

//资源权限管理  列表
export function resAuthorityList(data) { return get('/resourceAuthority/tree', data) }

//资源权限管理  删除
export function resAuthorityDelete(data) { return del(`/resourceAuthority/${data}`) }



