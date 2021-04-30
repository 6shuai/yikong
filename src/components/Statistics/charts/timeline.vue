<template>
    <el-dialog
        custom-class="player-timeline-wrap"
        title="玩家游戏行为轨迹"
        :visible.sync="dialogVisible"
        width="600px"
        append-to-body
    >   
        <div v-loading="loading">
            <div class="user-info">
                <el-image :src="resData.headimgurl"></el-image>
                <p class="name">{{ resData.name }}</p>
            </div>
            <el-timeline>
                <el-timeline-item
                    v-for="(activity, index) in resData.playerBehaviralData"
                    :key="index"
                    :timestamp="activity.occur">
                    <div class="content">
                        <span class="state">{{activity.hehavior == 1 ? '登录' : activity.hehavior == 2 ? '退出' : '开始游戏' }}</span>
                        <span class="desc">{{ activity.note }}</span>
                    </div>
                    
                </el-timeline-item>
            </el-timeline>
        </div>

        <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">关 闭</el-button>
        </span>
    </el-dialog>
</template>

<script>
import { placePlayerTimelineData } from '@/api/place';
import { screenPlayerTimelineData } from '@/api/screen';
import { contentPlayerTimelineData } from '@/api/content';

export default {
    data(){
        return {
            dialogVisible: false,
            resData: {},
            loading: false,
            api: undefined
        }
    },
    methods: {
        showPlayerTimeline(data){
            this.dialogVisible = true;
            switch (this.$route.query.source) {
                    case "place":
                        this.api = placePlayerTimelineData;
                        break;
                    case "screen":
                        this.api = screenPlayerTimelineData;
                        break;
                    case "content":
                        this.api = contentPlayerTimelineData;
                    default:
                        break;
                }

                this.loading = true;
                this.api(data).then(res => {
                    this.loading = false;
                    this.resData = res.obj;
                })
        }
    },
};
</script>

<style lang="scss">
    .player-timeline-wrap{
        .user-info{
            padding-bottom: 20px;
            text-align: center;

            .el-image{
                width: 70px;
                height: 70px;
                border: 1px solid #e5e5e5;
                border-radius: 50%;
            }

            p.name{
                line-height: 40px;
            }
        }

        .content{
            .state{
                padding-right: 20px;
                display: inline-block;
                width: 80px;
            }

            .desc{
                color: #999;
            }
        }
    }

</style>