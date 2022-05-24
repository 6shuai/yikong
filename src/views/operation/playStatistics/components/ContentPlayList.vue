<!-- 当前大屏播放情况 -->
<template>
    <div class="screen-play-list-wrap">
        <el-row class="head item">
            <el-col :span="3">时间</el-col>
            <el-col :span="2">时间池</el-col>
            <el-col :span="2">播放时长(秒)</el-col>
            <el-col :span="5">素材名称</el-col>
            <el-col :span="2">布局分屏</el-col>
            <el-col :span="2">类型</el-col>
            <el-col :span="2">
                <span v-show="!totalType">总时长(分)</span>
                <span v-show="totalType">总次数</span>
                <a href="javascript:;" class="el-icon-menu ml10" @click="totalType = !totalType"></a>
            </el-col>
            <el-col :span="3">上刊日期</el-col>
            <el-col :span="3">下刊日期</el-col>
        </el-row>

        <div v-if="playData && playData.length">
            <el-row class="item" v-for="(item, index) in playData" :key="index">
                <el-col :span="3">{{ item.playDate }}</el-col>
                <el-col :span="2">{{ item.roomType }}</el-col>
                <el-col :span="2">{{ item.duration }}</el-col>
                <el-popover
                    placement="top"
                    width="400"
                    trigger="hover">
                    <video width="370" controls v-if="item.contentType==2" :src="item.contentPath"></video>
                    <el-image v-else fit="cover" :src="item.contentPath"></el-image>
                    <div class="content-detail-popover">
                        <span>分辨率：{{ item.width }} x {{ item.height }}</span>
                        <span>文件大小：{{ (item.size / 1024 / 1024).toFixed(2) }}MB</span>
                    </div>
                    <el-col :span="5" class="content-name" slot="reference" @click.native="handleShowContentDetail(item, item.playDate, item.contentId)">{{ item.contentName }}</el-col>
                </el-popover>
                <el-col :span="2">{{ item.tempName }} / {{ item.regionName }}</el-col>
                <el-col :span="2">{{ item.contentPath.substring(item.contentPath.lastIndexOf('.')+1) }}</el-col>
                <el-col :span="2">{{ totalType ? item.playCount : parseInt(item.playDuration / 60) }}</el-col>
                <el-col :span="3">{{ item.publishDate }}</el-col>
                <el-col :span="3">{{ item.dueDate }}</el-col>
            </el-row>
        </div>

        <!-- 播放详情数据 -->
        <content-play-detail ref="contentPlayDetail"></content-play-detail>

    </div>
</template>

<script>
import ContentPlayDetail from "./ContentPlayDetail"

export default {
    components: {
        ContentPlayDetail
    },
    data(){
        return {
            playData: [],

            // 总计类型
            totalType: 0,

            // 屏幕id
            screenId: null
        }
    },
    methods: {
        contentPlayData(data = {}, screenId){
            this.playData = []
            this.$nextTick(() => {
                this.playData = data
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
            padding: 10px;
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

    .content-detail-popover{
        display: flex;
        justify-content: space-between;
        padding: 10px 0;
    }
</style>