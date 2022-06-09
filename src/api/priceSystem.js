import { postKeyValueRequest, get, post, put, del } from '@/utils/request';

// 新建价格体系
export function priceSystemCreate(data) { return post('/priceSystem/', data); }

// 复制价格体系
export function priceSystemCopy(data) { return get(`/priceSystem/copy?ids=${data}`); }


// 价格体系列表
export function priceSystemList(data) { return get('/priceSystem/', data); }


// 删除价格体系
export function priceSystemDelete(data) { return del(`/priceSystem/?ids=${data}`); }

// 获取价格体系详情 
export function priceSystemDetail(data) { return get('/priceSystem/detail', data); }

// 价格体系生效
export function priceSystemEffect(data) { return put(`/priceSystem/?id=${data.id}&effect=${data.effect}`); }


// 保存或修改屏幕刊例价
export function addScreenPrice(data) { return post('/priceSystem/publishedPrice', data); }




