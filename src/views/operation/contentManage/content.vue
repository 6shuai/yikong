<!--
 * @Author: liushuai
 * @Date: 2022-04-28 11:15:22
 * @LastEditors: liushuai
 * @LastEditTime: 2022-06-14 15:16:57
 * @Description: file content
 * @FilePath: \pclient\src\views\operation\contentManage\content.vue
-->
<template>
    <div 
        class="content-manage-wrap"
        @dragenter="handleShowPutMaterial('drag')"
    >
        
        <left-screen-list @currentScreenId="getScreenDataAndOrder"></left-screen-list>

        <div class="right-content" v-loading="materialDataLoading">
            <div class="content-wrap">
                <put-material 
                    v-show="showPutMaterial"
                    ref="putMaterial" 
                    :type="uploadMaterialType"
                    @closeUpload="closeUpload"
                    @putSuccess="getScreenMaterialList()"
                    @addLayout="addLayout"
                ></put-material>

                <div class="content-wrap-top" v-if="materialData">
                    <p>全部内容</p>
                    <div class="btn-wrap">
                        <el-button 
                            type="primary" 
                            @click="showSetDefaultMaterial=true"
                        >
                            默认素材
                        </el-button>
                        <el-button type="primary">素材库</el-button>
                    </div>
                </div>

                <el-empty v-else></el-empty>

                <el-scrollbar class="hidden-scroll-x" v-if="materialData">
                    <div class="content-wrap flex">
                        <div class="content-item" v-for="(item, index) in materialData" :key="item.id">

                            <i class="el-icon-warning" v-if="!regionsAllHasContent(item.screenLayout.regions) && item.type == 'other'"></i>

                            <div class="flex-between-center top-wrap">
                                <div>{{ findTimePool(item.projectId) }}</div>
                                <div class="duration" v-if="item.duration || item.longestTime">
                                    {{ item.duration || item.longestTime }}s
                                    <i class="el-icon-arrow-down" @click="e=> showSetDurationPop(e, index, item.longestTime || item.duration)"></i>
                                </div>
                            </div>

                            <div class="layout-wrap flex-center">
                                <div 
                                    class="layout"
                                    :style="{
                                        width: item.screenLayout.height > item.screenLayout.width ? item.screenLayout.width / item.screenLayout.height * layoutMaxHeight + 'px' : layoutMaxWidth + 'px',
                                        height: item.screenLayout.height > item.screenLayout.width ? layoutMaxHeight + 'px' : item.screenLayout.height / item.screenLayout.width * layoutMaxWidth + 'px'
                                    }"
                                >
                                    <div
                                        class="region"
                                        v-for="(regions, regionsIndex) in item.screenLayout.regions"
                                        :key="regionsIndex"
                                        :style="{
                                            width: regions.region.width + '%',
                                            height: regions.region.height + '%', 
                                            left: regions.region.x + '%',
                                            top:  regions.region.y + '%', 
                                        }"
                                    >   
    
                                        <el-image v-if="regions.content" :src="regions.content.thumbnail || regions.content.content"></el-image>   
    
                                        <div class="upload-content flex-center" v-else-if="item.type=='other'">
                                            <img v-if="!regions.uploadLoading" src="../../../assets/images/upload.png" />
                                            <el-progress v-else type="circle" :width="40" :percentage="regions.percentage"></el-progress>
                                            <material-upload
                                                @uploadState="uploadState($event, index, regionsIndex)"
                                            ></material-upload>
                                        </div>


                                        <!-- 素材操作按钮 -->
                                        <ul class="content-operate flex-center" v-if="regions.content && item.type!='other'">
                                            <li class="adaptation flex-center" @click="e=> showPop(e, item.id, item.projectId, regions.id)">
                                                <img src="../../../assets/images/operation_adaptation.png" />
                                            </li>
                                        </ul>
    
    
                                    </div>
                                </div>
                            </div>
                            
                            <el-scrollbar class="hidden-scroll-x screen-content">
                                <ul>
                                    <li v-for="(content, contentIndex) in item.screenLayout.regions" :key="contentIndex" :title="content.content ? content.content.name : ''">
                                        <span class="screen-layout-name overflow">{{ item.screenLayout.regions[contentIndex].region.name }}</span>
                                        <span class="content-name overflow">
                                            <img v-if="content.content && content.content.type==1" src="../../../assets/images/operation_content_type_img.png" />
                                            <img v-if="content.content && content.content.type==2" src="../../../assets/images/operation_content_type_video.png" />
                                            {{ content.content ? content.content.name : '素材文件待上传' }}
                                            <span class="duration" v-if="content.content && content.content.duration">{{ content.content.duration }}s</span>
                                        </span>
                                    </li>
                                </ul>
                            </el-scrollbar>

                        </div>

                        <div 
                            class="content-item add flex-center" 
                            @click="handleShowPutMaterial('add')"
                        >
                            <i class="el-icon-plus"></i>
                            <select-other-layout @selectedLayout="selectedLayout"></select-other-layout>
                        </div>
                    </div>
                </el-scrollbar>

            </div>
        </div>

        <!-- 设置默认素材 -->
        <set-default-material 
            :screenLayout="screenLayout.layout ? screenLayout.layout : {}" 
            :screenId="screenId"
            v-if="showSetDefaultMaterial"
            @hide="showSetDefaultMaterial = false"
            @setSuccess="showSetDefaultMaterial=false;getScreenMaterialList()"
        ></set-default-material>

        <!-- 设置内容适配模式 -->
        <content-adaptation ref="contentAdaptation"></content-adaptation>

        <!-- 设置素材包时长 -->
        <set-content-duration ref="setContentDuration" @saveContentDuration="saveContentDuration"></set-content-duration>

    </div>
