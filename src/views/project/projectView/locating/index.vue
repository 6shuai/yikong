<template>
    <div class="lock-position-list">
        <div class="lock-order-warp">
            <div class="total-price-and-add">
                <span class="total-price">刊例总价: <span class="ml20">{{ totalPrice }}</span></span>
    
                <el-button 
                    type="primary"
                    size="small"
                    icon="el-icon-plus"
                    @click="handleShowPlayRule()"
                >
                    寻 位
                </el-button>
            </div>
    
            <el-empty v-if="!resData.length"></el-empty>
        
            <div class="already-lock-list" v-loading="tLoading">
                <el-card class="item" v-for="(item, index) in resData" :key="item.id">
                    <div class="top-content">
                        <div class="left-time-info">
                            <p class="time-period">上刊时间段： {{ item.publishDate }} -- {{ item.dueDate }}</p>
                            <p v-if="item.type == 1">
                                <span class="play-type">轮播</span>
                                <span class="play-duration ml20">播放时长： {{ item.duration }}s</span>
                                <span class="play-count ml20">每日播放次数：{{ item.times }}次</span>
                            </p>
                            <p v-if="item.type == 3">
                                <span class="play-type limit-2">插播</span>
                                <span class="play-duration ml20">开始时间： {{ item.time }}</span>
                                <span class="play-count ml20">每日时间：{{ item.duration }}秒</span>
                            </p>
                            <div class="limit-time-wrap">
                                <p v-if="item.limits && item.limits.length ">{{ item.limits[0].type == 2 ? '禁止播放时间' : '限制播放时间' }} ：
                                    <span v-for="(limitTime, index) in item.limits" :key="index">
                                        {{ limitTime.begin }} - {{ limitTime.end }}
                                        <span v-if="index < item.limits.length-1">, </span>
                                    </span>
                                </p>
                            </div>
                        </div>
                        <div class="right-limit">
                            <span class="locating-time">订单号: {{ item.orderNumber }}</span>
                        </div>
                    </div>

                    <div class="fold flex-center" @click="$set(resData[index], 'fold', !item.fold)">
                        <div class="line"></div>
                        <div class="right">
                            <i :class="item.fold ? 'el-icon-caret-bottom' : 'el-icon-caret-top'"></i>
                            <span>{{ item.fold ? '展开' : '收起' }}</span>
                        </div>
                    </div>
    
                    <div class="screen-list" :class="{ 'to-fold': item.fold }">
                        <div class="screen-item" 
                            v-for="screen in item.orderedScreens" 
                            :key="screen.id"
                            @click.stop="handleShowDetail(screen.id, item.priceSystem.id)"
                        >

                            <el-image class="screen-photo" v-if="!screen.materials || !screen.materials.length" fit="cover" :src="screen.photo"></el-image>
                            
                            <el-carousel v-else :autoplay="false" height="133px" trigger="click">
                                <el-carousel-item 
                                    v-for="(sub, sIndex) in screen.materials" 
                                    :key="sIndex">
                                    <div class="screen-img flex">
                                        <div 
                                            class="item" 
                                            v-for="(child, childIndex) in sub.regions" 
                                            :key="childIndex"
                                            :style="{
                                                width: child.region.width + '%',
                                                height: child.region.height + '%',
                                                top: child.region.y + '%',
                                                left: child.region.x + '%'
                                            }"
                                        >   
                                            <el-image fit="cover" v-if="child.content" :src="child.content.thumbnail"></el-image> 
                                        </div>
                                    </div>
                                </el-carousel-item>
                            </el-carousel>


                            <div class="screen-name overflow">{{ screen.name }} {{ screen.location ? `(${screen.location})` : '' }}</div>

                            <div class="screen-bottom flex-center">
                                <a href="javascript:;" @click.stop="handleFreedScreen(item.id, screen.id)">释放</a>
                                <span v-if="screen.city">{{ screen.city }}</span>
                                <span v-if="screen.level">{{ screen.level }}</span>
                            </div>
                        </div>
                    </div>

                    <div class="bottom mt20">
                        <el-button size="small" @click="handleDeleteOrder(item.id)">取消订单</el-button>
                        <el-button type="primary" size="small" @click="handleLockAgain(item)">再次预定</el-button>
                    </div>
    
                </el-card>
            </div>
    
            <!-- 场所屏幕详情 -->
            <place-screen-detail ref="placeScreenDetail"></place-screen-detail>
    
            <!-- 播放规则 -->
            <play-limit-rule ref="playLimitRule"></play-limit-rule>
            
        </div>

    </div>
