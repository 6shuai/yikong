import { get, post, put, del } from '@/utils/request'

// 新建项目
export function projectCreate(data) { return post('/user/project/', data) }

// 项目列表
export function projectList(data) { return get('/user/project/', data) }

// 项目列表
export function organizationUser(data) { return get('/public/organizationUser', data) }


// 查询项目详情
export function projectDetail(data) { return get('/user/project/publishedProjectDetail', data) }

// 新建或修改合同
export function projectContractCreate(data) { return post('/user/project/publishedContract', data) }

// 提交合同审批
export function projectContractSubmitApproval(data) { return put(`/user/project/contractApproval?contract=${data}`); }

// 提交回合同日
export function projectContractSubmitReturnDate(data) { return put(`/user/project/archiveDate?contract=${data}`); }




// 物料列表 xx
export function projectMaterialList(data) { return get('/user/project/publishedMaterialMedia', data) }

// 查询当前内容所投放的屏幕列表 xx
export function projectMaterialForScreenList(data) { return get('/user/project/publishedMaterialMediaByPackage', data) }


// 物料列表 
export function projectMaterialLists(data) { return get('/material', data, 'published') }

// 物料对应的投放屏幕列表 
export function projectMaterialScreenList(data) { return get('/material_target', data, 'published') }

// 创建物料
export function projectMaterialUpload(data) { return post('/upload', data, 'published') }

// 下架物料
export function projectMaterialDelete(data) { return post('/remove_material', data, 'published') }

// 获取投放锁位列表
export function projectMaterialLockList(data) { return get('/target_placeholder', data, 'published') }

// 投放物料
export function projectMaterialPut(data) { return post('/throw_in_material', data, 'published') }


// 查询财务信息
export function projectFinanceInfo(data) { return get('/user/project/publishedContractPayment', data) }

// 添加或修改 付款记录
export function projectFinanceCreateLog(data) { return post('/user/project/publishedContractPayment', data) }


// 删除发票
export function projectFinanceInvoiceDelete(data) { return del(`/user/project/publishedInvoice?id=${data}`) }



// 查询成员列表
export function projectMemberList(data) { return get('/user/project/publishedProjectMember', data) }

// 添加项目成员
export function projectMemberCreate(data) { return post('/user/project/publishedProjectMember', data) }

// 删除项目成员
export function projectMemberDelete(data) { return del(`/user/project/publishedProjectMember?id=${data}`) }

// 根据用户名或昵称 查询用户列表
export function projectMemberSearch(data) { return get('/user/project/platformUser', data) }


// 添加 修改 受益人
export function projectBeneficiaryCreate(data) { return post('/user/project/publishedBeneficiary', data) }

// 删除受益人
export function projectBeneficiaryDelete(data) { return del(`/user/project/publishedBeneficiary?id=${data}`) }


// 寻位 - 获取屏幕列表
export function projectLocationScreenList(data) { return get('/user/project/placeAndScreen', data) }

// 寻位 - 获取屏幕列表  查看详情
export function projectLocationScreenDetail(data) { return get('/user/project/placeAndScreenDetail', data) }


// 获取寻位时用到的  价格体系列表
export function projectLockPriceSystemList(data) { return get('/price_system', data, 'published') }

// 寻位锁位
export function projectLockPositionCreate(data) { return post('/order', data, 'published') }

// 释放订单  删除锁位列表
export function projectLockPositionDeleteOrder(data) { return post('/delete_order', data, 'published') }

// 释放屏幕
export function projectLockPositionDeleteScreen(data) { return post('/unlock', data, 'published') }


// 锁位列表
export function projectLockList(data) { return get('/get_order', data, 'published') }

// 查询屏幕某天的上刊信息
export function projectScreenPublicDetail(data) { return get('/user/project/screenMaterial', data) }


// 查询屏幕某天的上刊信息 查询一个屏幕在某天的刊挂情况，用于锁位失败时候，查看该屏幕的使用详情 (姚哥) 
export function projectScreenUseDetail(data) { return get('/screen_statistics', data, 'published') }



// 查询物料包播放明细
export function projectMaterialPlayDetail(data) { return get('/user/project/publishedPlaybackStatistics', data) }




// 物料审核   待审核项目列表
export function materialAuditProjectList(data) { return get('/user/auditor/project', data) }

// 物料审核   分页查询待审核物料包列表
export function materialAuditPackageList(data) { return get('/user/auditor/materialPackage', data) }

// 物料审核   待审核屏幕列表
export function materialAuditScreenList(data) { return get('/user/auditor/screen', data) }

// 物料审核   查询待审核项目上刊明细列表
export function materialAuditMaterialDetail(data) { return get('/user/auditor/projectMaterial', data) }

// 物料审核   审核单个物料
export function materialAuditSingle(data) { return put(`/user/auditor/examineMaterial${data}`) }


// 物料审核   审核多个物料  全部通过 或者 全部拒绝
export function materialAuditAll(data) { return put(`/user/auditor/examineMaterials${data}`) }



// 获取屏幕布局模板
export function projectScreenLayoutTempList(data) { return get('/user/project/logicRegionTemp', data); }

// 获取内容物料列表
export function projectScreenContentList(data) { return get('/user/project/content', data); }


// 发票中心  查询发票列表
export function projectInvoiceList(data) { return get('/user/project/publishedInvoice', data) }

// 发票中心  申请发票  获取发票基本信息
export function projectInvoiceCenterDefaultInfo(data) { return get('/user/project/invoiceBaseInfo', data); }

// 发票中心  添加 修改 发票
export function projectInvoiceCreate(data) { return post('/user/project/publishedInvoice', data) }


// 发票中心  查询发票详情
export function projectInvoiceDetail(data) { return get('/user/project/invoiceDetails', data) }


// 发票中心  查询发票详情  (审核人员)
export function projectInvoiceReviewDetail(data) { return get('/user/invoiceReview/invoiceDetails', data) }



// 回款列表  申领
export function projectReturnMoneyApply(data) { return post('/user/project/collectionRequest', data) }

// 回款列表  申领记录列表
export function projectReturnMoneyApplyList(data) { return get('/user/project/collectionRequest', data) }

// 回款列表  申领记录删除
export function projectReturnMoneyApplyDelete(data) { return del(`/user/project/collectionRequest?id=${data}`) }

// 回款列表  查询销售签约的公司  
export function projectReturnMoneyCompany(data) { return get('/user/project/organizationForSale', data) }

// 回款列表  查看待分配信息  
export function projectReturnMoneyDistributeDetail(data) { return get('/user/project/scheduleForProject', data) }

// 回款列表  查看待分配信息 提交分配金额  
export function projectReturnMoneyDistribute(data) { return post('/user/project/distributePayment', data) }

// 回款列表  退款  
export function projectReturnMoneyRefund(data) { return post('/user/project/salesRefund', data) }


// 监播数据 列表
export function projectPlayStatisticsList(data) { return get('/user/project/materialPlaybackData', data) }


// 查询屏幕的播放情况 按月显示
export function projectPlayStatisticsCalendar(data) { return get('/user/project/materialPlaybackDataByPlaceholder', data) }

// 查询屏幕某天的播放数据
export function projectPlayStatisticsCurrentDay(data) { return get('/user/project/materialPlaybackDetail', data) }

