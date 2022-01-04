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
                prop="duration" 
                label="播放时长(秒)" 
                min-width="50"
            ></el-table-column>
            <el-table-column 
                prop="beginTime" 
                label="开始时间" 
                min-width="100"
            ></el-table-column>
            <el-table-column 
                prop="endTime" 
                label="结束时间" 
                min-width="100"
            ></el-table-column>
        </el-table>

        <el-pagination
            v-if="resData.length"
            background
            layout="total, prev, pager, next, sizes"
            :current-page="Number(params.pageNo)"
            :page-size="Number(params.pageSize)"
            @current-change="handleCurrentChange"
            :total="totalCount">
        </el-pagination>

    </div>
</template>

<script>
import { screenPlayTimeline } from '@/api/screen'
import { formatTime } from '@/utils/index'
import qs from "qs"

export default {
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
            screenPlayTimeline(this.params).then(res => {
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

        //导出
		handleDownload() {
			window.open(
				`${document.location.origin}/screen/exportPlayStatistics?${qs.stringify(this.params)}`
			)
		}
    }
}
</script>