</template>

<script>
import { projectLockList, projectLockPositionDeleteOrder, projectLockPositionDeleteScreen } from '@/api/project'
import { priceFormat } from '@/utils/index'
import PlaceScreenDetail from './components/PlaceScreenDetail'
import PlayLimitRule from './components/PlayLimitRule'

export default {
    components: {
        PlaceScreenDetail,
        PlayLimitRule
    },
    data(){
        return {
            resData: [],
            tLoading: false
        }
    },
    computed: {
        // 计算刊例总价
        totalPrice(){
            let result = 0
            for(let i = 0; i < this.resData.length; i++){
                let { type, duration, times, publishDate, dueDate } = this.resData[i]
                let durationDay = type == 1 ? duration * times : duration
                let playDay = this.getDaysBetween(publishDate, dueDate)
                for(let j = 0; j < this.resData[i].orderedScreens.length; j++){
                    let { price } = this.resData[i].orderedScreens[j]
                    
                    result += price * playDay * durationDay
                }
            }
            return priceFormat(result)
        }
    },
    mounted() {
        this.getScreenList()
    },
    methods: {
        // 获取锁位列表
        getScreenList(){
            this.tLoading = true
            projectLockList({ project: this.$route.params.id }).then(res => {
                this.tLoading = false
                if(res.code === this.$successCode){
                    this.resData = res.obj
                }
            })
        },

        // 时间差
        getDaysBetween(dateString1,dateString2){
            let startDate = Date.parse(dateString1)
            let endDate = Date.parse(dateString2)
            if (startDate>endDate){
                return 0
            }
            if (startDate==endDate){
                return 1
            }
            let days=(endDate - startDate)/(1*24*60*60*1000)
            return  days + 1
        },

        // 显示 选择播放规则
        handleShowPlayRule(data = undefined){
            this.$store.dispatch('project/setAgainReserveData', data)
            this.$refs.playLimitRule.init()
        },

        // 查看屏幕详情
        handleShowDetail(id, priceSystem){
            this.$refs.placeScreenDetail.showDetail(id, priceSystem)
        },

        // 再次预定
        handleLockAgain(data){
            this.$router.push(`/project/${this.$route.params.id}/locating?type=again`)
            this.handleShowPlayRule(data)
        },

        // 释放订单  删除锁位列表   需要二次确认 force第一次传false   第二次传true 强制删除
        handleDeleteOrder(id, force = false){
            let data = {
                order: id,
                force
            }
            projectLockPositionDeleteOrder(data).then(res => {
                if(res.code === this.$successCode){
                    this.$message.success('操作成功~')
                    this.getScreenList()
                }else if(res.code === 1204){
                    this.$confirm(
                        `要释放的锁位已经投放了素材,是否要删除?`,
                        "提示",
                        {
                            confirmButtonText: "确定",
                            cancelButtonText: "取消",
                            type: "warning",
                            center: true,
                        }
                    ).then(() => {
                        this.handleDeleteOrder(id, true)
                    })
                }
            })
        },

        // 释放大屏
        handleFreedScreen(orderId, screenId){
            this.$confirm(
                `您确定要对所选大屏进行释放吗?`,
                "提示",
                {
                    confirmButtonText: "确定",
                    cancelButtonText: "我再想想",
                }
            ).then(() => {
                this.freedScreen(false, orderId, screenId)
            })
        },

        freedScreen(force = false, orderId, screenId){
            let data = {
                order: orderId,
                screens: [screenId],
                force
            }

            projectLockPositionDeleteScreen(data).then(res => {
                this.btnLoading = false
                if(res.code === this.$successCode){
                    this.$message.success('释放成功~')
                    this.getScreenList()
                }else if(res.code === 1204){
                    this.$confirm(
                        `该屏幕正在使用中，释放后将在次日停止上刊，是否立即释放？`,
                        "提示",
                        {
                            confirmButtonText: "确认",
                            cancelButtonText: "取消",
                        }
                    ).then(() => {
                        this.freedScreen(true, orderId, screenId)
                    })
                }
            })
        }
    }
}
</script>

