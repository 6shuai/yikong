<template>
    <div class="material-match-wrap">
        <el-scrollbar class="screen-preview hidden-scroll-x mb10">
            <div class="order-list" v-for="(item, index) in screenData" :key="item.id">
                <div class="top-content">
                    <div class="left-time-info">
                        <div class="limt">
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
                        </div>
                        <div class="tip" v-if="item.disabled">
                            <p>素材时长 {{ item.duration > materialData.duration ? '<' : '>' }} 大屏时长暂不可选择</p>
                        </div>
                    </div>
                    <div class="right-limit">
                        <p v-if="item.limits && item.limits.length ">{{ item.limits[0].type == 2 ? '禁止播放时间' : '限制播放时间' }} ：
                            <span v-for="(limitTime, limitIndex) in item.limits" :key="limitIndex">{{ limitTime.begin }} - {{ limitTime.end }}</span>
                        </p>
                    </div>
                </div>

                <!-- 大屏列表 -->
                <el-scrollbar class="order-screen-scroll hidden-scroll-x">
                    <div class="screen-list-wrap">
                        <div 
                            class="screen-item" 
                            v-for="(child, cindex) in item.placeholders" 
                            :key="child.id"
                            @click.prevent="handelSelectScreen(item.disabled, child.id, index)"
                            :class="{ 'active': screenIds.includes(child.id) }"
                        >
    
                            <div class="content flex-between-center">
                                
                                <div class="screen-name overflow" :title="child.name + (child.location ? `(${child.location})` : '')">
                                    {{ child.name }} {{ child.location ? `(${child.location})` : '' }}
                                </div>
    
                                <div class="specification">{{ child.width }} * {{ child.height }}</div>
                            </div>
    
                            <div class="screen-img">
                                <el-image fit="cover" :src="child.photo"></el-image>
                            </div>
    
                            <div class="other flex">
                                <span>{{ child.city }}</span>
                                <span>{{ child.level }}</span>
                            </div>
                            
                        </div>


                    </div>
                </el-scrollbar>

                <div class="order-bottom flex-between-center">
                    <el-checkbox 
                        :disabled="(materialData.image && !item.disabled) ? false : true"
                        :value="orderScreenIds[index] && orderScreenIds[index].length == item.placeholders.length" 
                        @change="handleSelectAll(item.placeholders, index)"
                    >
                        全选
                    </el-checkbox>

                    <div class="order-number">订单编号: {{ item.orderNumber }}</div>

                </div>
            </div>
        </el-scrollbar>
        
        <div class="select-screen-and-submit flex-between-center">
            <div class="screen-count">本次已添加<span>{{ screenIds.length }}块</span>屏幕</div>
            <div class="btn-right">
                <el-button size="small" @click="$router.go(-1)">取消</el-button>
                <el-button 
                    type="primary"
                    size="small"
                    :disabled="!screenIds || !screenIds.length"
                    :loading="btnLoading"
                    @click="handleMaterialPut"
                >
                    确 定
                </el-button>
            </div>
        </div>

    </div>
</template>

<script>
import { projectMaterialLockList, projectMaterialPut, projectMaterialUpload } from '@/api/project'
import { aspectRatioCompute } from '@/utils/index'

