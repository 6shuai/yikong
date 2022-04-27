<template>
    <el-dialog
        width="520px"
        title="退款"
        :visible.sync="showRefundDialog"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        append-to-body
    >
        <el-form 
            label-width="80px"
            ref="refundForm"
            :model="refundParams"
            :rules="refundRules"
        >
            <el-form-item label="退款金额" prop="amount">
                <el-input-number 
                    class="w100"
                    :controls="false"
                    :max="maxPrice"
                    placeholder="请输入退款金额"
                    v-model="refundParams.amount"
                ></el-input-number>
            </el-form-item>
            <el-form-item label="退款时间" prop="refundTime">
                <el-date-picker
                    class="w100"
                    v-model="refundParams.refundTime"
                    type="date"
                    placeholder="请选择退款时间"
                    value-format="yyyy-MM-dd"
                >
                </el-date-picker>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="showRefundDialog = false">取 消</el-button>
            <el-button
                type="primary"
                :loading="btnLoading"
                @click="handleSubmitRefund"
                >确 定</el-button
            >
        </span>
    </el-dialog>
</template>

<script>
import { projectReturnMoneyRefund } from '@/api/project'

export default {
    data(){
        return {
            showRefundDialog: false,

            // 最大可退金额
            maxPrice: 0,

            refundParams: {},

            refundRules: {
                amount: [{ required: true, type: 'number', trigger: "blur", message: '请输入退款金额~' }],
                refundTime: [{ required: true, trigger: "change", message: '请选择退款时间~' }],
            },

            // 退款 btn loading
            btnLoading: false
        }
    },
    methods: {
        showRefund(price = 0, applyId = null) {
            this.maxPrice = price
            this.refundParams.collection = applyId
            this.showRefundDialog = true
        },


        // 退款提交
        handleSubmitRefund(){
            this.$refs.refundForm.validate((valid) => {
                if(valid){
                    this.btnLoading = true
                    projectReturnMoneyRefund(this.refundParams).then(res => {
                        this.btnLoading = false
                        if(res.code === this.$successCode){
                            this.$message.success('退款成功~')
                            this.showRefundDialog = false
                            this.$emit('refundSuccess')
                        }
                    })
                }
            })
        }

    }
}
</script>