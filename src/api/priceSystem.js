import { postKeyValueRequest, get, post, put, del } from '@/utils/request';

// 获取价格体系详情 
export function priceSystemDetail(data) { return get('/priceSystem/detail', data); }


// 保存或修改屏幕刊例价
export function addScreenPrice(data) { return post('/priceSystem/publishedPrice', data); }




