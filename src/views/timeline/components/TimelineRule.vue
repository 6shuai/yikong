<template>
    <el-dialog
        width="800px"
        title="时间轴调度设置"
        :visible.sync="showTimelineRule"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :show-close="false"
        class="timeline-rule"
        v-loading="loading"
        append-to-body>

        <el-form 
            label-width="80px"
        >
            <el-form-item label="规则">
                <el-radio-group v-model="ruleParams.scheduleRule">
                    <el-radio :label="0">无</el-radio>
                    <el-radio :label="1">内容</el-radio>
                    <el-radio :label="2">时间</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="是否循环" v-if="ruleParams.scheduleRule==1">
                <el-switch
                    :active-value="1"
                    :inactive-value="0"
                    v-model="ruleParams.scheduleLoop">
                </el-switch>
            </el-form-item>
            <el-form-item label="步骤列表" v-if="ruleParams.scheduleRule">
                <el-button type="primary" size="small" @click="showAddStep=true;setpScreen=[]">添加步骤</el-button>

                <div
                    class="add-step" 
                    v-if="showAddStep">
                        <p>选择屏幕区域</p>
                        <el-checkbox-group v-model="setpScreen">
                            <el-checkbox 
                                v-for="(item, index) in screenList"
                                :key="index"
                                :label="item.id"
                            >{{item.displayName}}
                            </el-checkbox>
                        </el-checkbox-group>
                    
                    <el-button size="mini" @click="showAddStep=false">取 消</el-button>
                    <el-button 
                        size="mini"
                        type="primary"
                        @click="handleAddStep"
                    >确 定</el-button>

                </div>

                <ul class="step-wrap">
                    <li class="header">
                        <div class="step">步骤</div>
                        <div class="screen">屏幕区域</div>
                        <div class="active">操作</div>
                    </li>
                    <li 
                        v-for="(item, index) in ruleParams.timelineScheduleSteps"
                        :key="index"
                    >
                        <div class="step">{{index+1}}</div>
                        <div class="screen">
                            <el-tag 
                                size="small" 
                                closable
                                v-for="(s, sIndex) in findRegion(item.stepRegions)"
                                @close="handleClose(s.id, item.stepRegions)"
                                :key="sIndex"
                            >{{s.nickname}}</el-tag>
                        </div>
                        <div class="active">
                            <el-popover
                                style="margin-left:10px"
                                placement="top"
                                :ref="item.id"
                                width="200">
                                <p>确定要删除此步骤吗?</p>
                                <div style="text-align: right; margin: 0">
                                    <el-button size="mini" type="text" @click="$refs[item.id][0].doClose()">取消</el-button>
                                    <el-button type="primary" size="mini" @click="deleteStep(item.id, index)">确定</el-button>
                                </div>
                                <a href="javascript:;" slot="reference">删除</a>
                            </el-popover>
                        </div>
                    </li>
                </ul>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="showTimelineRule=false">取 消</el-button>
            <el-button 
                type="primary"
                :loading="createdLoading"
                @click="createdRule"
            >确 定</el-button>
        </span>
    </el-dialog>
</template>

<script>
import { timelineRuleDetail, timelineRuleCreated, timelineRuleDelete, timelineRuleRegionDelete } from '@/api/timeline';
export default {
    data(){
        return{
            loading: true,
            showTimelineRule: false,  
            showAddStep: false,         //显示添加步骤
            createdLoading: false,
            ruleParams: {               //添加参数
                scheduleRule: 0,
                timelineScheduleSteps: []
            },             
            screenList: [],             //屏幕列表
            setpScreen: []
        }
    },
    methods: {
        setScreenList(data){
            this.screenList = data;
            console.log(data)
        },

        //获取详情
        getDetail(){
            this.showTimelineRule = true;
            this.loading = true;
            this.showAddStep = false;
            this.setpScreen = [];
            timelineRuleDetail({containerId: this.$route.params.id}).then(res => {
                this.loading = false;
                if(res.code === this.$successCode){
                    this.ruleParams = res.obj;
                }
            })
        },

        //添加步骤
        handleAddStep(){
            if(!this.setpScreen.length){
                this.$message.warning('请选择屏幕区域~');
                return;
            }

            let data = [];
            this.setpScreen.forEach(item => {
                data.push({
                    regionId: item
                })
            })
            this.ruleParams.timelineScheduleSteps.push({
                stepRegions: data
            })

            this.setpScreen = [];

        },

        //创建时间轴调度
        createdRule(){
            if(this.ruleParams.scheduleRule && !this.ruleParams.timelineScheduleSteps.length){
                this.$message.warning('还没添加步骤呢 ฅ⁽͑ ˚̀ ˙̭ ˚́ ⁾̉');
                return
            }

            this.ruleParams.timelineScheduleSteps.forEach((item, index) => {
                item.orderIndex = index;
            })
 
            this.createdLoading = true;
            timelineRuleCreated(this.ruleParams).then(res => {
                this.createdLoading = false;
                if(res.code === this.$successCode){
                    this.$message.success('操作成功~');
                    this.showTimelineRule = false;
                }
            })
        },

        //删除步骤
        deleteStep(id, index){
            if(!id) {
                this.deleteResult(index);
                return
            }
            timelineRuleDelete(id).then(res => {
                if(res.code === this.$successCode){
                    this.$message.success('删除成功~');
                    this.deleteResult(index);
                }
            })
        },

        deleteResult(index){
            this.ruleParams.timelineScheduleSteps.splice(index, 1);
        },


        //根据区域id 查找屏幕昵称
        findRegion(data){
            let nickname = [];
            data.forEach((item, index) => {
                this.screenList.forEach(s => {
                    if(item.regionId == s.id){
                        nickname.push({
                            nickname: s.displayName,
                            id: item.id
                        });
                    }
                })
            })

            return nickname;

        },


        //删除屏幕区域
        handleClose(id, data){
            console.log(id, data)
            if(data.length == 1){
                this.$message.warning('至少保留一个屏幕区域~');
                return;
            }
            timelineRuleRegionDelete(id).then(res => {
                if(res.code === this.$successCode){
                    this.$message.success('删除成功~');
                    data.splice(0, 1);
                }
            })
        }

    },
}
</script>

<style lang="scss">
    .timeline-rule{
        .step-wrap{
            width: 100%;
            li{
                padding: 10px 0;
                border-bottom: 1px solid #e5e5e5;
                &.header{
                    color:#f50038;
                    background: #ffc7c7;
                    border: none;
                }
                div{
                    display: inline-block;
                    text-align: center;
                    line-height: 30px;
                    padding: 0 5px;
                    &.step{
                        width: 50px;
                    }
                    &.screen{
                        width: 420px;
                    }
                    &.active{
                        width: 80px;
                        color: #f50038;
                        &:hover{
                            text-decoration: underline;
                        }
                    }

                }
            }
        }

        .add-step{
            width: 100%;
            padding: 10px;
            border: 1px solid #e5e5e5;
            border-radius: 6px;
            margin-bottom: 10px;
        }
    }
</style>