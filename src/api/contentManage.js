import { get, post, put, del } from '@/utils/request'

// 获取屏幕列表 按收藏和城市分组
export function getScreenGoupList(data) { return get('/screen/screenGroupByCity', data) }
