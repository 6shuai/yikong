<template>
    <el-dialog
        width="400px"
        title="播放计划"
        :visible.sync="showPlayPlan"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        @close="showPlayPlan=false"
        append-to-body>
        <el-form 
            label-width="80px"
            ref="planForm"
            :model="planParams"
            :rules="planRules"
        >
            <el-form-item label="计划开始" prop="beginDate">
                <el-date-picker
                    v-model="planParams.beginDate"
                    type="date"
                    format="yyyy-MM-dd" 
                    value-format="yyyy-MM-dd" 
                    placeholder="选择日期">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="计划结束" prop="endDate">
                <el-date-picker
                    v-model="planParams.endDate"
                    type="date"
                    format="yyyy-MM-dd" 
                    value-format="yyyy-MM-dd" 
                    placeholder="选择日期">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="计划类型" prop="planType">
                <el-radio-group v-model="planParams.planType">
                    <el-radio-button :label="1">曝光次数</el-radio-button>
                    <el-radio-button :label="2">时长</el-radio-button>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="曝光次数" v-if="planParams.planType == 1" prop="targetTimes">
                <el-input 
                    style="width: 220px"
                    v-model="planParams.targetTimes" 
                    type="number">
                    <template slot="append">次</template>
                </el-input>
            </el-form-item>
            <el-form-item label="时长" v-if="planParams.planType == 2" prop="targetLength">
                <el-input 
                    style="width: 220px"
                    v-model="planParams.targetLength" 
                    type="number">
                    <template slot="append">分钟</template>
                </el-input>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="showPlayPlan = false">取 消</el-button>
            <el-button type="primary" :loading="btnLoading" @click="updatePlayPlan">确 定</el-button>
        </span>
    </el-dialog>

</template>

<script>
import { contentPlayPlanCreated } from '@/api/content';
export default {
    data(){
        return {
            showPlayPlan: false,                  //播放计划  编辑窗口
            planParams: {},                       //播放计划  编辑参数   
            btnLoading: false,                    //确定按钮 loading
            planRules: {
                beginDate: [{ required: true, trigger: "change", message: '请选择计划开始日期~' }],
                endDate: [{ required: true, trigger: "change", message: '请选择计划结束日期~' }],
                planType: [{ required: true, trigger: "change", message: '请选择计划类型~' }],
                targetTimes: [{ required: true, trigger: "blur", message: '请输入曝光次数~' }],
                targetLength: [{ required: true, trigger: "blur", message: '请输入时长~' }],
            }
        }
    },
    methods: {
        //更新播放计划
        updatePlayPlan(){
            this.$refs.planForm.validate((valid) => {
                if (valid) {
                    this.btnLoading = true;
                    let params = JSON.parse(JSON.stringify(this.planParams));
                    if(params.targetTimes) params.targetTimes = Number(params.targetTimes);
                    if(params.targetLength) params.targetLength = Number(params.targetLength);
                    params.beginDate = params.beginDate + ' 00:00:00';
                    params.endDate = params.endDate + ' 00:00:00';
                    params.content = Number(this.$route.params.id);
                    contentPlayPlanCreated(params).then(res => {
                        this.btnLoading = false;
                        if(res.code === this.$successCode){
                            this.$message.success('操作成功~');
                            this.showPlayPlan = false;
                            this.$emit('updateDetail');
                        }
                    })
                }
            })
        },
    },
}
</script>