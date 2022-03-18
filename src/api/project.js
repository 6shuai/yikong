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




// 物料列表
export function projectMaterialList(data) { return get('/user/project/publishedMaterialMedia', data) }

// 查询当前内容所投放的屏幕列表
export function projectMaterialForScreenList(data) { return get('/user/project/publishedMaterialMediaByPackage', data) }


// 创建物料
export function projectMaterialCreate(data) { return post('/user/project/publishedMaterialMedia', data) }

// 删除物料
export function projectMaterialDelete(data) { return del(`/user/project/publishedMaterialMedia?id=${data}`) }


// 查询财务信息
export function projectFinanceInfo(data) { return get('/user/project/publishedContractPayment', data) }

// 添加或修改 付款记录
export function projectFinanceCreateLog(data) { return post('/user/project/publishedContractPayment', data) }

// 添加 修改 发票
export function projectFinanceCreateInvoice(data) { return post('/user/project/publishedInvoice', data) }

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
export function projectLocationScreenList(data) { return get('/user/project/screen', data) }


// 寻位
export function projectLocation(data) { return post('/user/project/locating', data) }

// 锁位
export function projectLockPosition(data) { return post('/user/project/lockPosition', data) }


// 查询锁位列表
export function projectLockPositionList(data) { return get('/user/project/publishedPlaceholder', data) }


// 删除锁位
export function projectLockPositionDelete(data) { return del(`/user/project/publishedPlaceholder?id=${data}`) }


// 查询屏幕某天的上刊信息
export function projectScreenPublicDetail(data) { return get('/user/project/screenMaterial', data) }


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


