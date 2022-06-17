<template> 
    <div class="lock-position-config-wrap">
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
                        v-model="placeParams.search"
                        @input="$debounce(getLockPositionList)"
                    ></el-input>
                </div>


                <div class="filter-item text-q color-info">
                    <label>筛选</label>
                    <div class="tabs">
                        <span 
                            v-for="(item, index) in [{ name: '全部', value: true }, { name: '未分配', value: false }]"
                            :key="index"
                            class="text-q color-info"
                            :class="{ 'active': placeParams.all == item.value }"
                            @click="placeParams.all=item.value;getLockPositionList()"
                        >{{ item.name }}</span>
                    </div>
                </div>
            </div>

            <el-scrollbar class="hidden-scroll-x" v-loading="placeListLoading">
                <div class="screen-list">
                    <div 
                        class="city-group"
                        v-for="(group, groupName, index) in placeData"
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
                            v-show="!item.active"
                        >
                            <div 
                                v-if="item.orders && item.orders.length && item.orders[0].type>1"
                                class="screen-wrap flex-center" 
                                @click="handelSelectScreen(item, groupName, childIndex)"
                            >
                                <div 
                                    class="screen-title overflow"
                                    :title="item.name + (item.location ? `(${item.location})` : '')"
                                >
                                    {{ item.name }} {{ item.location ? `(${item.location})` : '' }}
                                </div>
                                <div class="temp-layout">
                                    <div class="msg">
                                        <svg-icon :icon-class="item.orders[0].type==2 ? 'time' : '%'"></svg-icon>
                                    </div>
                                    <div class="value">{{ item.orders[0].type == 2 ? secondToHour(item.orders[0].duration) : item.orders[0].percent + '%' }}</div>
                                </div>
                            </div>
                            <div 
                                class="screen-wrap flex-center not-layout" 
                                @click="handelSelectScreen(item, groupName, childIndex)"
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
            <div class="lock-position-list">
                <el-scrollbar class="hidden-scroll-y">
                    <div class="lock-list-wrap" :style="`width: ${ruleData.length ? 200 * ruleData.length + 80 : 200}px`">
                        <div 
                            class="item flex-between-center" 
                            v-for="(item, index) in ruleData" 
                            :key="index"
                            :class="{ active: index == currentRuleIndex }"
                            @click="currentRuleIndex = index"
                        >   
                            <svg-icon :icon-class="item.type==2 ? 'time' : '%'"></svg-icon>
                            <div class="msg">
                                <p class="desc">{{ item.type == 2 ? '按时长' : '按占比' }}</p>
                                <p class="value">{{ item.type == 2 ? item.durationText : item.duration }}<span>{{ item.type==4 ? '%' : '' }}</span></p>
                            </div>
                        </div>
                        <div class="add color-info" @click="$refs.createdLockRule.showCreateRuleDialog()">
                            <i class="el-icon-plus"></i>
                        </div>
                    </div>
                </el-scrollbar>
            </div>
            
            <div class="selected-screen-list-wrap">
                <div v-if="ruleData.length">
                    <p>
                        <span v-if="ruleData[currentRuleIndex].type==2">按时长 - {{ ruleData[currentRuleIndex].durationText }} &nbsp;&nbsp; </span>
                        <span v-if="ruleData[currentRuleIndex].type==4">按占比 - {{ ruleData[currentRuleIndex].duration }} %&nbsp;&nbsp; </span>
                        {{ ruleData[currentRuleIndex].selectedScreens ? ruleData[currentRuleIndex].selectedScreens.length : 0 }}个
                    </p>
                    <div class="screen-card" 
                        v-for="(item, index) in ruleData[currentRuleIndex].selectedScreens" 
                        :key="item.id"
                    >
                        {{ item.name }} {{ item.location ? `(${item.location})` : '' }}
                        <i class="el-icon-circle-close" @click="handleScreenDelete(index)"></i>
                    </div>
                </div>
            </div>
    
            <div class="lock-position-config-bottom">
                <div class="success-count"><span v-show="successCount">已变更{{ successCount }}个屏幕布局配置</span></div>
                <div class="right-btn">
                    <el-button size="small" @click="$router.push('/operation/contentManage')">取消</el-button>
                    <el-button 
                        type="primary" 
                        size="small"
                        :loading="btnLoading"
                        @click="handleApplication"
                    >
                        应用
                    </el-button>
                </div>
            </div>
        </div>

        <!-- 创建屏幕时长规则 -->
        <created-lock-rule ref="createdLockRule" @addLockRule="addLockRule"></created-lock-rule>

    </div>
