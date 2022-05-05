<template>
    <div class="material-match-wrap">
        <div class="screen-preview mb10">
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
                            <p>物料时长 {{ item.duration > materialData.duration ? '<' : '>' }} 大屏时长暂不可选择</p>
                        </div>
                    </div>
                    <div class="right-limit">
                        <p v-if="item.limits && item.limits.length ">{{ item.limits[0].type == 2 ? '禁止播放时间' : '限制播放时间' }} ：
                            <span v-for="(limitTime, index) in item.limits">{{ limitTime.begin }} - {{ limitTime.end }}</span>
                        </p>
                    </div>
                </div>

                <!-- 大屏列表 -->
                <div class="screen-list-wrap">
                    <div 
                        class="screen-item" 
                        v-for="(child, cindex) in item.placeholders" 
                        :key="child.id"
                        @click.prevent="handelSelectScreen(item.disabled, child.id, index)"
                    >
    
                        <el-checkbox 
                            v-show="materialData.image"
                            :disabled="item.disabled"
                            :value="screenIds.includes(child.id)" 
                            @change="handelSelectScreen(item.disabled, child.id, index)"
                        ></el-checkbox>
    
                        <div class="content">
                            <div 
                                class="screen"
                                :style="{
                                    width: child.height > child.width ? child.width / child.height * maxWidth + 'px' : maxWidth + 'px',
                                    height: child.height > child.width ? maxWidth + 'px' : child.height / child.width * maxWidth + 'px'
                                }"
                            >
                                <el-image 
                                    v-if="materialData.image"
                                    class="material"
                                    :src="materialData.image"
                                ></el-image>
                            </div>

                            <!-- 物料尺寸不匹配 -->
                            <div class="screen-detail" v-if="materialData.width && !item.disabled && aspectRatioCompute(child.width, child.height) != aspectRatioCompute(materialData.width, materialData.height)">
                                <article>
                                    <p>建议上传合适尺寸的物料</p>
                                </article>
                            </div>

                            <!-- 当前屏幕已上传的物料 -->
                            <div class="material-count" v-if="child.materials && child.materials.length && child.materials[0].id">

                                <span v-for="(m, mIndex) in child.materials.length" :key="mIndex"></span>

                                <ul class="material-list">
                                    <li v-for="content in child.materials">
                                        <el-image :src="content.regions[0].content"></el-image>
                                    </li>
                                </ul>
                            </div>
    
                        </div>
    
                        <div class="screen-name overflow" :class="{ 'disabled': item.disabled }">
                            {{ child.name }} {{ child.location ? `(${child.location})` : '' }}
                        </div>
                    </div>
                </div>


                <!-- 全选 -->
                <el-checkbox 
                    class="mt10"
                    :disabled="(materialData.image && !item.disabled) ? false : true"
                    :value="orderScreenIds[index] && orderScreenIds[index].length == item.placeholders.length" 
                    @change="handleSelectAll(item.placeholders, index)"
                >
                    全选
                </el-checkbox>

            </div>
        </div>
        
        <div class="select-screen-and-submit">
            <el-checkbox v-model="immediate" class="mr20">即时生效</el-checkbox>
            <el-button 
                type="primary"
                :disabled="!screenIds || !screenIds.length"
                :loading="btnLoading"
                @click="handleMaterialPut"
            >
                确 定
            </el-button>
        </div>

    </div>
</template>

<script>
import { projectMaterialLockList, projectMaterialPut, projectMaterialUpload } from '@/api/project'

