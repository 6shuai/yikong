import { get } from '@/utils/request'


//操作日志 列表
export function getLogList(data) { return get('/sysLog/', data) }
