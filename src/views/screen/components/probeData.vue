<template>
    <el-card class="template-card screen-details" v-loading="loading">
        <div class="header-wrap detail-header-wrap mb30">
            <el-page-header @back="$router.go(-1)"> </el-page-header>
            <div class="title">
                <h2>{{ screenName }} - 探针数据统计图</h2>
            </div>
            <div class="filter-date">
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
            </div>
        </div>
        
        <div id="chart" style="width: 100%; height: 500px;"></div>

    </el-card>
</template>
<script>
import * as echarts from 'echarts';
import { screenProbeData } from '@/api/screen';

export default {
    data() {
        return {
            loading: false,
            datePicker: [],
            resData: [],
            screenName: '',
            params: {}
        };
    },
    mounted() {
        this.init();
    },
    methods: {
        init(){
            this.params.screenId = this.$route.params.id;
            this.loading = true;
            screenProbeData(this.params).then(res => {
                this.loading = false;
                if(res.code === this.$successCode){
                    let { screenFootTraffics, displayName } = res.obj;
                    this.resData = screenFootTraffics;
                    this.screenName = displayName;
                    this.loadLine();
                }
            })
        },

        search(){
            this.params = {
                ...this.params,
                startTime: this.datePicker[0],
                endTime: this.datePicker[1]
            }
            this.init()
        },

        //折线图
        loadLine(){
            var chartDom = document.getElementById('chart');
            var myChart = echarts.init(chartDom);
            var option;
            var date = [];
            var data = [];


            this.resData.forEach(item => {
                date.push(item.period);
                data.push(item.number);
            })

            option = {
                tooltip: {
                    trigger: 'axis',
                    position: function (pt) {
                        return [pt[0], '10%'];
                    }
                },
                title: {
                    left: 'center',
                    // text: displayName + ' - 探针数据统计图',
                },
                toolbox: {
                    // feature: {
                    //     dataZoom: {
                    //         yAxisIndex: 'none'
                    //     },
                    //     restore: {},
                    //     saveAsImage: {}
                    // }
                    feature: {
                        dataView: {show: true, readOnly: false},
                        magicType: {show: true, type: ['line', 'bar']},
                        restore: {show: true},
                        saveAsImage: {show: true}
                    }
                },
                xAxis: {
                    type: 'category',
                    boundaryGap: true,
                    data: date,
                    axisPointer: {
                        type: 'shadow'
                    }
                },
                yAxis: {
                    type: 'value',
                    boundaryGap: [0, '100%']
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
                        name: '人数',
                        type: 'bar',
                        showBackground: true,
                        itemStyle: {
                            color: new echarts.graphic.LinearGradient(
                                0, 0, 0, 1,
                                [
                                    {offset: 0, color: '#83bff6'},
                                    {offset: 0.5, color: '#188df0'},
                                    {offset: 1, color: '#188df0'}
                                ]
                            )
                        },
                        emphasis: {
                            itemStyle: {
                                color: new echarts.graphic.LinearGradient(
                                    0, 0, 0, 1,
                                    [
                                        {offset: 0, color: '#2378f7'},
                                        {offset: 0.7, color: '#2378f7'},
                                        {offset: 1, color: '#83bff6'}
                                    ]
                                )
                            }
                        },
                        data: data
                    }
                ]
            };

            option && myChart.setOption(option);

            window.onresize = function () {
                myChart.resize();
            }
        }
    }
};
</script>

<style lang="scss" scope>
    .filter-date{
        float: right;
    }
</style>