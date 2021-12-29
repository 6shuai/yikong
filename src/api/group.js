import { get, post, put, del } from '@/utils/request'

//权限群组管理  添加
export function groupCreated(data) { return post('/resourceGroup/', data) }

//权限群组管理  列表
export function groupList(data) { return get('/resourceGroup/', data) }

//权限群组管理  删除群组
export function groupDelete(data) { return del(`/resourceGroup/?id=${data}`) }

//权限群组管理  详情
export function groupDetail(data) { return get('/resourceGroup/detail', data) }



//权限群组管理  组织内用户列表
export function groupMemberList(data) { return get('/resourceGroup/organizationUserInfo', data) }

//权限群组管理  添加用户
export function groupAddMember(data) { return post('/resourceGroup/resourceGroupUser', data) }

//权限群组管理  删除用户
export function groupMemberDelete(data) { return del(`/resourceGroup/resourceGroupUser${data}`) }


//权限群组管理  查询所有内容角色
export function groupResRole(data) { return get('/resourceGroup/resourceRole', data) }

//权限群组管理  某个成员的角色列表
export function groupResRoleList(data) { return get('/resourceGroup/resourceRole', data) }

//权限群组管理  修改成员角色
export function groupResRoleChange(data) { return put(`/resourceGroup/resourceRole${data}`) }
