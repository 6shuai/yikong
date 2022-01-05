<template>
    <div class="content_play_count_wrap">

        <div 
            class="mb20"
            style="float: right;"
        >
            <el-date-picker
                class="mr20"
                v-model="params.beginTime"
                align="right"
                type="date"
                placeholder="选择日期"
                value-format="yyyy-MM-dd"
                @change="handleSearch"
                :picker-options="pickerOptions">
            </el-date-picker>
            <el-button 
                type="primary"
                size="medium"
                icon="el-icon-download"
                @click="handleDownload"
            >导出</el-button>
        </div>


        <el-table
            v-loading="tLoading"
            stripe
            size="small"
            :data="resData"
            style="width: 100%;margin-bottom: 20px;"
            row-key="id"
            border>
            <el-table-column 
                prop="screenName" 
                label="缩略图" 
                min-width="100"
            >
                <template slot-scope="scope">
                    <el-image 
                        fit="cover" 
                        :src="scope.row.image"
                        style="height: 50px"
                    ></el-image>
                </template>
            </el-table-column>
            <el-table-column 
                prop="contentName" 
                label="内容" 
                min-width="120"
            ></el-table-column>
            <el-table-column 
                prop="playNum" 
                label="总次数" 
                min-width="60"
            ></el-table-column>
            <el-table-column 
                prop="duration" 
                label="总时长(秒)" 
                min-width="60"
            ></el-table-column>
            <el-table-column 
                prop="beginTime" 
                label="查看明细" 
                width="110"
            >
                <template slot-scope="scope">
                    <el-button 
                        type="primary" 
                        size="mini"
                        @click="handleContentDetail(scope.row.contentId)"
                    >
                        查看明细
                    </el-button>
                </template>
            </el-table-column>
        </el-table>

        <el-pagination
            v-if="resData.length"
            background
            layout="total, prev, pager, next"
            :current-page="Number(params.pageNo)"
            :page-size="Number(params.pageSize)"
            @current-change="handleCurrentChange"
            :total="totalCount">
        </el-pagination>


        <!-- 内容详情 -->
        <content-detail ref="contentDetail"></content-detail>

    </div>
</template>

<script>
import { screenPlayContentData } from '@/api/screen'
import { formatTime } from '@/utils/index'
import ContentDetail from './ContentDetail'
import qs from "qs"

export default {
    components: {
        ContentDetail
    },
    data(){
        return {
            tLoading: false,
            params: {
                pageNo: 1,
                pageSize: 40,
                screenId: Number(this.$route.params.id),
                beginTime: formatTime(new Date(), 'date')
            },

            //播放次数统计列表
            resData: [],

            //总条数
            totalCount: 0,

            // 禁止选择今天之后的日期
            pickerOptions: {
                disabledDate(time) {
                    return time.getTime() > Date.now();
                }
            }
        }
    },
    mounted() {
        this.getScreenTimeline()
    },
    methods: {
        //获取播放次数列表
        getScreenTimeline(){
            this.tLoading = true
            screenPlayContentData(this.params).then(res => {
                this.tLoading = false
                if(res.code === this.$successCode){
                    let { list, totalRecords } = res.obj
                    this.resData = list
                    this.totalCount = totalRecords
                }
            })
        },

        //分页
        handleCurrentChange(page){
            this.params.pageNo = page
            this.getScreenTimeline()
        },
        
        //搜索
        handleSearch(){
            this.params.pageNo = 1
            this.getScreenTimeline()
        },

        //查看详情
        handleContentDetail(contentId){
            this.$refs.contentDetail.showDialog({ 
                beginTime: this.params.beginTime || formatTime(new Date(), 'date'), 
                contentId 
            })
        },

        //导出
		handleDownload() {
			window.open(
				`${document.location.origin}/screen/exportPlayStatisticsGroupByContentId?${qs.stringify(this.params)}`
			)
		}
    }
}
</script>
