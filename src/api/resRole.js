import { postKeyValueRequest, get, post, put, del } from '@/utils/request'

//资源角色管理  列表
export function resRoleList(data) { return get('/resourceRole/', data) }

//资源角色管理  删除
export function resRoleDelete(data) { return del(`/resourceRole/${data}`) }

//资源角色管理  资源权限列表
export function resRoleAuthorityList(data) { return get('/resourceRole/resourceAuthority', data) }

//资源角色管理  添加资源角色
export function resRoleCreated(data) { return post('/resourceRole/', data) }


//资源角色管理  根据资源角色 获取资源权限
export function resRoleAuthority(data) { return get('/resourceRole/resourceAuthorityByRoleId', data) }

//资源角色管理  资源角色添加修改  资源权限
export function resRoleAuthorityCreated(data) { return put(`/resourceRole/resourceAuthority${data}`) }




