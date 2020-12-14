import { postKeyValueRequest, get, post, put, del } from '@/utils/request'

//游戏管理  添加或修改
export function gameCreated(data) { return post('/application/', data) }

//游戏管理 详情
export function gameDetail(data) { return get(`/application/applicationDetail${data}`) }

//游戏管理  删除游戏截图
export function gameScreenshotDelete(data) { return del(`/application/applicationShow/${data}`) }

//游戏管理  更新secret码时调用
export function gameUpdateSecret(data) { return post(`/application/secret/${data}`) }


//游戏管理 列表
export function gameList(data) { return get('/application/', data) }

//游戏管理  收藏 或 取消收藏
export function gameFavorite(data) { return put(`/application/isFavorite${data}`) }

//游戏管理 删除
export function gameDelete(data) { return del(`/application/${data}`) }

//游戏管理 包管理 保存
export function packageCreated(data) { return post('/application/applicationPackage', data) }

//游戏管理 包管理 列表
export function packageList(data) { return get('/application/applicationPackage', data) }

//游戏管理 包管理 删除
export function packageDelete(data) { return del(`/application/applicationPackage${data}`) }

//游戏管理 包管理 提交测试
export function packageSubmitTest(data) { return post('/application/applicationPackageToTest?id='+data) }

//游戏管理 包管理 上线测试包
export function packageOnline(data) { return post('/application/applicationPackageGoOnline?id='+data) }

//游戏管理 包管理 线上游戏包 列表
export function packageProductionList(data) { return get('/application/applicationPackageByBack', data) }

//游戏管理 包管理 变更游戏包
export function packageProductionUpdate(data) { return post('/application/updateApplyPackage'+data) }




//游戏管理  详情  游戏装配列表  查询游戏配置列表
export function gameDataConfigList(data) { return get('/application/gameConfigList', data) }

//游戏管理  详情  游戏装配列表  创建或修改
export function gameDataCreated(data) { return post('/application/gameAssembly', data) }

//游戏管理  详情  游戏装配列表  
export function gameDataList(data) { return get('/application/gameAssembly', data) }

//游戏管理  详情  游戏装配列表   获取详情
export function gameDataDetail(data) { return get(`/application/gameAssemblyDetail/${data}`) }

//游戏管理  详情  游戏装配列表  删除
export function gameDataDelete(data) { return del(`/application/gameAssembly/${data}`) }




//查询授权列表
export function gameAuthority(data) { return get('/application/applicationAuthority', data) }

//修改权限
export function gameAuthorityUpdate(data) { return post('/application/applicationAuthority', data) }



//排行榜管理  列表
export function rankTempList(data) { return get('/rankingListTemp/', data) }

//排行榜管理  创建排行榜模板
export function rankTempCreated(data) { return post('/rankingListTemp/', data) }

//排行榜管理  获取排行榜类型数据
export function rankTempTypeList(data) { return get('/rankingListTemp/rankingListType', data) }


//排行榜管理  创建子周期
export function rankTempSubcycleCreated(data) { return post('/rankingListTemp/subcycle', data) }

//排行榜管理  删除子周期
export function rankTempSubcycleDetele(data) { return del('/rankingListTemp/subcycle', data) }


//排行榜管理  排行榜数据
export function rankTempData(data) { return get('/rankingListTemp/rankingListData', data) }
