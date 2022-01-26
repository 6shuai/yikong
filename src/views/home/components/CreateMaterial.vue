<template>
    <el-dialog
        class="create-material-wrap"
        width="1200px"
        title="新建物料"
        :visible.sync="showCreateMaterial"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :show-close="false"
        append-to-body
    >
        <el-empty 
            v-if="!screenData || !screenData.length"
            description="暂无锁位信息"
        ></el-empty>
        <el-row v-else>
            <el-col 
                class="screen-list"
                :span="15">
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
                    v-for="(item, index) in screenData"
                    :key="index"
                    @click="selectedIndex = index; handleChangeScreen()"
                    :class="{ active: selectedIndex === index }"
                >
                    <span class="radio"><el-radio v-model="selectedIndex" :label="index"></el-radio></span>
                    <span class="screen">{{ item.screenName }}</span>
                    <span class="duration">{{ item.materialDuration }}</span>
                    <span class="play-count">{{ item.publishedTimes }}</span>
                    <span class="start-time">{{ formDataEvent(item.fromTimeFormat) }}</span>
                    <span class="end-time">{{ formDataEvent(item.toTimeFormat) }}</span>
                    <span class="count">{{ item.count }}</span>
                </div>


            </el-col>
            <el-col :span="9">
                <el-form 
                    label-width="110px"
                    ref="addMaterialForm"
                    :inline="true"
                >
                    <div v-if="selectedScreen && selectedScreen.count">
                        <el-form-item 
                            v-for="(item, index) in selectedScreen.count"
                            :key="index"
                            label="内容">
                            <el-select
                                v-model="addParams[index].content"
                                filterable
                                remote
                                reserve-keyword
                                placeholder="请输入内容名称"
                                :remote-method="handleSearchContent"
                            >
                                <el-option
                                    v-for="item in contentData"
                                    :key="item.id"
                                    :label="item.displayName"
                                    :value="item.id">
                                </el-option>
            
                                <el-pagination
                                    v-if="contentData.length"
                                    :hide-on-single-page="false"
                                    layout="total, prev, pager, next"
                                    :current-page="Number(contentSearchParams.pageNo)"
                                    :page-size="contentSearchParams.pageSize"
                                    @current-change="contentSearchParams.pageNo=$event,getContentData()"
                                    :total="contentTotalCount">
                                </el-pagination>  
            
                            </el-select>
                        </el-form-item>
                        <el-form-item label="上刊时间">
                            <el-date-picker
                                v-model="selectedScreen.fromTimeFormat"
                                type="date"
                                placeholder="选择日期"
                                :disabled="true"
                                value-format="yyyy-MM-dd">
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item label="下刊时间">
                            <el-date-picker
                                v-model="selectedScreen.toTimeFormat"
                                type="date"
                                placeholder="选择日期"
                                :disabled="true"
                                value-format="yyyy-MM-dd">
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item label="每日播放次数">
                            <el-input-number 
                                class="w220"
                                :controls="false"
                                :disabled="true"
                                v-model="selectedScreen.publishedTimes" 
                                :min="0"
                                placeholder="每日播放次数"
                            ></el-input-number>
                        </el-form-item>
                    </div>
                </el-form>
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
import { contentList } from '@/api/content'
import { dateAddHMS } from '@/utils/index'

export default {
    data(){
        return {
            showCreateMaterial: false,
            createdLoading: false,
            addParams: [],

            // 屏幕列表
            screenData: [],

            // 选中的屏幕信息
            selectedScreen: {},

            // 选中的屏幕index
            selectedIndex: null,

            // 内容列表
            contentData: [],

            // 选中的内容
            selectedContent: [],

            // 内容搜索项
            contentSearchParams: {
                pageNo: 1,
                pageSize: 40
            },

            // 内容总数
            contentTotalCount: 0
        }
    },
    methods: {
        // 显示新建物料窗口
        showCreateMaterialDialog(){
            this.showCreateMaterial = true
            this.getScreenData()
            this.getContentData()
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
        handleChangeScreen(){
            this.selectedScreen = this.screenData[this.selectedIndex]
            let { screen, fromTimeFormat, toTimeFormat, publishedTimes, id } = this.selectedScreen
            this.addParams = []
            for(let i = 0; i < this.selectedScreen.count; i++){
                this.addParams.push({
                    screen,
                    publishedTimes,
                    effectiveTime: fromTimeFormat,
                    dueTime: toTimeFormat,
                    project: Number(this.$route.params.id),
                    placeholderId: id
                })
            }
            
        },

        // 获取内容列表
        getContentData(){
            contentList(this.contentSearchParams).then(res => {
                if(res.code === this.$successCode){
                    let { list, totalRecords } = res.obj
                    this.contentData = list
                    this.contentTotalCount = totalRecords
                }
            })
        },

        // 内容搜索
        handleSearchContent(event){
            this.contentSearchParams = {
                ...this.contentSearchParams,
                displayName: event,
                pageNo: 1
            }
            this.getContentData()
        },


        // 新建物料
        handleCreate(){
            this.createdLoading = true

            if(!this.addParams.length){
                this.$message.warning('还没选择屏幕呢~')
                return
            }   


            for(let i = 0; i < this.addParams.length; i++){
                let item = this.addParams[i]
                if(!item.content){
                    this.$message.warning('还有内容没选择~')
                    return
                }
            }
            
            projectMaterialCreate(this.addParams).then(res => {
                this.createdLoading = false
                if(res.code === this.$successCode){
                    this.$message.success('提交成功~')
                    this.showCreateMaterial = false
                    this.$emit('createMaterialSuccess')
                }
            }) 
        },

        formDataEvent(val){
            return dateAddHMS(val)
        }
    }
}
</script>

<style lang="scss">
    .create-material-wrap{
        .el-select{
            width: 220px;
        }

        .screen-list{
            border-right: 1px solid #e5e5e5;

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
                        width: 200px;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                        text-align: left;
                    }

                    &.duration, &.play-count, &.count{
                        width: 80px;
                    }

                    &.start-time, &.end-time{
                        width: 100px;
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
    }
</style>