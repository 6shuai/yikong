
<template>
    <el-dialog
        custom-class="screen-play-detail"
        width="520px"
        :visible.sync="showScreenPlayDetailDialog"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :show-close="false"
        v-loading="playDataLoading"
    >   

        <div slot="title" class="dialog-head">
            <div class="play-type-and-date">
                <span class="play-type mr10">轮播</span>
                <span>{{ currentDate }}日 详情</span>
            </div>
            <div class="not-play-count" v-if="missingCount > 0">漏播: {{ missingCount }}次</div>
        </div>

        <el-empty v-if="!resData.length && !playDataLoading"></el-empty>

        <div class="material-play-log">
            <el-row 
                class="log-head" 
                type="flex" 
                justify="center" 
                align="middle"
                v-if="resData.length"
            >
                <el-col :span="2">序号</el-col>
                <el-col :span="12">物料</el-col>
                <el-col :span="10" class="play-date">
                    <p>
                        <span>开始时间</span>
                        <span>结束时间</span>
                    </p>
                </el-col>
            </el-row>

            <el-row 
                class="material-item" 
                type="flex" 
                justify="center" 
                align="middle"
                v-for="(item, index) in resData"
                :key="index"
            >
                <el-col :span="2">{{ index+1 }}</el-col>
                <el-col :span="12" class="material">
                    <screen-layout 
                        :screen="item" 
                        :maxWidth="180"
                        :showBorder="false"
                    >
                        <template v-slot="dataDefalut">
                        
                            <img 
                                class="content-image"
                                :src="dataDefalut.data.image" 
                            >
                        </template>
                    </screen-layout>

                    <p>{{ item.playCount }}次</p>
                </el-col>
                <el-col 
                    :span="10" 
                    class="play-date"
                >
                    <div class="date" :class="{ 'active': item.active }">
                        <el-scrollbar 
                            class="hidden-scroll-x"
                            :style="{ height: (item.active || resData.length == 1 ) && item.times.length > 10 ? '300px' : item.times.length * 30 + 'px' }"
                        >
                            <p v-for="(time, tIndex) in item.times" :key="tIndex">
                                <span>{{ time.beginTime }}</span>
                                <span>{{ time.endTime }}</span>
                            </p>
                        </el-scrollbar>
                    </div>
                    <div 
                        class="show-more"
                        v-if="resData.length != 1 && item.times.length > 3"
                        @click="$set(resData[index], 'active', !item.active)"
                    >
                        <i :class="item.active ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i>
                    </div>
                </el-col>
            </el-row>
        </div>

        <span slot="footer" class="dialog-footer">
            <el-button
                type="primary"
                @click="showScreenPlayDetailDialog = false"
                >确 定</el-button
            >
        </span>
    </el-dialog>
</template>

<script>
import { projectPlayStatisticsCurrentDay } from '@/api/project'
import ScreenLayout from '@/views/screenLayout/components/ScreenLayout'

export default {
    components: {
        ScreenLayout
    },
    data() {
        return {
            showScreenPlayDetailDialog: false,

            // 播放数据加载中
            playDataLoading: false,

            resData: {},

            // 漏播次数
            missingCount: 0,

            // 当前日期
            currentDate: ''
        }
    },
    methods: {
        showDialog(placeholderId, date, missingCount){
            this.showScreenPlayDetailDialog = true
            this.currentDate = date
            this.missingCount = missingCount

            let data = {
                placeholder: placeholderId,
                day: date
            }
            this.playDataLoading = true
            projectPlayStatisticsCurrentDay(data).then(res => {
                this.playDataLoading = false
                if(res.code === this.$successCode){
                    this.resData = res.obj
                }
            })
        }
    }
}
</script>

<style lang="scss">
.screen-play-detail{
    .el-dialog__header{
        background: #4A4A4A;
    }

    .dialog-head{
        padding: 10 20px;
        color: #fff;
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

    .material-play-log{
        .log-head{
            padding: 10px 20px;
            text-align: center;
        }

        .play-date p{
            display: flex;
            line-height: 30px;
            
            span{
                flex: 1;
            }
        }

        .material-item{
            border: 1px solid #e5e5e5;
            margin-bottom: 20px;
            padding: 20px;

            .material{
                text-align: center;

                p{
                    line-height: 28px;
                }
            }

            .play-date{
                .date{
                    // overflow: hidden;
                    // height: 60px;

                    &.active{
                        height: auto;
                    }
                }

                .show-more{
                    padding: 0 10px;
                    text-align: right;
                    cursor: pointer;
                    background: #fff;

                    &:hover{
                        color: var(--color-primary);
                    }
                }

            }
        }


    }
}
</style>
