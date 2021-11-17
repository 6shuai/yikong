<template>
	<el-drawer
		class="add-pond-drawer"
		:show-close="true"
		:title="pondParams.id ? '编辑奖池' : '添加奖池'"
		size="700px"
		:visible.sync="drawer"
	>
		<div class="add-pond-wrap">
			<el-scrollbar>
				<el-form
					label-width="110px"
					ref="addPondForm"
					:model="pondParams"
					:rules="pondRules"
				>
					<el-form-item label="奖池名称" prop="displayName">
						<el-input
							v-model="pondParams.displayName"
							placeholder="奖池名称"
						></el-input>
					</el-form-item>
					<el-form-item label="奖池描述">
						<el-input
							type="textarea"
							:rows="3"
							v-model="pondParams.description"
							placeholder="奖池描述"
						></el-input>
					</el-form-item>
					<el-form-item label="奖池类型" prop="poolType">
						<el-select
							v-model="pondParams.poolType"
							filterable
							placeholder="请选择奖池类型"
						>
							<el-option
								v-for="item in pondTypeData"
								:key="item.id"
								:label="item.displayName"
								:value="item.id"
							>
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="发放规则" prop="pickSequence">
						<el-select
							v-model="pondParams.pickSequence"
							filterable
							placeholder="请选择发放规则"
						>
							<el-option
								v-for="item in ruleData"
								:key="item.id"
								:label="item.displayName"
								:value="item.id"
							>
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="单次发放数量" prop="awardCount">
						<el-input-number
							:min="1"
							v-model="pondParams.awardCount"
							controls-position="right"
							placeholder="单次发放数量"
						></el-input-number>
					</el-form-item>
					<el-form-item label="允许重复" prop="duplicate">
						<el-switch
							:active-value="1"
							:inactive-value="0"
							v-model="pondParams.duplicate"
						></el-switch>
					</el-form-item>

					<el-divider content-position="left" v-if="pondParams.id"
						>发奖条件</el-divider
					>
					<el-form-item v-if="pondParams.id" prop="condition">
						<el-button
							v-if="detailData.addAwardCondition"
							type="primary"
							size="small"
							plain
							@click="
								$refs.addCondition.showDialog({
									poolId: pondParams.id,
								})
							"
							>添加发奖条件</el-button
						>

						<div
							class="condition-warp"
							v-loading="conditionLoading"
						>
							<el-card
								v-for="(item, index) in conditionData"
								:key="item.id"
							>
								<div class="title overflow">
									{{ item.readableString }}
								</div>
								<div class="operation">
									<el-link
										v-if="detailData.editAwardCondition"
										type="primary"
										@click="
											$refs.addCondition.showDialog(item)
										"
										>编辑</el-link
									>

									<el-popover
										v-if="detailData.deleteAwardCondition"
										placement="top"
										:ref="'condition-' + index"
										width="200"
									>
										<p>此操作将删除此条件, 是否继续?</p>
										<div
											style="text-align: right; margin: 0"
										>
											<el-button
												size="mini"
												type="text"
												@click="
													$refs[
														'condition-' + index
													][0].doClose()
												"
												>取消</el-button
											>
											<el-button
												type="primary"
												size="mini"
												:loading="deleteLoading"
												@click="
													handleDeleteCondition(
														item.id,
														index
													)
												"
												>确定</el-button
											>
										</div>
										<el-link type="danger" slot="reference"
											>删除</el-link
										>
									</el-popover>
								</div>
							</el-card>
						</div>
					</el-form-item>

					<el-divider content-position="left" v-if="pondParams.id"
						>奖品内容</el-divider
					>
					<el-form-item v-if="pondParams.id">
						<el-button
							v-if="detailData.addAwardItem"
							type="primary"
							size="small"
							plain
							@click="
								$refs.addPrize.showDialog(
									{
										poolId: pondParams.id,
									},
									pondParams.poolType,
									detailData.beginTime,
									detailData.endTime,
									promotionId
								)
							"
							>添加</el-button
						>
						<el-button type="primary" size="small" plain disabled
							>导入</el-button
						>
					</el-form-item>
				</el-form>

				<div
					v-loading="prizeLoading"
					v-if="pondParams.id"
					class="prize-wrap"
				>
					<el-card
						class="item"
						v-for="(item, index) in prizeData"
						:key="item.id"
					>
						<div class="content">
							<p class="title">{{ item.currencyName }}</p>
							<p class="desc">
								<span
									>库存: {{ item.residue }} /
									{{ item.total }}</span
								>
								<el-divider direction="vertical"></el-divider>
								<span
									>单次上限：{{ item.awardCountLimit }}</span
								>
								<el-divider direction="vertical"></el-divider>
								<span
									>概率：{{
										item.rate ? item.rate : 0
									}}%</span
								>
								<el-divider direction="vertical"></el-divider>
								<span
									>每日发放量：{{
										item.dayLimit ? item.dayLimit : 0
									}}</span
								>
							</p>
						</div>
						<div class="operation">
							<span
								class="edit"
								@click="
									$refs.addPrize.showDialog(
										item,
										pondParams.poolType,
										detailData.beginTime,
										detailData.endTime,
										promotionId
									)
								"
								>编辑</span
							>
							<span
								class="edit"
								@click="$refs.addGetLimit.showGetLimit(item.id)"
								>领取限制</span
							>
							<span
								class="delete"
							>
								<el-popover
									placement="top"
									:ref="'prize-' + item.id"
									width="200"
								>
									<p>
										此操作将删除【{{ item.currencyName }}】,
										是否继续?
									</p>
									<div style="text-align: right; margin: 0">
										<el-button
											size="mini"
											type="text"
											@click="
												$refs[
													'prize-' + item.id
												][0].doClose()
											"
											>取消</el-button
										>
										<el-button
											type="primary"
											size="mini"
											:loading="deleteLoading"
											@click="
												handleDeletePrize(
													item.id,
													index
												)
											"
											>确定</el-button
										>
									</div>
									<span slot="reference">删除</span>
								</el-popover>
							</span>
						</div>
					</el-card>
				</div>
			</el-scrollbar>

			<div class="footer-btn">
				<el-button @click="drawer = false">取 消</el-button>
				<el-button
					type="primary"
					:loading="btnLoading"
					@click="handleSavePond"
					>提交</el-button
				>
			</div>
		</div>

		<!-- 添加 或 修改 奖品 -->
		<add-prize
			ref="addPrize"
			@prizeCreatedSuccess="getPrizeList"
		></add-prize>

		<!-- 添加 或 编辑 条件 -->
		<add-condition
			ref="addCondition"
			@addConditionSuccess="addConditionSuccess"
		></add-condition>

		<!-- 添加 或 编辑 领取限制 -->
		<add-pond-get-limit ref="addGetLimit"></add-pond-get-limit>
	</el-drawer>
