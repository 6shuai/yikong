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

		<div class="statistics-tool">
			<el-button
				:disabled="!resData.length"
				class="right-btn"
				plain
				type="primary"
				size="small"
				icon="el-icon-upload2"
				@click="download"
				>导出</el-button
			>
			<el-button
				:disabled="!resData.length"
				class="right-btn"
				plain
				type="primary"
				size="small"
				icon="el-icon-upload2"
				@click="downloadPlayAwardDetail"
				>导出玩家奖励详情</el-button
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
				prop="awardTime"
				label="时间段"
				min-width="80"
			></el-table-column>
			<el-table-column prop="gameCount" label="游戏人数" min-width="80">
			</el-table-column>
			<el-table-column
				prop="awardCount"
				label="受益人数"
				min-width="80"
			></el-table-column>
			<el-table-column
				prop="avgAward"
				label="人均收益"
				min-width="80"
			></el-table-column>
			<el-table-column
				prop="sumAward"
				label="发钱总额"
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
	placeAwardStatistics,
	placeAwardStatisticsDetail,
} from "@/api/place";
import {
	screenGameList,
	screenAwardStatistics,
	screenAwardStatisticsDetail,
} from "@/api/screen";
import {
	contentPlaceList,
	contentAwardStatistics,
	contentAwardStatisticsDetail,
} from "@/api/content";

export default {
	data() {
		return {
			params: {
				pageNo: 1,
				pageSize: 48,
                viewByDay: 1
			},
			datePicker: [],
			placeData: [], // 场所列表
			screenData: [], // 屏幕列表
			gameData: [], // 游戏列表
			tableLoading: false,
			resData: [],
			totalCount: 0,
			api: {},
		};
	},
	created() {
		this.params = {
			...this.params,
			placeId: this.$route.query.placeId,
			screenId: this.$route.query.screenId,
			contentId: this.$route.query.contentId,
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
				StatisticsList = placeAwardStatistics;
				StatisticsDetail = placeAwardStatisticsDetail;
				break;
			case "screen":
				GameList = screenGameList;
				StatisticsList = screenAwardStatistics;
				StatisticsDetail = screenAwardStatisticsDetail;
				break;
			case "content":
				PlaceList = contentPlaceList;
				ScreenList = placeScreenList;
				StatisticsList = contentAwardStatistics;
				StatisticsDetail = contentAwardStatisticsDetail;
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
			this.api.StatisticsList(this.params).then((res) => {
				this.tableLoading = false;
				if (res.code === this.$successCode) {
					let { list, totalRecords } = res.obj;
					this.resData = list;
					this.totalCount = totalRecords;
				}
			});
		},

		// 场所列表
		getPlaceList() {
			this.api.PlaceList().then((res) => {
				this.placeData = res.obj;
			});
		},

		// 屏幕列表
		getScreen(placeId) {
			let data = {
				placeId: this.params.placeId || this.$route.query.placeId,
			};
			this.api.ScreenList(data).then((res) => {
				this.screenData = res.obj;
			});
		},

		// 游戏列表
		getGameList() {
			this.api.GameList().then((res) => {
				this.gameData = res.obj;
			});
		},

		// 查看详情
		handleDetail(row) {
			this.$refs.statisticsDetail.showDialog(
				{
					awardTime: row.awardTime,
					placeId: this.params.placeId,
					screenId: this.params.screenId,
					contentId: this.params.contentId
				},
				this.api.StatisticsDetail
			);
		},

		// 搜索
		search() {
			this.params.pageNo = 1;
			this.params.startTime = this.datePicker ? this.datePicker[0] : "";
			this.params.endTime = this.datePicker ? this.datePicker[1] : "";
			this.init();
		},

		// 分页
		handleCurrentChange(page) {
			this.params.pageNo = page;
			this.init();
		},

		// 每页多少条
		handleSizeChange(size) {
			this.params.pageSize = size;
			this.init();
		},

		// 导出
		download() {
			window.open(
				`${document.location.origin}/${
					this.$route.query.source
				}/exportAwardCash?${qs.stringify(this.params)}`
			);
		},

		// 导出玩家 游戏奖励详情
		downloadPlayAwardDetail(){
			window.open(
				`${document.location.origin}/${
					this.$route.query.source
				}/exportAwardCashDetail?${qs.stringify(this.params)}`
			);
		}
	},
	components: {
		StatisticsDetail,
	},
};
</script>

<style lang="scss">
.statistics-list {
	.statistics-tool {
		text-align: right;
		margin-bottom: 10px;
	}
}
</style>