<style lang="scss">
    .material_screen_tag{
        cursor: pointer;
    }

    .lock-position-list{
        .total-price-and-add{
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
        
        .right-btn{
            float: right;
            margin-left: 20px;
        }

        .total-price{
            font-size: 18px;
        }
    }

    .already-lock-list{
        padding-top: 20px;

        &>.item{
            margin-bottom: 20px;
            padding: 0 10px;

            .top-content{
                display: flex;
                justify-content: space-between;
                align-items: flex-end;
                padding-bottom: 10px;

                p{
                    line-height: 26px;
                    font-size: 14px;
                }

                .left-time-info{
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

                    .limit-time-wrap{
                        padding-left: 70px;
                    }

                }

                .right-limit{
                    .locating-time{
                        float: right;
                        font-size: 14px;
                        color: #787878;
                        line-height: 40px;
                    }
                }
            }   

            .fold{
                cursor: pointer;
                
                .line{
                    flex: 1;
                    height: 1px;
                    background: #6F6F6F;
                }

                .right{
                    width: 76px;
                    line-height: 24px;
                    padding-left: 10px;

                    i{
                        font-size: 24px;
                        color: var(--color-primary);
                        margin-right: 5px;
                        vertical-align: top;
                    }

                    span{
                        font-size: 14px;
                        vertical-align: text-bottom;
                    }
                }
            }

            .screen-list{
                display: flex;
                flex-wrap: wrap;
                padding-top: 20px;
                border-bottom: 1px solid #6F6F6F;

                &.to-fold{
                    height: 0;
                    padding: 0;
                    overflow: hidden;
                    border: none;
                }

                .screen-item{
                    width: 190px;
                    margin: 0 30px 25px 30px;
                    position: relative;

                    .screen-photo{
                        width: 100%;
                        height: 133px;
                    }

                    .screen-img{
                        width: 100%;
                        height: 133px;
                        background: #999;

                        .screen-wrap{
                            width: 190px;
                        }

                        .el-image{
                            width: 100%;
                            height: 100%;
                        }

                    }

                    .screen-name{
                        position: absolute;
                        left: 0;
                        top: 0;
                        z-index: 99;
                        width: 100%;
                        text-align: center;
                        color: #fff;
                        background:rgba(17, 24, 39, 0.45);
                        padding: 5px;
                    }

                    .screen-bottom{
                        font-size: 12px;
                        text-align: center;
                        padding: 10px 0;

                        span{
                            height: 20px;
                            line-height: 18px;
                            border: 1px solid #171717;
                            border-radius: 2px;
                            margin-left: 8px;
                            padding: 0 10px;
                        }

                        a{
                            width: 25px;
                            height: 25px;
                            line-height: 25px;
                            text-align: center;
                            background: #848484;
                            color: #fff;
                            transform: rotate(20deg);
                            border-radius: 50%;
                        }
                    }

                    .el-carousel__indicators--horizontal{
                        bottom: 9px;
                        left: 50%;
                        transform: translateX(-50%);
                        background: rgba(216, 216, 216, 0.4);
                        padding: 2px 5px;
                        line-height: 0px;
                        border-radius: 5px;

                        .el-carousel__indicator--horizontal{
                            padding: 2px 4px;

                            .el-carousel__button{
                                width: 5px;
                                height: 5px;
                                border-radius: 50%;
                            }
                        }
                    }
                }
            }

            .bottom{
                text-align: right;
            }
        }
    }
</style>