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
                            @click="mainRegionId = regions.region.id; layoutId = item.id"
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
            <div class="screen-card" v-for="(item, index) in selectedScreens" :key="item.id">
                {{ item.name }} {{ item.location ? `(${item.location})` : '' }}
                <i class="el-icon-circle-close" @click="handleScreenDelete(index)"></i>
            </div>
        </div>

        <div class="screen-list-wrap">
            <div class="filter-wrap">
                <el-input 
                    prefix-icon="el-icon-search" 
                    class="w220" 
                    v-model="screenParams.search"
                    @input="$debounce(getScreenList)"
                ></el-input>
                <el-radio-group 
                    size="medium" 
                    v-model="screenParams.all"
                    @change="getScreenList"
                >
                    <el-radio-button :label="true">全部</el-radio-button>
                    <el-radio-button :label="false">未分配</el-radio-button>
                </el-radio-group>
            </div>
            <el-scrollbar class="hidden-scroll-x">
                <div class="screen-list" :loading="screenListLoading">
                    <div 
                        class="city-group"
                        v-for="(item, index) in screenData"
                        :key="index"
                    >
                        <div class="city-title">{{ screenData[index-1] && item.city == screenData[index-1].city ? '' : item.city }}</div>
                        <div class="screen-wrap" @click="handelSelectScreen(item)">
                            <div class="screen-title overflow">{{ item.name }} {{ item.location ? `(${item.location})` : '' }}</div>
                            <div 
                                v-if="item.defaultLayout"
                                class="temp-layout"
                                :style="{
                                    width: item.height > item.width ? item.width / item.height * maxWidth + 'px' : maxWidth + 'px',
                                    height: item.height > item.width ? maxHeight + 'px' : item.height / item.width * maxWidth + 'px'
                                }"
                            >
                                <div 
                                    class="item" 
                                    v-for="(sub, sIndex) in item.defaultLayout.regions" 
                                    :key="sIndex"
                                    :class="{ 'active': item.defaultLayout.mainRegion == sub.region.id }"
                                    :style="{
                                        width: sub.region.width + '%',
                                        height: sub.region.height + '%',
                                        top: sub.region.y + '%',
                                        left: sub.region.x + '%'
                                    }"
                                >   
                                </div>
                            </div>
                            <p class="not-layout" v-else>未分配默认布局</p>
                        </div>
                    </div>
                </div>
            </el-scrollbar>
        </div>

        <div class="screen-layout-config-bottom">
            <div class="success-count"><span v-show="successCount">已变更{{ successCount }}个屏幕布局配置</span></div>
            <div class="right-btn">
                <el-button size="small" @click="$router.push('/contentManage')">取消</el-button>
                <el-button 
                    type="primary" 
                    size="small" 
                    :disabled="!mainRegionId || !selectedScreenIds.length"
                    :loading="btnLoading"
                    @click="handleApplication"
                >
                    应用
                </el-button>
            </div>
        </div>

    </div>
</template>

<script>
import { getScreenLayoutList, getScreenListAndLayout, contentMangeSetScreenLayout } from '@/api/contentManage'

export default {
    data(){
        return {
            // 屏幕布局模板列表
            layoutData: [],

            // 屏幕布局显示状态  1 横屏  2竖屏
            layoutDisplayState: 1,

            // 选定的屏幕布局id
            layoutId: null,
            
            // 选定的主逻辑区域id
            mainRegionId: null,

            // 最大宽
            maxWidth: 120,

            // 最大高
            maxHeight: 60,

            // 获取屏幕列表参数
            screenParams: {
                // true 全部  fasle 未分配
                all: true,   
            },

            // 屏幕列表加载中
            screenListLoading: false,

            // 屏幕列表
            screenData: [],

            // 已选择的屏幕
            selectedScreens: [],

            // 已选择的屏幕id
            selectedScreenIds: [],

            // 应用中
            btnLoading: false,

            // 应用成功数量
            successCount: null
        }
    },
    mounted() {
        this.screenLayout()
        this.getScreenList()
    },
    methods: {
        // 屏幕布局列表
        screenLayout(){
            getScreenLayoutList().then(res => {
                this.layoutData = res.obj
            })
        },

        // 屏幕列表 
        getScreenList(){
            this.screenListLoading = true
            let data = JSON.parse(JSON.stringify(this.screenParams))
            if(!data.all) delete data.all
            getScreenListAndLayout(data).then(res => {
                this.screenListLoading = false
                this.screenData = res.obj
            })
        },

        // 选择大屏
        handelSelectScreen(data){
            if(!this.selectedScreenIds.includes(data.id)){
                this.selectedScreenIds.push(data.id)
                this.selectedScreens.push(data)
            }
        },

        // 删除已选定的大屏
        handleScreenDelete(index){
            this.selectedScreenIds.splice(index, 1)
            this.selectedScreens.splice(index, 1)
        },

        // 应用
        handleApplication(){
            console.log('屏幕布局id', this.layoutId)
            console.log('布局主区域id', this.mainRegionId)
            console.log('屏幕id', this.selectedScreenIds)
            let data = {
                layout: this.layoutId,
                mainRegion: this.mainRegionId,
                screens: this.selectedScreenIds
            }
            this.btnLoading = true
            contentMangeSetScreenLayout(data).then(res => {
                this.btnLoading = false
                if(res.code === this.$successCode){
                    this.$message.success('应用成功~')
                    this.getScreenList()
                    this.selectedScreenIds = []
                    this.selectedScreens = []
                    this.mainRegionId = null
                    this.successCount = res.obj
                }
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
            flex-wrap: wrap;

            .screen-card{
                display: inline-block;
                padding: 20px;
                background: #fff;
                border-radius: 6px;
                margin: 10px;
                position: relative;

                .el-icon-circle-close{
                    position: absolute;
                    top: -5px;
                    right: -5px;
                    color: var(--color-danger);
                    cursor: pointer;
                }
            }
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

            .el-scrollbar{
                height: 160px;
            }

            .screen-list{
                display: flex;
                flex-wrap: wrap;

                .city-group{
                    margin: 10px 20px 0 0;
                    .city-title{
                        font-size: 12px;
                        height: 26px;
                        line-height: 26px;
                    }

                    .screen-wrap{
                        width: 200px;
                        height: 110px;
                        text-align: center;
                        background: #fff;
                        border-radius: 6px;
                        cursor: pointer;

                        .screen-title{
                            line-height: 26px;
                            padding-top: 6px;
                        }

                        .temp-layout{
                            display: block;
                            position: relative;
                            background: #D0D4DA;
                            margin: 0 auto;
                            border-radius: 6px;
                            overflow: hidden;
                            margin-top: 10px;

                            .item{
                                position: absolute;
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                overflow: hidden;

                                &.active{
                                    background: $mainColor;
                                }
                            }
                        }

                        .not-layout{
                            font-size: 13px;
                            color: #999;
                            padding: 30px 0;
                        }
                    }
                }
            }
            
        }

        .screen-layout-config-bottom{
            height: 60px;
            padding: 0 20px;
            background: $bgColor;
            display: flex;
            justify-content: space-between;
            align-items: center;

            .right-btn{
                float: right;
            }
        }
    }
</style>