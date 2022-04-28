import { get, post, put, del } from '@/utils/request'

// 获取屏幕列表 按收藏和城市分组
export function getScreenGoupList(data) { return get('/screen/screenGroupByCity', data) }


// 配置屏幕布局  屏幕布局列表
export function getScreenLayoutList(data) { return get('/layout', data) }
