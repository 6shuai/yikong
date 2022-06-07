<template>
    <el-card class="capturing-wrap">
        
        <!-- 返回 -->
        <i class="el-icon-d-arrow-left" title="返回" @click="$parent.showCapturing = false"></i>

        <el-card class="screen-play-detail"> 
            <div class="detail-content">
                <div class="property">
                    <p class="title">播放规则
                        <span class="limit-1" v-if="limitParams.type==1">轮播</span>
                        <span class="limit-2" v-if="limitParams.type==3">插播</span>
                    </p>
                    <p>
                        <span>开始日期: {{ limitParams.publishDate }}</span>
                        <span class="ml10" v-if="limitParams.type==1">素材时长: {{ limitParams.duration }}s</span>
                        <span class="ml10" v-if="limitParams.type==3">开始时间: {{ limitParams.time }}</span>
                    </p>
                    <p>
                        <span>结束日期: {{ limitParams.dueDate }}</span>
                        <span class="ml10" v-if="limitParams.type==1">每日播放次数: {{ limitParams.times }}次</span>
                        <span class="ml10" v-if="limitParams.type==3">播放时长: {{ limitParams.duration }}s</span>
                    </p>

                    <div class="limit" v-if="limitParams.limits && limitParams.limits.length">
                        <p>{{ limitParams.limits[0].type == 1 ? '限制播放时间' : '禁止播放时间' }}: 
                            <span v-if="!limitParams.limits || !limitParams.limits.length">--</span>
                            <span v-else v-for="(item, index) in limitParams.limits" :key="index">
                                {{ item.begin + ' - ' + item.end }} 
                                {{ index!= limitParams.limits.length-1 ? ' , ' : '' }}
                            </span>
                        </p>
                    </div>
                </div>

                <!-- 是否可以编辑播放规则 -->
                <a 
                    href="javascript:;" 
                    class="edit-right" 
                    @click="handleShowPlayRule"
                    v-if="showEdit"
                >
                    编辑>>
                </a>

            </div>
        </el-card>

        <el-scrollbar class="hidden-scroll-x screen-scrollbar" style="height: calc(100vh - 416px)">
            <div class="captring-screen-list" id="app-main-wrap">
                <div 
                    class="item" 
                    v-for="(item, index) in screenList"
                    :key="index"
                    :style="{ width: placeW }"
                    @click.prevent="handelSelectScreen(item.id)"
                >
                    <div class="screen-content">
                        <el-checkbox 
                            :value="screenIds.includes(item.id)" 
                            :disabled="item.disabled"
                            @change="handelSelectScreen(item.id)"
                        ></el-checkbox>
                        <div class="screen-image">
                            <el-image 
                                :style="{height: imageH+'px'}"
                                fit="cover" 
                                :src="item.defaultShow || item.photo"
                            ></el-image>
    
                            <p class="screen-name">{{ item.displayName }}{{ item.location ? `(${item.location})` : '' }}</p>
                            <p class="price" v-show="realPrice(item.price, index)">
                                <span>单价: 
                                    <s v-if="discount">{{ realPrice(item.price, index) }}</s>
                                    <span v-else>{{ realPrice(item.price, index) }}</span>
                                </span>
                                <span class="current-price" v-if="discount">{{ discountPrice(item.price, index) }}</span>
                            </p>
                        </div>
    
                        <!-- 广告位已满 -->
                        <div class="advertising-full" v-if="item.disabled">
                            <div class="text">该块大屏广告位已满,请重新选择大屏。</div>
                        </div>
                    </div>

                </div>
            </div>
        </el-scrollbar>

        <div class="bottom-operate mt20">
            <div class="checkbox-wrap">
                <el-checkbox 
                    v-model="isSelectAll" 
                    @change="handleSelectAll"
                >
                    全选
                </el-checkbox>
                <el-button 
                    type="warning" 
                    size="mini"
                    @click="handleBatchDelete"
                >
                    批量删除
                </el-button>
            </div>
            <div class="screen-count-and-price">
                <b class="conut">已选大屏<span class="active">{{ screenIds.length }}</span>个</b>
                <span class="discount ml10">合计(含折扣
                    <el-select clearable size="mini" v-model="discount" placeholder="请选择">
                        <el-option
                            v-for="(item, index) in 9"
                            :key="index"
                            :label="9-index"
                            :value="9-index">
                        </el-option>
                    </el-select>
                折)：</span>
                <b class="price active">{{ screenTotalPrice }}</b>
                <el-button 
                    type="info" 
                    size="small"
                    @click="handleLock"
                    :loading="btnLoading"
                    :disabled="screenIds.length ? false : true"
                >
                    确 定
                </el-button>
            </div>
        </div>


        <!-- 寻位详情 -->
        <locating-result ref="locatingResult" @lockFail="showEdit=true"></locating-result>

        <!-- 播放规则 -->
        <play-limit-rule ref="playLimitRule" @editSuccess="init"></play-limit-rule>

    </el-card>

