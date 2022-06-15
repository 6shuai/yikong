<!--
 * @Author: liushuai
 * @Date: 2022-06-10 14:13:29
 * @LastEditors: liushuai
 * @LastEditTime: 2022-06-10 14:26:22
 * @Description: file content
 * @FilePath: \pclient\src\views\operation\contentManage\components\SelectOhterLayout.vue
-->
<template>
    <el-popover
        popper-class="operation-select-layout-popver"
        placement="bottom-end"
        :visible-arrow="false"
        width="578"
        ref="popover"
        trigger="click">
        <div class="other-layout-btn text-z" slot="reference" @click.stop="handleShowOtherLayout">
            其他布局<i class="el-icon-arrow-down"></i>
        </div>
        
        <el-scrollbar class="operation-select-other-layout-wrap hidden-scroll-x">
            <div class="layout-list" v-loading="layoutLoading">
                <div 
                    class="layout-item" 
                    v-for="(item, index) in layoutData" 
                    @click="selectedCurrentLayout(item)"
                    :key="index"
                >
                    <div class="layout-wrap flex-center">
                        <div
                            class="layout"
                            :style="{
                                width: item.height > item.width ? item.width / item.height * layoutMaxWidth + 'px' : layoutMaxWidth + 'px',
                                height: item.height > item.width ? layoutMaxWidth + 'px' : item.height / item.width * layoutMaxWidth + 'px'
                            }"
                        >
                            <div
                                class="region"
                                v-for="(regions, regionsIndex) in item.regions"
                                :key="regionsIndex"
                                @click="mainRegionId = regions.id; layoutId = item.id"
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
                    <div class="name text-q">{{ item.name }}</div>
                </div>
            </div>
        </el-scrollbar>

    </el-popover>
</template>

<script>
import { getScreenLayoutList } from '@/api/contentManage'

export default {
    data() {
        return {
            // 屏幕布局列表
            layoutData: [],

            // 屏幕布局数据加载中
            layoutLoading: false,

            // 屏幕布局最大宽
            layoutMaxWidth: 120
        }
    },
    methods: {
        // 显示其他布局
        handleShowOtherLayout(){
            this.screenLayout()
        },

        // 屏幕布局列表
        screenLayout(){
            this.layoutLoading = true
            getScreenLayoutList().then(res => {
                this.layoutLoading = false
                this.layoutData = res.obj
            })
        },

        // 选中当前布局
        selectedCurrentLayout(data){
            console.log(data)
            this.$refs.popover.doClose()
            this.$emit('selectedLayout', data)
        }
    }
}
</script>

<style lang="scss">
    .operation-select-layout-popver{
        padding: 0;
    }

    .operation-select-other-layout-wrap{
        height: 156px;

        .layout-list{
            width: 576px;
            min-height: 156px;
            display: flex;
            flex-wrap: wrap;

            .layout-item{
                width: 144px;
                text-align: center;

                .layout-wrap{
                    width: 120px;
                    height: 120px;
                    margin: 6px 12px;
                }

                .layout{
                    background: var(--color-info);
                    border-radius: 6px;
                    overflow: hidden;
                    position: relative;
                    cursor: pointer;

                    &.vertical{
                        width: 102px;
                        height: 240px;
                    }

                    .region{
                        position: absolute;
                        border: 1px solid #fff;
                        cursor: pointer;
                    }
                }

                &:hover{
                    background: var(--color-primary);
                    color: #fff;

                    .layout{
                        background: var(--color-dark-info);

                        .region{
                            border-color: var(--color-primary);
                        }
                    }
                }

                .name{
                    padding-bottom: 10px;
                }
            }
        }
    }
</style>