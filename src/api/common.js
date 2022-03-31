import { get } from '@/utils/request'

// 所属权限组列表
export function getMyGroupList(data) { return get('/user/resourceGroup', data) }

// 价格体系
export function getPriceTypeList(data) { return get('/public/publishedPriceSystem', data) }


// 查询所有主页
export function getHomePageList(data) { return get('/public/homePage', data) }

// 查询发票类目
export function getGoodsAndServicesList(data) { return get('/public/goodsAndServices', data) }

