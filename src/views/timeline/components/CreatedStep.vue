<template>
    <!-- 新建步骤 -->
    <el-dialog
        width="1000px"
        title="新建步骤"
        :visible.sync="showCreatedStep"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        class="timeline-rule created-step-wrap"
        append-to-body
    >
        <el-form label-width="80px">
            <el-form-item label="选择屏幕布局模板">
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
                                        top: sub.percentageY + 'px',
                                        left: sub.percentageX + 'px'
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
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="showCreatedStep = false">取 消</el-button>
            <el-button
                type="primary"
                :loading="createdLoading"
                @click="createdStep"
                >确 定</el-button
            >
        </span>
    </el-dialog>
</template>
<script>
import { timelineStageTempList, timelineStageStepCreated } from '@/api/timeline';
export default {
    data(){
        return{
            showCreatedStep: false,
            stepParams: {},
            createdLoading: false,
            tempId: undefined,
            tempList: [],
            tempLoading: true
        }
    },
    methods: {
        showDialog(id){
            this.tempId = undefined;
            this.stepParams.phaseId = id;
            this.showCreatedStep = true;
            console.log(this.stepParams)
            this.layoutTempList();
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
            console.log(this.$store)
            let { width, height } = this.$store.state.timeline.screenSize;

            data.logicRegionSubs.forEach((item, index) => {
                timelineRegions.push({
                    displayName: item.displayName,
                    x: item.percentageX / 100 * width,
                    y: item.percentageY / 100 * height,
                    width: item.percentageWidth / 100 * width,
                    height: item.percentageHeight / 100 * height
                })
            })

            this.stepParams = {
                ...this.stepParams,
                timelineRegions
            }
        },

        //创建步骤
        createdStep(){
            if(!this.stepParams.timelineRegions){
                this.$message.warning('还没选择屏幕布局~');
                return
            }
            this.createdLoading = true;
            timelineStageStepCreated(this.stepParams).then(res => {
                this.createdLoading = false;
                if(res.code === this.$successCode){
                    this.$message.success('创建步骤成功~');
                    this.showCreatedStep = false;
                    this.$emit('createdStepSuccess');
                }
            })
        }
    },
}
</script>
<style lang="scss" scope>
    .created-step-wrap{
        .el-radio{
            margin-top: 15px;
            display: block;
        }
        .temp-list{
            display: flex;
            flex-wrap: nowrap;
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