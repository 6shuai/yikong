<template>
	<!-- 把当前时间轴复制到其他时间轴 -->
	<el-dialog
		width="1000px"
		title="复制到其他时间轴"
		:visible.sync="showImportList"
		:close-on-click-modal="false"
		:close-on-press-escape="false"
		@close="showImportList = false"
		append-to-body
	>
		<div
			class="clearfix import-timeline-list timeline-wrap"
		>

            <el-row :gutter="40">
                <el-col :span="12">
                    <div class="timeline-tree">
						<p>
							<el-checkbox 
								:true-label="1"
								:false-label="0"
								v-model="isCoverContainer">是否覆盖时间轴容器内容</el-checkbox>
						</p>
						<el-tree
							ref="tree"
							default-expand-all
							:data="timelineData"
							show-checkbox
							node-key="id"
							:props="defaultProps"
						>
						</el-tree>
					</div>
                </el-col>
                <el-col :span="12" v-loading="dataLoading">
                    <el-input
                        placeholder="时间轴名称"
                        clearable
                        v-model="params.name"
                        @input="handleSearch"
                    ></el-input>

                    <el-checkbox-group 
                        v-model="targetIds">
                        <el-checkbox 
                            class="box-card screen-list"
                            v-for="(item, index) in resData"
                            :key="index"
                            :label="item.label" 
                            :disabled="item.id == $route.params.id"
                            border
                        >{{item.displayName}}</el-checkbox>
                    </el-checkbox-group>
                    

                    <!-- 分页 -->
                    <el-pagination
                        v-if="resData.length"
                        class="mt20"
                        background
                        layout="total, prev, pager, next"
                        :page-size="params.pageSize"
                        :current-page="Number(params.pageNo)"
                        @current-change="handleCurrentChange"
                        :total="totalCount"
                    >
                    </el-pagination>
                </el-col>
            </el-row>

		</div>

		<span slot="footer" class="dialog-footer">
			<el-button @click="showImportList = false">取 消</el-button>
			<el-button type="primary" @click="handleConfirm"
				>确 定</el-button
			>
		</span>

		<el-dialog
			title="确认要复制到以下时间轴"
			:visible.sync="showConfirm"
			:close-on-click-modal="false"
			:close-on-press-escape="false"
			:show-close="false"
			append-to-body
		>
			<el-tag
				v-for="item in checkedTimeline"
				class="mr20 mb20 bold"
				:key="item"
				effect="plain">
				{{ item }}
			</el-tag>

			<span slot="footer" class="dialog-footer">
				<el-button @click="showConfirm = false">再想想</el-button>
				<el-button type="primary" :loading="btnLoading" @click="hadleImport"
					>确 定</el-button
				>
			</span>
		</el-dialog>

	</el-dialog>
</template>

<script>
import {
	timelineContainerList,
	copyTimelineContainer,
} from "@/api/timeline";
export default {
	data() {
		return {
			showImportList: false,
			showConfirm: false,
			dataLoading: false,
			resData: [],
			params: {
				pageNo: 1,
				pageSize: 20,
			},
			totalCount: 0,
			targetIds: [],
			timelineData: [], //时间轴阶段数据
			defaultProps: {
				children: "children",
				label: "label",
			},
			btnLoading: false, //提交按钮loading
			isCoverContainer: 0,
			checkedTimeline: [],  //要复制到的时间轴
			checkedIds: [],       //要复制到的时间轴id
			regionIds: [],
		};
	},
	methods: {
        showDialog(r, c) {
            this.init();
            this.isCoverContainer = 0;
            this.timelineData = [];
            this.targetIds = [];

            let rotation = this.findRegionsId(r);
            let cutIn = this.findRegionsId(c);

            if (rotation.length) {
                this.timelineData.push({
                    label: "轮播",
                    children: rotation,
                });
            }

            if (cutIn.length) {
                this.timelineData.push({
                    label: "插播",
                    children: cutIn,
                });
            }
        },

		//加载时间轴列表
		init() {
			this.showImportList = true;
			this.dataLoading = true;
			timelineContainerList(this.params).then((res) => {
				this.dataLoading = false;
				if (res.code === this.$successCode) {
					let { list, totalRecords } = res.obj;
					list.forEach(item => {
						item.label = item.displayName + '@@@@' + item.id
					})
					this.resData = list;
					this.totalCount = totalRecords;
				}
			});
		},

		//分页
		handleCurrentChange(page) {
			this.params.pageNo = page;
			this.init();
		},

		//搜索
		handleSearch() {
			this.params.pageNo = 1;
			this.init();
		},


		//提取阶段中的区域id
		findRegionsId(data) {
			let arr = [];
			data.forEach((item, index) => {
				arr.push({
					id: null,
					label: `第${index + 1}阶段`,
					children: [],
				});

				item.timelineRegions.forEach((children, cindex) => {
					arr[index].children.push({
						id: children.id,
						label: children.displayName,
					});
				});
			});
			return arr;
		},

		handleConfirm() {
			//id     当前时间轴容器ID
			//copyId  被复制时间轴容器ID
			let treeKeys = this.$refs.tree.getCheckedKeys();
			this.regionIds = treeKeys.filter((item) => {
				return Number(item);
			});

			if(!this.regionIds.length){
				this.$message.warning('还没选择要复制的时间轴阶段呢~')
				return
			}else if(!this.targetIds.length){
                this.$message.warning('我要复制到哪个时间轴?')
				return
            }

			this.checkedTimeline = [];
			this.checkedIds = [];

			this.targetIds.forEach(item => {
				this.checkedTimeline.push(item.split('@@@@')[0])
				this.checkedIds.push(item.split('@@@@')[1])
			})

			this.showConfirm = true;
			
			
            
            
		},

		//确定复制
		hadleImport(){
			this.btnLoading = true;
            let data = `?sourceId=${this.$route.params.id}&targetIds=${this.checkedIds}&regionIds=${this.regionIds}&isCoverContainer=${this.isCoverContainer}`;
            copyTimelineContainer(data).then(res => {
                this.btnLoading = false;
                if(res.code === this.$successCode){
                    this.$message.success('操作成功~');
                    this.showConfirm = false;
					this.showImportList = false;
                }
            })
		}
	},
};
</script>

<style lang="scss">
.el-scrollbar__wrap{
    overflow-x: hidden;
}
.import-timeline-list {
	&.timeline-wrap {
		height: 100%;


		.screen-list {
            width: 100%;
            cursor: pointer;
            margin-top:10px;
            
            &.el-checkbox.is-bordered+.el-checkbox.is-bordered{
                margin-left: 0;
            }

            .screen-info {
                display: flex;
                line-height: 50px;

                .title {
                    padding: 0 10px;
                    flex: 1;
                }

                .delete{
                    float: right;
                    width: 80px;
                    color: var(--color-info);
                    &:hover{
                        color: var(--color-danger);
                        text-decoration: underline;
                    }
                    &.add-btn{
                        color: var(--color-success);
                        &:hover{
                            color: #5ee192;
                        }
                    }
                }
            }
            .time{
                line-height: 20px;
                margin-left: 10px;
                color: #999;
                .el-icon-time{
                    margin-right: 5px;
                }
            }
        }
	}
}

.timeline-tree{
	background: #f5fdfd;
	padding: 20px 0;
    border: 1px solid #e5e5e5;
    border-radius: 4px;
	.el-tree {
		background: #f5fdfd;
	}
	&>p{
		padding-left: 24px;
		.el-checkbox__label{
			color: #ff2e63;
		}
	}
}

</style>