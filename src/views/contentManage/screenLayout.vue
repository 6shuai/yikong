<template> 
    <div class="screen-layout-config-wrap">
        <div class="screen-layout-list">
            <el-radio-group size="medium" v-model="layoutDisplayState">
                <el-radio-button :label="1">横屏</el-radio-button>
                <el-radio-button :label="2">竖屏</el-radio-button>
            </el-radio-group>
            <el-scrollbar class="hidden-scroll-x">
                <div class="layout-wrap">
                    <div
                        class="layout"
                        :class="{ vertical: layoutDisplayState==2 }" 
                        v-for="(item, index) in layoutData" 
                        :key="index"
                    >
                        <div
                            class="region"
                            v-for="(regions, regionsIndex) in item.regions"
                            :key="regionsIndex"
                            @click="mainRegionId = regions.region.id"
                            :class="{ 'active': mainRegionId == regions.region.id}"
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
            </el-scrollbar>
        </div>
        
        <div class="selected-screen-list-wrap">

        </div>

        <div class="screen-list-wrap">
            <div class="filter-wrap">
                <el-input prefix-icon="el-icon-search" class="w220"></el-input>
                <el-radio-group size="medium" v-model="layoutDisplayState">
                    <el-radio-button :label="1">全部</el-radio-button>
                    <el-radio-button :label="2">未分配</el-radio-button>
                </el-radio-group>
            </div>
            <div class="screen-list">
                <div class="">

                </div>
            </div>
        </div>

        <div class="screen-layout-config-bottom">
            
        </div>

    </div>
</template>

<script>
import { getScreenLayoutList } from '@/api/contentManage'

export default {
    data(){
        return {
            // 屏幕布局模板列表
            layoutData: [],

            // 屏幕布局显示状态  1 横屏  2竖屏
            layoutDisplayState: 1,
            
            // 选定的主逻辑区域id
            mainRegionId: null,
        }
    },
    mounted() {
        this.screenLayout()
    },
    methods: {
        screenLayout(){
            getScreenLayoutList().then(res => {
                this.layoutData = res.obj
            })
        }
    }
}
</script>

<style lang="scss" scoped>
    $bgColor: #F2F3F5;
    $mainColor: #0283C6;

    .screen-layout-config-wrap {
        width: 100%;
        height: calc(100vh - 72px);
        display: flex;
        flex-direction: column;
        background: #fff;

        .screen-layout-list{
            height: 240px;
            margin: 20px;

            .el-scrollbar{
                height: 200px;
            }

            .layout-wrap{
                width: 100%;
                display: flex;
                flex-wrap: wrap;
                margin-left: -20px;
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

                    &:hover{
                        background: $mainColor;
                    }
                }
            }
        }

        .selected-screen-list-wrap{
            flex: 1;
            background: $bgColor;
            margin: 0 20px 20px;
        }

        .screen-list-wrap{
            height: 200px;
            background: $bgColor;
            margin: 0 20px 20px;
            padding: 10px 20px;

            .filter-wrap{
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
        }

        .screen-layout-config-bottom{
            height: 60px;
            background: $bgColor;
        }
    }
</style>