</template>

<script>
import { getScreenLayoutAndOrderDetail, operationMaterialData, operationPutOtherLayoutMaterial } from '@/api/contentManage'
import LeftScreenList from '../components/LeftScreenList'
import SetDefaultMaterial from './components/SetDefaultMaterial'
import PutMaterial from './components/PutMaterial'
import SelectOtherLayout from './components/SelectOtherLayout'
import MaterialUpload from '../components/MaterialUpload'
import ContentAdaptation from './components/ContentAdaptation'
import SetContentDuration from './components/SetContentDuration'

export default {
    components: {
        LeftScreenList,
        SetDefaultMaterial,
        PutMaterial,
        SelectOtherLayout,
        MaterialUpload,
        ContentAdaptation,
        SetContentDuration
    },
    data() {
        return {
            // 当前屏幕id
            screenId: null,

            // 当前屏幕布局
            screenLayout: {},

            // 屏幕素材数据
            materialData: undefined,

            materialDataLoading: false,

            // 显示管理默认素材
            showSetDefaultMaterial: false,

            // 显示上传素材
            showPutMaterial: false,

            layoutMaxWidth: 314,
            layoutMaxHeight: 135,

            // 上传素材方式  add 点击添加按钮   drag 拖放
            uploadMaterialType: 'add',
        }
    },
    computed: {
        findTimePool(){
            return (projectId) => {
                let orders = this.screenLayout.orders
                let msg = ''
                for(let i = 0; i < orders.length; i++){
                    if(orders[i].projectId == projectId){
                        msg = orders[i].roomType == 1 ? '商场' : orders[i].roomType == 2 ? '小风景' : '政府'
                    }
                }
                return msg
            }
        },

        // 其他布局 区域内容是否都已上传
        regionsAllHasContent(){
            return (data) => {
                let result = true
                for(let i = 0; i < data.length; i++){
                    if(!data[i].content){
                        result = false
                    }
                }
                return result
            }
        } 
    },
    methods: {
        // 获取屏幕数据和绑定的锁位订单
        getScreenDataAndOrder({ id }){
            this.materialData = undefined
            this.materialDataLoading = true
            this.showPutMaterial = false
            getScreenLayoutAndOrderDetail({ screen: id }).then(res => {
                this.screenLayout = res.obj
                if(this.screenLayout) {
                    this.getScreenMaterialList(id)
                } else {
                    this.materialDataLoading = false
                }
            })
        },

        // 获取屏幕素材数据
        getScreenMaterialList(id = this.screenId){
            this.screenId = id
            operationMaterialData({ screen: id }).then(res => {
                this.materialDataLoading = false
                this.materialData = res.obj
            })
        },

        handleShowPutMaterial(type){
            this.uploadMaterialType = type
            this.showPutMaterial = true
            this.$nextTick(() => {
                this.$refs.putMaterial.showUploadMaterial(this.screenLayout.orders)
            })
        },
        
        // 关闭上传窗口
        closeUpload(val){
            this.showPutMaterial = false
        },

        // 选择了其他布局
        selectedLayout(data){
            this.otherLayoutData = {
                type: 'other',
                screenLayout: data
            }
            this.handleShowPutMaterial('other')
        },

        // 往内容列表 添加一个其他布局的数据
        addLayout(projectId){
            this.otherLayoutData.projectId = projectId
            this.materialData.push(this.otherLayoutData)
        },

        // 上传状态
        uploadState(event, index, regionsIndex){
            let { type, completeVal, obj } = event

            let data = this.materialData[index]

            data.screenLayout.regions[regionsIndex] = {
                ...data.screenLayout.regions[regionsIndex],
                uploadLoading: type=='progress' ? true : false,
                percentage: completeVal || 0,
                content: obj || null
            }

            if(obj && obj.duration) data.longestTime = (obj.duration > data.longestTime || !data.longestTime) ? obj.duration : data.longestTime


            this.$set(this.materialData, index, data)


            if(this.regionsAllHasContent(data.screenLayout.regions)){
                console.log('全部上传完成~', data)

                let regionsData = this.regionsData(data.screenLayout.regions)

                let params = {
                    project: data.projectId,
                    duration: data.duration || data.longestTime,
                    layout: {
                        id: data.screenLayout.id,
                        regions: regionsData
                    }
                }

                this.putOtherLayout(params)
            }
        },

        // 获取逻辑区域id 和内容   longestTime 最长时长 
        regionsData(regions){
            let regionsData = []

            for(let i = 0; i < regions.length; i++){
                let item = regions[i]
                regionsData.push({
                    id: item.id,
                    content: {
                        id: item.content.id,
                        duration: item.content.duration
                    }
                })
            }
            return regionsData
        },

        // 投放其他布局的素材
        putOtherLayout(params){
            operationPutOtherLayoutMaterial(params).then(res => {
                if(res.code === this.$successCode){
                    this.$message.success('投放成功~')
                    this.getScreenMaterialList()
                }
            })
        },
        
        // 显示内容适配
        showPop(e, id, projectId, region){

            //先隐藏并销毁之前显示的
            this.$refs.contentAdaptation.visible = false

            this.$refs.contentAdaptation.params = {
                package: id,
                placeholder: this.findCurrentPlaceholder(projectId),
                region
            }
            var pop1 = this.$refs.contentAdaptation.$refs.pop1
            pop1.doDestroy(true)

            this.$nextTick(() => {
                //显示新的
                pop1.referenceElm = pop1.$refs.reference = e.target
                this.$refs.contentAdaptation.visible = true
            })
        },

        // 查找素材包投放的锁位id
        findCurrentPlaceholder(projectId){
            let placeholder = null
            for(let i = 0; i < this.screenLayout.orders.length; i++){
                if(this.screenLayout.orders[i].projectId == projectId){
                    placeholder = this.screenLayout.orders[i].placeholder
                }
            }

            return placeholder
        },

        // 显示设置素材时长
        showSetDurationPop(e, index, defaultDuration){
            //先隐藏并销毁之前显示的
            this.$refs.setContentDuration.visible = false

            this.$refs.setContentDuration.params = {
                index,
                defaultDuration
            }
            var pop = this.$refs.setContentDuration.$refs.setDurationPop
            pop.doDestroy(true)

            this.$nextTick(() => {
                //显示新的
                pop.referenceElm = pop.$refs.reference = e.target
                this.$refs.setContentDuration.visible = true
            })
        },

        // 把设置好的时长 添加到当前素材包
        saveContentDuration(duration, index){
            this.$set(this.materialData[index], 'duration', duration)
        }
    }

}
</script>

