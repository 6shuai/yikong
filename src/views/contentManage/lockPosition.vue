<template> 
    <div class="lock-position-config-wrap">
        <div class="lock-position-list">
            <el-scrollbar class="hidden-scroll-x">
                <div class="lock-list-wrap">
                    <div 
                        class="item" 
                        v-for="(item, index) in ruleData" 
                        :key="index"
                        :class="{ active: index == currentRuleIndex }"
                        @click="currentRuleIndex = index"
                    >
                        <span v-if="item.type == 4" class="icon">%</span>
                        <span v-if="item.type == 2" class="icon el-icon-time"></span>
                        <p>{{ item.type == 2 ? item.durationText : item.duration }}<span>{{ item.type==4 ? '%' : '' }}</span></p>
                    </div>
                    <div class="item add" @click="$refs.createdLockRule.showCreateRuleDialog()">
                        <i class="el-icon-plus"></i>
                    </div>
                </div>
            </el-scrollbar>
        </div>
        
        <div class="selected-screen-list-wrap">
            <div v-if="ruleData.length">
                <div class="screen-card" 
                    v-for="(item, index) in ruleData[currentRuleIndex].selectedScreens" 
                    :key="item.id"
                >
                    {{ item.name }} {{ item.location ? `(${item.location})` : '' }}
                    <i class="el-icon-circle-close" @click="handleScreenDelete(index)"></i>
                </div>
            </div>
        </div>

        <div class="screen-list-wrap">
            <div class="filter-wrap">
                <el-input 
                    prefix-icon="el-icon-search" 
                    class="w220" 
                    v-model="placeParams.search"
                    @input="$debounce(getLockPositionList)"
                ></el-input>
                <el-radio-group 
                    size="medium" 
                    v-model="placeParams.all"
                    @change="getLockPositionList"
                >
                    <el-radio-button :label="true">全部</el-radio-button>
                    <el-radio-button :label="false">未分配</el-radio-button>
                </el-radio-group>
            </div>
            <el-scrollbar class="hidden-scroll-x">
                <div class="screen-list" :loading="placeListLoading">
                    <div 
                        class="city-group"
                        v-for="(item, index) in placeData"
                        :key="index"

                    >
                        <div class="city-title">{{ placeData[index-1] && item.city == placeData[index-1].city ? '' : item.city }}</div>
                        <div class="screen-wrap" @click="handelSelectScreen(item, index)">
                            <div class="screen-title overflow">{{ item.name }} {{ item.location ? `(${item.location})` : '' }}</div>
                            <div class="msg">{{ item.type == 2 ? '按时长' : item.type == 4 ? '按比例' : '未配置屏幕时长' }}</div>
                            <div class="content" v-if="item.duration">{{ item.duration }}</div>
                        </div>
                    </div>
                </div>
            </el-scrollbar>
        </div>

        <div class="lock-position-config-bottom">
            <div class="success-count"><span v-show="successCount">已变更{{ successCount }}个屏幕布局配置</span></div>
            <div class="right-btn">
                <el-button size="small" @click="$router.push('/contentManage')">取消</el-button>
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
            // 当前选中的规则index
            currentRuleIndex: null, 

            // 屏幕时长规则列表
            ruleData: [], 

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
                this.placeData = res.obj
            })
        },

        // 选择大屏
        handelSelectScreen(data){
            if(this.ruleData.length && !this.ruleData[this.currentRuleIndex].selectedScreenIds) {
                this.$set(this.ruleData[this.currentRuleIndex], 'selectedScreenIds', [])
            } 

            if(this.ruleData.length && !this.ruleData[this.currentRuleIndex].selectedScreens) {
                this.$set(this.ruleData[this.currentRuleIndex], 'selectedScreens', [])
            } 

            if(this.ruleData.length && !this.ruleData[this.currentRuleIndex].selectedScreenIds.includes(data.id)){
                let ids = this.ruleData[this.currentRuleIndex].selectedScreenIds.concat([data.id])
                let datas = this.ruleData[this.currentRuleIndex].selectedScreens.concat([data])
                this.$set(this.ruleData[this.currentRuleIndex], 'selectedScreenIds', ids)
                this.$set(this.ruleData[this.currentRuleIndex], 'selectedScreens', datas)
            }

        },

        // 删除已选定的大屏
        handleScreenDelete(index){
            this.$delete(this.ruleData[this.currentRuleIndex].selectedScreenIds, index)
            this.$delete(this.ruleData[this.currentRuleIndex].selectedScreens, index)
        },

        // 应用
        handleApplication(){
            let data = []
            for(let i = 0; i < this.ruleData.length; i++){
                if(this.ruleData[i].selectedScreenIds){
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
    $bgColor: #F2F3F5;
    $mainColor: #0283C6;

    .lock-position-config-wrap {
        width: 100%;
        height: calc(100vh - 72px);
        display: flex;
        flex-direction: column;
        background: #fff;

        .lock-position-list{
            height: 140px;
            margin: 0 20px;

            .el-scrollbar{
                height: 140px;
            }

            .lock-list-wrap{
                width: 100%;
                display: flex;
                flex-wrap: wrap;
                margin-left: -20px;
            }

            .item{
                width: 120px;
                height: 100px;
                background: #D0D4DA;
                border-radius: 6px;
                overflow: hidden;
                margin: 20px;
                position: relative;
                cursor: pointer;
                display: flex;
                justify-content: center;
                align-items: center;
                flex-direction: column;

                &.active{
                    background: $mainColor;
                    color: #fff;
                }

                span.icon{
                    padding: 10px 0;
                    font-size: 20px;
                }

                &:hover{
                    background: $mainColor;
                    color: #fff;
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
                        display: flex;
                        flex-direction: column;
                        cursor: pointer;
                        justify-content: space-around;
                        padding: 10px 0;

                        .screen-title{
                            line-height: 26px;
                        }

                        .msg{
                            font-size: 12px;
                        }

                        .content{
                            color: #000;
                        }

                        
                    }
                }
            }
            
        }

        .lock-position-config-bottom{
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