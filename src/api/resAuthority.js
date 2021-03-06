import { get, post, del } from '@/utils/request'

//内容权限管理  权限父级列表
export function resAuthorityParentList(data) { return get('/resourceAuthority/', data) }

//内容权限管理  列表
export function resAuthorityList(data) { return get('/resourceAuthority/tree', data) }

//内容权限管理  添加权限
export function resAuthorityCreated(data) { return post('/resourceAuthority/', data) }

//内容权限管理  删除
export function resAuthorityDelete(data) { return del(`/resourceAuthority/${data}`) }



