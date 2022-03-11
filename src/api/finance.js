import { postKeyValueRequest, get, post, put, del } from '@/utils/request';

// 查询回款列表
export function financeReturnMoneyList(data) { return get('/finance/projectAmount', data); }


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
export function financeCommissionSystemList(data) { return get('/finance/commissionSystem', data); }

// 创建或编辑  提成体系
export function financeCommissionSystemCreate(data) { return post('/finance/commissionSystem', data); }

// 删除提成体系
export function financeCommissionSystemDelete(data) { return del(`/finance/commissionSystem${data}`); }