</template>

<script>
import {
	activityPondCreated,
	activityPrizeList,
	activityPrizeDelete,
	activityConditionList,
	activityConditionDelete,
	activityCurrencyTypeList,
} from "@/api/activity";
import AddPrize from "./AddPrize";
import AddCondition from "./AddCondition";
import AddPondGetLimit from "./PondGetLimit";

export default {
	props: ["detailData"],
	data() {
		return {
			drawer: false,
			pondParams: {},
			btnLoading: false,
			deleteLoading: false,
			ruleData: [
				{
					id: 1,
					displayName: "随机",
				},
				{
					id: 2,
					displayName: "顺序",
				},
			],
			pondRules: {
				displayName: [
					{
						required: true,
						trigger: "blur",
						message: "请输入奖池名称~",
					},
				],
				poolType: [
					{
						required: true,
						trigger: "blur",
						message: "请选择奖池类型~",
					},
				],
				pickSequence: [
					{
						required: true,
						trigger: "blur",
						message: "请选择发放规则~",
					},
				],
				awardCount: [
					{
						required: true,
						trigger: "blur",
						message: "请输入单次发放数量~",
					},
				],
				duplicate: [
					{
						required: true,
						trigger: "blur",
						message: "请选择是否重复~",
					},
				],
			},
			prizeData: [], //奖品内容
			prizeLoading: false,
			conditionData: [], //条件列表
			conditionLoading: false,
			pondTypeData: [], //奖池类型
			promotionId: null, //活动id
		};
	},
	methods: {
		showAddPond(data, activityId) {
			data = data ? JSON.parse(JSON.stringify(data)) : {};
			this.promotionId = activityId;
			this.pondParams = {
				...data,
				promotionId: activityId,
				duplicate: this.pondParams.duplicate ? 1 : 0,
			};
			this.drawer = true;

			if (this.pondParams.id) {
				this.getConditionList();
				this.getPrizeList();
			}

			this.$nextTick(() => {
				this.$refs["addPondForm"].clearValidate();
				this.getCurrencyTypeList();
			});
		},

		//根据奖池id 查询 奖品列表
		getPrizeList() {
			this.prizeLoading = true;
			activityPrizeList({ poolId: this.pondParams.id }).then((res) => {
				this.prizeLoading = false;
				if (res.code === this.$successCode) {
					this.prizeData = res.obj;
				}
			});
		},

		//添加奖池
		handleSavePond() {
			this.$refs.addPondForm.validate((valid) => {
				if (valid) {
					this.btnLoading = true;
					activityPondCreated(this.pondParams).then((res) => {
						this.btnLoading = false;
						if (res.code === this.$successCode) {
							this.$message.success(
								this.pondParams.id ? "编辑成功~" : "添加成功~"
							);
							this.drawer = false;
							this.$emit("pondCreatedSuccess");
						}
					});
				}
			});
		},

		//删除奖品
		handleDeletePrize(id, index) {
			let data = `?id=${id}`;
			this.deleteLoading = true;
			activityPrizeDelete(data).then((res) => {
				this.deleteLoading = false;
				if (res.code === this.$successCode) {
					this.$message.success("删除成功~");
					this.prizeData.splice(index, 1);
					this.$refs["prize-" + id][0].doClose();
				}
			});
		},

		//添加条件
		addConditionSuccess(data) {
			this.getConditionList();
		},

		//删除条件
		handleDeleteCondition(id, index) {
			if (!id) {
				this.deleteConditionResult(index);
				return;
			}
			this.deleteLoading = true;
			let data = `?id=${id}`;
			activityConditionDelete(data).then((res) => {
				this.deleteLoading = false;
				if (res.code === this.$successCode) {
					this.deleteConditionResult(index);
				}
			});
		},

		//条件删除成功
		deleteConditionResult(index) {
			this.$message.success("删除成功~");
			this.conditionData.splice(index, 1);
			this.$refs["condition-" + index][0].doClose();
		},

		//发奖条件列表
		getConditionList() {
			let data = { poolId: this.pondParams.id };
			this.conditionLoading = true;
			activityConditionList(data).then((res) => {
				this.conditionLoading = false;
				if (res.code === this.$successCode) {
					this.conditionData = res.obj;
				}
			});
		},

		//奖池类型列表
		getCurrencyTypeList() {
			activityCurrencyTypeList().then((res) => {
				this.pondTypeData = res.obj;
			});
		},
	},
	components: {
		AddPrize,
		AddCondition,
		AddPondGetLimit,
	},
};
</script>
<style lang="scss" scope>
.add-pond-drawer {
	.el-drawer__body {
		height: calc(100% - 80px);
	}
	.add-pond-wrap {
		padding: 0 10px 50px 10px;
		height: 100%;
		.el-scrollbar {
			height: 100%;
			.el-scrollbar__wrap {
				overflow-x: hidden;
			}
		}

		.prize-wrap {
			margin-left: 50px;
			display: flex;
			flex-wrap: wrap;
			position: relative;
			padding-bottom: 40px;

			.item {
				width: 500px;
				margin: 5px;
				background: #222831;
				color: #fff;

				.el-card__body {
					padding: 5px 10px;
					p {
						line-height: 28px;
						&.title {
							overflow: hidden;
							text-overflow: ellipsis;
							white-space: nowrap;
						}
						&.desc {
							font-size: 13px;
							color: #999;
							display: flex;
							justify-content: space-around;
							align-items: center;
						}
					}
					.operation {
						margin-top: 5px;
						border-top: 1px solid #e5e5e5;
						display: flex;
						padding: 10px;
						& > span {
							flex: 1;
							text-align: center;
							font-size: 13px;
							cursor: pointer;
							&.edit {
								border-right: 1px solid #e5e5e5;
								&:hover {
									color: #53d397;
								}
							}
							&.delete:hover {
								color: #ef3f61;
							}
						}
					}
				}
			}
		}

		.footer-btn {
			position: fixed;
			bottom: 10px;
			right: 10px;
			.el-button {
				padding: 10px 50px;
			}
		}
	}

	.condition-warp {
		margin-top: 10px;
		.el-card {
			margin-bottom: 10px;
			.el-card__body {
				padding: 5px 10px;
				.title {
					width: 450px;
					display: inline-block;
					vertical-align: top;
				}
				.operation {
					width: 80px;
					display: inline-block;
					.el-link {
						line-height: 1;
						&:first-child {
							margin-right: 5px;
						}
					}
				}
			}
		}
	}
}
</style>
