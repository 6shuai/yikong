import { get, post, put, del } from '@/utils/request'

// 新建项目
export function projectCreate(data) { return post('/project/', data) }

// 项目列表
export function projectList(data) { return get('/project/', data) }

// 项目列表
export function organizationUser(data) { return get('/public/organizationUser', data) }


// 查询项目详情
export function projectDetail(data) { return get('/project/publishedProjectDetail', data) }

// 新建或修改合同
export function projectContractCreate(data) { return post('/project/publishedContract', data) }

// 新建或修改合同   获取提成体系列表
export function projectCommissionSystemList(data) { return get('/project/commissionSystem', data); }

// 提交合同审批
export function projectContractSubmitApproval(data) { return put(`/project/contractApproval?contract=${data}`); }

// 提交回合同日
export function projectContractSubmitReturnDate(data) { return put(`/project/archiveDate?contract=${data}`); } 


// 素材列表 
export function projectMaterialLists(data) { return get('/material', data, 'published') }

// 素材对应的投放屏幕列表 
export function projectMaterialScreenList(data) { return get('/material_target', data, 'published') }

// 创建素材
export function projectMaterialUpload(data) { return post('/upload', data, 'published') }

// 下架素材
export function projectMaterialDelete(data) { return post('/remove_material', data, 'published') }

// 获取投放锁位列表
export function projectMaterialLockList(data) { return get('/target_placeholder', data, 'published') }

// 投放素材
export function projectMaterialPut(data) { return post('/sales_throw_in_content', data, 'published') }


// 查询财务信息
export function projectFinanceInfo(data) { return get('/project/publishedContractPayment', data) }

// 添加或修改 付款记录
export function projectFinanceCreateLog(data) { return post('/project/publishedContractPayment', data) }


// 删除发票
export function projectFinanceInvoiceDelete(data) { return del(`/project/publishedInvoice?id=${data}`) }



// 查询成员列表
export function projectMemberList(data) { return get('/project/publishedProjectMember', data) }

// 添加项目成员
export function projectMemberCreate(data) { return post('/project/publishedProjectMember', data) }

// 删除项目成员
export function projectMemberDelete(data) { return del(`/project/publishedProjectMember?id=${data}`) }

// 根据用户名或昵称 查询用户列表
export function projectMemberSearch(data) { return get('/project/platformUser', data) }


// 添加 修改 受益人
export function projectBeneficiaryCreate(data) { return post('/project/publishedBeneficiary', data) }

// 删除受益人
export function projectBeneficiaryDelete(data) { return del(`/project/publishedBeneficiary?id=${data}`) }


// 寻位 - 获取屏幕列表
export function projectLocationScreenList(data) { return get('/project/placeAndScreen', data) }

// 寻位 - 获取屏幕列表  查看详情
export function projectLocationScreenDetail(data) { return get('/project/placeAndScreenDetail', data) }


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
export function projectScreenPublicDetail(data) { return get('/screen/screenMaterial', data) }


// 查询屏幕某天的上刊信息 查询一个屏幕在某天的刊挂情况，用于锁位失败时候，查看该屏幕的使用详情 (姚哥) 
export function projectScreenUseDetail(data) { return get('/screen_statistics', data, 'published') }



// 查询素材包播放明细
export function projectMaterialPlayDetail(data) { return get('/project/publishedPlaybackStatistics', data) }




// 素材审核   待审核项目列表
export function materialAuditProjectList(data) { return get('/auditor/project', data) }

// 素材审核   分页查询待审核素材包列表
export function materialAuditPackageList(data) { return get('/auditor/materialPackage', data) }

// 素材审核   待审核屏幕列表
export function materialAuditScreenList(data) { return get('/auditor/screen', data) }

// 素材审核   查询待审核项目上刊明细列表
export function materialAuditMaterialDetail(data) { return get('/auditor/projectMaterial', data) }

// 素材审核   审核单个素材
export function materialAuditSingle(data) { return put(`/auditor/examineMaterial${data}`) }


// 素材审核   审核多个素材  全部通过 或者 全部拒绝
export function materialAuditAll(data) { return put(`/auditor/examineMaterials${data}`) }



// 获取屏幕布局模板
export function projectScreenLayoutTempList(data) { return get('/project/logicRegionTemp', data); }

// 发票中心  查询发票列表
export function projectInvoiceList(data) { return get('/project/publishedInvoice', data) }

// 发票中心  申请发票  获取发票基本信息
export function projectInvoiceCenterDefaultInfo(data) { return get('/project/invoiceBaseInfo', data); }

// 发票中心  添加 修改 发票
export function projectInvoiceCreate(data) { return post('/project/publishedInvoice', data) }


// 发票中心  查询发票详情
export function projectInvoiceDetail(data) { return get('/project/invoiceDetails', data) }


// 发票中心  查询发票详情  (审核人员)
export function projectInvoiceReviewDetail(data) { return get('/invoiceReview/invoiceDetails', data) }



// 回款列表  申领
export function projectReturnMoneyApply(data) { return post('/collectionRequest/', data) }

// 回款列表  申领记录列表
export function projectReturnMoneyApplyList(data) { return get('/collectionRequest/', data) }

// 回款列表  申领记录删除
export function projectReturnMoneyApplyDelete(data) { return del(`/collectionRequest/?id=${data}`) }

// 回款列表  查询销售签约的公司  
export function projectReturnMoneyCompany(data) { return get('/collectionRequest/organizationForSale', data) }

// 回款列表  查看待分配信息  
export function projectReturnMoneyDistributeDetail(data) { return get('/collectionRequest/scheduleForProject', data) }

// 回款列表  查看待分配信息 提交分配金额  
export function projectReturnMoneyDistribute(data) { return post('/collectionRequest/distributePayment', data) }

// 回款列表  退款  
export function projectReturnMoneyRefund(data) { return post('/collectionRequest/salesRefund', data) }


// 监播数据 列表
export function projectPlayStatisticsList(data) { return get('/project/materialPlaybackData', data) }


// 查询屏幕的播放情况 按月显示
export function projectPlayStatisticsCalendar(data) { return get('/project/materialPlaybackDataByPlaceholder', data) }

// 查询屏幕某天的播放数据
export function projectPlayStatisticsCurrentDay(data) { return get('/project/materialPlaybackDetail', data) }

