<template>
    <el-dialog
        width="400px"
        :title="projectReturnMoneyDetail.projectName"
        :visible.sync="showPaymentDialog"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        append-to-body
        custom-class="member-settle"
    >

        <el-input-number
            class="w220"
            v-model="price"
            :controls="false"
            :min="0"
            :max="projectReturnMoneyDetail.nonPayment"
            placeholder="请输入付款金额"
        ></el-input-number>
        
        <span slot="footer" class="dialog-footer">
            <el-button @click="showPaymentDialog = false">取 消</el-button>
            <el-button
                :disabled="!price"
                type="primary"
                :loading="btnLoading"
                @click="handlePayment"
                >确 定</el-button
            >
        </span>
    </el-dialog>
</template>

<script>
export default {
    data() {
        return {
            // 是否显示付款窗口
            showPaymentDialog: false,

            // 付款金额
            price: null,

            // 项目回款详情
            projectReturnMoneyDetail: {},

            btnLoading: false
        }
    },
    methods: {
        showPayment(data){
            this.projectReturnMoneyDetail = data
            this.price = data.nonPayment

            this.showPaymentDialog = true
        },

        // 付款
        handlePayment(){
            
        }
    }   
}
</script>

<style lang="scss" scoped>
    .member-settle{
        .el-dialog__body{
            text-align: center;
        }
    }    
</style>