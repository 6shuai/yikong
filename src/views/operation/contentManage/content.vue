<!--
 * @Author: liushuai
 * @Date: 2022-04-28 11:15:22
 * @LastEditors: liushuai
 * @LastEditTime: 2022-06-10 14:26:50
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
                        <div class="content-item" v-for="item in materialData" :key="item.id">
                            <div class="flex-between-center top-wrap">
                                <div>{{ findTimePool(item.projectId) }}</div>
                                <div class="duration">{{ item.duration }}s</div>
                            </div>
                            <div class="layout">
                                <div
                                    class="region"
                                    v-for="(regions, regionsIndex) in item.screenLayout.regions"
                                    :key="regionsIndex"
                                    :class="{ 'active': screenLayout.layout && screenLayout.layout.mainRegion == regions.id}"
                                    :style="{
                                        width: regions.region.width + '%',
                                        height: regions.region.height + '%', 
                                        left: regions.region.x + '%',
                                        top:  regions.region.y + '%', 
                                    }"
                                >   
                                    <el-image v-if="regions.content" :src="regions.content.thumbnail"></el-image>   
                                </div>
                            </div>
                            <ul class="screen-content">
                                <li v-for="(content, contentIndex) in item.screenLayout.regions" :key="contentIndex" :title="content.content ? content.content.name : ''">
                                    <span class="screen-layout-name overflow">{{ item.screenLayout.regions[contentIndex].region.name }}</span>
                                    <span class="content-name overflow" v-if="content.content">{{ content.content.name }}</span>
                                </li>
                            </ul>
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

    </div>
</template>

<script>
import { getScreenLayoutAndOrderDetail, operationMaterialData } from '@/api/contentManage'
import LeftScreenList from '../components/LeftScreenList'
import SetDefaultMaterial from './components/SetDefaultMaterial'
import PutMaterial from './components/PutMaterial'
import SelectOtherLayout from './components/SelectOtherLayout'

export default {
    components: {
        LeftScreenList,
        SetDefaultMaterial,
        PutMaterial,
        SelectOtherLayout
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

            // 上传素材方式  add 点击添加按钮   drag 拖放
            uploadMaterialType: 'add'
        }
    },
    computed: {
        findTimePool(){
            return (projectId) => {
                let orders = this.screenLayout.orders
                let msg = ''
                for(let i = 0; i < orders.length; i++){
                    if(orders[i].projectId == projectId){
                        msg = orders[i].roomType == 1 ? '商场' : '小风景'
                    }
                }
                return msg
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
                screenLayout: data
            }
            this.handleShowPutMaterial('other')
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
                    overflow: hidden;
                    border-left: 12px solid #3B82F6;

                    .top-wrap{
                        padding-bottom: 6px;   
                        color: #6B7280;
                    }


                    .screen-content{
                        li{
                            line-height: 26px;
                            display: flex;

                            span.screen-layout-name{
                                width: 30px; 
                                font-size: 12px;
                                color: #999;
                                margin-right: 10px;
                            }

                            span.content-name{
                                flex: 1;
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


                .layout{
                    width: 314px;
                    height: 135px;
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
                        cursor: pointer;
                        
                        .el-image{
                            width: 100%;
                            height: 100%;
                        }

                        &.active{
                            background: var(--color-primary);
                        }
                    }
                }
            }
        }
    }
</style>