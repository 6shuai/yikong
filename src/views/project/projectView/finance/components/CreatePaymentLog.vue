<template>
    <el-dialog
        width="520px"
        :title="addParams.nonPayment ? '付款' : addParams.id ? '编辑付款记录' : '添加付款记录'"
        :visible.sync="showCreatePaymentLog"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        append-to-body
    >
        <el-form 
            label-width="80px"
            ref="addForm"
            :model="addParams"
            :rules="addParamsRules"
        >
            <el-form-item label="付款额" prop="amount">
                <el-input-number 
                    class="w220"
                    :controls="false"
                    v-model="addParams.amount" 
                    :min="0"
                    :max="nonPayment"
                    placeholder="付款额"
                ></el-input-number>
            </el-form-item>
            <el-form-item label="付款时间" prop="occurTime">
                <el-date-picker
                    v-model="addParams.occurTime"
                    type="datetime"
                    placeholder="选择付款时间"
                    value-format="yyyy-MM-dd HH:mm:ss"
                >
                </el-date-picker>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="showCreatePaymentLog = false">取 消</el-button>
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
import { projectFinanceCreateLog } from '@/api/project'

export default {
    data(){
        return {
            showCreatePaymentLog: false,
            createdLoading: false,
            addParams: {},

            // 未付款金额
            nonPayment: null,

            // 表单验证
            addParamsRules: {
                amount: [{ required: true, message: '请输入付款额~', type: 'number', trigger: 'blur' }],
                occurTime: [{ required: true, message: '请选择付款时间~', trigger: 'change' }]
            }
        }
    },
    methods: {
        // 显示新建付款记录窗口
        showCreatePaymentLogDialog(data = {}, nonPayment){
            this.addParams = JSON.parse(JSON.stringify(data))
            this.nonPayment = nonPayment

            if(data.id) this.nonPayment = this.addParams.amount + this.nonPayment
            
            this.showCreatePaymentLog = true
            this.$nextTick(() => {
                this.$refs["addForm"].clearValidate();
            })
        },

        // 新建付款记录
        handleCreate(){
            this.$refs.addForm.validate((valid) => {
                if(valid){
                    this.createdLoading = true
                    if(!this.addParams.contract) this.addParams.contract = this.$store.state.project.projectContractDetail.id
                    projectFinanceCreateLog(this.addParams).then(res => {
                        this.createdLoading = false
                        if(res.code === this.$successCode){
                            this.showCreatePaymentLog = false 
                            this.$parent.getFinanceInfo()
                        }
                    })
                }
            })
        }
    },
}
</script>