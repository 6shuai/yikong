import { postKeyValueRequest, get, post, put, del } from '@/utils/request'

//基础角色  获取所有角色
export function roleList(data) { return get('/basicRole/role', data) }

//基础角色  列表
export function basicRoleList(data) { return get('/basicRole/', data) }

//基础角色  创建
export function basicRoleCreated(data) { return post('/basicRole/', data) }

//基础角色  删除
export function basicRoleDelete(data) { return del(`/basicRole/${data}`) }
