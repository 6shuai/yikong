import { get, post, put, del } from '@/utils/request'

//游戏管理  添加或修改
export function gameCreated(data) { return post('/gameApplication/', data) }

//游戏管理 详情
export function gameDetail(data) { return get(`/gameApplication/applicationDetail${data}`) }

//游戏管理  删除游戏截图
export function gameScreenshotDelete(data) { return del(`/gameApplication/applicationShow/${data}`) }

//游戏管理  更新secret码时调用
export function gameUpdateSecret(data) { return post(`/gameApplication/secret/${data}`) }


//游戏管理 列表
export function gameList(data) { return get('/gameApplication/', data) }

//游戏管理  收藏 或 取消收藏
export function gameFavorite(data) { return put(`/gameApplication/isFavorite${data}`) }

//游戏管理 删除
export function gameDelete(data) { return del(`/gameApplication/${data}`) }

//游戏管理 包管理 保存
export function packageCreated(data) { return post('/gameApplication/applicationPackage', data) }

//游戏管理 包管理 列表
export function packageList(data) { return get('/gameApplication/applicationPackage', data) }

//游戏管理 包管理 删除
export function packageDelete(data) { return del(`/gameApplication/applicationPackage${data}`) }

//游戏管理 包管理 提交测试
export function packageSubmitTest(data) { return post('/gameApplication/applicationPackageToTest?id='+data) }

//游戏管理 包管理 上线测试包
export function packageOnline(data) { return post('/gameApplication/applicationPackageGoOnline?id='+data) }

//游戏管理 包管理 线上游戏包 列表
export function packageProductionList(data) { return get('/gameApplication/applicationPackageByBack', data) }

//游戏管理 包管理 变更游戏包
export function packageProductionUpdate(data) { return post('/gameApplication/updateApplyPackage'+data) }




//游戏管理  详情  游戏装配列表  查询游戏配置列表
export function gameDataConfigList(data) { return get('/gameApplication/gameConfigList', data) }

//游戏管理  详情  游戏装配列表  创建或修改
export function gameDataCreated(data) { return post('/gameApplication/gameAssembly', data) }

//游戏管理  详情  游戏装配列表  
export function gameDataList(data) { return get('/gameApplication/gameAssembly', data) }

//游戏管理  详情  游戏装配列表   获取详情
export function gameDataDetail(data) { return get(`/gameApplication/gameAssemblyDetail/${data}`) }

//游戏管理  详情  游戏装配列表  删除
export function gameDataDelete(data) { return del(`/gameApplication/gameAssembly/${data}`) }


//排行榜管理  列表
export function rankTempList(data) { return get('/rankingListTemp/', data) }

//排行榜管理  创建排行榜模板
export function rankTempCreated(data) { return post('/rankingListTemp/', data) }

//排行榜管理  获取排行榜类型数据
export function rankTempTypeList(data) { return get('/rankingListTemp/rankingListType', data) }


//排行榜管理  创建子周期
export function rankTempSubcycleCreated(data) { return post('/rankingListTemp/subcycle', data) }

//排行榜管理  删除子周期
export function rankTempSubcycleDetele(data) { return del(`/rankingListTemp/subcycle${data}`) }


//排行榜管理  排行榜数据
export function rankTempData(data) { return get('/rankingListTemp/rankingListData', data) }

//排行榜管理  屏幕列表
export function rankTempScreenList(data) { return get('/rankingListTemp/screen', data) }



//查询资源 与 群组 相关联列表
export function gameAuthority(data) { return get('/gameApplication/groupApplication', data) }

//添加资源 与 群组关联
export function gameAuthorityUpdate(data) { return post('/gameApplication/groupApplication', data) }

//删除资源 与 群组关联
export function gameAuthorityDelete(data) { return del(`/gameApplication/groupApplication${data}`) }



//分页查询插播广告
export function gameCutInAdver(data) { return get('/gameApplication/spot', data) }


//分页查询活动列表
export function gameActivity(data) { return get('/gameApplication/promotion', data) }
