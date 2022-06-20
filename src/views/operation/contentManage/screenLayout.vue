<template> 
    <div class="screen-layout-config-wrap">
        <div class="left-screen-list">
            <div class="filter-wrap">
                
                <div class="head-wrap">
                    <el-dropdown 
                        class="head-left-icon" 
                        placement="bottom-start"
                        @command="$router.push($event)"
                    >
                        <span class="el-dropdown-link">
                            <i class="el-icon-s-operation"></i>
                        </span>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item command="/operation/contentManage">配置内容组</el-dropdown-item>
                            <el-dropdown-item command="/operation/screenLayout">配置屏幕布局</el-dropdown-item>
                            <el-dropdown-item command="/operation/lockPosition">配置屏幕时长</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>

                    <el-input 
                        clearable
                        prefix-icon="el-icon-search"
                        size="small"
                        v-model="screenParams.search"
                        @input="$debounce(getScreenList)"
                    ></el-input>
                </div>
                

                <!-- <div class="filter-item">
                    <label>分组</label>
                    <div class="tabs">
                        <span 
                            v-for="(item, index) in ['按城市', '按宽高比']"
                            :key="index"
                            :class="{ 'active': groupTypetabIndex == index }"
                            @click="groupTypetabIndex = index; screenGrouSet()"
                        >{{ item }}</span>
                    </div>
                </div> -->

                <div class="filter-item text-q color-info">
                    <label>筛选</label>
                    <div class="tabs">
                        <span 
                            v-for="(item, index) in [{ name: '全部', value: true }, { name: '未分配', value: false }]"
                            :key="index"
                            class="text-q color-info"
                            :class="{ 'active': screenParams.all == item.value }"
                            @click="screenParams.all=item.value;getScreenList()"
                        >{{ item.name }}</span>
                    </div>
                </div>
            </div>

            <el-scrollbar class="hidden-scroll-x" v-loading="screenListLoading">
                <div class="screen-list">
                    <div 
                        class="city-group"
                        v-for="(group, groupName, index) in screenData"
                        :key="index"
                    >
                        <div 
                            class="city-title text-q flex-between-center" 
                            @click="handleToggleHide(index)"
                        >
                            <span>{{ groupName }}</span> 
                            <span :class="hideListIndex.includes(index) ? 'el-icon-arrow-right' : 'el-icon-arrow-down'"></span>
                        </div>

                        <div 
                            v-for="(item, childIndex) in group" :key="childIndex"
                            :class="{ 'hide-list': hideListIndex.includes(index) }"
                            v-show="!selectedScreenIds.includes(item.id)"
                        >
                            <div 
                                v-if="item.layout"
                                class="screen-wrap flex-center" 
                                @click="handelSelectScreen(item)"
                            >
                                <div 
                                    class="screen-title overflow"
                                    :title="item.name + (item.location ? `(${item.location})` : '')"
                                >
                                    {{ item.name }} {{ item.location ? `(${item.location})` : '' }}
                                </div>
                                <div 
                                    class="temp-layout"
                                    :style="{
                                        width: item.height > item.width ? item.width / item.height * maxWidth + 'px' : maxWidth + 'px',
                                        height: item.height > item.width ? maxHeight + 'px' : item.height / item.width * maxWidth + 'px'
                                    }"
                                >
                                    <div 
                                        class="item" 
                                        v-for="(sub, sIndex) in item.layout.regions" 
                                        :key="sIndex"
                                        :class="{ 'active': item.layout.mainRegion == sub.id }"
                                        :style="{
                                            width: sub.region.width + '%',
                                            height: sub.region.height + '%',
                                            top: sub.region.y + '%',
                                            left: sub.region.x + '%'
                                        }"
                                    >   
                                    </div>
                                </div>
                            </div>
                            <div 
                                class="screen-wrap flex-center not-layout" 
                                @click="handelSelectScreen(item)"
                                v-else
                            >
                                <div 
                                    class="screen-title overflow"
                                    :title="item.name + (item.location ? `(${item.location})` : '')"
                                >
                                    {{ item.name }} {{ item.location ? `(${item.location})` : '' }}
                                </div>
                                <div class="temp-layout">未配置</div>
                            </div>

                        </div>
                    </div>
                </div>
            </el-scrollbar>

        </div>

        <div class="right-content">
            <div class="screen-layout-list">
                <el-scrollbar class="hidden-scroll-x">
                    <div class="layout-wrap">
                        <div 
                            class="layout-item" 
                            v-for="(item, index) in layoutData" 
                            :key="index"
                            @click="layoutId = item.id"
                            :class="{ active: layoutId == item.id }"
                        >
                            <div class="layout-content flex-center">
                                <div
                                    class="layout"
                                    :style="{
                                        width: item.height > item.width ? item.width / item.height * layoutMaxHeight + 'px' : (item.height / item.width * layoutMaxWidth) > 103 ? 102 / (item.height / item.width * layoutMaxWidth) * layoutMaxWidth + 'px' : layoutMaxWidth + 'px',
                                        height: item.height > item.width ? layoutMaxHeight + 'px' : (item.height / item.width * layoutMaxWidth > 102 ? 102 : item.height / item.width * layoutMaxWidth) + 'px'
                                    }"
                                >
                                    <div
                                        class="region"
                                        v-for="(regions, regionsIndex) in item.regions"
                                        :key="regionsIndex"
                                        :class="{ 'active': item.mainRegion == regions.id}"
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
                            <div class="name">{{ item.name }}</div>
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

    
            <div class="screen-layout-config-bottom">
                <div class="success-count"><span v-show="successCount">已变更{{ successCount }}个屏幕布局配置</span></div>
                <div class="right-btn">
                    <el-button size="small" @click="$router.push('/operation/contentManage')">取消</el-button>
                    <el-button 
                        type="primary" 
                        size="small" 
                        :disabled="!layoutId || !selectedScreenIds.length"
                        :loading="btnLoading"
                        @click="handleApplication"
                    >
                        应用
                    </el-button>
                </div>
            </div>
        </div>

    </div>
