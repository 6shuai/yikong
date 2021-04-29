<template>
	<div class="statistics-list keep-statistics">
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
					value-format="yyyy-MM-dd"
					range-separator="至"
					start-placeholder="开始日期"
					end-placeholder="结束日期"
				>
				</el-date-picker>
			</el-form-item>
		</el-form>

		<el-table
			class="mb20"
			v-loading="tableLoading"
			stripe
			size="small"
			:data="resData"
			row-key="id"
			border
			:summary-method="getSummaries"
			show-summary
		>
			<el-table-column
				min-width="120"
			>
                <template slot-scope="scope">
                    <div>{{ scope.row.day }} 新增去重</div>
                </template>
            </el-table-column>
			<el-table-column
                v-for="(item, index) in resData"
                :key="index"
				:label="item.day"
				min-width="120"
			>
                <template slot-scope="scope">
                    <div v-if="item.keeps && item.keeps.length">{{ item.keeps[scope.$index] }}</div>
                    <div ref="hight" v-if="scope.$index == index">{{ item.new || 0 }}</div>
                </template>
            </el-table-column>
		</el-table>
		
		<el-tag effect="dark">复玩率: {{ (replayRate * 100).toFixed(2) }} %</el-tag>

	</div>
</template>

<script>
import {
	placeGameList,
	placeScreenList,
	placePlayerKeepData,
} from "@/api/place";
import {
	screenGameList,
	screenPlayerKeepData,
} from "@/api/screen";
import {
	contentPlaceList,
	contentScreenList,
	contentPlayerKeepData,
} from "@/api/content";

export default {
	data() {
		return {
			params: {
				pageNo: 1,
				pageSize: 48
			},
			datePicker: [],
			placeData: [], //场所列表
			screenData: [], //屏幕列表
			gameData: [], //游戏列表
			tableLoading: false,
			resData: [],
			replayRate: '',
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

		switch (this.$route.query.source) {
			case "place":
				ScreenList = placeScreenList;
				GameList = placeGameList;
				StatisticsList = placePlayerKeepData;
				break;
			case "screen":
				GameList = screenGameList;
				StatisticsList = screenPlayerKeepData;
				break;
			case "content":
				PlaceList = contentPlaceList;
				ScreenList = contentScreenList;
				StatisticsList = contentPlayerKeepData;
				break;
			default:
				break;
		}

		this.api = {
			PlaceList,
			ScreenList,
			GameList,
			StatisticsList,
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

			this.resData = [];
			this.api.StatisticsList(this.params).then((res) => {
				this.tableLoading = false;
				if (res.code === this.$successCode) {
					if(!res.obj) return
					let { playerKeep, replayRate } = res.obj;
					this.resData = playerKeep;
					this.replayRate = replayRate;

					this.$nextTick(() => {
						this.$refs.hight.forEach(item => {
							item.parentElement.parentElement.style.background = "#ffc7c7";
						})
					})
				}
			});
		},

		//合计行 数据
		getSummaries(){
			let sums = ['参与人数'];
			this.resData.forEach(item => {
				sums.push(item.total);
			})

			return sums
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

		//搜索
		search() {
			this.params.pageNo = 1;
			this.params.startTime = this.datePicker ? this.datePicker[0] + ' 00:00:00' : '';
			this.params.endTime = this.datePicker ? this.datePicker[1] + ' 00:00:00'  : '';
			this.init();
		}
	},
};
</script>

<style lang="scss" scope>
.statistics-list {
	.statistics-tool {
		text-align: right;
		margin-bottom: 10px;
	}
}
</style>