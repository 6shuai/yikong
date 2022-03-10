<template>
    <el-dialog
        class="create-material-wrap"
        width="1200px"
        title="物料投放"
        v-if="showCreateMaterial"
        :visible.sync="showCreateMaterial"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :show-close="false"
        append-to-body
    >

        <el-empty 
            v-if="!screenData.publishedPlaceholders || !screenData.publishedPlaceholders.length"
            description="暂无锁位信息"
        ></el-empty>
        <el-row v-else>
            
            <el-col :span="24">
                <h3>物料</h3>

                <!-- 选择屏幕布局模板 -->
                <material-select-screen-layout
                    @setScreenLayoutData="setScreenLayoutData"
                    :selectedScreenDuration="selectedScreen[0] ? selectedScreen[0].materialDuration : null"
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
                class="screen-list"
                :span="24">
                <h3>投放屏幕</h3>
                <div class="total-price mb20">
                    <el-tag type="primary">总刊例价: {{ screenData.totalPrice }}</el-tag>
                </div>
                <div class="item list-head">
                    <span class="radio"></span>
                    <span class="screen">屏幕名称</span>
                    <span class="duration">物料时长</span>
                    <span class="play-count">播放次数</span>
                    <span class="start-time">上刊时间</span>
                    <span class="end-time">下刊时间</span>
                    <span class="count">数量</span>
                </div>
                <div 
                    class="item"
                    v-for="(item, index) in screenData.publishedPlaceholders"
                    :key="item.id"
                    v-show="(!selectedScreen[0] ? true : selectedScreen[0].materialDuration == item.materialDuration ?  true : false) && (item.materialDuration == contentDuration || !contentDuration)"
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
        <span slot="footer" class="dialog-footer">
            <el-button @click="showCreateMaterial = false">取 消</el-button>
            <el-button
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
            screenData: [],

            // 选中的屏幕信息
            selectedScreen: [],

            // 选中的屏幕index
            selectedIndex: [],

            // 已选择的物料时长
            contentDuration: null
        }
    },
    methods: {
        // 显示新建物料窗口
        showCreateMaterialDialog(){
            this.showCreateMaterial = true
            this.selectedScreen = []
            this.selectedIndex = []
            this.addParams = {}
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

        // 设置屏幕逻辑区域内容
        setScreenLayoutData(data, contentDuration){
            // 已选择的物料时长
            this.contentDuration = contentDuration
            this.addParams = data
        },


        // 新建物料
        handleCreate(){
            if(!this.selectedScreen.length){
                this.$message.warning('还没选择屏幕呢~')
                return
            }else if(!this.addParams.publishedMaterialRegions || !this.addParams.publishedMaterialRegions.length){
                this.$message.warning('你咋没投放物料呢~')
                return
            }

            for(let j = 0; j < this.addParams.publishedMaterialRegions.length; j++){
                if(!this.addParams.publishedMaterialRegions[j].contentId){
                    this.$message.warning('你咋没投放物料呢~')
                    return
                }
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
                        width: 40px;

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
    }
</style>