</template>

<script>
import { getScreenLayoutList, getScreenListAndLayout, contentMangeSetScreenLayout } from '@/api/contentManage'
import { aspectRatioCompute } from '@/utils/index'

export default {
    data(){
        return {
            groupTypetabIndex: 0,

            // 折叠组index
            hideListIndex: [],

            // 获取屏幕列表参数
            screenParams: {
                // true 全部  fasle 未分配
                all: true,   
            },

            // 屏幕列表加载中
            screenListLoading: false,

            // 屏幕列表  未分类
            screenDataUncategorized: [],

            // 屏幕列表
            screenData: [],

            // 已选择的屏幕
            selectedScreens: [],

            // 已选择的屏幕id
            selectedScreenIds: [],

            // 屏幕布局模板列表
            layoutData: [],

            // 屏幕布局显示状态  1 横屏  2竖屏
            layoutDisplayState: 1,

            // 选定的屏幕布局id
            layoutId: null,

            // 最大宽
            maxWidth: 56,

            // 最大高
            maxHeight: 62,

            layoutMaxWidth: 240,
            layoutMaxHeight: 102,


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
                this.screenDataUncategorized = res.obj
                this.screenGrouSet()
            })
        },

        // 屏幕分组
        screenGrouSet(){
            let obj = {}
            let data = JSON.parse(JSON.stringify(this.screenDataUncategorized))
            for(let i = 0; i < data.length; i++){
                let { city, width, height } = data[i]
                if(!obj[this.groupTypetabIndex ? aspectRatioCompute(width, height) : city]) obj[this.groupTypetabIndex ? aspectRatioCompute(width, height) : city] = []
                obj[this.groupTypetabIndex ? aspectRatioCompute(width, height) : city].push(data[i])
            }
            this.screenData = obj
        },

        // 折叠大屏列表
        handleToggleHide(index){
            if(this.hideListIndex.includes(index)){
                this.hideListIndex.splice(this.hideListIndex.indexOf(index), 1)
            }else{
                this.hideListIndex.push(index)
            }
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
            console.log('屏幕id', this.selectedScreenIds)
            let data = {
                layout: this.layoutId,
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
    .screen-layout-config-wrap {
        width: 100%;
        height: calc(100vh - 40px);
        display: flex;
        
        .left-screen-list{
            width: 266px;
            background: var(--bg-color-1);
        
            .filter-wrap{
                padding: 0 12px;

                .head-wrap{
                    display: flex;
                    align-items: center;
                    
                    .head-left-icon{
                        font-size: 18px;
                        margin-right: 12px;
                        cursor: pointer;
                    }

                    .el-input{
                        flex: 1;
                    }
                }

                .el-input{
                    margin: 12px 0;
                }

                .filter-item{
                    padding: 6px 0;
                    display: flex;
                    align-items: center;

                    label{
                        width: 36px;
                    }

                    .tabs{
                        flex: 1;
                        height: 27px;
                        line-height: 27px;
                        display: flex;
                        border: 1px solid var(--color-info);
                        border-radius: 3px;

                        span{
                            flex: 1;
                            text-align: center;
                            cursor: pointer;

                            &:first-child{
                                border-right: 1px solid var(--color-info);
                            }

                            &.active{
                                background: var(--color-info);
                                color: #fff
                            }
                        }
                    }
                }
            }

            .el-scrollbar{
                height: calc(100% - 96px);
            }

            .screen-list{
                margin: 0 12px;

                .city-group{
                    .city-title{
                        line-height: 39px;
                        padding: 0 12px;
                    }

                    .hide-list{
                        height: 0;
                        margin: 0;
                        overflow: hidden;
                    }

                    .screen-wrap{
                        width: 100%;
                        height: 78px;
                        text-align: center;
                        background: #fff;
                        border-radius: 6px;
                        margin-top: 12px;
                        cursor: pointer;

                        .screen-title{
                            width: 170px;
                            padding: 30px 20px;
                            border-right: 1px solid rgba(17, 24, 39, 0.1);
                        }

                        .temp-layout{
                            width: 72px;
                            margin: 8px;
                            display: block;
                            position: relative;
                            background: var(--color-info);
                            margin: 0 auto;

                            .item{
                                position: absolute;
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                overflow: hidden;
                                border: 1px solid #fff;

                                &.active{
                                    background: var(--color-primary);
                                }
                            }
                        }

                        &.not-layout{
                            height: 39px;
                            background: var(--color-warning);
                            color: #fff;
                            font-size: 13px;
                            
                            .screen-title{
                                padding: 10px 20px;
                            }

                            .temp-layout{
                                background: transparent;
                            }
                        }
                        
                    }
                }
            }
        }

        .right-content{
            flex: 1;
            display: flex;
            flex-direction: column;
            background: #fff;
        }

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
                align-items: center;

                .layout-item{
                    text-align: center;
                    cursor: pointer;
                    margin: 20px;
                    padding: 10px;

                    .layout-content{
                        width: 240px;
                        height: 102px;
                    }

                    .name{
                        padding-top: 10px;
                    }

                    &:hover, &.active{
                        background: #d5ebfd;
                    }
                }
            }

            .layout{
                width: 240px;
                height: 102px;
                background: var(--color-info);
                border-radius: 6px;
                overflow: hidden;
                position: relative;

                &.vertical{
                    width: 102px;
                    height: 240px;
                }

                .region{
                    position: absolute;
                    border: 1px solid #fff;
                    cursor: pointer;

                    &.active{
                        background: var(--color-primary);
                    }
                }
            }
        }

        .selected-screen-list-wrap{
            flex: 1;
            background: var(--bg-color-1);
            margin: 0 20px 20px;
            flex-wrap: wrap;

            .screen-card{
                display: inline-block;
                line-height: 18px;
                padding: 12px;
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
            background: var(--bg-color-1);
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
            padding: 0 20px;
            background: var(--bg-color-1);
            display: flex;
            justify-content: space-between;
            align-items: center;

            .right-btn{
                float: right;
            }
        }
    }
</style>