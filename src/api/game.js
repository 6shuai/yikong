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

//游戏管理 包管理 提交测试
export function packageSubmitTest(data) { return post('/application/applicationPackageToTest?id='+data) }

//游戏管理 包管理 上线测试包
export function packageOnline(data) { return post('/application/applicationPackageGoOnline?id='+data) }

//游戏管理 包管理 线上游戏包 列表
export function packageProductionList(data) { return get('/application/applicationPackageByBack', data) }

//游戏管理 包管理 变更游戏包
export function packageProductionUpdate(data) { return post('/application/updateApplyPackage'+data) }

