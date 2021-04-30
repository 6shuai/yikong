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
				>
				</el-date-picker>
			</el-form-item>

			<el-form-item label="选择行为">
				<el-radio-group v-model="params.hehavior" @change="init">
					<el-radio-button :label="1">登录统计</el-radio-button>
					<el-radio-button :label="3">开始游戏统计</el-radio-button>
					<el-radio-button :label="2">退出统计</el-radio-button>
				</el-radio-group>
			</el-form-item>

			<el-form-item label="显示区间">
				<el-input-number
					v-model="timeNum"
					controls-position="right"
					@change="loadLine"
					:min="1"
				></el-input-number>
				分钟
			</el-form-item>
		</el-form>
		<div class="game-charts" v-loading="tableLoading">
			<div id="chart" style="width: 100%; height: 500px"></div>
		</div>

		<!-- 统计数据 详情 -->
		<player-statistics-detail
			ref="statisticsDetail"
		></player-statistics-detail>

	</div>
</template>

<script>
import PlayerStatisticsDetail from "../game/StatisticsDetail";

import * as echarts from "echarts";
import {
	placeGameList,
	placeScreenList,
	placeStatisticsDetail,
	placePlayerBehaviralData
} from "@/api/place";
import {
	screenGameList,
	screenStatisticsDetail,
	screenPlayerBehaviralData,
} from "@/api/screen";
import {
	contentPlaceList,
	contentScreenList,
	contentStatisticsDetail,
	contentPlayerBehaviralData,
} from "@/api/content";

