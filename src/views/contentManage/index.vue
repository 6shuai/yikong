<!--
 * @Author: liushuai
 * @Date: 2022-04-28 11:15:22
 * @LastEditors: liushuai
 * @LastEditTime: 2022-04-28 13:50:00
 * @Description: file content
 * @FilePath: \pclient\src\views\contentManage\index.vue
-->
<template>
    <div class="content-manage-wrap">
        <div class="left-screen-list" v-loading="screenLoading">
            <div class="head-wrap">
                <el-input 
                    clearable
                    prefix-icon="el-icon-search"
                    v-model="screenName"
                    @input="$debounce(getScreenList)"
                ></el-input>
                <el-dropdown class="head-right-icon" @command="handleCommand">
                    <span class="el-dropdown-link">
                        <i class="el-icon-s-operation"></i>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item>创建内容</el-dropdown-item>
                        <el-dropdown-item command="/contentManage/screenLayout">配置屏幕布局</el-dropdown-item>
                        <el-dropdown-item command="/contentManage/lockPosition">配置屏幕时长</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </div>
            <el-scrollbar class="screen-list hidden-scroll-x">
                <div 
                    class="screen-group-wrap"
                    v-for="(group, groupName, index) in screenData"
                    :key="index"
                >
                    <div class="group-title">{{ groupName }}</div>
                    <ul>
                        <li 
                            v-for="item in group" 
                            :key="item.id"
                            :class="{ 'active': screenId == item.id }"
                            @click="getScreenDataAndOrder(item.id)"
                        >
                            <span class="title overflow">{{ item.displayName }} {{ item.location ? `(${item.location})` : '' }}</span>
                            <span class="collection" @click="handleFavorite(item)"><i :class="item.isFavorite ? 'el-icon-star-on' : 'el-icon-star-off'"></i></span>
                        </li>
                    </ul>
                </div>

                <!-- <el-empty v-if="!screenData.length"></el-empty> -->

            </el-scrollbar>
        </div>
        <div class="right-content" v-loading="materialDataLoading">
            <div class="content-wrap">
                <put-material ref="putMaterial"></put-material>

                <div class="content-wrap-top" v-if="materialData">
                    <p>全部内容</p>
                    <div class="btn-wrap">
                        <el-button 
                            type="primary" 
                            v-if="materialData.length"
                            @click="showSetDefaultMaterial=true"
                        >
                            管理默认素材
                        </el-button>
                        <el-button type="primary">素材库</el-button>
                    </div>
                </div>

                <el-empty v-else></el-empty>

                <el-scrollbar class="hidden-scroll-y">
                    <div class="content-item" v-for="item in materialData" :key="item.id">
                        <p class="duration">{{ item.duration }}s</p>
                        <div class="layout">
                            <div
                                class="region"
                                v-for="(regions, regionsIndex) in item.screenLayout.regions"
                                :key="regionsIndex"
                                :class="{ 'active': screenLayout.layout.mainRegion == regions.region.id}"
                                :style="{
                                    width: regions.region.width + '%',
                                    height: regions.region.height + '%', 
                                    left: regions.region.x + '%',
                                    top:  regions.region.y + '%', 
                                }"
                            >   
                                <el-image :src="regions.content.content"></el-image>   
                            </div>
                        </div>
                        <ul class="screen-content">
                            <li v-for="(content, contentIndex) in item.screenLayout.regions" :key="contentIndex">
                                <span class="screen-layout-name">{{ item.screenLayout.regions[contentIndex].region.name }}</span>
                                <span class="content-name overflow">{{ content.content.name }}</span>
                            </li>
                        </ul>
                    </div>
                </el-scrollbar>

            </div>
        </div>

        <!-- 设置默认素材 -->
        <set-default-material 
            :screenLayout="materialData[0].screenLayout" 
            :mainRegion="screenLayout.layout.mainRegion"
            :screenId="screenId"
            v-if="showSetDefaultMaterial"
            @setSuccess="showSetDefaultMaterial=fasle;getScreenMaterialList()"
        ></set-default-material>

    </div>
</template>

<script>
import { getScreenGoupList, getScreenLayoutAndOrderDetail, operationMaterialData } from '@/api/contentManage'
import { screenFavorite } from '@/api/screen'
import SetDefaultMaterial from './components/SetDefaultMaterial'
import PutMaterial from './components/PutMaterial'

