<template>
    <div class="screen-material-play-calendar-wrap">
        <div class="screen-material-play-calendar-head">
            <div class="left">
                <span 
                    class="play-type mr10"
                    :class="{ 'limit-2': resData.orderType == '插播' }"
                >
                    {{ resData.orderType }}
                </span>
                <span class="mr10">{{ resData.screenName }}</span>
                <span class="mr10">监播情况</span>
                <el-select
                    v-if="calendarData.yearArr && calendarData.yearArr.length > 1"
					v-model="currentYearIndex"
				>
					<el-option
						v-for="(item, index) in calendarData.yearArr"
						:key="index"
						:label="item"
						:value="index"
					>
					</el-option>
                </el-select>
            </div>
            <div class="not-play-conut">
                漏播: {{ resData.missingCount }} 次
            </div>
        </div>
        <ul class="calendar-wrap mt20" v-if="calendarData.monthArr && calendarData.monthArr.length">
            <li v-for="(month, index) in calendarData.monthArr[currentYearIndex]" :key="index">
                <el-calendar :value="month" :first-day-of-week="7">
                    <template slot="dateCell" slot-scope="{date, data}">
                        <el-tooltip 
                            v-if="playbacks[data.day]" 
                            effect="dark" 
                            :content="playbacks[data.day].playCount + '/' + resData.playTimes" 
                            placement="top"
                        >
                            <div 
                                class="highlight"
                                :class="{ danger: playbacks[data.day].playCount < resData.playTimes }"
                                @click="handleShowCurrentDayPlayDetail(data.day, resData.playTimes - playbacks[data.day].playCount)"
                            >
                                <span>{{ Number(data.day.split('-').pop()) }}</span>
                            </div>
                        </el-tooltip>
                        <span v-else>{{ Number(data.day.split('-').pop()) }}</span>
                    </template>
                </el-calendar>
            </li>
        </ul>

        <!-- 播放详情 -->
        <play-detail ref="playDetail"></play-detail>

    </div>
</template>

<script>
import { projectPlayStatisticsCalendar } from '@/api/project'
import PlayDetail from "./PlayDetail"

export default {
    components:{
        PlayDetail
    },
    props: {
        screenPlaceHolderId: Number
    },
    data(){
        return {
            // 日历 月份列表
            calendarData: {},

            currentYearIndex: 0,

            playbacks: {},

            resData: {}
        }
    },
    mounted() {
        this.getScreenPlayCycle()
    },
    methods: {
        // 获取屏幕播放周期
        getScreenPlayCycle(){
            projectPlayStatisticsCalendar({ placeholder: this.screenPlaceHolderId }).then(res => {
                if(res.code === this.$successCode){
                    this.resData = res.obj
                    
                    for(let i = 0; i < this.resData.playbacks.length; i++){
                        let { days } = this.resData.playbacks[i]
                        this.playbacks[days] = this.resData.playbacks[i]
                    }

                    this.queryPlayCycle()
                }
            })
        },

        // 查询播放周期
        queryPlayCycle(){
            this.calendarData = {
                yearArr: [],
                monthArr: []
            }

            for(let i = 0; i < this.resData.playbacks.length; i++){
                let item = this.resData.playbacks[i]
                let year = item.days.split('-')[0]
                let month = item.days.split('-')[1]
                if(!this.calendarData.yearArr.includes(year)){
                    this.calendarData.yearArr.push(year)
                }

                if(!this.calendarData.monthArr[this.calendarData.yearArr.length-1]) this.calendarData.monthArr[this.calendarData.yearArr.length-1] = []

                if(!this.calendarData.monthArr[this.calendarData.yearArr.length-1].includes(year + '-' + month)){
                    this.calendarData.monthArr[this.calendarData.yearArr.length-1].push(year + '-' + month)
                }

            }

        },

        // 显示某天的播放数据
        handleShowCurrentDayPlayDetail(date, missingCount){
            this.$refs.playDetail.showDialog(this.screenPlaceHolderId, date, missingCount)
        }
    }
}
</script>

<style lang="scss">
.screen-material-play-calendar-wrap{
    .screen-material-play-calendar-head{
        padding: 10px;
        border-bottom: 1px solid #e5e5e5;
        display: flex;
        justify-content: space-between;
        align-items: center;

        .play-type{
            display: inline-block;
            background: #0091C2;
            border-radius: 4px;
            color: #fff;
            padding: 2px 10px;
            font-size: 14px;
            line-height: 20px;

            &.limit-2{
                background: #C27B00;
            }
        }
    }

    .calendar-wrap{
        display: flex;
        flex-wrap: wrap;

        li{
            width: 500px;
            margin: 0 20px 20px 0;
            border: 1px solid #ebeef5;

            .el-calendar__button-group{
                display: none;
            }

            td{
                border: none;

                &.is-selected{
                    background-color: transparent;
                }

                .highlight{
                    background: #E4ECFF;
                    color: #00B960;

                    &.danger{
                        color: var(--color-danger);
                    }

                    &:hover span{
                        text-decoration: underline;
                    }
                }
            }

            .el-calendar-table .el-calendar-day{
                height: 40px;
                line-height: 40px;
                text-align: center;
                padding: 0;
                margin-bottom: 10px;
            }
        }
    }

    .el-calendar-table:not(.is-range) td.prev .el-calendar-day, .el-calendar-table:not(.is-range) td.next .el-calendar-day{
        display: none;
    }
}
</style>