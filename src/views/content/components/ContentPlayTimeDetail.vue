<template>
    <el-dialog
        width="1000px"
        title="时间明细"
        class="play_time_detail"
        :visible.sync="showPlayDetail"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        @close="showPlayDetail=false"
        append-to-body>

        <el-form label-width="50px" :inline="true">
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

            <div class="total_count_and_download mb20">
                <el-tag type="primary">总时长: {{ playTotalTime }}</el-tag>
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
                min-width="100"
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

    </el-dialog>
</template>

<script>
import { contentPlaceData } from '../mixins/index'
import { contentPlayStatisticsDetail } from '@/api/content'
import { placeScreenList } from '@/api/place'
import qs from "qs"

export default {
    mixins: [contentPlaceData],
    data(){
        return {
            showPlayDetail: false,
            tLoading: false,
            resData: [],
            params: {
                pageNo: 1,
                pageSize: 20
            },
            totalCount: 0,

            //屏幕列表
            screenData: [],

            //播放总时长
            playTotalTime: 0
        }
    },
    methods: {
        //显示明细窗口
        showDialog(date, data){
            this.params = {
                ...data,
                pageNo: 1,
                pageSize: 20,
                beginTime: date,
                contentId: Number(this.$route.params.id)
            }
            this.showPlayDetail = true
            this.getPlayDetail()
        },

        //时间统计明细
        getPlayDetail(){
            this.tLoading = true
            contentPlayStatisticsDetail(this.params).then(res => {
                this.tLoading = false
                if(res.code === this.$successCode){
                    let { list, totalRecords } = res.obj.page
                    this.resData = list
                    this.totalCount = totalRecords
                    this.playTotalTime = res.obj.duration
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
            this.getPlayDetail()
        },

        //搜索
        handleSearch(){
            this.params.pageNo = 1
            this.getPlayDetail()
        },

        //导出
		handleDownload() {
			window.open(
				`${document.location.origin}/content/exportPlayStatisticsDetails?${qs.stringify(this.params)}`
			)
		}
    }
}
</script>

<style lang="scss" scoped>
    .play_time_detail{
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