import { get } from '@/utils/request'

//所属权限组列表
export function getMyGroupList(data) { return get('/user/resourceGroup', data) }

//价格体系
export function getPriceTypeList(data) { return get('/public/publishedPriceSystem', data) }

