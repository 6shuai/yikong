<template>
    <div class="lock-position-list">
        <div class="lock-order-warp" v-if="!showFreenScreen">
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
                            <p v-if="item.limits && item.limits.length ">{{ item.limits[0].type == 2 ? '禁止播放时间' : '限制播放时间' }} ：
                                <span v-for="(limitTime, index) in item.limits" :key="index">{{ limitTime.begin }} - {{ limitTime.end }}</span>
                            </p>
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
                            <div class="screen-img">
                                <el-image fit="cover" :src="screen.photo"></el-image>
                                <div class="screen-name overflow">{{ screen.name }} {{ screen.location ? `(${screen.location})` : '' }}</div>
                            </div>
                            <div class="screen-bottom">
                                <el-tag size="small" v-if="screen.city">{{ screen.city }}</el-tag>
                                <el-tag size="small" v-if="screen.level">{{ screen.level }}</el-tag>
                            </div>
                        </div>
                    </div>

                    <div class="bottom mt20 clearfix">
                        <el-button type="primary" size="small" plain @click="handleLockAgain(item)">再次预定</el-button>
                        <el-button type="danger" size="small" plain @click="handleShowFreed(item)">释放大屏</el-button>
                    </div>
    
                </el-card>
            </div>
    
            <!-- 场所屏幕详情 -->
            <place-screen-detail ref="placeScreenDetail"></place-screen-detail>
    
            <!-- 播放规则 -->
            <play-limit-rule ref="playLimitRule"></play-limit-rule>
            
        </div>

        <!-- 释放大屏 -->
        <freed-screen 
            v-if="showFreenScreen" 
            :orderDetail="orderDetail" 
            @freedSuccess="showFreenScreen=false; getScreenList()"
        ></freed-screen>

    </div>
</template>

<script>
import { projectLockList, projectLockPositionDeleteOrder } from '@/api/project'
import { priceFormat } from '@/utils/index'
import PlaceScreenDetail from './components/PlaceScreenDetail'
import PlayLimitRule from './components/PlayLimitRule'
import FreedScreen from './components/FreedScreen'

export default {
    components: {
        PlaceScreenDetail,
        PlayLimitRule,
        FreedScreen
    },
    data(){
        return {
            resData: [],
            tLoading: false,

            // 显示释放大屏
            showFreenScreen: false,

            // 订单详情
            orderDetail: undefined
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

        // 显示释放大屏
        handleShowFreed(item){
            this.showFreenScreen = true 
            this.orderDetail = item
            this.$router.push({
                path: this.$route.path,
                query: {
                    taget: 'freed'
                }
            })
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
        }
    },
    watch: {
        '$route.query'(n, o){
            if(this.$route.query.taget && this.orderDetail){
                this.showFreenScreen = true
            }else{
                this.showFreenScreen = false
            }
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

        .item{
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
                    .locating-time{
                        float: right;
                        font-size: 14px;
                        color: #999;
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
                    padding-left: 10px;

                    i{
                        font-size: 20px;
                        color: var(--color-primary);
                        margin-right: 5px;
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
                margin-left: -20px;

                &.to-fold{
                    height: 0;
                    overflow: hidden;
                }

                .screen-item{
                    width: 250px;
                    margin: 0 0 20px 20px;
                    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);

                    .screen-img{
                        width: 100%;
                        height: 180px;
                        position: relative;
                        background: #999;

                        .el-image{
                            width: 100%;
                            height: 100%;
                        }

                        .screen-name{
                            position: absolute;
                            left: 0;
                            bottom: 0;
                            width: 100%;
                            text-align: center;
                            color: #fff;
                            background: rgba($color: #000000, $alpha: 0.6);
                            padding: 5px;
                        }
                    }

                    .screen-bottom{
                        text-align: center;
                        padding: 10px 0;
                    }
                }
            }
        }
    }
</style>