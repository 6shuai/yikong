import { postKeyValueRequest, get, post, put, del } from '@/utils/request'

//所属权限组列表
export function getMyGroupList(data) { return get('/user/resourceGroup', data) }