</template>

<script>
import { screenSizeWatch } from '@/mixins'
import { priceFormat } from '@/utils/index'
import { projectLockPositionCreate } from '@/api/project'
import LocatingResult from './LocatingResult'
import PlayLimitRule from './PlayLimitRule'

export default {
    components: {
        LocatingResult,
        PlayLimitRule
    },
    props: {
        selectedScreenList: Array
    },
    mixins: [screenSizeWatch],
    computed: {
        // 真实价格
        realPrice(){
            return (price, index) => {
                if(!this.playDay) return 0
                // 一天播放时长
                let { type, duration, times } = this.limitParams
                let durationDay = type == 1 ? duration * times : duration
                let amount = price * this.playDay * durationDay
                let result = priceFormat(amount)
                this.$set(this.screenList[index], 'realPrice', amount || 0)
                return result
            }
        },

        // 打折价格
        discountPrice(){
            return (price, index) => {
                if(!this.discount) {
                    this.screenList[index].discountPrice = 0
                    return 0
                }
                // 一天播放时长
                let { type, duration, times } = this.limitParams
                let durationDay = type == 1 ? duration * times : duration
                let amount = price * this.playDay * durationDay * (this.discount / 10)
                let result = priceFormat(amount)
                this.$set(this.screenList[index], 'discountPrice', amount)
                return result
            }
        },

        // 总价格
        screenTotalPrice(){
            let totalPrice = 0
            for(let i = 0; i < this.screenList.length; i++){
                if(this.screenIds.includes(this.screenList[i].id)){
                    totalPrice += this.discount ? this.screenList[i].discountPrice : this.screenList[i].realPrice
                }
            }
            return priceFormat(totalPrice)
        }
    },
    data(){
        return {
            // 播放规则
            limitParams: {},

            // 是否可以编辑播放规则   锁位失败的情况下可以编辑
            showEdit: false,

            // 折扣
            discount: null,

            // 播放天数
            playDay: 0,

            // 屏幕列表
            screenList: [],

            // 已选的屏幕id
            screenIds: [],

            // 是否全选
            isSelectAll: true,

            // 提交按钮loading
            btnLoading: false
        }
    },
    mounted() {
        this.init()

        // 播放天数
        this.playDay = this.getDaysBetween(this.limitParams.publishDate, this.limitParams.dueDate, this.screenTotalPrice)


        for(let i = 0 ; i < this.screenList.length; i++){
            this.screenIds.push(this.screenList[i].id)
        }
    },
    methods: {
        init(){
            if(this.$store.state.project.playRuleData){
                this.limitParams = this.$store.state.project.playRuleData
                this.screenList = JSON.parse(JSON.stringify(this.selectedScreenList.flat()))
            }else{
                this.$router.push(`/project/${this.$route.params.id}/locating`)
            }
        },

        // 编辑播放规则
        handleShowPlayRule(){
            this.$refs.playLimitRule.init(this.$store.state.project.playRuleData)
        },

        // 选择屏幕
        handelSelectScreen(id){
            if(this.screenIds.includes(id)){
                let index = this.screenIds.indexOf(id)
                this.screenIds.splice(index, 1)
            }else{
                this.screenIds.push(id)
            }
            this.isSelectAll = this.screenIds.length === this.screenList.length
        },

        // 全选
        handleSelectAll(){
            if(this.screenIds.length === this.screenList.length){
                this.screenIds = []
                this.isSelectAll = false
            }else{
                this.screenIds = []
                for(let i = 0 ; i < this.screenList.length; i++){
                    this.screenIds.push(this.screenList[i].id)
                }
                this.isSelectAll = true
            }
        },

        // 批量删除
        async handleBatchDelete(){
            let ids = JSON.parse(JSON.stringify(this.screenIds))
            let data = await this.screenList.filter((item) => {

                let result = !ids.includes(item.id)
                let index = this.screenIds.indexOf(item.id)
                this.screenIds.splice(index, 1)
                return result
            })
            this.screenList = data
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

    
        // 确定锁位
        handleLock(){
            this.limitParams.project = Number(this.$route.params.id)
            this.limitParams.screens = this.screenIds

            this.btnLoading = true
            projectLockPositionCreate(this.limitParams).then(res => {
                this.btnLoading = false
                if(res.code === this.$successCode){

                    this.$refs.locatingResult.showLocatingResultDialog(res.obj.screens, this.screenList, this.screenTotalPrice)
                }
            })
        }
    }
}

</script>

<style lang="scss">
    $borderColor: #e5e5e5;
    .capturing-wrap{
        width: 100%;
        padding: 0 20px;
        position: relative;

        .el-icon-d-arrow-left{
            position: absolute;
            top: 20px;
            left: 10px;
            font-weight: bold;
            font-size: 20px;
            cursor: pointer;

            &:hover{
                color: var(--color-primary);
            }
        }

        .screen-play-detail{
            background: #e3fdfd;
            padding: 0 20px;

            p{
                line-height: 24px;

                &.title{
                    font-size: 18px;
                    font-weight: bold;
                    padding-bottom: 10px;
                }
            }

            .detail-content{
                display: flex;
                justify-content: space-between;
                align-items: flex-end;

                .property .title{
                    span{
                        display: inline-block;
                        background: #0091C2;
                        border-radius: 4px;
                        color: #fff;
                        padding: 2px 10px;
                        font-size: 14px;
                        line-height: 20px;
                        margin-left: 10px;

                        &.limit-2{
                            background: #C27B00;
                        }
                    }
                }

                .edit-right{
                    color: var(--color-primary);
                }
            }
        }   

        .captring-screen-list{
            display: flex;
            flex-wrap: wrap;
            margin-left: -20px;

            .item{
                .screen-content{
                    border: 1px solid $borderColor;
                    border-radius: 4px;
                    cursor: pointer;
                    margin: 20px 0 0 20px;
                    overflow: hidden;
                    position: relative;
                }

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

                .el-image{
                    width: 100%;
                    height: 160px;
                }

                p{
                    line-height: 30px;
                    padding: 0 10px;

                    &.screen-name{
                        text-align: center;
                    }

                    &.price{
                        .current-price{
                            color: var(--color-info);
                            font-weight: bold;
                            margin-left: 5px;
                        }
                    }
                }
                
                .advertising-full{
                    position: absolute;
                    top: 0;
                    left: 0;
                    z-index: 100;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, .6);
                    display: flex;
                    justify-content: center;
                    align-items: center;

                    .text{
                        width: 100%;
                        padding: 20px;
                        background: #FF8E8E;
                        text-align: center;
                    }
                }
            }
        }

        .bottom-operate{
            width: 100%;
            height: 60px;
            border-top: 1px solid $borderColor;
            display: flex;
            align-items: center;
            padding: 0 20px;

            .checkbox-wrap{
                width: 150px;

                .el-checkbox{
                    margin-right: 10px;
                }
            }

            .screen-count-and-price{
                flex: 1;
                text-align: right;
                
                .active{
                    color: var(--color-info);
                    padding: 0 5px;
                }

                .el-select{
                    width: 83px;
                }
            }
        }
    }
</style>


