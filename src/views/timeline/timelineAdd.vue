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
                                    <el-input type="number" v-model="timelineParams.width" placeholder="宽"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="2" style="text-align: center">
                                <span>x</span>
                            </el-col>
                            <el-col :span="11">
                                <el-form-item prop='height'>
                                    <el-input type="number" v-model="timelineParams.height" placeholder="高"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-form-item>
                    <el-form-item label="时段" class="is-required">
                        <el-row>
                            <el-col :span="11">
                                <el-form-item class="limit-time limit-star-time" prop="beginTime">
                                    <el-time-select
                                        placeholder="起始时间"
                                        v-model="timelineParams.beginTime"
                                        :picker-options="{
                                            start: '05:00',
                                            step: '00:15',
                                            end: '23:30'
                                        }">
                                    </el-time-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="2" style="text-align: center">
                                <span>—</span>
                            </el-col>
                            <el-col :span="11">
                                <el-form-item class="limit-time" prop="endTime">
                                    <el-time-select
                                        placeholder="结束时间"
                                        v-model="timelineParams.endTime"
                                        :picker-options="{
                                            start: '05:00',
                                            step: '00:15',
                                            end: '23:30',
                                            minTime: timelineParams.beginTime
                                        }">
                                    </el-time-select>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-form-item>
                    <el-form-item label="说明">
                        <el-input type="textarea" :rows="3" v-model="timelineParams.description" placeholder="大屏描述"></el-input>
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
            timelineParams: {},
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
                }
            })
        },

        //保存
        timelineSureBtn(){
            this.$refs.timelineParams.validate((valid) => {
                if (valid) {
                    this.btnLoading = true;
                    let copyData = JSON.parse(JSON.stringify(this.timelineParams));
                    copyData.beginTime = '1970-01-01 ' + (copyData.beginTime.length > 5 ? copyData.beginTime : copyData.beginTime + ':00' );
                    copyData.endTime = '1970-01-01 ' + (copyData.endTime.length > 5 ? copyData.endTime : copyData.endTime + ':00' );
                    timelineContainerCreated(copyData).then(res => {
                        if(res.code === this.$successCode){
                            this.$message.success('操作成功~');
                            this.$router.push('/timeline/index');
                        }
                    })
                }
            })
        }
    },
}
</script>
<style lang="scss" scope>

</style>