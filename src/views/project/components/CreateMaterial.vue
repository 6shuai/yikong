<template>
    <el-dialog
        class="create-material-wrap"
        width="1200px"
        title="物料投放"
        v-if="showCreateMaterial"
        :visible.sync="showCreateMaterial"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        append-to-body
    >

        <el-empty 
            v-if="!screenData.publishedPlaceholders || !screenData.publishedPlaceholders.length"
            description="暂无锁位信息"
        ></el-empty>
        <el-row v-else>
            <el-steps :active="stepActive" simple>
                <el-step title="物料" icon="el-icon-document-add"></el-step>
                <el-step title="投放屏幕" icon="el-icon-monitor"></el-step>
            </el-steps>

            <el-col :span="24" v-show="stepActive==1">

                <!-- 选择屏幕布局模板 -->
                <material-select-screen-layout
                    @setScreenLayoutData="setScreenLayoutData"
                ></material-select-screen-layout>

                <!-- 播放限制 -->
                <div 
                    class="play-limit-wrap"
                    v-if="selectedScreen && selectedScreen.length">

                    <div v-for="item in selectedScreen" :key="item.id">
                        <div 
                            class="mt20"
                            v-if="item.publishedLimitPlaceholders && item.publishedLimitPlaceholders.length">
                            <h3 class="mb10">{{ item.screenName }}</h3>
                            <el-table
                                stripe
                                size="small"
                                :data="item.publishedLimitPlaceholders"
                                row-key="id"
                                border>
                                <el-table-column 
                                    prop="limitType" 
                                    label="限制类型" 
                                    min-width="100"
                                >
                                    <template slot-scope="scope">
                                        <span>{{ scope.row.limitType == 1 ? '限制播放' : '禁止播放' }}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column 
                                    prop="limitBeginFormat" 
                                    label="开始时间" 
                                    min-width="100"
                                >
                                    <template slot-scope="scope">
                                        <span>{{ formDataLimit(scope.row.limitBeginFormat) }}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column 
                                    prop="limitEndFormat" 
                                    label="结束时间" 
                                    min-width="100"
                                >
                                    <template slot-scope="scope">
                                        <span>{{ formDataLimit(scope.row.limitEndFormat) }}</span>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </div>
                    </div>
                </div>

            </el-col>

            <el-col 
                v-show="stepActive==2"
                class="screen-list"
                :span="24">
                <div class="total-price mb20">
                    <el-tag type="primary">总刊例价: {{ screenData.totalPrice }}</el-tag>
                </div>
                <div class="item list-head">
                    <span class="radio">
                        <el-checkbox 
                            :value="selectedScreen.length && selectedScreen.length === publishedPlaceholders.length"
                            @change="handleSelectAll"
                        >全选</el-checkbox>
                    </span>
                    <span class="screen">屏幕名称</span>
                    <span class="duration">物料时长</span>
                    <span class="play-count">播放次数</span>
                    <span class="start-time">上刊时间</span>
                    <span class="end-time">下刊时间</span>
                    <span class="count">数量</span>
                </div>
                <div 
                    class="item"
                    v-for="(item, index) in publishedPlaceholders"
                    :key="item.id"
                    @click.stop="item.selected = !item.selected;handleChangeScreen(item, index)"
                    :class="{ active: item.selected }"
                >
                    <span class="radio">
                        <el-checkbox 
                            :value="item.selected"
                            @change="item.selected = !item.selected;handleChangeScreen(item, index)"
                        ></el-checkbox>
                    </span>
                    <span class="screen">{{ item.screenName }}</span>
                    <span class="duration">{{ item.materialDuration }}</span>
                    <span class="play-count">{{ item.publishedTimes }}</span>
                    <span class="start-time">{{ formDataEvent(item.fromTimeFormat) }}</span>
                    <span class="end-time">{{ formDataEvent(item.toTimeFormat) }}</span>
                    <span class="count">{{ item.count }}</span>
                </div>


            </el-col>
            
        </el-row>
        <span 
            v-if="screenData.publishedPlaceholders && screenData.publishedPlaceholders.length"
            slot="footer" 
            class="dialog-footer"
        >
            <el-button 
                type="primary"
                plain
                v-show="stepActive==2" 
                @click="stepActive=1"
            >
                上一步
            </el-button>
            <el-button 
                type="primary"
                plain
                v-show="stepActive==1" 
                @click="handleClickNextStep"
            >
                下一步
            </el-button>
            <el-button
                v-show="stepActive==2"
                type="primary"
                :loading="createdLoading"
                @click="handleCreate"
                >确 定</el-button
            >
        </span>
    </el-dialog>
</template>

<script>
import { projectMaterialCreate, projectLockPositionList } from '@/api/project'
import { dateAddHMS, findTimeHasYtd } from '@/utils/index'
import MaterialSelectScreenLayout from './MaterialSelectScreenLayout'

