import { postKeyValueRequest, get, post, put, del } from '@/utils/request';

// 查询待审批合同列表
export function contractApprovalList(data) { return get('/user/contractReview/contract', data); }

// 查询待审批合同详情
export function contractApprovalDetail(data) { return get('/user/contractReview/contractDetails', data); }

// 合同审批
export function contractApproval(data) { return put(`/user/contractReview/contract${data}`); }
