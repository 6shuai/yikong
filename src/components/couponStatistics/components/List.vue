<template>
    <div class="statistics-list">
        <el-form label-width="80px" :inline="true">
			<el-form-item
				label="场所"
				v-if="
					$route.query.source != 'place' &&
					$route.query.source != 'screen'
				"
			>
				<el-select
					v-model="params.placeId"
					filterable
					clearable
					placeholder="请选择场所"
					@change="
						$delete(params, 'screenId');
						search();
						getScreen();
					"
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

			<el-form-item label="屏幕" v-if="$route.query.source != 'screen'">
				<el-select
					v-model="params.screenId"
					filterable
					clearable
					placeholder="请选择屏幕"
					@change="search"
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

			<el-form-item label="游戏" v-if="$route.query.source != 'content'">
				<el-select
					v-model="params.contentId"
					filterable
					clearable=""
					placeholder="请选择游戏"
					@change="search"
				>
					<el-option
						v-for="item in gameData"
						:key="item.id"
						:label="item.displayName"
						:value="item.id"
					>
					</el-option>
				</el-select>
			</el-form-item>

			<el-form-item label="优惠券">
				<el-select
					v-model="params.couponDefinitionId"
					clearable
					placeholder="请选择优惠券"
					@change="search"
					@clear="$delete(params, 'couponDefinitionId')"
				>
					<el-option
						v-for="item in couponData"
						:key="item.id"
						:label="item.displayName" 
						:value="item.id"
					>
					</el-option>
				</el-select>
			</el-form-item>

			<el-form-item label="状态">
				<el-select
					v-model="params.state"
					clearable
					placeholder="请选择优惠券状态"
					@clear="$delete(params, 'state')"
					@change="search"
					class="mb20"
				>
					<el-option
						v-for="item in [
							{ id: 0, name: '未核销' },
							{ id: 1, name: '已核销' },
							{ id: 2, name: '已过期' },
						]"
						:key="item.id"
						:label="item.name"
						:value="item.id"
					>
					</el-option>
				</el-select>
			</el-form-item>

			<el-form-item label="时间范围">
				<el-date-picker
					@change="search"
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
		</el-form>

		<div class="statisics-tag">
			<el-tag type="primary">发券量: {{ couponInfo.couponCount }}</el-tag>
			<el-tag type="primary">核销量: {{ couponInfo.writeOffCount }}</el-tag>
			<el-tag type="primary">核销率: {{ couponInfo.writeOffRate}}</el-tag>

			<el-button
				:disabled="!resData.length"
				type="primary"
				size="small"
				icon="el-icon-download"
				@click="download"
				>导出</el-button
			>
		</div>
		<el-table
			class="mb20"
			v-loading="tableLoading"
			stripe
			size="small"
			:data="resData"
			row-key="id"
			border
		>
			<el-table-column
				prop="collectionTime"
				label="发券时间"
				min-width="80"
			></el-table-column>
			<el-table-column
				prop="couponCount"
				label="发券量"
				min-width="80"
			></el-table-column>
			<el-table-column
				prop="writeOffCount"
				label="核销量"
				min-width="80"
			></el-table-column>
			<el-table-column
				prop="writeOffRate"
				label="核销率"
				min-width="80"
			></el-table-column>
			<el-table-column label="详情" width="110">
				<template slot-scope="scope">
					<el-button
						size="mini"
						type="primary"
						@click="handleDetail(scope.row)"
					>
						查看详情
					</el-button>
				</template>
			</el-table-column>
		</el-table>

		<el-pagination
			background
			layout="total, prev, pager, next, sizes"
			:page-sizes="[48, 80, 100]"
			:page-size="Number(params.pageSize)"
			:current-page="Number(params.pageNo)"
			@size-change="handleSizeChange"
			@current-change="handleCurrentChange"
			:total="totalCount"
		>
		</el-pagination>

		<!-- 统计数据 详情 -->
		<statistics-detail ref="statisticsDetail"></statistics-detail>
    </div>
</template>

<script>
import qs from "qs";
import StatisticsDetail from "./StatisticsDetail";

import {
	placeGameList,
	placeScreenList,
	placeCouponStatistics,
	placeCouponStatisticsDetail,
} from "@/api/place";
import {
	screenGameList,
	screenCouponStatistics,
	screenCouponStatisticsDetail,
} from "@/api/screen";
import {
	contentPlaceList,
	contentCouponStatistics,
	contentCouponStatisticsDetail,
} from "@/api/content";
import {
	couponStatistics,
	couponStatisticsDetail,
	couponStatisticsDetailCouponList
} from "@/api/activity";