export default {
	data() {
		return {
			params: {
				hehavior: 1,
			},
			datePicker: [],
			placeData: [], //场所列表
			screenData: [], //屏幕列表
			gameData: [], //游戏列表
			tableLoading: false,
			resData: [],
			timelineData: [],
			api: {},
			activeName: "",
			timeNum: 5,
			chartText: '登录次数'
		};
	},
	mounted() {
		this.params = {
			...this.params,
			placeId: this.$route.query.placeId,
			screenId: this.$route.query.screenId,
			contentId: this.$route.query.contentId,
		};

		let PlaceList = undefined;
		let ScreenList = undefined;
		let GameList = undefined;
		let PlayerBehaviorList = undefined;
		let StatisticsDetail = undefined;

		switch (this.$route.query.source) {
			case "place":
				ScreenList = placeScreenList;
				GameList = placeGameList;
				PlayerBehaviorList = placePlayerBehaviralData;
				StatisticsDetail = placeStatisticsDetail;

				break;
			case "screen":
				GameList = screenGameList;
				PlayerBehaviorList = screenPlayerBehaviralData;
				StatisticsDetail = screenStatisticsDetail;
				break;
			case "content":
				PlaceList = contentPlaceList;
				ScreenList = contentScreenList;
				PlayerBehaviorList = contentPlayerBehaviralData;
				StatisticsDetail = contentStatisticsDetail;
				break;
			default:
				break;
		}

		this.api = {
			PlaceList,
			ScreenList,
			GameList,
			PlayerBehaviorList,
			StatisticsDetail
		};

		if (
			this.$route.query.source != "place" &&
			this.$route.query.source != "screen"
		)
			this.getPlaceList();
		if (this.$route.query.source != "screen") this.getScreen();
		if (this.$route.query.source != "content") this.getGameList();

		this.init();
	},
	methods: {
		init() {
			this.tableLoading = true;
			if (!this.params.placeId) delete this.params.placeId;
			if (!this.params.screenId) delete this.params.screenId;
			if (!this.params.contentId) delete this.params.contentId;

			switch (this.params.hehavior) {
				case 1:
					this.chartText = '登录次数';
					break;
				case 3:
					this.chartText = '玩游戏次数';
					break;
				case 2:
					this.chartText = '退出次数';
					break;
				default:
					break;
			}

			this.api.PlayerBehaviorList(this.params).then((res) => {
				this.tableLoading = false;
				if (res.code === this.$successCode) {
					this.resData = res.obj;
					this.loadLine();
				}
			});
		},

		timeDifferenceMinute(beginTime, endTime) {
			var begin1 = beginTime.substr(0, 10).split("-");
			var end1 = endTime.substr(0, 10).split("-");
			//将拆分的数组重新组合，并实例成化新的日期对象
			var date1 = new Date(begin1[1] + -+begin1[2] + -+begin1[0]);
			var date2 = new Date(end1[1] + -+end1[2] + -+end1[0]);

			var m = parseInt(Math.abs(date2 - date1) / 1000 / 60);

			var min1 =
				parseInt(beginTime.substr(11, 2)) * 60 +
				parseInt(beginTime.substr(14, 2));
			var min2 =
				parseInt(endTime.substr(11, 2)) * 60 +
				parseInt(endTime.substr(14, 2));

			var n = min2 - min1;
			var minutes = m + n;
			return minutes;
		},

		//折线图
		loadLine() {
			let _this = this;
			let chartDom = document.getElementById("chart");
			let myChart = echarts.init(chartDom);
			let option;
			let resData = this.resData; 
			let date = [];
			let data = [];
			let count = 0;
			let totalCount = 0;
			this.timelineData = [];

			for (let i = 0; i < resData.length; i++) {
				let item = this.deleteTimeDuration(resData[i].occur, false);
				if(!date.length){	
					date.push(item);	
				}else if(this.timeDifferenceMinute(date[date.length-1], item) >= this.timeNum){
					date[date.length-1] = date[date.length-1] + ' - ' + this.findNewTime( date[date.length-1], this.timeNum * 60 );
					date.push(item);
					data.push(count);
					totalCount += count;
					count = 0;
				}
				count += 1;

				if(i == resData.length-1){
					data.push(resData.length - totalCount);
					date[date.length-1] = date[date.length-1] + ' - ' + this.findNewTime( date[date.length-1], this.timeNum * 60 );
				}
	
			}


			option = {
				tooltip: {
					trigger: "axis",
				},
				toolbox: {
                    feature: {
                        dataView: {show: true, readOnly: false},
                        magicType: {show: true, type: ['line', 'bar']},
                        restore: {show: true},
                        saveAsImage: {show: true}
                    }
                },
				xAxis: {
					type: "category",
					boundaryGap: true,
					axisLine: {
						color: "#666669",
						lineStyle: {
							type: "solid",
							color: "#666669", //左边线的颜色
							width: "1", //坐标线的宽度
						},
					},
					name: "显示区间",
					data: date,
					axisPointer: {
                        type: 'shadow'
                    }
				},
				yAxis: {
					name: this.chartText,
					type: "value",
					axisLabel: {
						formatter: "{value} ",
						color: "#666669",
					},
					splitLine: {
						lineStyle: {
							color: "#EEEEF1",
						},
					},
					axisLine: {
						color: "#666669",
						lineStyle: {
							type: "solid",
							color: "#666669", //左边线的颜色
							width: "1", //坐标线的宽度
						},
					},
					boundaryGap: [0, '100%']
				},
				visualMap: {
					show: false,
					dimension: 0,
					pieces: [
						{
							lte: 6,
							color: "#FF4A4A",
						},
						{
							gt: 6,
							lte: 8,
							color: "#FF4A4A",
						},
						{
							gt: 8,
							lte: 14,
							color: "#FF4A4A",
						},
						{
							gt: 14,
							lte: 17,
							color: "#FF4A4A",
						},
						{
							gt: 17,
							color: "#FF4A4A",
						},
					],
				},
				dataZoom: [{
                    type: 'inside',
                    start: 0,
                    end: 100
                }, {
                    start: 0,
                    end: 100
                }],
				series: [
					{
						itemStyle: {
							normal: {
								lineStyle: {
									color: "#FF4A4A",
								},
							},
						},
						name: this.chartText,
						type: "line",
						smooth: true,
						data: data,
					},
				],
			};
			// 使用刚指定的配置项和数据显示图表。
			myChart.setOption(option);

			window.onresize = function () {
				myChart.resize();
			};

			myChart.getZr().off('click');
			myChart.getZr().on('click',params=>{
				const pointInPixel= [params.offsetX, params.offsetY];
				if (myChart.containPixel('grid',pointInPixel)) {
					let xIndex=myChart.convertFromPixel({seriesIndex:0},[params.offsetX, params.offsetY])[0];
					/*事件处理代码书写位置*/
					let startTime = date[xIndex].split(' - ')[0];
					let endTime = date[xIndex].split(' - ')[1];
					_this.$refs.statisticsDetail.showDialog(
						{
							// occur: row.occur,
							placeId: _this.params.placeId,
							screenId: _this.params.screenId,
							contentId: _this.params.contentId,
							startTime,
							endTime,
							hehavior: _this.params.hehavior,
						},
						_this.api.StatisticsDetail
					);
				}
			});

			// //点击事件
			// myChart.on("click", function (params) {
				// console.log(params.dataIndex, _this.timelineData)
				
			// });
		},

		//传入时间  和 时长  返回一个新的时间
		findNewTime(date, duration) {
			let year = date.split(" ")[0];
			let time = date.split(" ")[1];
			let t = time.split(":");
			//小时
			let h = Number(t[0]);
			//分钟
			let m = Number(t[1]);
			//秒
			let s = Number(t[2]);

			//秒转换成分钟  余出来的秒数
			let remainderS = duration % 60;

			if (d > 60) {
				h = h + (d - (d % 60)) / 60;
				d = d % 60;
			} else if (d < -60) {
				h = h - (Math.abs(d) - (d % 60)) / 60;
				d = d % 60;
			}

			//秒数转为 分钟
			let d = (duration - remainderS) / 60;
			if (s + remainderS >= 60) {
				s = s + remainderS - 60;
				m = m + 1;
			} else if (s + remainderS < 0) {
				s = 60 - Math.abs(s + remainderS);
				m = m - 1;
			} else {
				s = s + remainderS;
			}
			if (m + d >= 60) {
				m = m + d - 60;
				h = h + 1;
			} else if (m + d < 0) {
				m = 60 - Math.abs(m + d);
				h = h - 1;
			} else {
				m = m + d;
			}
			return (
				year + " " + this.addPreZero(h) + ":" + this.addPreZero(m)
				// +
				// ":" +
				// this.addPreZero(s)
			);
		},

		//小于10 前面补个0
		addPreZero(number) {
			return number < 10 ? "0" + number : number;
		},

		//场所列表
		getPlaceList() {
			this.api.PlaceList().then((res) => {
				this.placeData = res.obj;
			});
		},

		//删除时间秒
		deleteTimeDuration(date, state = true) {
			let duration = date.substring(
				date.lastIndexOf(":") + 1,
				date.length
			);
			if (duration > 0 && state) {
				return this.findNewTime(
					date.substring(0, date.lastIndexOf(":")),
					60
				);
			}
			return date.substring(0, date.lastIndexOf(":"));
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

		//按条件筛选
		search() {
			this.params.startTime = this.datePicker ? this.datePicker[0] : "";
			this.params.endTime = this.datePicker ? this.datePicker[1] : "";
			this.init();
		},
	},
	components: {
		PlayerStatisticsDetail,
	},
};
</script>
