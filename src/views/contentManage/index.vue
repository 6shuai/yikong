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
                <el-dropdown class="head-right-icon">
                    <span class="el-dropdown-link">
                        <i class="el-icon-s-operation"></i>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item>创建内容</el-dropdown-item>
                        <el-dropdown-item>配置屏幕布局</el-dropdown-item>
                        <el-dropdown-item>配置屏幕时长</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </div>
            <el-scrollbar class="screen-list">
                <div 
                    class="screen-group-wrap"
                    v-for="(group, groupName, index) in screenData"
                    :key="index"
                >
                    <div class="group-title">{{ groupName }}</div>
                    <ul>
                        <li v-for="item in group" :key="item.id">{{ item.displayName }} {{ item.location ? `(${item.location})` : '' }}</li>
                    </ul>
                </div>

                <!-- <el-empty v-if="!screenData.length"></el-empty> -->

            </el-scrollbar>
        </div>
        <div class="right-content">

        </div>

        <router-view></router-view>
    </div>
</template>

<script>
import { getScreenGoupList } from '@/api/contentManage'

export default {
    data() {
        return {
            // 屏幕列表
            screenData: {},

            // 按屏幕名称搜索
            screenName: '',

            // 屏幕列表数据加载中
            screenLoading: false,
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
        }
    }

}
</script>

<style lang="scss" scoped>
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
                        cursor: pointer;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;

                        &:hover{
                            background: #0283C6;
                            color: #fff;
                        }
                    }
                }
            }
        }

        .right-content{
            margin-left: 20px;
            flex: 1;
        }
    }
</style>