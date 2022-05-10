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
                            v-for="(item, subIndex) in group" 
                            :key="item.id"
                            :class="{ 'active': screenId == item.id }"
                            @click="getScreenDefaultLayout(item.id)"
                        >
                            <span class="title overflow">{{ item.displayName }} {{ item.location ? `(${item.location})` : '' }}</span>
                            <span class="collection" @click="handleFavorite(item)"><i :class="item.isFavorite ? 'el-icon-star-on' : 'el-icon-star-off'"></i></span>
                        </li>
                    </ul>
                </div>

                <!-- <el-empty v-if="!screenData.length"></el-empty> -->

            </el-scrollbar>
        </div>
        <div class="right-content">
            <div class="content-wrap">
                <div class="content-wrap-top" v-if="screenLayout">
                    <p>全部内容</p>
                    <div class="btn-wrap">
                        <el-button 
                            type="primary" 
                            v-if="screenLayout.regions.length>1"
                            @click="showSetDefaultMaterial=true"
                        >
                            管理默认素材
                        </el-button>
                        <el-button type="primary">素材库</el-button>
                    </div>
                </div>
                <el-empty v-else></el-empty>

                <div class="layout" v-if="screenLayout">
                    <div
                        class="region"
                        v-for="(regions, regionsIndex) in screenLayout.regions"
                        :key="regionsIndex"
                        :class="{ 'active': screenLayout.mainRegion == regions.region.id}"
                        :style="{
                            width: regions.region.width + '%',
                            height: regions.region.height + '%', 
                            left: regions.region.x + '%',
                            top:  regions.region.y + '%', 
                        }"
                    >
                    </div>
                </div>

            </div>
        </div>

        <!-- 设置默认素材 -->
        <set-default-material 
            :screenLayout="screenLayout" 
            :screenId="screenId"
            v-if="showSetDefaultMaterial"
            @setSuccess="showSetDefaultMaterial=fasle;getScreenDefaultLayout()"
        ></set-default-material>

    </div>
</template>

<script>
import { getScreenGoupList, getScreenLayoutDetail } from '@/api/contentManage'
import { screenFavorite } from '@/api/screen'
import SetDefaultMaterial from './components/SetDefaultMaterial'

export default {
    components: {
        SetDefaultMaterial
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

            // 屏幕默认布局详情
            screenLayout: undefined,

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

        // 获取屏幕默认布局
        getScreenDefaultLayout(id = this.screenId){
            this.screenId = id
            getScreenLayoutDetail({ screen: id }).then(res => {
                this.screenLayout = res.obj
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

                .content-wrap-top{
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .layout{
                    width: 200px;
                    height: 120px;
                    background: #D0D4DA;
                    border-radius: 6px;
                    overflow: hidden;
                    margin: 20px;
                    position: relative;
                    cursor: pointer;

                    &.vertical{
                        width: 120px;
                        height: 200px;
                    }

                    .region{
                        position: absolute;
                        border: 1px solid #fff;
                        cursor: pointer;

                        &.active{
                            background: $mainColor;
                        }
                    }
                }
            }
        }
    }
</style>