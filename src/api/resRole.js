import { get, post, put, del } from '@/utils/request'

//内容角色管理  列表
export function resRoleList(data) { return get('/resourceRole/', data) }

//内容角色管理  删除
export function resRoleDelete(data) { return del(`/resourceRole/${data}`) }

//内容角色管理  内容权限列表
export function resRoleAuthorityList(data) { return get('/resourceRole/resourceAuthority', data) }

//内容角色管理  添加内容角色
export function resRoleCreated(data) { return post('/resourceRole/', data) }


//内容角色管理  根据内容角色 获取内容权限
export function resRoleAuthority(data) { return get('/resourceRole/resourceAuthorityByRoleId', data) }

//内容角色管理  内容角色添加修改  内容权限
export function resRoleAuthorityCreated(data) { return put(`/resourceRole/resourceAuthority${data}`) }




