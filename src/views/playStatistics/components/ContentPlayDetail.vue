<template>
    <el-dialog
        width="1000px"
        title="hhhh"
        :visible.sync="showPlayDetailDialog"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :show-close="false"
        append-to-body
        custom-class="content-play-detail-dialog"
    >   
        <div class="content-detail" v-if="contentInfo">
            <div class="content-img">
                <el-image fit="cover" :src="contentInfo.contentPath"></el-image>
            </div>
            <div class="right-detail">
                <div class="detail-top overflow">
                    <span class="content-type">{{ contentType(contentInfo.contentType) }}</span>
                    <span class="content-title">{{ contentInfo.contentName }}</span>
                </div>
                <ul>
                    <li>物料时长： {{ contentInfo.duration }}s</li>
                    <li>文件类型： {{ contentInfo.contentPath.substring(contentInfo.contentPath.lastIndexOf('.')+1) }}</li>
                    <li>分辨率： {{ contentInfo.width }} x {{ contentInfo.height }}</li>
                    <li>文件大小： {{ contentInfo.size }}</li>
                </ul>
            </div>
        </div>

        <div class="play-date mt10">
            <div class="left-date">
                <div class="date">
                    <span class="label">监播日期</span>
                    <span>{{ playDate }}</span>
                </div>
                <div class="total-duration" v-show="!statisticsType">
                    <i class="el-icon-time"></i>
                    总时长 {{ playDuration }}分
                </div>

                <div class="total-duration" v-show="statisticsType">
                    <i class="el-icon-tickets"></i>
                    总次数 {{ playCount }}次
                </div>

                <a href="javascript:;" class="el-icon-menu ml10" @click="statisticsType = !statisticsType"></a>
            </div>
            <div class="right-btn">
                <el-button type="primary" size="small" @click="download">导出</el-button>
            </div>
        </div>

        <div class="play-list" :loading="dataLoading">
            <el-row class="item head">
                <el-col :span="8">序号</el-col>
                <el-col :span="8">开始时间</el-col>
                <el-col :span="8">结束时间</el-col>
            </el-row>
            <el-row class="item" v-for="(item, index) in contentPlayData" :key="index">
                <el-col :span="8">{{ item.number }}</el-col>
                <el-col :span="8">{{ item.beginTime }}</el-col>
                <el-col :span="8">{{ item.endTime }}</el-col>
            </el-row>
        </div>

        <el-empty v-if="!dataLoading && !contentPlayData.length"></el-empty>

        <el-pagination
            background
            :hide-on-single-page="true"
            layout="total, prev, pager, next"
            :current-page="Number(params.pageNo)"
            :page-size="Number(params.pageSize)"
            @current-change="handleCurrentChange"
            :total="totalCount">
        </el-pagination>
        
        <span slot="footer" class="dialog-footer">
            <el-button
                type="primary"
                @click="showPlayDetailDialog=false"
                >确 定</el-button
            >
        </span>
    </el-dialog>
</template>

<script>
import { operateContentPlayData } from '@/api/playStatistics'
import { findContentType } from '@/utils/config'
import qs from 'qs'

export default {
    data(){
        return {
            showPlayDetailDialog: false,

            // 内容信息
            contentInfo: undefined,
            
            // 内容播放数据
            contentPlayData: [],

            // 数据加载中
            dataLoading: false,

            totalCount: 0,

            params: {},

            // 监播日期
            playDate: null,

            // 播放次数
            playCount: null,

            // 播放时长
            playDuration: null,

            // 统计类型显示
            statisticsType: 0
        }
    },
    computed: {
        contentType(){
            return (id) => {
                return findContentType(id)
            }
        }
    },
    methods: {
        showContentPlayData(contentInfo, params){
            this.showPlayDetailDialog = true
            this.contentInfo = contentInfo
            this.playDate = params.playDate

            this.params = {
                ...params,
                pageNo: 1,
                pageSize: 40
            }
            this.getDetail()
        },

        getDetail(){
            this.dataLoading = true
            operateContentPlayData(this.params).then(res => {
                this.dataLoading = false
                let { list, totalRecords } = res.obj.page
                this.contentPlayData = list
                this.totalCount = totalRecords

                let { playCount, playDuration } = res.obj

                this.playCount = playCount
                this.playDuration = playDuration
            })
        },

        // 分页
        handleCurrentChange(page){
            this.params.pageNo = page
            this.getDetail()
        },

        //导出
		download() {
			window.open(
				`${document.location.origin}/user/project/exportOneMaterialPlaybackData?${qs.stringify(this.params)}`
			);
		}
    }
}

</script>

<style lang="scss">
    $bgColor: #F2F3F5;
    $mainColor: #0283C6;

    .content-play-detail-dialog{
        .content-detail{
            display: flex;

            .content-img{
                flex: 1;
                height: 120px;

                .el-image{
                    height: 120px;
                }
            }

            .right-detail{
                flex: 1;
                
                .detail-top{
                    display: flex;
                    align-items: center;

                    .content-type{
                        padding: 5px 10px;
                        color: #fff;
                        background: $mainColor;
                        margin-right: 10px;
                        border-radius: 6px;
                    }

                    .content-title{
                        font-size: 16px;
                    }
                }

                ul{
                    display: flex;
                    flex-wrap: wrap;
                    margin-top: 10px;

                    li{
                        width: 50%;
                        font-size: 14px;
                        padding: 10px 0;
                    }
                }
            }
        }

        .play-date{
            display: flex;
            justify-content: space-between;
            align-items: center;
            background: #eee;

            .left-date{
                border-radius: 6px;
                border-radius: 6px;
                overflow: hidden;

                .date, .total-duration{
                    line-height: 32px;
                    display: inline-block;
                }

                .date{
                    background: #fff;
                }

                span{
                    padding: 0px 10px;

                    &.label{
                        display: inline-block;
                        color: #fff;
                        background: $mainColor;
                        height: 32px;
                    }
                }

                .total-duration{
                    color: $mainColor;
                    margin-left: 10px;
                }
            }
        }

        .play-list{
            .item{
                margin-top: 10px;
                padding: 15px;
                background: $bgColor;

                &.head{
                    background: $mainColor;
                    color: #fff;
                }
            }
        }
    }
</style>