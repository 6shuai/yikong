<template>
    <el-dialog
        width="400px"
        :title="`【${ projectName }】结算`"
        :visible.sync="showProjectPriceClearing"
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
            :max="noSettle"
            placeholder="请输入结算金额"
        ></el-input-number>
        
        <span slot="footer" class="dialog-footer">
            <el-button @click="showProjectPriceClearing = false">取 消</el-button>
            <el-button
                :disabled="!price"
                type="primary"
                :loading="btnLoading"
                @click="handleClearing"
                >确 定</el-button
            >
        </span>
    </el-dialog>
</template>

<script>
import { financeMemberSettle } from '@/api/finance'

export default {
    data(){
        return {
            showProjectPriceClearing: false,

            // 项目结算金额
            price: null,

            // 未结算的金额
            noSettle: null,

            // 项目名称
            projectName: '',

            // 提交结算laoding
            btnLoading: false
        }
    },
    methods: {
        // 显示当前用户 此月的项目结算情况
        showProjectPriceClearingDialog({ month, beneficiary, displayName, noSettle }){
            this.params = {
                beneficiary,
                commissionDate: month
            }
            this.projectName = displayName
            this.price = noSettle
            this.noSettle = noSettle
            this.showProjectPriceClearing = true
        },

        // 提交结算
        handleClearing(){
            this.btnLoading = true
            this.params.amount = this.price

            let data = JSON.parse(JSON.stringify(this.params))
            data.commissionDate = data.commissionDate + '-01 00:00:00'

            financeMemberSettle(data).then(res => {
                this.btnLoading = false
                if(res.code === this.$successCode){
                    this.$message.success('操作成功~')
                    this.showProjectPriceClearing = false
                    
                    this.$emit('settleSuccess')
                }
            })
        }

    }
}
</script>

<style lang="scss">
    .member-settle{
        .el-dialog__body{
            text-align: center;
        }
    }
</style>