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

// 物料列表
export function projectMaterialList(data) { return get('/project/publishedMaterialMedia', data) }

// 查询当前内容所投放的屏幕列表
export function projectMaterialForScreenList(data) { return get('/project/publishedMaterialMediaByContent', data) }


// 创建物料
export function projectMaterialCreate(data) { return post('/project/publishedMaterialMedia', data) }

// 删除物料
export function projectMaterialDelete(data) { return del(`/project/publishedMaterialMedia?id=${data}`) }


// 查询财务信息
export function projectFinanceInfo(data) { return get('/project/publishedContractPayment', data) }

// 添加或修改 付款记录
export function projectFinanceCreateLog(data) { return post('/project/publishedContractPayment', data) }

// 添加 修改 发票
export function projectFinanceCreateInvoice(data) { return post('/project/publishedInvoice', data) }

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
