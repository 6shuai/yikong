<template>
	<!-- 导入时间轴 -->
	<el-dialog
		width="550px"
		title="选择要导入的时间轴"
		:visible.sync="showImportList"
		:close-on-click-modal="false"
		:close-on-press-escape="false"
		@close="showImportList = false"
		append-to-body
	>
		<div
			class="clearfix import-timeline-list timeline-wrap"
			v-loading="dataLoading"
		>
			<el-input
				placeholder="时间轴名称"
				clearable
				v-model="params.name"
				@input="init"
			></el-input>
			<!-- <el-card class="box-card timeline-list" :body-style="{ padding: '0px' }" v-for="(item, index) in resData" :key="index">
                <div class="timeline-info">
                    <div class="title">{{item.displayName}}</div>
                    <div class="import add-btn" v-if="!item.hide" @click="hadleImport(item.id)"><i class="el-icon-download"></i>导入</div>
                </div>
            </el-card> -->

			<el-collapse
				accordion
				class="mt10"
				v-model="activeNames"
				@change="handleChange"
			>
				<el-collapse-item
					v-for="(item, index) in resData"
					:key="index"
					:title="item.displayName"
					:name="item.id"
				>
					<div 
						class="timeline-tree"
						v-loading="treeLoading"
						v-if="activeNames == item.id">
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

				</el-collapse-item>
			</el-collapse>

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
		</div>

		<span slot="footer" class="dialog-footer">
			<el-button @click="showImportList = false">取 消</el-button>
			<el-button type="primary" :loading="btnLoading" @click="hadleImport"
				>确 定</el-button
			>
		</span>
	</el-dialog>
</template>

<script>
import {
	timelineContainerList,
	importTimelineContainer,
	timelineStageData,
} from "@/api/timeline";
export default {
	inject: ["reload"],
	data() {
		return {
			showImportList: false,
			dataLoading: false,
			resData: [],
			params: {
				pageNo: 1,
				pageSize: 40,
			},
			totalCount: 0,
			activeNames: null, //选择要展开的时间轴
			timelineData: [], //时间轴阶段数据
			treeLoading: false, //阶段数据加载中
			defaultProps: {
				children: "children",
				label: "label",
			},
			btnLoading: false, //提交按钮loading
			isCoverContainer: 0
		};
	},
	methods: {
		//加载时间轴列表
		init() {
			this.showImportList = true;
			this.dataLoading = true;
			timelineContainerList(this.params).then((res) => {
				this.dataLoading = false;
				if (res.code === this.$successCode) {
					let { list, totalRecords } = res.obj;
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

		//打开折叠栏
		handleChange(e) {
			if (this.activeNames) {
				this.isCoverContainer = 0;
				this.treeLoading = true;
				this.timelineData = [];
				timelineStageData(e).then((res) => {
					this.treeLoading = false;
					let obj = res.obj;
					let cutIn = this.findRegionsId(obj.cutIn);
					let rotation = this.findRegionsId(obj.rotation,);

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

					console.log(this.timelineData);
				});
			}
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

		//选中时间轴导入
		hadleImport() {
			//id     当前时间轴容器ID
			//copyId  被复制时间轴容器ID
			let treeKeys = this.$refs.tree[0].getCheckedKeys();
			let ids = treeKeys.filter((item) => {
				return Number(item);
			});

			if(!ids.length){
				this.$message.warning('还没选择要导入的时间轴呢~')
				return
			}

			this.$confirm(
				`确定要将选中项导入到当前时间轴?`,
				"提示",
				{
					confirmButtonText: "确定",
					cancelButtonText: "取消",
					type: "warning",
				}
			)
			.then(() => {
				this.btnLoading = true;
				let data = `?id=${this.$route.params.id}&copyId=${this.activeNames}&regionIds=${ids}&isCoverContainer=${this.isCoverContainer}`;
				importTimelineContainer(data).then(res => {
					this.btnLoading = false;
					if(res.code === this.$successCode){
						this.$message.success({
							message: '时间轴导入成功~',
							duration: 1000,
							onClose: () => {
								this.reload(); //刷新页面
							}
						});
					}
				})
			})
			.catch(() => {});
		},
	},
};
</script>

<style lang="scss" scope>
@import "../../../styles/variables.scss";
.import-timeline-list {
	&.timeline-wrap {
		height: 100%;
		.timeline-list {
			width: 100%;
			height: 50px;
			line-height: 50px;
			margin: 10px 0;
			cursor: pointer;
		}
	}
}

.timeline-tree{
	background: #f5fdfd;
	padding-top: 20px;;
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