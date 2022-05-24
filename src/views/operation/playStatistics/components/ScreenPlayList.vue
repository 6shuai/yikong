<!-- 当前大屏播放情况 -->
<template>
    <div class="screen-play-list-wrap">
        <el-row class="head item">
            <el-col :span="3">时间池</el-col>
            <el-col :span="3">播放时长(秒)</el-col>
            <el-col :span="6">素材名称</el-col>
            <el-col :span="3">布局分屏</el-col>
            <el-col :span="3">类型</el-col>
            <el-col :span="3">上刊日期</el-col>
            <el-col :span="3">下刊日期</el-col>
        </el-row>
        <div v-if="playData && playData.length">
            <div class="group" v-for="(item, index) in playData" :key="index">
                <div class="play-date">
                    <span>{{ item.playDate }}</span>
                    <span v-show="!item.countType" class="total"><i class="el-icon-time"></i>总时长: {{ timeFromat(item.playDuration) }}</span>
                    <span v-show="item.countType" class="total"><i class="el-icon-tickets"></i>总次数: {{ item.playCount }}次</span>
                    <a href="javascript:;" class="el-icon-menu ml10" @click="$set(playData[index], 'countType', !item.countType)"></a>
                </div>
                <!-- <el-row class="item" type="flex" align="middle">
                    <el-col :span="3">小风景</el-col>
                    <el-col :span="3">15</el-col>
                    <el-col :span="18">
                        <el-row class="item">
                            <el-col :span="8">素材名称</el-col>
                            <el-col :span="4">布局分屏</el-col>
                            <el-col :span="4">类型</el-col>
                            <el-col :span="4">上刊日期</el-col>
                            <el-col :span="4">下刊日期</el-col>
                        </el-row>
                        <el-row class="item">
                            <el-col :span="8">素材名称</el-col>
                            <el-col :span="4">布局分屏</el-col>
                            <el-col :span="4">类型</el-col>
                            <el-col :span="4">上刊日期</el-col>
                            <el-col :span="4">下刊日期</el-col>
                        </el-row>
                        <el-row class="item">
                            <el-col :span="8">素材名称</el-col>
                            <el-col :span="4">布局分屏</el-col>
                            <el-col :span="4">类型</el-col>
                            <el-col :span="4">上刊日期</el-col>
                            <el-col :span="4">下刊日期</el-col>
                        </el-row>
                    </el-col>
                </el-row> -->
                <el-row class="item" v-for="(child, cIndex) in item.materialInfo" :key="cIndex + index">
                    <el-col :span="3">{{ child.roomType }}</el-col>
                    <el-col :span="3">{{ child.duration }}</el-col>
                    <el-popover
                        placement="top"
                        width="400"
                        trigger="hover">
                        <video width="370" controls v-if="child.contentType==2" :src="child.contentPath"></video>
                        <el-image v-else fit="cover" :src="child.contentPath"></el-image>
                        <div class="content-detail-popover">
                            <span>分辨率：{{ child.width }} x {{ child.height }}</span>
                            <span>文件大小：{{ (child.size / 1024 / 1024).toFixed(2) }}MB</span>
                        </div>
                        <el-col :span="6" class="content-name" slot="reference" @click.native="handleShowContentDetail(child, item.playDate, child.contentId)">{{ child.contentName }}</el-col>
                    </el-popover>
                    <el-col :span="3">{{ child.tempName }} / {{ child.regionName }}</el-col>
                    <el-col :span="3">{{ child.contentPath.substring(child.contentPath.lastIndexOf('.')+1) }}</el-col>
                    <el-col :span="3">{{ child.publishDate }}</el-col>
                    <el-col :span="3">{{ child.dueDate }}</el-col>
                </el-row>
            </div>
        </div>

        <!-- 播放详情数据 -->
        <content-play-detail ref="contentPlayDetail"></content-play-detail>

    </div>
</template>

<script>
import ContentPlayDetail from "./ContentPlayDetail"
import { formatSeconds } from '@/utils/index'

export default {
    components: {
        ContentPlayDetail
    },
    data(){
        return {
            playData: [],

            // 屏幕id
            screenId: null
        }
    },
    computed: {
        timeFromat(){
            return (date) => {
                return formatSeconds(date)
            }
        }
    },
    methods: {
        contentPlayData(data = {}, screenId){
            this.playData = []

            this.$nextTick(() => {
                this.playData = JSON.parse(JSON.stringify(data))
                this.screenId = screenId
            })
        },

        // 查看内容播放详情
        handleShowContentDetail(data, playDate, contentId){
            let params = {
                playDate,
                contentId,
                screenId: this.screenId
            }
            this.$refs.contentPlayDetail.showContentPlayData(data, params)
        }
    },
}
</script>

<style lang="scss">
    $listBgColor: #e2e2e2;
    $activeBgColor: var(--color-primary);

    .screen-play-list-wrap{
        .play-date{
            padding: 10px 0;    

            .total{
                color: $activeBgColor;
                margin-left: 20px;
            }
        }

        .item{
            padding: 15px;
            margin-bottom: 10px;
            background: $listBgColor;
            text-align: center;
            line-height: 20px;

            .el-col{
                padding: 0 10px;
                overflow: hidden;
                text-align: center;
                white-space: nowrap;

                &.content-name{
                    cursor: pointer;

                    &:hover{
                        color: var(--color-primary);
                    }
                }
            }

            .item{
                padding: 15px 0;

            }

            &.head{
                background: $activeBgColor;
                color: #fff;
            }
        }
    }
</style>