</template>

<script>
import { contentMangeGetPlaceLockPosition, contentMangeSetPlaceLockPosition } from '@/api/contentManage'
import CreatedLockRule from './components/CreatedLockRule'

export default {
    components: {
        CreatedLockRule
    },
    data(){
        return {
            groupTypetabIndex: 0,

            // 折叠组index
            hideListIndex: [],

            // 当前选中的规则index
            currentRuleIndex: null, 

            // 屏幕时长规则列表
            ruleData: [], 

            // 商场锁位列表  未分类
            placeDataUncategorized: [],

            // 商场锁位列表
            placeData: [],

            // 获取商场列表参数
            placeParams: {
                // true 全部  fasle 未分配
                all: true,   
            },

            // 商场列表加载中
            placeListLoading: false,

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
    computed: {
        secondToHour(){
            return (value) => {
                var theTime = parseInt(value)// 秒
                var middle= 0// 分
                var hour= 0// 小时

                if(theTime >= 60) {
                    middle= parseInt(theTime/60)
                    theTime = parseInt(theTime%60)
                    if(middle>= 60) {
                        hour= parseInt(middle/60)
                        middle= parseInt(middle%60)
                    }
                }
                var result = ""
                if(hour> 0) {
                    result += parseInt(hour)+"小时"
                }
                if(middle > 0) {
                    result += parseInt(middle)+"分"
                }
                if(theTime > 0){
                    result += parseInt(theTime)+"秒"
                }

                return result
            }
        }
    },
    mounted() {
        this.getLockPositionList()
    },
    methods: {
        // 添加规则
        addLockRule(data){
            this.ruleData.push(data)
            this.currentRuleIndex = this.ruleData.length - 1
        },

        // 获取商场锁位列表
        getLockPositionList(){
            let data = JSON.parse(JSON.stringify(this.placeParams))
            if(!data.all) delete data.all
            this.placeListLoading = true
            contentMangeGetPlaceLockPosition(data).then(res => {
                this.placeListLoading = false
                this.placeDataUncategorized = res.obj
                this.placeGrouSet()
            })
        },

        // 商场列表分组
        placeGrouSet(){
            let obj = {}
            let data = JSON.parse(JSON.stringify(this.placeDataUncategorized))
            for(let i = 0; i < data.length; i++){
                let { city, width, height } = data[i]
                if(!obj[this.groupTypetabIndex ? aspectRatioCompute(width, height) : city]) obj[this.groupTypetabIndex ? aspectRatioCompute(width, height) : city] = []
                obj[this.groupTypetabIndex ? aspectRatioCompute(width, height) : city].push(data[i])
            }
            this.placeData = obj
        },

        // 折叠商场分组
        handleToggleHide(index){
            if(this.hideListIndex.includes(index)){
                this.hideListIndex.splice(this.hideListIndex.indexOf(index), 1)
            }else{
                this.hideListIndex.push(index)
            }
        },

        // 选择大屏
        handelSelectScreen(data, groupName, childIndex){

            if(this.ruleData.length && !this.ruleData[this.currentRuleIndex].selectedScreenIds) {
                this.$set(this.ruleData[this.currentRuleIndex], 'selectedScreenIds', [])
            } 

            if(this.ruleData.length && !this.ruleData[this.currentRuleIndex].selectedScreens) {
                this.$set(this.ruleData[this.currentRuleIndex], 'selectedScreens', [])
            } 

            if(this.ruleData.length && !this.ruleData[this.currentRuleIndex].selectedScreenIds.includes(data.id)){
                let ids = this.ruleData[this.currentRuleIndex].selectedScreenIds.concat([data.id])
                data.selectedScreenIndex = [groupName, childIndex]
                let datas = this.ruleData[this.currentRuleIndex].selectedScreens.concat([data])
                this.$set(this.ruleData[this.currentRuleIndex], 'selectedScreenIds', ids)
                this.$set(this.ruleData[this.currentRuleIndex], 'selectedScreens', datas)
                this.placeData[groupName][childIndex].active = true
            }

            console.log(this.ruleData, this.currentRuleIndex, groupName, childIndex)

        },

        // 删除已选定的大屏
        handleScreenDelete(index){
            let selectedScreenIndex = this.ruleData[this.currentRuleIndex].selectedScreens[index].selectedScreenIndex
            this.placeData[selectedScreenIndex[0]][selectedScreenIndex[1]].active = false
            this.$delete(this.ruleData[this.currentRuleIndex].selectedScreenIds, index)
            this.$delete(this.ruleData[this.currentRuleIndex].selectedScreens, index)
        },

        // 应用
        handleApplication(){
            let data = []
            for(let i = 0; i < this.ruleData.length; i++){
                if(this.ruleData[i].selectedScreenIds && this.ruleData[i].selectedScreenIds.length){
                    let { type, duration, durationType, selectedScreenIds } = this.ruleData[i]
                    let obj = {
                        type,
                        screens: selectedScreenIds
                    }

                    if(type == 2 && durationType == 1){
                        obj.duration = duration * 60
                    }else if(type == 2 && durationType == 2){
                        obj.duration = duration * 60 * 60
                    }else {
                        obj.percent = duration
                    }

                    data.push(obj)
                }
            }

            if(data.length){
                this.btnLoading = true
                contentMangeSetPlaceLockPosition(data).then(res => {
                    this.btnLoading = false
                    if(res.code === this.$successCode){
                        this.$message.success('应用成功~')
                        this.getLockPositionList()
                        for(let i = 0; i < this.ruleData.length; i++){
                            this.$delete(this.ruleData[i], 'selectedScreenIds')
                            this.$delete(this.ruleData[i], 'selectedScreens')
                        }
                    }
                })
            }


        }
    }
}
</script>

<style lang="scss" scoped>
    .lock-position-config-wrap {
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

                            .msg{
                                margin: 6px;

                                svg{
                                    width: 25px;
                                    height: 25px;
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
            overflow: hidden;
        }

        .lock-position-list{
            height: 102px;

            .el-scrollbar{
                width: 100%;
            }

            .lock-list-wrap{
                width: 100%;
                display: flex;
                align-items: center;
                flex-wrap: wrap;
            }

            .item{
                width: 172px;
                height: 78px;
                background: var(--color-info);
                border-radius: 6px;
                overflow: hidden;
                margin: 12px;
                padding: 12px 24px;
                position: relative;
                cursor: pointer;
                color: #fff;

                svg{
                    width: 50px;
                    height: 50px;
                }

                p.value{
                    font-size: 22px;
                    line-height: 32px;
                    padding-top: 5px;
                }

                &.active{
                    background: var(--color-primary);
                    color: #fff;
                }

                &:hover{
                    background: var(--color-primary);
                    color: #fff;
                }
            }

            .add{
                width: 60px;
                height: 60px;
                line-height: 60px;
                border: 1px solid var(--color-info);
                font-size: 28px;
                border-radius: 6px;
                margin: 12px;
                text-align: center;
                cursor: pointer;
            }
        }

        .selected-screen-list-wrap{
            flex: 1;
            background: var(--bg-color-1);
            margin: 12px;
            padding: 12px;
            flex-wrap: wrap;

            .screen-card{
                display: inline-block;
                padding: 20px;
                background: #fff;
                border-radius: 6px;
                margin: 12px 12px 0 0;
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

        .lock-position-config-bottom{
            height: 50px;
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