<template>
    <div class="lock-position-list el-card freed-screen-wrap">
        <div class="already-lock-list">
            <div class="item">
                <div class="top-content">
                    <div class="left-time-info">
                        <p class="time-period">上刊时间段： {{ resData.publishDate }} -- {{ resData.dueDate }}</p>
                        <p v-if="resData.type == 1">
                            <span class="play-type">轮播</span>
                            <span class="play-duration ml20">播放时长： {{ resData.duration }}s</span>
                            <span class="play-count ml20">每日播放次数：{{ resData.times }}次</span>
                        </p>
                        <p v-if="resData.type == 3">
                            <span class="play-type limit-2">插播</span>
                            <span class="play-duration ml20">开始时间： {{ resData.time }}</span>
                            <span class="play-count ml20">每日时间：{{ resData.duration }}秒</span>
                        </p>
                    </div>
                    <div class="right-limit">
                        <p v-if="resData.limits && resData.limits.length ">{{ resData.limits[0].type == 2 ? '禁止播放时间' : '限制播放时间' }} ：
                            <span v-for="(limitTime, index) in resData.limits" :key="index">{{ limitTime.begin }} - {{ limitTime.end }}</span>
                        </p>
                    </div>
                </div>

                <div class="screen-list mt20">
                    <div class="screen-item" 
                        v-for="screen in resData.orderedScreens" 
                        :key="screen.id"
                        @click.stop="handelSelectScreen(screen.id)"
                    >
                        <div class="screen-img">
                            <el-checkbox 
                                :value="screenIds.includes(screen.id)"
                                @change="handelSelectScreen(screen.id)"
                            ></el-checkbox>
                            <el-image fit="cover" :src="screen.photo"></el-image>
                            <div class="screen-name overflow">{{ screen.name }} {{ screen.location ? `(${screen.location})` : '' }}</div>
                        </div>
                        <div class="screen-bottom">
                            <el-tag size="small" v-if="screen.city">{{ screen.city }}</el-tag>
                            <el-tag size="small" v-if="screen.level">{{ screen.level }}</el-tag>
                        </div>
                    </div>
                </div>

            </div>
        </div>

        <div class="select-all">
            <el-checkbox :value="isSelectAll" @change="handleSelectAll">全选</el-checkbox>
            <el-button 
                type="primary" 
                size="small"
                :disabled="!screenIds.length ? true : false"
                @click="handleFreedScreen"
            >
                释放大屏
            </el-button>
        </div>

        <el-dialog
            width="520px"
            title="提示" 
            :visible.sync="showSureFreed"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            :show-close="false"
            append-to-body
        >   
            <div class="freed-confirm-wrap">
                <div class="msg">后台检测到以下大屏有正在进行中的上刊素材,释放后该屏上的所有素材也将自动下刊,是否继续释放?</div>
    
                <!-- 进行中的屏幕 -->
                <ul class="conduct-screen-list">
                    <li class="head">进行中</li>
                    <li v-for="item in conductScreen" :key="item.id">
                       <div class="screen-name">{{ item.name }} {{ item.location ? `(${item.location})` : '' }}</div> 
                       <div class="screen-material">
                            <el-image 
                                fit="cover"
                                v-for="(img, index) in item.packages"
                                :key="index"
                                :src="img.regions[0].content"
                            ></el-image>
                       </div>
                    </li>
                </ul>
            </div>


            <span slot="footer" class="dialog-footer">
                <el-button @click="showSureFreed=false">我再想想</el-button>
                <el-button
                    type="primary"
                    :loading="btnLoading"
                    @click="freedScreen(true); btnLoading = true"
                    >确 定</el-button
                >
            </span>
        </el-dialog>

    </div>
</template>

<script>
import { projectLockPositionDeleteScreen } from '@/api/project'

export default {
    props: {
        orderDetail: Object
    },
    data(){
        return {
            resData: [],

            // 已选的屏幕id
            screenIds: [],

            // 是否全选
            isSelectAll: false,

            tLoading: false,

            // 显示是否确认释放
            showSureFreed: false,

            // 进行中的屏幕
            conductScreen: [],

            // 确定按钮loading
            btnLoading: false
        }
    },
    mounted() {
        this.resData = JSON.parse(JSON.stringify(this.orderDetail))
    },
    methods: {
        // 选择屏幕
        handelSelectScreen(id){
            if(this.screenIds.includes(id)){
                let index = this.screenIds.indexOf(id)
                this.screenIds.splice(index, 1)
            }else{
                this.screenIds.push(id)
            }
            this.isSelectAll = this.screenIds.length === this.resData.orderedScreens.length
        },

        // 全选
        handleSelectAll(){
            if(this.screenIds.length === this.resData.orderedScreens.length){
                this.screenIds = []
                this.isSelectAll = false
            }else{
                this.screenIds = []
                for(let i = 0 ; i < this.resData.orderedScreens.length; i++){
                    this.screenIds.push(this.resData.orderedScreens[i].id)
                }
                this.isSelectAll = true
            }
        },

        // 释放大屏
        handleFreedScreen(){
            this.$confirm(
                `您确定要对所选大屏进行释放吗?`,
                "提示",
                {
                    confirmButtonText: "确定",
                    cancelButtonText: "我再想想",
                    type: "warning",
                    center: true,
                }
            ).then(() => {
                this.freedScreen(false)
            })
        },

        freedScreen(force = false){
            let data = {
                order: this.resData.id,
                screens: this.screenIds,
                force
            }

            projectLockPositionDeleteScreen(data).then(res => {
                this.btnLoading = false
                if(res.code === this.$successCode){
                    this.showSureFreed = false
                    this.$message.success('释放成功~')
                    this.$emit('freedSuccess')
                }else if(res.code === 1204){
                    this.conductScreen = res.obj
                    this.showSureFreed = true
                }
            })
        }

    }
}
</script>

<style lang="scss">
    .freed-screen-wrap{
        height: calc(100vh - 360px);
        margin-bottom: 20px;
        position: relative;

        .screen-img{
            .el-checkbox{
                position: absolute;
                top: 0;
                right: 0;
                z-index: 99;

                .el-checkbox__inner{
                    width: 20px !important;
                    height: 20px !important;
                    
                    &::after{
                        height: 10px;
                        left: 7px;
                        top: 2px;
                    }
                }
            }
        }
        
        .select-all{
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            padding: 20px;
            background: #eeeeee;
            text-align: right;

            .el-button{
                margin-left: 20px;
            }
        }
    }

    .freed-confirm-wrap{
        .msg{
            padding: 10px 20px;
            line-height: 28px;
            color: var(--color-danger);
        }

        .conduct-screen-list{
            border: 1px solid #e5e5e5;   
            li{
                border-bottom: 1px solid #e5e5e5;
                padding: 10px;
                display: flex;
                justify-content: center;
                align-items: center;

                &.head{
                    line-height: 30px;
                    text-align: center;
                }

                &:last-child{
                    border: none;
                }

                .screen-name{
                    width: 150px;
                    margin-right: 20px;
                }

                .screen-material{
                    flex: 1;
                    
                    .el-image{
                        display: inline-block;
                        height: 60px;
                        margin: 0 10px 10px 0;
                        background: #999;
                        border: 1px solid #e5e5e5;
                    }
                }
            }
        }
    }

</style>