export default {
    components: {
        MaterialSelectScreenLayout
    },
    data(){
        return {
            showCreateMaterial: false,
            createdLoading: false,
            addParams: {},

            // 屏幕列表
            screenData: {},
            publishedPlaceholders: [],

            // 选中的屏幕信息
            selectedScreen: [],

            // 选中的屏幕index
            selectedIndex: [],

            // 已选择的物料时长
            contentDuration: null,

            // 步骤条 当前激活的步骤
            stepActive: 1
        }
    },
    methods: {
        // 显示新建物料窗口
        showCreateMaterialDialog(){
            this.showCreateMaterial = true
            this.selectedScreen = []
            this.selectedIndex = []
            this.addParams = {}
            this.stepActive = 1
            this.getScreenData()
        },

        // 获取已锁位的屏幕列表
        getScreenData(){
            projectLockPositionList({ project: this.$route.params.id }).then(res => {
                if(res.code === this.$successCode){
                    this.screenData = res.obj
                }
            })
        },

        // 选择屏幕
        handleChangeScreen(data, index){
            if(this.selectedIndex.includes(index)){
                this.selectedScreen.splice(this.selectedIndex.indexOf(index), 1)
                this.selectedIndex.splice(this.selectedIndex.indexOf(index), 1)
            }else{
                this.selectedScreen.push(data)
                this.selectedIndex.push(index)
            }
        },

        // 选择屏幕 全选
        handleSelectAll(){
            let isAllSelect = true

            if(this.selectedScreen.length === this.publishedPlaceholders.length){
                isAllSelect = false
            }

            this.selectedIndex = []
            this.selectedScreen = []

            for(let i = 0; i < this.publishedPlaceholders.length; i++){
                let item = this.publishedPlaceholders[i]
                item.selected = isAllSelect
                if(isAllSelect){
                    this.selectedIndex.push(i)
                    this.selectedScreen.push(item)
                }
            }
        },

        // 设置屏幕逻辑区域内容
        setScreenLayoutData(data, contentDuration){
            // 已选择的物料时长
            this.contentDuration = contentDuration
            this.addParams = data
        },


        // 点击下一步
        handleClickNextStep(){
            if(!this.addParams.publishedMaterialRegions || !this.addParams.publishedMaterialRegions.length){
                this.$message.warning('你咋没投放物料呢~')
                return
            }

            for(let j = 0; j < this.addParams.publishedMaterialRegions.length; j++){
                if(!this.addParams.publishedMaterialRegions[j] || !this.addParams.publishedMaterialRegions[j].contentId){
                    this.$message.warning('你咋没投放物料呢~')
                    return
                }
            }
            
            // 物料包时长比输入的值默认多一秒
            this.publishedPlaceholders = this.screenData.publishedPlaceholders.filter((item) => {
                // 物料小数点向上取整  物料包和物料的时长差距在1秒之内
                return item.materialDuration+1 > this.contentDuration && item.materialDuration+1 - this.contentDuration <= 1
            })
            this.stepActive = 2
        },


        // 新建物料
        handleCreate(){
            if(!this.selectedScreen.length){
                this.$message.warning('还没选择屏幕呢~')
                return
            }
            
            // 已选择的屏幕 id
            let publishedMaterialMedias = []
            for(let i = 0; i < this.selectedScreen.length; i++){
                let { id } = this.selectedScreen[i]
                publishedMaterialMedias.push({
                    placeholderId: id
                })
            }

            this.addParams.publishedMaterialMedias = publishedMaterialMedias

            this.createdLoading = true
            projectMaterialCreate(this.addParams).then(res => {
                this.createdLoading = false
                if(res.code === this.$successCode){
                    this.$message.success(res.message)
                    this.showCreateMaterial = false
                    this.$emit('createMaterialSuccess')
                }
            }) 
        },


        formDataEvent(val){
            return dateAddHMS(val)
        },

        formDataLimit(val){
            return findTimeHasYtd(val)
        }
    }
}
</script>

<style lang="scss">
    .create-material-wrap{
        h3{
            text-align: center;
            padding-bottom: 10px;
        }

        .el-select{
            width: 220px;
        }

        .screen-list{
            padding-top: 20px;
            margin-top: 40px;
            border-top: 1px solid #e5e5e5;

            .item{
                display: flex;
                height: 40px;
                line-height: 40px;

                &.list-head{
                    background: #d0d0d0;
                }   

                &:not(:first-child){
                    cursor: pointer;

                    &:hover{
                        background: #f1f1f1;
                    }
                }

                &.active{
                    span{
                        color: var(--color-primary);
                    }
                }


                span{
                    text-align: center;

                    &.screen{
                        width: 300px;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                        text-align: left;
                    }

                    &.duration, &.play-count, &.count{
                        width: 150px;
                    }

                    &.start-time, &.end-time{
                        width: 180px;
                    }

                    &.radio{
                        width: 100px;
                        text-align: left;
                        padding-left: 20px;

                        .el-radio__label{
                            display: none;
                        }
                    }
                }
            }
        }

        .play-limit-wrap{
            padding: 10px;

            .title{
                padding-left: 32px;
            }
        }


        .select-screen-layout{
            text-align: center;
            cursor: pointer;
        }

        .select-content{
            line-height: 30px;
            border: 1px dashed var(--color-danger);
            border-radius: 4px;

            span{
                width: 100px;
                display: block;
                text-align: center;
                color: var(--color-danger);
                cursor: pointer;

                &:first-child{
                    border-bottom: 1px dashed var(--color-danger);
                }

                &:hover{
                    background: var(--color-danger);
                    color: #fff;
                }
            }
        }

        .el-steps--simple{
            padding: 13px 20%;
        }
    }
</style>