export default {
    props: {
        materialData: Object,
        contentId: Number,
        materialDate: Array
    },
    data(){
        return {
            // 屏幕最大宽
            maxWidth: 250,

            // 屏幕列表
            screenData: [],
            
            // 大屏数量
            screenCount: null,

            // 已选中的屏幕列表id
            screenIds: [],

            // 按订单 区分  已选的屏幕id
            orderScreenIds: [],

            // 确定按钮loading
            btnLoading: false
        }
    },
    computed: {
        handleAspectRatioCompute(){
            return (width, height) => {
                return aspectRatioCompute(width, heith)
            }
        }
    },
    mounted() {
        this.getLockList()
    },
    methods: {
        // 锁位列表
        getLockList(){
            projectMaterialLockList({ project: this.$route.params.id }).then(res => {
                if(res.code === this.$successCode){
                    this.screenData = res.obj
                }
            })
        },

        // 检查大屏的时长 是否符合素材的时长 
        durationWhetherMatch(){
            for(let i = 0 ; i < this.screenData.length; i++){
                this.screenCount += this.screenData[i].placeholders.length
                let order = this.screenData[i]
                // 检查大屏的时长 是否符合素材的时长  素材包时长比输入的值默认多一秒
                if(order.duration + 1 > this.materialData.duration && order.duration + 1 - this.materialData.duration <= 1){
                    this.$set(this.screenData[i], 'disabled', false)
                }else{
                    this.$set(this.screenData[i], 'disabled', true)
                }
            }
        },

        // 选择屏幕
        handelSelectScreen(disabled, id, index){
            if(disabled || !this.materialData.image) return 
            if(this.screenIds.includes(id)){
                let i = this.screenIds.indexOf(id)
                this.$delete(this.screenIds, i)

                let j = this.orderScreenIds[index].indexOf(id)
                this.$delete(this.orderScreenIds[index], j)
            }else{
                this.$set(this.screenIds, this.screenIds.length, id)
                if(!this.orderScreenIds[index]) this.orderScreenIds[index] = []
                this.$set(this.orderScreenIds[index], this.orderScreenIds[index].length, id)
            }
        },

        // 全选
        handleSelectAll(placeholders, index){
            let result = true
            if(this.orderScreenIds[index] && this.orderScreenIds[index].length == placeholders.length){
                result = false                
            }
            for(let i = 0; i < placeholders.length; i++){
                let id = placeholders[i].id
                if(this.screenIds.includes(id) && !result){
                    let idIndex = this.screenIds.indexOf(id)
                    this.$delete(this.screenIds, idIndex)

                    let idIndex2 = this.orderScreenIds[index].indexOf(id)
                    this.$delete(this.orderScreenIds[index], idIndex2)
                }else if(!this.screenIds.includes(id) && result){
                    this.$set(this.screenIds, this.screenIds.length, id)
                    if(!this.orderScreenIds[index]) this.orderScreenIds[index] = []
                    this.$set(this.orderScreenIds[index], this.orderScreenIds[index].length, id)
                }
            }
        },

         // 当前时间是否在这个范围内
        isDuringDate (date, beginDateStr, endDateStr) {
            let curDate = new Date(date),
                beginDate = new Date(beginDateStr),
                endDate = new Date(endDateStr);
            if (curDate >= beginDate && curDate <= endDate) {
                return true
            }
            return false
        },

        // 二维数组 转为一维数组 
        arrayFormat(arr){
            let newArr = arr.reduce((acc, curr) => {
                return acc.concat(curr)
            })
            return newArr
        },

        // 素材投放
        async handleMaterialPut(){
            
            let data = {
                project: this.$route.params.id,
                content: {
                    id: this.contentId,
                    duration: this.materialData.duration
                },
                placeholders: this.screenIds
            }

            let result = true
            if(this.materialDate && this.materialDate.length){
                data.publishDate = this.materialDate[0]
                data.dueDate = this.materialDate[1]

                for(let i = 0; i < this.screenData.length; i++){
                    let { publishDate, dueDate } = this.screenData[i]
                    if(this.orderScreenIds[i] && this.orderScreenIds[i].length && (!this.isDuringDate(data.publishDate, publishDate, dueDate) || !this.isDuringDate(data.dueDate, publishDate, dueDate))){
                        console.log(data.publishDate,data.dueDate,  publishDate, dueDate, this.isDuringDate(data.publishDate, publishDate, dueDate), this.isDuringDate(data.dueDate, publishDate, dueDate))
                        result = false
                    }
                }
            }

            if(!result){
                this.$confirm('您选择的上刊大屏不在素材可播放的时间内，请重新选择。', '提示', {
                    confirmButtonText: '确定',
                    showCancelButton: false
                })
                return
            }


            let packageId =  await this.uploadMaterial()
            this.btnLoading = true
            projectMaterialPut(data).then(res => {
                this.btnLoading = false
                if(res.code === this.$successCode){
                    this.$message.success('素材投放成功~')
                    this.$emit('materialPutSuccess')
                }
            })
        },

        // 调用上传素材接口
        uploadMaterial(){
            return new Promise((resolve, reject) => {
                let data = {
                    project: this.$route.params.id,
                    content: this.contentId,
                }
                projectMaterialUpload(data).then(res => {
                    this.uploadLoading = false
                    if(res.code === this.$successCode){
                        this.packageId = res.obj
                        resolve(res.obj)
                    }else{
                        reject('error')
                        this.btnLoading = false
                    }
                })
            })
        },
    }
}
</script>

<style lang="scss">
    $borderColor: #e5e5e5;

    .material-match-wrap{
        .screen-preview{
            height: calc(100vh - 450px);
        
            .order-list{
                box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
                background: #fff;
                padding: 20px;
                margin-bottom: 20px;

                .top-content{
                    display: flex;
                    justify-content: space-between;
                    padding-bottom: 10px;

                    p{
                        line-height: 26px;
                        font-size: 14px;
                    }

                    .left-time-info{
                        display: flex;

                        .limt{
                            font-weight: bold;
                            display: inline-block;

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
                        


                        .tip{
                            display: inline-block;
                            background: #FF81B0;
                            padding: 5px 10px;
                            height: 36px;
                            color: #fff;
                            margin-left: 30px;
                        }
                    }


                    .right-limit{
                        display: flex;
                        align-items: end;
                    }
                }   

                .order-bottom{
                    font-size: 14px;
                    padding-top: 10px;
                }

            }

            .order-screen-scroll {
                padding-bottom: 10px;
                border-top: 1px solid $borderColor;
                border-bottom: 1px solid $borderColor;

                .el-scrollbar__wrap{
                    max-height: 410px;
                }
            }

            .screen-list-wrap{
                display: flex;
                flex-wrap: wrap;
                padding-top: 20px;
                
                .screen-item{
                    width: 240px;
                    margin: 0 12px 20px 8px;
                    padding: 8px 12px;
                    position: relative;
                    cursor: pointer;
                    box-shadow: 0px 1px 2px 0px rgba(0, 0, 0, 0.25);

                    &.active{
                        background: #CBE2FF;
                    }

                    .content{
                        line-height: 20px;
                        padding: 2px 0 8px 0;

                        .screen-name{
                            width: 130px;
                            color: #71717A;
                            font-weight: 700;
                        }

                        .specification{
                            font-size: 12px;
                            color: #D4D4D8;
                        }
                    }

                    .screen-img{
                        width: 215px;
                        height: 95px;

                        .el-image{
                            width: 100%;
                            height: 100%;
                        }
                    }

                    .other{
                        padding-top: 8px;
                        
                        span{
                            font-size: 12px;
                            height: 20px;
                            line-height: 18px;
                            color: #AAAAAA;
                            border: 1px solid #AAAAAA;
                            border-radius: 2px;
                            padding: 0 8px;
                            margin-right: 10px;
                        }
                    }
                }
            }
        }

        .select-screen-and-submit{
            position: absolute;
            bottom: 0;
            left: 0;
            padding: 0 50px;
            width: 100%;
            height: 59px;
            background: #F3F4F6;

            .screen-count{
                color: #3D3D3D;
                span{
                    font-weight: bold;
                    margin: 0 5px;
                }
            }
        }
    }
</style>