export default {
    components: {
        SetDefaultMaterial,
        PutMaterial
    },
    data() {
        return {
            // 屏幕列表
            screenData: {},

            // 按屏幕名称搜索
            screenName: '',

            // 屏幕列表数据加载中
            screenLoading: false,

            // 选中的屏幕id
            screenId: null,

            // 当前屏幕布局
            screenLayout: {},



            // 屏幕物料数据
            materialData: undefined,

            materialDataLoading: false,

            // 显示管理默认素材
            showSetDefaultMaterial: false
        }
    },
    mounted() {
        this.getScreenList()
    },
    methods: {
        getScreenList(){
            this.screenLoading = true
            getScreenGoupList({ displayName: this.screenName }).then(res => {
                this.screenLoading = false
                this.screenData = res.obj
            })
        },

        // 收藏或取消收藏
        handleFavorite({ isFavorite, id }){
            let data = {
                isFavorite: isFavorite ? 0 : 1,
                screenId: id,
                userId: this.$store.state.user.loginData.id,
            };
            let s = `?isFavorite=${data.isFavorite}&screenId=${data.screenId}&userId=${data.userId}`
            screenFavorite(s).then(res => {
                if(res.code === this.$successCode){
                    this.$message.success('操作成功~')
                    this.getScreenList()
                }
            })
        },

        // 下拉菜单跳转对应页
        handleCommand(path){
            this.$router.push(path)
        },

        // 获取屏幕数据和绑定的锁位订单
        getScreenDataAndOrder(id){
            this.materialData = undefined
            this.materialDataLoading = true
            getScreenLayoutAndOrderDetail({ screen: id }).then(res => {
                this.screenLayout = res.obj
                if(this.screenLayout) {
                    this.getScreenMaterialList(id)
                } else {
                    this.materialDataLoading = false
                }
            })
        },

        // 获取屏幕物料数据
        getScreenMaterialList(id = this.screenId){
            this.screenId = id
            operationMaterialData({ screen: id }).then(res => {
                this.materialDataLoading = false
                this.materialData = res.obj
                if(!this.materialData){
                    this.$refs.putMaterial.showUploadMaterial(this.screenLayout.order)
                }
            })
        }
    }

}
</script>

<style lang="scss" scoped>
    $bgColor: #F2F3F5;
    $mainColor: #0283C6;

    .content-manage-wrap{
        display: flex;
        height: calc(100vh - 72px);
        background: #fff;
        
        .left-screen-list{
            width: 300px;
            background: #F3F3F4;

            .head-wrap{
                padding: 20px;
                display: flex;
                align-items: center;
                border-bottom: 1px solid #e5e5e5;
                
                .head-right-icon{
                    font-size: 18px;
                    margin-left: 10px;
                    cursor: pointer;
                }

                .el-input{
                    flex: 1;
                }
            }

            .screen-list{
                height: calc(100vh - 153px);

                .screen-group-wrap{
                    .group-title{
                        font-size: 12px;
                        color: #999;
                        padding: 10px;
                    }

                    li{
                        padding: 15px 20px;
                        line-height: 21px;
                        cursor: pointer;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                        display: flex;
                        align-items: center;

                        &.active{
                            background: #0283C6;
                            color: #fff;
                        }

                        &:hover{
                            background: #0283C6;
                            color: #fff;

                            .collection{
                                display: block;
                            }
                        }

                        .title{
                            flex: 1;
                        }

                        .collection{
                            width: 30px;
                            font-size: 20px;
                            display: none;

                            .el-icon-star-on{
                                color: #e6a23c;
                            }
                        }
                    }
                }
            }
        }

        .right-content{
            margin-left: 20px;
            flex: 1;

            .content-wrap{
                height: 100%;
                margin: 20px;
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
                    height: calc(100% - 150px);
                }
                
                .content-item{
                    width: 220px;
                    padding: 10px;
                    display: inline-block;
                    background: #fff;
                    border-radius: 6px;
                    margin: 20px 20px 0 0;
                    overflow: hidden;

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
                }

                .layout{
                    width: 200px;
                    height: 120px;
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
                            background: $mainColor;
                        }
                    }
                }
            }
        }
    }
</style>