import { postKeyValueRequest, get, post, put, del } from '@/utils/request';

// 添加收款记录
export function financeReturnMoneyAddLog(data) { return post('/user/finance/businessTransaction', data); }

// 获取收款记录列表
export function financeReturnMoneyLogList(data) { return get('/user/finance/businessTransaction', data); }

// 删除收款记录
export function financeReturnMoneyLogDelete(data) { return del(`/user/finance/businessTransaction?id=${data}`); }

// 收款分配
export function financeReturnMoneyDistribute(data) { return put(`/user/finance/collectionRequest?${data}`); }



// 退款处理列表 审核列表
export function financeReturnMoneyReviewList(data) { return get('/user/finance/salesRefund', data); }

// 退款审核
export function financeReturnMoneyReview(data) { return put(`/user/finance/salesRefund?${data}`); }

// 退款处理列表数量
export function financeReturnMoneyReviewCount(data) { return get('/user/finance/salesRefundStatistics', data); }





// 获取项目权责  
export function financeProjectInfo(data) { return get('/user/finance/project', data); }

// 获取项目权责明细
export function financeProjectDetail(data) { return get('/user/finance/projectAccrual', data); } 


// 获取员工权责
export function financeMemberInfo(data) { return get('/user/finance/member', data); }


// 查询员工某个月的权责明细
export function financeMemberMonthInfo(data) { return get('/user/finance/memberFinanceForMonth', data); }

// 结算员工提成
export function financeMemberSettle(data) { return post('/user/finance/settleCommission', data); }



// 获取提成体系列表
export function financeCommissionSystemList(data) { return get('/user/finance/commissionSystem', data); }

// 创建或编辑  提成体系
export function financeCommissionSystemCreate(data) { return post('/user/finance/commissionSystem', data); }


// 获取发票列表
export function financeCommissionInvoiceList(data) { return get('/user/invoiceReview/invoice', data); }

// 获取发票项目明细
export function financeCommissionInvoiceProjectDetail(data) { return get('/user/invoiceReview/publishedProject', data); }

// 审核发票
export function financeCommissionInvoiceReview(data) { return put(`/user/invoiceReview/invoice?${data}`); }

// 审核发票  驳回原因列表
export function financeCommissionInvoiceTurnDownReasonList(data) { return get('/public/invoiceRejectionReason', data); }

