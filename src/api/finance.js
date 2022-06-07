import { postKeyValueRequest, get, post, put, del } from '@/utils/request';

// 添加收款记录
export function financeReturnMoneyAddLog(data) { return post('/businessTransaction/', data); }

// 获取收款记录列表
export function financeReturnMoneyLogList(data) { return get('/businessTransaction/', data); }

// 删除收款记录
export function financeReturnMoneyLogDelete(data) { return del(`/businessTransaction/?id=${data}`); }

// 收款分配
export function financeReturnMoneyDistribute(data) { return put(`/businessTransaction/collectionRequest?${data}`); }



// 退款处理列表 审核列表
export function financeReturnMoneyReviewList(data) { return get('/businessTransaction/salesRefund', data); }

// 退款审核
export function financeReturnMoneyReview(data) { return put(`/businessTransaction/salesRefund?${data}`); }

// 退款处理列表数量
export function financeReturnMoneyReviewCount(data) { return get('/businessTransaction/salesRefundStatistics', data); }





// 获取项目权责  
export function financeProjectInfo(data) { return get('/finance/project', data); }

// 获取项目权责明细
export function financeProjectDetail(data) { return get('/finance/projectAccrual', data); } 


// 获取员工权责
export function financeMemberInfo(data) { return get('/finance/member', data); }


// 查询员工某个月的权责明细
export function financeMemberMonthInfo(data) { return get('/finance/memberFinanceForMonth', data); }

// 结算员工提成
export function financeMemberSettle(data) { return post('/finance/settleCommission', data); }



// 获取提成体系列表
export function financeCommissionSystemList(data) { return get('/commissionSystem/', data); }

// 创建或编辑  提成体系
export function financeCommissionSystemCreate(data) { return post('/commissionSystem/', data); }


// 获取发票列表
export function financeCommissionInvoiceList(data) { return get('/invoiceReview/invoice', data); }

// 获取发票项目明细
export function financeCommissionInvoiceProjectDetail(data) { return get('/invoiceReview/publishedProject', data); }

// 审核发票
export function financeCommissionInvoiceReview(data) { return put(`/invoiceReview/invoice?${data}`); }

// 审核发票  驳回原因列表
export function financeCommissionInvoiceTurnDownReasonList(data) { return get('/public/invoiceRejectionReason', data); }

