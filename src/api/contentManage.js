import { get, post, put, del, postKeyValueRequest } from '@/utils/request'

// 获取屏幕列表 按收藏和城市分组
export function getScreenGoupList(data) { return get('/screen/screenGroupByCity', data) }


// 获取屏幕的基本数据，包括屏幕分辨率，和该屏幕绑定的运营锁位订单
export function getScreenLayoutAndOrderDetail(data) { return get('/screen_for_operation', data, 'published') }

// 运营投放素材
export function operationPutMaterial(data) { return post('/throw_in_content', data, 'published') }

// 获取运营在某个屏幕上投放的素材数据
export function operationMaterialData(data) { return get('/operational_material', data, 'published') }



// 获取某个屏幕的默认布局
export function getScreenLayoutDetail(data) { return get('/default_layout', data, 'published') }

// 设置某个屏幕的默认内容
export function setScreenLayoutContent(data) { return post('/screen_default', data, 'published') }



// 配置屏幕布局  屏幕布局列表
export function getScreenLayoutList(data) { return get('/layout', data, 'published') }

// 获取屏幕列表 包含屏幕布局
export function getScreenListAndLayout(data) { return get('/screen_layout', data, 'published') }

// 设置屏幕的默认布局
export function contentMangeSetScreenLayout(data) { return post('/default_layout', data, 'published') }


// 获取商场的锁位
export function contentMangeGetPlaceLockPosition(data) { return get('/landlord', data, 'published') }

// 创建或修改商场的锁位
export function contentMangeSetPlaceLockPosition(data) { return post('/landlord', data, 'published') }
