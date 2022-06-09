<!--
 * @Author: liushuai
 * @Date: 2022-04-28 11:15:22
 * @LastEditors: liushuai
 * @LastEditTime: 2022-04-28 13:50:00
 * @Description: file content
 * @FilePath: \pclient\src\views\contentManage\index.vue
-->
<template>
    <div 
        class="content-manage-wrap"
        @dragenter="handleShowPutMaterial('drag')"
        @dragover="handleShowPutMaterial('drag')"
    >
        
        <left-screen-list @currentScreenId="getScreenDataAndOrder"></left-screen-list>

        <div class="right-content" v-loading="materialDataLoading">
            <div class="content-wrap">
                <put-material 
                    v-show="showPutMaterial"
                    ref="putMaterial" 
                    :type="uploadMaterialType"
                    @closeUpload="showPutMaterial=false"
                    @putSuccess="getScreenMaterialList()"
                ></put-material>

                <div class="content-wrap-top" v-if="materialData">
                    <p>全部内容{{showPutMaterial}}</p>
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

                <el-scrollbar class="hidden-scroll-y" v-if="materialData">
                    <div class="content-wrap flex">
                        <div class="content-item" v-for="item in materialData" :key="item.id">
                            <p class="duration">{{ item.duration }}s</p>
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
                                    <el-image :src="regions.content.thumbnail"></el-image>   
                                </div>
                            </div>
                            <ul class="screen-content">
                                <li v-for="(content, contentIndex) in item.screenLayout.regions" :key="contentIndex" :title="content.content.name">
                                    <span class="screen-layout-name overflow">{{ item.screenLayout.regions[contentIndex].region.name }}</span>
                                    <span class="content-name overflow">{{ content.content.name }}</span>
                                </li>
                            </ul>
                        </div>

                        <div 
                            class="content-item add flex-center" 
                            @click="handleShowPutMaterial('add')"
                        >
                            <i class="el-icon-plus"></i>
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

export default {
    components: {
        LeftScreenList,
        SetDefaultMaterial,
        PutMaterial
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

                    .duration{
                        text-align: right;
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