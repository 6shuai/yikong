<template>
    <el-dialog
        class="get-limit-dialog"
        title="领取限制"
        :visible.sync="showLimitDialog"
        width="600px"
        :append-to-body="true"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
    >
        <el-form
            label-width="120px"
            ref="addLimitForm"
            :model="limitParams"
            :rules="limitRules"
        >
            <el-form-item label="限制类型" prop="claimLimit">
                <el-select
                    style="width: 100%"
                    v-model="limitParams.claimLimit"
                    filterable
                    clearable
                    placeholder="请选择限制类型"
                >
                        <!-- v-for="item in [{ id: 1, name: '单品限制' }, { id: 2, name: '总量限制' }]" -->
                    <el-option
                        v-for="item in [{ id: 1, name: '默认类型' }]" 
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                    >
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="开始时间类型" prop="beginType">
                <el-select
                    style="width: 100%"
                    v-model="limitParams.beginType"
                    filterable
                    clearable
                    placeholder="请选择开始时间类型"
                >
                    <el-option
                        v-for="item in [{ id: 1, name: '活动期间' }, { id: 2, name: '固定时间' }]"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                    >
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item 
                label="开始时间" 
                prop="beginTime"
                v-if="limitParams.beginType==2"
            >
                <el-date-picker
                    v-model="limitParams.beginTime"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    format="yyyy-MM-dd HH:mm:ss"
                    placeholder="开始时间"
                >
                </el-date-picker>
            </el-form-item>
            <el-form-item label="结束时间类型" prop="endType">
                <el-select
                    style="width: 100%"
                    v-model="limitParams.endType"
                    filterable
                    clearable
                    placeholder="请选择结束时间类型"
                >
                    <el-option
                        v-for="item in [{ id: 1, name: '活动期间' }, { id: 2, name: '固定时间' }]"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                    >
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item 
                label="结束时间" 
                prop="endTime"
                v-if="limitParams.endType == 2"
            >
                <el-date-picker
                    v-model="limitParams.endTime"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    format="yyyy-MM-dd HH:mm:ss"
                    placeholder="结束时间"
                >
                </el-date-picker>
            </el-form-item>
            <el-form-item label="限制数量" prop="limit">
                <el-input-number
                    :min="0"
                    v-model="limitParams.limit"
                    placeholder="限制数量"
                ></el-input-number>
            </el-form-item>
        </el-form>

        <span slot="footer" class="dialog-footer">
            <el-button @click="showLimitDialog = false">取 消</el-button>
            <el-button
                type="primary"
                :loading="btnLoading"
                @click="handleAddLimit"
                >确 定</el-button
            >
        </span>
    </el-dialog>
</template>

<script>
import { activityAddLimit, activityPondAddLimit } from '@/api/activity';

export default {
    props: ['ponId'],
    data(){
        return{
            showLimitDialog: false,
            limitParams: {},
            limitRules: {
                claimLimit: [
                    { 
                        required: true, 
                        trigger: "change", 
                        type: "number",
                        message: "请选择限制类型~" 
                    }
                ],
                beginType: [
                    { 
                        required: true, 
                        trigger: "change", 
                        type: "number",
                        message: "请选择开始时间类型~" 
                    }
                ],
                beginTime: [
                    { 
                        required: true, 
                        trigger: "change", 
                        message: "请选择开始时间~" 
                    }
                ],
                endType: [
                    { 
                        required: true, 
                        trigger: "change", 
                        type: "number",
                        message: "请选择结束时间类型~" 
                    }
                ],
                endTime: [
                    { 
                        required: true, 
                        trigger: "change", 
                        message: "请选择结束时间~" 
                    }
                ],
                limit: [
                    { 
                        required: true, 
                        trigger: "blur", 
                        type: 'number',
                        message: "请输入限制数量~" 
                    }
                ],
            },
            btnLoading: false
        }
    },
    methods: {
        showGetLimit(data){
            this.showLimitDialog = true;
            if(this.$refs["addLimitForm"]){
                this.$refs["addLimitForm"].resetFields()
                this.limitParams = {};
            }
            this.$nextTick(() => {
                if(data) this.limitParams = JSON.parse(JSON.stringify(data));
            })
        },

        handleAddLimit(){
            this.$refs.addLimitForm.validate((valid) => {
                if(valid){
                    this.btnLoading = true;
                    let addLimitApi = activityAddLimit;
                    if(this.ponId){
                        addLimitApi = activityPondAddLimit;
                        this.limitParams.item = this.ponId;
                    }else{
                        this.limitParams.promotion = this.$route.params.id;
                    }
                    addLimitApi(this.limitParams).then(res => {
                        this.btnLoading = false;
                        if(res.code == 0){
                            this.$message.success('操作成功~');
                            this.showLimitDialog = false;
                            this.$emit('limitCreatedSuccess');
                        }
                    })
                }
            })
        }
    }
}
</script>