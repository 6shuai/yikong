import { get, post, put, del } from '@/utils/request'

//运营素材监播统计数据
export function operateContentPlayStatistics(data) { return get('/materialPlayback/materialPlaybackDataForOperation', data) }

//运营 查询单个素材播放数据
export function operateContentPlayData(data) { return get('/materialPlayback/oneMaterialPlaybackData', data) }
