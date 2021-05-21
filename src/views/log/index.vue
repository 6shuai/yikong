<template>
	<el-card class="template-card question-wrap" shadow="never">
		<div slot="header" class="clearfix">
			<span>操作日志</span>
        </div>

        <div class="top-operation-wrap">
            <el-input  
                class="mr10"
                clearable
                placeholder="用户名称"
                v-model="params.accountName"
                @input="search"
            ></el-input>

            <el-input  
                class="mr10"
                clearable
                placeholder="操作说明"
                v-model="params.operation"
                @input="search"
            ></el-input>

            <el-date-picker
                v-model="datetime"
                @change="search"
                type="datetimerange"
                format="yyyy-MM-dd HH:mm:ss"
                value-format="yyyy-MM-dd HH:mm:ss"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
            </el-date-picker>
        </div>

		<el-table
			v-loading="tableLoading"
			stripe
			size="small"
			:data="resData"
			style="width: 100%;margin-bottom: 20px;"
			row-key="id"
            border>
            <el-table-column prop="accountName" label="用户名" min-width="50"></el-table-column>
            <el-table-column prop="createTime" label="操作时间" min-width="50">
                <template slot-scope="scope">
                    {{formatTime(scope.row.createTime)}}
                </template>
            </el-table-column>
            <el-table-column prop="ip" label="ip" min-width="50"></el-table-column>
            <el-table-column prop="method" label="方法名" min-width="100"></el-table-column>
            <el-table-column prop="operation" label="操作说明" min-width="100"></el-table-column>
			<el-table-column
				label="操作"
				width="150">
				<template slot-scope="scope">
					<el-button 
						size="mini"
						type="success"
                        @click="dialogVisible=true;logDetails=hasJson(scope.row.params)"
					>
						查看详情
                    </el-button>
				</template>
			</el-table-column>
		</el-table>

		<el-pagination
			background
			layout="total, prev, pager, next, sizes"
			:page-sizes="[40, 80, 100]"
			:current-page="Number(params.pageNo)"
			@size-change="handleSizeChange"
			@current-change="handleCurrentChange"
			:total="totalCount">
        </el-pagination>
        

        <!-- 操作详情 -->
        <el-dialog
            title="详情参数"
            :visible.sync="dialogVisible"
            width="40%">
            <pre style="white-space: pre-wrap!important;
            word-wrap: break-word!important;
            *white-space:normal!important;
            line-height:2">{{logDetails}}
            </pre>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">关 闭</el-button>
            </span>
        </el-dialog>

	</el-card>
</template>

<script>
import { getLogList } from '@/api/log';
import { timeDisposeTool } from '@/mixins';
export default {
    mixins: [timeDisposeTool],
    data(){
        return {
            resData: [],
			params: {
				pageNo: 1,
                pageSize: 40,
			},
			totalCount: 0,                 //总条数
            tableLoading: false,
            datetime: [],
            logDetails: {},                //日志详情
            dialogVisible: false,
        }
    },
    created() {
        this.init();
    },
    methods: {
        init(){
            this.tableLoading = true;
            getLogList(this.params).then(res => {
                this.tableLoading = false;
                if(res.code === this.$successCode){
                    this.resData = res.obj.list;
                    this.totalCount = res.obj.totalRecords;
                }
            })
		},
		
		//启动游戏
		handleStart(id){
            // let data = {
            //     gameId: id,
            //     accountName: this.userInfo.accountName,
            //     accountId: this.userInfo.id
            // }
            // gamesStart(data).then(res => {
            //     if(res.code === this.$successCode){
            //         this.$message.success('启动成功~');
            //     }
            // })
        },
        
        //筛选搜索
        search(){
            this.params = {
                ...this.params,
                pageNo: 1,
                startTime: this.datetime[0],
                endTime: this.datetime[1]
            };
            this.init();
        },

		//页码
        handleCurrentChange(page){
            this.params.pageNo = page;
            this.init();
        },

        //每页多少条
        handleSizeChange(num){
            this.params.pageSize = num;
            this.init();
		},

        hasJson(data){
            let result = data;
            try {
                result = JSON.parse(data) 
            } catch (error) {
                
            }

            return result
        }
    }
}
</script>
