<template>
    <div class="locating-wrap">
        
        <!-- 已锁位列表 -->
        <el-button 
            class="lock-btn"
            type="primary"
            plain
            @click="$refs.lockPositionList.showLockPositionListDialog()"
        >
            锁位列表
        </el-button>

        <div 
            class="screen-list" 
            v-loading="dataLoading"
        >
            <el-form 
                label-width="80px"
            >
                <el-form-item label="屏幕名称" prop="displayName">
                    <el-input 
                        class="w220" 
                        size="small" 
                        clearable 
                        placeholder="屏幕名称" 
                        v-model="searchParams.displayName" 
                        @input="$debounce(getScreenList)"
                    ></el-input>
                </el-form-item>
                <el-form-item label="选择地区" prop="displayName">
                    <select-region 
                        @selectArea="searchParams={...searchParams, ...$event};getScreenList()"
                    ></select-region>
                </el-form-item>
            </el-form>

            <div class="list">
                <el-scrollbar>
                    <el-card 
                        class="item" 
                        v-for="item in screenData"
                        :key="item.id"
                        @click.native="handleAddScreen(item)"
                    >
                        <i class="el-icon-plus"></i>
                        {{ item.displayName }}
                    </el-card>
                </el-scrollbar>
            </div>

        </div>

        <!-- 选中的屏幕列表 -->
        <div class="selected-screen-list">
            <el-scrollbar>
                <h3>请从左侧列表选择需要寻位的屏幕</h3>
    
                <div class="form-screen">
                    <ul 
                        class="item" 
                        v-for="(item, index) in selectedScreen"
                        :key="item.id"
                    >
                        <li class="title">
                            {{ item.displayName }}
                            <div class="delete" @click="selectedScreen.splice(index, 1)">删除</div>
                        </li>
                        <li>
                            <span class="label">物料时长</span>
                            <span class="value">
                                <el-input-number 
                                    class="w200"
                                    :controls="false"
                                    v-model="item.materialDuration" 
                                    :min="0"
                                ></el-input-number>
                            </span>
                        </li>
                        <li>
                            <span class="label">每日播放次数</span>
                            <span class="value">
                                <el-input-number 
                                    class="w200"
                                    :controls="false"
                                    v-model="item.publishedTimes" 
                                    :min="0"
                                ></el-input-number>
                            </span>
                        </li>
                        <li>
                            <span class="label">开始日期</span>
                            <span class="value">
                                <el-date-picker
                                    class="w200"
                                    v-model="item.fromTime"
                                    type="date"
                                    placeholder="选择开始日期"
                                    value-format="yyyy-MM-dd">
                                </el-date-picker>
                            </span>
                        </li>
                        <li>
                            <span class="label">结束日期</span>
                            <span class="value">
                                <el-date-picker
                                    class="w200"
                                    v-model="item.toTime"
                                    type="date"
                                    placeholder="选择结束日期"
                                    value-format="yyyy-MM-dd">
                                </el-date-picker>
                            </span>
                        </li>
                        <li>
                            <span class="label">数量</span>
                            <span class="value">
                                <el-input-number 
                                    class="w200"
                                    :controls="false"
                                    v-model="item.count" 
                                    :min="0"
                                ></el-input-number>
                            </span>
                        </li>
                    </ul>
                </div>
            </el-scrollbar>

            <el-button
                type="primary"
                class="save-btn"
                :loading="btnLoading"
                @click="handleLocating"
            >提 交</el-button>

        </div>


        <!-- 寻位结果 -->
        <locating-result 
            ref="locatingResult"
            @lockPositionSuccess="lockPositionSuccess"
        ></locating-result>

        <!-- 锁位列表 -->
        <lock-position-list ref="lockPositionList"></lock-position-list>

    </div>
</template>

<script>
import { projectLocationScreenList, projectLocation } from '@/api/project'
import SelectRegion from '@/components/SelectRegion/index'
import { dateAddHMS } from '@/utils/index'
import LocatingResult from './components/LocatingResult'
import LockPositionList from './components/LockPositionList'

