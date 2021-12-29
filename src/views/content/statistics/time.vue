<template>
    <div class="content_play_count_wrap">
        <el-form label-width="80px" :inline="true">
			<el-form-item
				label="场所"
			>
				<el-select
					v-model="params.placeId"
					filterable
					clearable
					placeholder="请选择场所"
					@change="
						$delete(params, 'screenId');
						handleSearch();
						getScreen();
					"
                    @clear="$delete(params, 'placeId')"
				>
					<el-option
						v-for="item in placeData"
						:key="item.id"
						:label="item.displayName"
						:value="item.id"
					>
					</el-option>
				</el-select>
			</el-form-item>

			<el-form-item label="屏幕">
				<el-select
					v-model="params.screenId"
					filterable
					clearable
					placeholder="请选择屏幕"
					@change="handleSearch"
                    @clear="$delete(params, 'screenId')"
				>
					<el-option
						v-for="item in screenData"
						:key="item.id"
						:label="item.displayName"
						:value="item.id"
					>
					</el-option>
				</el-select>
			</el-form-item>

			<el-form-item label="时间范围">
				<el-date-picker
					@change="handleSearch"
					v-model="datePicker"
					type="datetimerange"
					value-format="yyyy-MM-dd HH:mm:ss"
					range-separator="至"
					start-placeholder="开始日期"
					end-placeholder="结束日期"
                    :default-time="['00:00:00', '23:59:59']"
				>
				</el-date-picker>
			</el-form-item>

            <div class="total_count_and_download mb20">
                <el-tag type="primary">总次数: {{ playTotalCount }}</el-tag>
                <el-button 
                    type="primary"
                    size="medium"
                    icon="el-icon-download"
                    @click="handleDownload"
                >导出</el-button>
            </div>
		</el-form>


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
                label="屏幕" 
                min-width="200"
            >
                <template slot-scope="scope">
                    <div class="overflow" :title="scope.row.screenName">
                        {{ scope.row.screenName }}
                    </div>
                </template>
            </el-table-column>
            <el-table-column 
                prop="duration" 
                label="播放时长(秒)" 
                min-width="60"
            ></el-table-column>
            <el-table-column 
                prop="beginTime" 
                label="日期" 
                min-width="100"
            ></el-table-column>
            <el-table-column 
                prop="beginTime" 
                label="操作" 
                width="110"
            >
                <template slot-scope="scope">
                    <el-button 
                        type="primary" 
                        size="mini"
                        @click="handleTimeDetail(scope.row.beginTime)"
                    >
                        查看明细
                    </el-button>
                </template>
            </el-table-column>
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

        <!-- 统计明细 -->
        <content-play-time-detail
            ref="contentPlayTimeDetail"
        ></content-play-time-detail>

    </div>
</template>

<script>
import { contentPlaceData } from '../mixins/index'
import { placeScreenList } from '@/api/place'
import { contentPlayStatistics } from '@/api/content'
import ContentPlayTimeDetail from '@/views/content/components/ContentPlayTimeDetail'
import qs from "qs"

export default {
    mixins: [contentPlaceData],
    components: {
        ContentPlayTimeDetail
    },
    data(){
        return {
            tLoading: false,
            params: {
                pageNo: 1,
                pageSize: 40,
                contentId: this.$route.params.id
            },

            //起止日期
            datePicker: [],

            //播放次数统计列表
            resData: [],

            //总条数
            totalCount: 0,

            //播放总次数
            playTotalCount: 0,

            //屏幕列表
            screenData: []
        }
    },
    mounted() {
        this.getPlayCount()
    },
    methods: {
        //获取播放次数列表
        getPlayCount(){
            this.tLoading = true
            contentPlayStatistics(this.params).then(res => {
                this.tLoading = false
                if(res.code === this.$successCode){
                    let { list, totalRecords } = res.obj.page
                    this.resData = list
                    this.totalCount = totalRecords
                    this.playTotalCount = res.obj.playNum
                }
            })
        },

        //屏幕列表
		getScreen() {
			placeScreenList({ placeId: this.params.placeId }).then((res) => {
				this.screenData = res.obj
			})
		},

        //分页
        handleCurrentChange(page){
            this.params.pageNo = page
            this.getPlayCount()
        },
        
        //搜索
        handleSearch(){
            this.params.pageNo = 1
            this.params.beginTime = this.datePicker ? this.datePicker[0] : ""
			this.params.endTime = this.datePicker ? this.datePicker[1] : ""
            this.getPlayCount()
        },

        //查看明细
        handleTimeDetail(beginTime){
            this.$refs.contentPlayTimeDetail.showDialog(beginTime, this.params)
        },

        //导出
		handleDownload() {
			window.open(
				`${document.location.origin}/content/exportPlayStatisticsDuration?${qs.stringify(this.params)}`
			)
		}
    }
}
</script>
<style lang="scss" scoped>
    .content_play_count_wrap{
        .total_count_and_download{
            display: inline-block;
            float: right;

            .el-tag{
                height: 36px;
                line-height: 36px;
                margin-right: 10px;
                vertical-align: middle;
            }
        }
    }
</style>