export default {
    props: {
        materialData: Object,
        contentId: Number
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

            // 是否即时上刊
            immediate: false,

            // 确定按钮loading
            btnLoading: false
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

        // 检查大屏的时长 是否符合物料的时长 
        durationWhetherMatch(){
            for(let i = 0 ; i < this.screenData.length; i++){
                this.screenCount += this.screenData[i].placeholders.length
                let order = this.screenData[i]
                // 检查大屏的时长 是否符合物料的时长  物料包时长比输入的值默认多一秒
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

        // 二维数组 转为一维数组 
        arrayFormat(arr){
            let newArr = arr.reduce((acc, curr) => {
                return acc.concat(curr)
            })
            return newArr
        },

        //宽高比计算
        aspectRatioCompute(width, height){

            // id=1(16:9)  id=2(16:10)  id=3(9:16)  id=4(10:16)  id=5(4:3)  id=6(3:4)  id=7(21:9)
            if(width > height){
                let ratio = width / height;
                if(ratio < 1.5){
                    return '4 : 3'
                }else if(ratio >= 1.5 && ratio < 2.3){
                    return '16 : 9'
                }else{
                    return '21 : 9'
                }
            }else{
                let ratio = height / width;
                if(ratio < 1.5){
                    return '3 : 4'
                }else if(ratio >= 1.5 && ratio < 2.3){
                    return '9 : 16'
                }else{
                    return '21 : 9'
                }
            }
        },

        // 物料投放
        async handleMaterialPut(){
            this.btnLoading = true
            let packageId =  await this.uploadMaterial()

            let data = {
                packageId: packageId,
                immediate: this.immediate,
                placeholders: this.screenIds
            }

            projectMaterialPut(data).then(res => {
                this.btnLoading = false
                if(res.code === this.$successCode){
                    this.$message.success('物料投放成功~')
                    this.$emit('materialPutSuccess')
                }
            })
        },

        // 调用上传物料接口
        uploadMaterial(){
            return new Promise((resolve, reject) => {
                let data = {
                    layout: 13, // 屏幕布局id 默认通屏
                    project: this.$route.params.id,
                    regions: [
                        {
                            // 屏幕区域id 默认通屏 21
                            region: 21,  
                            content: this.contentId,
                            duration: this.materialData.duration
                        }
                    ]
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
        padding-bottom: 80px;
        position: relative;  

        .screen-preview{
            .order-list{
                box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
                padding: 20px;
                margin: 20px 0;

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

            }

            .screen-list-wrap{
                display: flex;
                flex-wrap: wrap;
                padding-top: 20px;
                border-top: 1px solid $borderColor;
                border-bottom: 1px solid $borderColor;
                
                .screen-item{
                    width: 300px;
                    margin: 0 8px 20px 8px;
                    position: relative;
                    cursor: pointer;

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

                    .content{
                        width: 100%;
                        height: 200px;
                        border: 1px solid #5e5e5e;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        position: relative;

                        .screen{
                            background: #000;
                            text-align: center;

                            .material{
                                display: inline-block;
                                background: #999;
                                height: 100%;
                            }
                        }

                        .screen-detail{
                            position: absolute;
                            top: 0;
                            left: 0;
                            width: 100%;
                            height: 100%;
                            display: flex;
                            justify-content: center;
                            align-items: center;

                            &.disabled{
                                background: #e4e4e4b3;
                                color: #000;
                            }

                            article{
                                width: 100%;
                                text-align: center;
                            }

                            p{
                                line-height: 26px;
                                background: #DB5D8C;
                                color: #fff;
                                padding: 5px;
                            }
                        }

                        .material-count{
                            width: 100%;
                            position: absolute;
                            bottom: 5px;
                            margin: 0 10px;
                            display: flex;
                            justify-content: end;

                            span{
                                width: 8px;
                                height: 8px;
                                border-radius: 50%;
                                background: #000;
                                margin-right: 5px;
                            }

                            .material-list{
                                position: absolute;
                                top: 10px;
                                right: 10px;
                                z-index: 99;
                                box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
                                max-width: 230px;
                                display: flex;
                                flex-wrap: wrap;
                                padding:0 10px 10px 0;
                                background: #fff;
                                opacity: 0;
                                height: 0;
                                transition: all .3s;

                                li{
                                    width: 100px;
                                    height: 60px;
                                    border: 1px solid #e5e5e5;
                                    margin: 10px 0 0 10px;
                                    display: flex;
                                    justify-content: center;
                                    align-items: center;

                                    .el-image{
                                        height: 100%;
                                    }
                                }
                            }

                            &:hover{
                                .material-list{
                                    opacity: 1;
                                    height: auto;
                                }
                            }
                        }
                    }

                    .screen-name{
                        line-height: 49px;
                        text-align: center;
                        font-weight: bold;

                        &.disabled{
                            background: #e4e4e4b3;
                        }

                        &.suggest{
                            background: #D17799;
                            color: #fff;
                        }
                    }
                }
            }
        }

        .select-screen-and-submit{
            display: flex;
            align-items: center;
            justify-content: end;
            position: fixed;
            left: 0;
            bottom: 0px;
            z-index: 99;
            padding: 20px;
            width: 100%;
            background: #eeeeee;

            .el-button{
                margin-left: 20px;
            }
        }
    }
</style>