export default {
	data() {
		return {
			params: {
				pageNo: 1,
				pageSize: 48,
			},
			datePicker: [],
			placeData: [], //场所列表
			screenData: [], //屏幕列表
			gameData: [], //游戏列表
			tableLoading: false,
			resData: [],
			totalCount: 0,
			api: {},
			couponData: [],     //优惠券列表
			couponInfo: {},     //优惠券汇总
		};
	},
	created() {
		this.params = {
			...this.params,
			placeId: this.$route.query.placeId,
			screenId: this.$route.query.screenId,
			contentId: this.$route.query.contentId,
			promotionId: this.$route.query.promotionId,
		};

		let PlaceList = undefined;
		let ScreenList = undefined;
		let GameList = undefined;
		let StatisticsList = undefined;
		let StatisticsDetail = undefined;

		switch (this.$route.query.source) {
			case "place":
				ScreenList = placeScreenList;
				GameList = placeGameList;
				StatisticsList = placeCouponStatistics;
				StatisticsDetail = placeCouponStatisticsDetail;
				break;
			case "screen":
				GameList = screenGameList;
				StatisticsList = screenCouponStatistics;
				StatisticsDetail = screenCouponStatisticsDetail;
				break;
			case "content":
				PlaceList = contentPlaceList;
				ScreenList = placeScreenList;
				StatisticsList = contentCouponStatistics;
				StatisticsDetail = contentCouponStatisticsDetail;
				break;
			case "activity":
				PlaceList = contentPlaceList;
				ScreenList = placeScreenList;
				GameList = placeGameList;
				StatisticsList = couponStatistics;
				StatisticsDetail = couponStatisticsDetail;
				break;
			default:
				break;
		}

		this.api = {
			PlaceList,
			ScreenList,
			GameList,
			StatisticsList,
			StatisticsDetail,
		};

		this.init();
		if (
			this.$route.query.source != "place" &&
			this.$route.query.source != "screen"
		)
			this.getPlaceList();
		if (this.$route.query.source != "screen") this.getScreen();
		if (this.$route.query.source != "content") this.getGameList();
	},
	methods: {
		init() {
			this.tableLoading = true;
			if (!this.params.placeId) delete this.params.placeId;
			if (!this.params.screenId) delete this.params.screenId;
			if (!this.params.contentId) delete this.params.contentId;
			if (!this.params.promotionId) delete this.params.promotionId;

			this.getCouponList(this.params)

			this.api.StatisticsList(this.params).then((res) => {
				this.tableLoading = false;

				if (res.code === this.$successCode) {
					let { list, totalRecords } = res.obj.page;
					this.resData = list;
					this.totalCount = totalRecords;

					let { couponCount, writeOffCount, writeOffRate } = res.obj.couponCount;
					this.couponInfo = {
						couponCount,
						writeOffCount,
						writeOffRate
					}
				}
			});
		},

		//场所列表
		getPlaceList() {
			this.api.PlaceList().then((res) => {
				this.placeData = res.obj;
			});
		},

		//屏幕列表
		getScreen(placeId) {
			let data = {
				placeId: this.params.placeId || this.$route.query.placeId,
			};
			this.api.ScreenList(data).then((res) => {
				this.screenData = res.obj;
			});
		},

		//游戏列表
		getGameList() {
			this.api.GameList().then((res) => {
				this.gameData = res.obj;
			});
		},

		//查看详情
		handleDetail(row) {
			this.$refs.statisticsDetail.showDialog(
				{
					collectionTime: row.collectionTime,
					placeId: this.params.placeId,
					screenId: this.params.screenId,
					contentId: this.params.contentId,
					couponDefinitionId: this.params.couponDefinitionId,
					promotionId: this.$route.query.promotionId,
				},
				this.api.StatisticsDetail,
				this.params.state
			);
		},

		//搜索
		search() {
			this.params.pageNo = 1;
			this.params.startTime = this.datePicker ? this.datePicker[0] : "";
			this.params.endTime = this.datePicker ? this.datePicker[1] : "";
			this.init();
		},

		//分页
		handleCurrentChange(page) {
			this.params.pageNo = page;
			this.init();
		},

		//每页多少条
		handleSizeChange(size) {
			this.params.pageSize = size;
			this.init();
		},

		//获取优惠券列表
        getCouponList(data){
            couponStatisticsDetailCouponList(data).then(res => {
                if(res.code === this.$successCode){
                    this.couponData = res.obj;
                }
            })
        },

		//导出
		download() {
			window.open(
				`${document.location.origin}/promotion/exportCoupon?${qs.stringify(this.params)}`
			);
		},
	},
	components: {
		StatisticsDetail
	},
};
</script>

<style lang="scss">
.statistics-list {
	.statisics-tag{
		text-align: right;
		margin-bottom: 10px;

		.el-tag{
			margin-left: 5px;
		}

		.el-button{
			margin-left: 20px;
		}
	}
}
</style>