export default {
    components: {
        SelectRegion,
        LocatingResult,
        LockPositionList
    },
    data(){
        return {
            searchParams: {},
            
            // 屏幕列表
            screenData: [],

            // 屏幕列表加载中
            dataLoading: false,

            // 选中的屏幕
            selectedScreen: [],
            addParams: {},

            // 寻位提交loading
            btnLoading: false
        }
    },
    mounted() {
        this.getScreenList()
    },
    methods: {
        // 获取屏幕列表
        getScreenList(){
            this.dataLoading = true
            projectLocationScreenList(this.searchParams).then(res => {
                this.dataLoading = false
                if(res.code === this.$successCode){
                    this.screenData = res.obj
                }
            })
        },

        // 选择屏幕
        handleAddScreen(data){
            this.selectedScreen.push({
                ...data,
                materialDuration: 15,
                publishedTimes: 120,
                count: 1
            })
        },

        // 寻位提交
        handleLocating(){
            let data = JSON.parse(JSON.stringify(this.selectedScreen))
            for(let i = 0; i < data.length; i++){
                let item = data[i]

                if(!item.materialDuration){
                    this.$message.warning(`【${item.displayName}】 物料时长咋不填呢?`)
                    return
                }else if(!item.publishedTimes){
                    this.$message.warning(`【${item.displayName}】 每日播放次数咋不填呢?`)
                    return
                }else if(!item.fromTime){
                    this.$message.warning(`【${item.displayName}】 开始日期咋不填呢?`)
                    return
                }else if(!item.toTime){
                    this.$message.warning(`【${item.displayName}】 结束日期咋不填呢?`)
                    return
                }else if(!item.count){
                    this.$message.warning(`【${item.displayName}】数量咋不填呢?`)
                    return
                }

                item.screen = item.id
                item.fromTime = dateAddHMS(item.fromTime)
                item.toTime = dateAddHMS(item.toTime)
                item.project = this.$route.params.id
                delete item.id
            }
            this.btnLoading = true
            projectLocation(data).then(res => {
                this.btnLoading = false
                if(res.code === this.$successCode){
                    this.$refs.locatingResult.showLocatingResultDialog(res.obj, data)
                }
            })
        },


        // 锁位成功
        lockPositionSuccess(){
            this.selectedScreen = []
        }
    }
}
</script>

<style lang="scss">
    .locating-wrap{
        height: calc(100vh - 280px);
        display: flex;
        position: relative;

        .lock-btn{
            position: absolute;
            top: -20px;
            right: 0px;
            z-index: 99;
        }

        .el-scrollbar{
            height: 100%;

            .el-scrollbar__wrap{
                overflow-x: hidden;
            }
        }

        .screen-list{
            width: 500px;
            border-right: 1px solid #e5e5e5;

            .list{
                height: calc(100% - 150px);

                .item{
                    margin-bottom: 20px;
                    margin-right: 20px;
                    cursor: pointer;

                    i{
                        margin-right: 10px;
                    }

                    &:hover{
                        box-shadow: 0 2px 12px 0 rgba(241, 2, 2, 0.3);
                    }
                }
            }
        }

        .selected-screen-list{
            flex: 1;
            margin: 0 20px;

            .form-screen{
                display: flex;
                flex-wrap: wrap;
                margin-left: -20px;
            }


            h3{
                text-align: center;
            }

            .item{
                width: 330px;
                display: inline-block;
                border: 1px solid #e5e5e5;
                border-radius: 6px;
                padding: 10px;
                margin: 20px;
                overflow: hidden;
                li{
                    margin-bottom: 10px;

                    &.title{
                        text-align: center;
                        font-weight: bold;
                        position: relative;
                        white-space: nowrap;

                        .delete{
                            position: absolute;
                            top: -10px;
                            right: -10px;
                            font-size: 12px;
                            width: 50px;
                            text-align: center;
                            background: rgb(248, 89, 49);
                            color: #fff;
                            height: 30px;
                            line-height: 30px;
                            cursor: pointer;
                            opacity: .5;

                            &:hover{
                                opacity: 1;
                            }
                        }
                    }
                    
                    span{
                        display: inline-block;

                        &.label{
                            width: 95px;
                            text-align: right;
                            padding-right: 10px;
                            font-size: 13px;
                        }
                    }
                }
            }

            .save-btn{
                position: fixed;
                bottom: 50px;
                right: 30px;
            }
        }
    }
</style>