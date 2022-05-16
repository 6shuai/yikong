<template>
    <div class="play-statistics-wrap" v-loading="dataLoading">
        <div class="order-screen-play-list" v-show="!showPlayCalendar">
            <el-empty v-if="!resData.length && !dataLoading"></el-empty>
            <el-card 
                class="order-list" 
                v-for="(item, index) in resData" 
                :key="index"
            >
                <div class="top-content">
                    <div class="left-time-info">
                        <p class="time-period">上刊时间段： {{ item.publishDate }} -- {{ item.dueDate }}</p>
                        <p v-if="item.orderType == '轮播'">
                            <span class="play-type">轮播</span>
                            <span class="play-duration ml20">播放时长： {{ item.duration }}s</span>
                            <span class="play-count ml20">每日播放次数：{{ item.playTimes }}次</span>
                        </p>
                        <p v-if="item.orderType == '插播'">
                            <span class="play-type limit-2">插播</span>
                            <span class="play-duration ml20">开始时间： {{ item.time }}</span>
                            <span class="play-count ml20">每日时间：{{ item.duration }}秒</span>
                        </p>
                    </div>
                    <div class="right-limit">
                        <p v-if="item.limits && item.limits.length ">{{ item.limits[0].type == 2 ? '禁止播放时间' : '限制播放时间' }} ：
                            <span v-for="(limitTime, index) in item.limits">{{ limitTime.begin }} - {{ limitTime.end }}</span>
                        </p>
                    </div>
                </div>
                <div class="screen-list-wrap" v-if="item.playbacks && item.playbacks.length">
                    <el-table
                        class="mb20"
                        stripe
                        size="small"
                        :data="item.playbacks"
                        row-key="id"
                    >
                        <el-table-column
                            label="大屏名称"
                            min-width="80"
                        >
                            <template slot-scope="scope">
                                <a href="javascript:;" class="screen-name" @click="handlClickShowPlayCalendar(scope.row.placeholder)">
                                    {{ scope.row.screenName }}
                                </a>
                            </template>
                        </el-table-column>
                        <el-table-column
                            v-for="(val, key, screenIndex) in item.playbacks[0]"
                            v-if="key.indexOf('-') > -1"
                            :label="key"
                            min-width="80"
                        >
                            <template slot-scope="scope">
                                <a 
                                    href="javascript:;"
                                    :class="item.playTimes <= scope.row[key] ? 'accomplish' : 'fail'"
                                    @click="handleShowCurrentDayPlayDetail(scope.row.placeholder, key, item.playTimes - scope.row[key])"
                                >
                                    {{ scope.row[key] }} / {{ item.playTimes }}
                                </a>
                            </template>
                        </el-table-column>
                        <el-table-column
                            label="漏播次数"
                            min-width="80"
                        >
                            <template slot-scope="scope">
                                {{ scope.row.missingCount }}
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
    
            </el-card>
        </div>

        <!-- 屏幕监播情况 -->
        <play-calendar v-if="showPlayCalendar" :screenPlaceHolderId="screenPlaceHolderId"></play-calendar>

        <!-- 播放详情 -->
        <play-detail ref="playDetail"></play-detail>

    </div>
</template>

<script>
import { projectPlayStatisticsList } from '@/api/project'
import PlayCalendar from './components/PlayCalendar'
import PlayDetail from "./components/PlayDetail"

export default {
    components: {
        PlayCalendar,
        PlayDetail
    },
    data() {
        return {
            resData: [],
            
            // 监播数据加载中
            dataLoading: false,

            // 显示屏幕监播情况
            showPlayCalendar: false,

            // 屏幕占位id
            screenPlaceHolderId: null
        }
    },
    mounted() {
        this.getOrderPlayStatisticsList()
    },
    methods: {
        getOrderPlayStatisticsList(){
            this.dataLoading = true
            projectPlayStatisticsList({ id: this.$route.params.id }).then(res => {
                this.dataLoading = false                
                this.resData = res.obj
            })
        },

        // 显示屏幕监播情况
        handlClickShowPlayCalendar(id){
            this.screenPlaceHolderId = id
            this.showPlayCalendar = true 
            this.$router.push({
                path: this.$route.path,
                query: {
                    target: 'calendar'
                }
            })
        },

         // 显示某天的播放数据
        handleShowCurrentDayPlayDetail(screenPlaceHolderId, date, missingCount){
            this.$refs.playDetail.showDialog(screenPlaceHolderId, date, missingCount)
        }
    },
    watch: {
        '$route.query'(n, o){
            if(this.$route.query.target && this.screenPlaceHolderId){
                this.showPlayCalendar = true
            }else{
                this.showPlayCalendar = false
            }
        }
    }
}
</script>

<style lang="scss">
    .play-statistics-wrap{
        .order-list{
            margin: 20px;

            .top-content{
                display: flex;
                justify-content: space-between;
                padding-bottom: 10px;
                border-bottom: 1px solid #e5e5e5;

                p{
                    line-height: 26px;
                    font-size: 14px;
                }

                .left-time-info{
                    width: 400px;
                    font-weight: bold;

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

                .right-limit{
                    display: flex;
                    align-items: end;
                }
            }   

            .screen-list-wrap{
                .el-table thead tr th{
                    color: #333;
                    background: #D8D8D8;
                }

                .screen-name{
                    color: #333;
                    font-weight: bold;

                    &:hover{
                        color: var(--color-primary);
                    }
                }


                .accomplish{
                    color: #23D89E;
                }

                .fail{
                    color: #D82323;
                }
            }
        }
    }
</style>