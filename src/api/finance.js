import { postKeyValueRequest, get, post, put, del } from '@/utils/request';

// 获取项目权责  
export function financeProjectInfo(data) { return get('/finance/project', data); }


// 获取员工权责
export function financeMemberInfo(data) { return get('/finance/member', data); }


// 查询员工某个月的权责明细
export function financeMemberMonthInfo(data) { return get('/finance/memberFinanceForMonth', data); }

// 结算员工提成
export function financeMemberSettle(data) { return post('/finance/settleCommission', data); }


