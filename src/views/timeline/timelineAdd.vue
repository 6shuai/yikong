<template>
    <el-card class="timeline-add-wrap">
        <el-page-header @back="$router.go(-1)">
            <div slot="content">
                {{$route.params.id ? '编辑时间轴' : '创建时间轴'}}
            </div>
        </el-page-header>
        <el-row :gutter="10" class="mt30" v-loading="$route.params.id && loading">
            <el-col :xs="24" :sm="24" :md="12">
                <el-form 
                    label-width="160px"
                    ref="timelineParams"
                    :model="timelineParams"
                    :rules="timelineRules"
                >
                    <el-form-item label="名称" prop="displayName">
                        <el-input v-model="timelineParams.displayName" placeholder="名称"></el-input>
                    </el-form-item>
                    <el-form-item label="品牌" prop="owner">
                        <el-select v-model="timelineParams.owner" placeholder="请选择所属品牌" style="width:100%">
                            <el-option 
                                v-for="item in groupData" 
                                :key="item.id"
                                :label="item.displayName" 
                                :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="设计宽高" class="is-required">
                        <el-row>
                            <el-col :span="11">
                                <el-form-item prop='width'>
                                    <el-input type="number" v-model="timelineParams.width" :min="1" placeholder="宽"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="2" style="text-align: center">
                                <span>x</span>
                            </el-col>
                            <el-col :span="11">
                                <el-form-item prop='height'>
                                    <el-input type="number" v-model="timelineParams.height" :min="1" placeholder="高"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-form-item>
                    <el-form-item label="时段" class="is-required">
                        <el-row>
                            <el-col :span="11">
                                <el-form-item class="limit-time limit-star-time" prop="beginTime">
                                    <el-time-picker
                                        v-model="timelineParams.beginTime"
                                        value-format="HH:mm"
                                        format="HH:mm"
                                        placeholder="起始时间">
                                    </el-time-picker>
                                </el-form-item>
                            </el-col>
                            <el-col :span="2" style="text-align: center">
                                <span>—</span>
                            </el-col>
                            <el-col :span="11">
                                <el-form-item class="limit-time" prop="endTime">
                                    <el-time-picker
                                        v-model="timelineParams.endTime"
                                        value-format="HH:mm"
                                        format="HH:mm"
                                        placeholder="结束时间">
                                    </el-time-picker>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-form-item>
                    <el-form-item label="说明">
                        <el-input type="textarea" :rows="3" v-model="timelineParams.description" placeholder="时间轴描述"></el-input>
                    </el-form-item>
                    <el-form-item label="">
                        <el-button type="primary" icon="el-icon-check" :loading="btnLoading" @click="timelineSureBtn">提  交</el-button>
                    </el-form-item>
                </el-form>
            </el-col>
        </el-row>
    </el-card>
</template>
<script>
import { getOrganizationList } from '@/mixins';
import { timelineContainerCreated, timelineContainerDetail } from '@/api/timeline';
export default {
    mixins: [getOrganizationList],
    data(){
        return {
            timelineParams: {
                beginTime: '10:00',
                endTime: '22:00',
            },
            btnLoading: false,     
            timelineRules: {
                displayName: [{ required: true, trigger: "blur", message: '请输入名称~' }],
                owner: [{ required: true, trigger: "change", message: '请选择品牌~' }],
                width: [{ required: true, trigger: "change", message: '请输入宽~' }],
                height: [{ required: true, trigger: "change", message: '请输入高~' }],
                beginTime: [{ required: true, trigger: "change", message: '请选择起始时间~' }],
                endTime: [{ required: true, trigger: "change", message: '请选择结束时间~' }],
            },
            loading: false,          //编辑时获取详情  loading
            copyTimelineParams: {}
        }
    },
    mounted() {
        if(this.$route.params.id){
            this.getDetail();
        }
    },
    methods: {
        //编辑 获取详情
        getDetail(){
            timelineContainerDetail(this.$route.params.id).then(res => {
                if(res.code === this.$successCode){
                    this.timelineParams = res.obj;
                    this.timelineParams.beginTime = res.obj.beginTimeFormat.split('1970-01-01 ')[1];
                    this.timelineParams.endTime = res.obj.endTimeFormat.split('1970-01-01 ')[1];
                    this.copyTimelineParams = JSON.parse(JSON.stringify(this.timelineParams));
                }
            })
        },

        //保存
        timelineSureBtn(){
            this.$refs.timelineParams.validate((valid) => {
                if (valid) {
                    if(this.timelineParams.id && !this.timeVerify()) return
                    this.timelineCreated();
                }
            })
        },

        timelineCreated(){
            this.btnLoading = true;
            let copyData = JSON.parse(JSON.stringify(this.timelineParams));
            copyData.beginTime = '1970-01-01 ' + (copyData.beginTime.length > 5 ? copyData.beginTime : copyData.beginTime + ':00' );
            copyData.endTime = '1970-01-01 ' + (copyData.endTime.length > 5 ? copyData.endTime : copyData.endTime + ':00' );
            timelineContainerCreated(copyData).then(res => {
                if(res.code === this.$successCode){
                    this.$message.success('操作成功成功~');
                    this.$router.push('/timeline/index');
                }
            })
        },

        //编辑时时间验证
        timeVerify(){
            let handle = true;
            let msg = '';
            if(this.copyTimelineParams.beginTime && this.timeDifference(this.copyTimelineParams.beginTime, this.timelineParams.beginTime) > 0){
                msg = `当前时段开始时间超过上次设置的时间，【${this.timelineParams.beginTime}】之前结束的时间轴内容将不再显示。`;
            }
            if(this.copyTimelineParams.endTime && this.timeDifference(this.copyTimelineParams.endTime, this.timelineParams.endTime) < 0){
                msg += `当前时段结束时间早于上次设置的时间，【${this.timelineParams.endTime}】之后开始的时间轴内容将不再显示。`;
            }

            if(msg){
                this.$confirm(`${msg} 是否继续?`, '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                }).then(() => {
                    this.timelineCreated();
                }).catch(() => {});
                handle = false;
            }
            return handle;
        },

        //计算时间差（相差分钟）
        // var beginTime="08:31:00";
        // var endTime="21:50:00";
        timeDifference(beginTime, endTime){ 
            var start1 = beginTime.split(":");
            var startAll = parseInt(start1[0]*60) + parseInt(start1[1]);

            this.startHour = parseInt(start1[0]);
            this.startMinute = parseInt(start1[1]);
            
            var end1 = endTime.split(":");
            var endAll = parseInt(end1[0]*60) + parseInt(end1[1]);
            
            return endAll - startAll;
        },
    },
}
</script>
<style lang="scss" scope>
    .timeline-add-wrap{
        .el-input{
            width: 100%;
        }
    }
</style>