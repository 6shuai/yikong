<template>
    <!-- 新建阶段 -->
    <el-dialog
        width="1000px"
        :title="stageParams.id ? '编辑阶段' : '新建阶段'"
        :visible.sync="showCreatedStage"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :show-close="false"
        class="timeline-create-stage"
        v-loading="loading"
        append-to-body
    >
        <el-form label-width="80px">
            <el-form-item label="选择屏幕布局模板" class="is-required" v-if="!stageParams.id">
                <ul class="temp-list clearfix" v-loading="tempLoading">
                    <li 
                        v-for="(item, index) in tempList" 
                        :key="index"
                        :class="{active: item.id==tempId}"
                        @click="handleSelected(item)"
                        :title="item.displayName"
                    >
                        <div class="layout-warp">
                            <div 
                                class="temp-layout"
                                :style="{
                                    width: item.height > item.width ? item.width / item.height * 100 + 'px' : '100px',
                                    height: item.height > item.width ? '100px' : item.height / item.width * 100 + 'px'
                                }"
                            >
                                <div 
                                    class="item" 
                                    v-for="sub in item.logicRegionSubs" 
                                    :key="sub.id"
                                    :style="{
                                        width: sub.percentageWidth + '%',
                                        height: sub.percentageHeight + '%',
                                        top: sub.percentageY + '%',
                                        left: sub.percentageX + '%'
                                    }"
                                ></div>
                            </div>
                        </div>
                        <div class="title">{{item.displayName}}</div>
                    </li>
                    <li 
                        class="created-temp"
                        @click="$router.push('/screen/layout/add')"
                    >   
                        <i class="el-icon-right"></i>
                        <p>去创建布局模板</p>
                    </li>
                </ul>
            </el-form-item>

            <el-form-item 
                v-if="stageParams.phaseType == 2 || !prevData || (prevData.isRotation && stageParams.phaseType == 1)"
                :class="{'is-required': stageParams.phaseType == 2 || (prevData && prevData.isRotation)}"
                label="开始时间" >
                <el-time-picker
                    v-model="stageParams.beginTime"
                    value-format="HH:mm:ss"
                    format="HH:mm:ss"
                    placeholder="开始时间"
                    :picker-options="{
                        selectableRange: `${startTime} - 23:59:59`
                    }"
                >
                </el-time-picker>
            </el-form-item>

            <el-form-item 
                v-if="stageParams.phaseType == 2"
                label="持续时长" 
                class="is-required">
                <el-input
                    class="w220 mr10"
                    type="number"
                    v-model="stageParams.duration"
                    :min="1"
                    placeholder="持续时长"
                ></el-input>
                秒
            </el-form-item>
            <el-form-item 
                v-if="stageParams.phaseType == 1"
                label="是否循环" 
                prop="isRotation">
                <el-switch
                    :active-value="1"
                    :inactive-value="0"
                    v-model="stageParams.isRotation"
                ></el-switch>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="showCreatedStage = false">取 消</el-button>
            <el-button
                type="primary"
                :loading="createdLoading"
                @click="createdStage"
                >确 定</el-button
            >
        </span>
    </el-dialog>
</template>

<script>
import { timeDisposeTool } from '@/mixins';
import { timelineStageTempList, timelineStageCreated } from '@/api/timeline';
export default {
    mixins: [timeDisposeTool],
    props: ['startTime'],
    data() {
        return {
            showCreatedStage: false,
            loading: false,
            createdLoading: false,
            stageParams: {},
            tempId: undefined,
            tempList: [],
            tempLoading: true,
            prevData: {},            //上一个阶段数据
        };
    },
    methods: {
        showDialog(phaseType, data, prevData, newStageStartTime){
            this.prevData = prevData;
            this.tempId = undefined;
            this.showCreatedStage = true;
            this.layoutTempList();
            this.stageParams = {
                containerId: this.$route.params.id,
                phaseType,
                isRotation: data.isRotation,
                beginTime: newStageStartTime,
                timelineRegions: data.timelineRegions,
            }
            if(data && data.id){
                this.stageParams = {
                    ...this.stageParams,
                    ...data,
                    beginTime: data.beginTimeFormat
                }
            }
        },

        //屏幕布局模板
        layoutTempList(){
            this.tempLoading = true;
            timelineStageTempList().then(res => {
                this.tempLoading = false;
                if(res.code === this.$successCode){
                    this.tempList = res.obj;
                }
            })
        },

        //选择模板
        handleSelected(data){
            this.tempId = data.id;
            let timelineRegions = [];
            let { width, height } = this.$store.state.timeline.screenSize;

            data.logicRegionSubs.forEach((item, index) => {
                timelineRegions.push({
                    regionSubId: item.id
                })
            })

            this.stageParams = {
                ...this.stageParams,
                timelineRegions
            }
        },
        
        //创建阶段
        createdStage(){
            if(!this.stageParams.timelineRegions){
                this.$message.warning('还没选择屏幕布局~');
                return
            }else if(!this.stageParams.beginTime && (this.stageParams.phaseType == 2 || this.prevData.isRotation)){
                this.$message.warning('还没选择开始时间~');
                return
            }else if(!this.stageParams.duration && this.stageParams.phaseType == 2){
                this.$message.warning('还没填写持续时间~');
                return
            }
            this.createdLoading = true;
            this.stageParams.beginTime = this.stageParams.beginTime ? "1970-01-01 " + this.stageParams.beginTime : '';

            timelineStageCreated(this.stageParams).then(res => {
                this.createdLoading = false;
                if(res.code === this.$successCode){
                    this.$message.success(this.stageParams.id ? '修改成功~' : '创建成功~');
                    this.showCreatedStage = false;

                    this.$emit('createdStageSuccess', this.stageParams.id ? 'editStage' : 'addStage', {
                        beginTimeFormat: this.stageParams.beginTime ? this.stageParams.beginTime.split('1970-01-01 ')[1] : '',
                        duration: this.stageParams.duration ? this.stageParams.duration : 0,
                        isRotation: this.stageParams.isRotation
                    });
                }
            })
        },

        //删除当前阶段后 把下一个阶段的开始时间改成上一个的开始时间
        changeNextStageTime(params){
            params.beginTime = params.beginTime ? "1970-01-01 " + params.beginTime : '';
            timelineStageCreated(params).then(res => {
                if(res.code === this.$successCode){
                    console.log('修改下一阶段开始时间成功');
                }
            })
        }


    },
};
</script>

<style lang="scss" scope>
    .timeline-create-stage{
        .temp-list{
            display: flex;
            flex-wrap: wrap;
            li{
                margin-right: 10px;
                margin-bottom: 20px;
                width: 120px;
                height: 140px;
                padding: 10px;
                text-align: center;
                border: 1px solid #e5e5e5;
                border-radius: 4px;
                cursor: pointer;

                &.created-temp{
                    color: #fc5185;
                    i{
                        font-size: 22px;
                    }
                }

                &:hover{
                    border-color: #6a2c70;
                }

                &.active{
                    border-color: #6a2c70;
                }

                .layout-warp{
                    width: 100px;
                    height: 100px;
                    .temp-layout{
                        display: block;
                        height: 100px;
                        position: relative;
                        border: 1px solid #ffdc93;
                        margin: 0 auto;
                        .item{
                            position: absolute;
                            border: 1px solid #ff2e63;
                        }
                    }
                }

                .title{
                    line-height: 20px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }
            }
        }
    }
</style>