<style lang="scss">
    .content-manage-wrap{
        
        .right-content{
            margin: 12px;
            flex: 1;

            .content-wrap{
                height: 100%;
                background: #F3F3F4;
                border-radius: 6px;
                padding: 20px;
                position: relative;

                .content-wrap-top{
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .el-scrollbar{
                    height: calc(100% - 70px);
                }

                .content-wrap{
                    flex-wrap: wrap;
                }
                
                .content-item{
                    width: 350px;
                    height: 250px;
                    padding: 12px;
                    background: #fff;
                    border-radius: 12px;
                    margin: 0 28px 28px 0;
                    border-left: 12px solid #3B82F6;
                    position: relative;

                    .el-icon-warning{
                        font-size: 26px;
                        position: absolute;
                        top: -10px;
                        right: -10px;
                        color: red;
                    }

                    .top-wrap{
                        padding-bottom: 6px;   
                        color: #6B7280;
                        font-size: 14px;

                        i{
                            cursor: pointer;
                        }
                    }


                    .screen-content{
                        height: 70px;

                        li{
                            line-height: 24px;
                            padding-top: 6px;
                            display: flex;

                            span.screen-layout-name{
                                width: 30px; 
                                font-size: 12px;
                                color: #999;
                                margin-right: 10px;
                            }

                            span.content-name{
                                flex: 1;

                                .duration{
                                    font-size: 12px;
                                    color: #6B7280;
                                }
                            }
                        }
                    }

                    &.add{
                        color: #9CA3AF;
                        background: #E5E7EB;
                        font-size: 52px;
                        cursor: pointer;
                        border: none;
                        position: relative;

                        .other-layout-btn{
                            font-size: 14px;
                            position: absolute;
                            bottom: 12px;
                            right: 12px;
                            width: 90px;
                            height: 30px;
                            line-height: 30px;
                            text-align: center;
                            background: #6B7280;
                            border-radius: 3px;
                            color: #fff;
                        }
                    }
                }

                .layout-wrap{
                    width: 314px;
                    height: 135px;
                }


                .layout{
                    overflow: hidden;
                    position: relative;
                    background: #D0D4DA;
                    cursor: pointer;

                    &.vertical{
                        width: 120px;
                        height: 200px;
                    }

                    .region{
                        position: absolute;
                        border: 1px solid #fff;
                        background: #F3F4F6;
                        cursor: pointer;
                        
                        .el-image{
                            width: 100%;
                            height: 100%;
                        }

                        &.active{
                            background: var(--color-primary);
                        }

                        .upload-content{
                            position: relative;
                            width: 100%;
                            height: 100%;
                        }

                        .content-operate{
                            position: absolute;
                            top: 0;
                            left: 0;
                            width: 100%;
                            height: 100%;
                            z-index: 100;
                            background: rgba(17, 24, 39, 0.6);
                            display: none;

                            li{
                                width: 44px;
                                height: 44px;
                                border-radius: 50%;

                                &.adaptation{
                                    background: #0EA5E9;
                                }
                            }
                        }

                        &:hover{
                            .content-operate{
                                display: flex;
                            }
                        }
                    }
                }
            }
        }
    }
</style>