<template>
    <div class="finance-wrap" v-loading="dataLoading">
        <div class="statistics">
            <span>刊例价: {{ moneyFormat(resData.totalPrice) }}</span>
            <span>投放价: {{ moneyFormat(resData.amount) }}</span>
            <span>折扣: {{ resData.discountRate }} %</span>
        </div>

        <el-tabs v-model="activeName" type="card">
            <el-tab-pane label="明细" name="detail">
                <finance-detail 
                    :logData="resData.materials"
                ></finance-detail>
            </el-tab-pane>

            <el-tab-pane label="付款" name="payment">

                <div class="payment-log-top">
                    <!-- <el-button 
                        type="primary"
                        size="small"
                        icon="el-icon-plus"
                        @click="handleAddLog()"
                    >
                        添加付款记录
                    </el-button> -->

                    <div class="statistics">
                        <span>应付款: {{ moneyFormat(paymentInfo.amount) }}</span>
                        <span>已付款: {{ moneyFormat(paymentInfo.sumPayment) }}</span>
                        <span>未付款: {{ moneyFormat(paymentInfo.nonPayment) }}</span>
                    </div>
                </div>

                <finance-payment 
                    :paymentData="paymentInfo.contractPayments"
                    @editPayment="handleAddLog"
                ></finance-payment>
            </el-tab-pane>

            <el-tab-pane label="发票" name="invoice">
                <finance-invoice 
                    :invoiceData="{
                        ...resData.invoiceData,
                        amount: resData.amount
                    }"
                    @handleAddInvoice="handleAddInvoice"
                ></finance-invoice>
            </el-tab-pane>

            <el-tab-pane label="权责" name="duty">
                <finance-duty 
                    :dutyData="resData.accrualDetails"
                    :projectId="Number(contractId)"
                ></finance-duty>
            </el-tab-pane>

        </el-tabs>


        <!-- 添加付款记录 -->
        <create-payment-log ref="createPaymentLog"></create-payment-log>

        <!-- 添加发票 -->
        <create-invoice ref="createInvoice"></create-invoice>

    </div>
</template>

<script>
import { projectFinanceInfo } from '@/api/project'
import { accMul, priceFormat } from '@/utils/index'
import FinanceDetail from './components/FinanceDetail'
import FinancePayment from './components/FinancePayment'
import CreatePaymentLog from './components/CreatePaymentLog'
import FinanceInvoice from './components/FinanceInvoice'
import CreateInvoice from './components/CreateInvoice'
import FinanceDuty from './components/FinanceDuty'

export default {
    components: {
        FinanceDetail,
        FinancePayment,
        CreatePaymentLog,
        FinanceInvoice,
        CreateInvoice,
        FinanceDuty
    },
    props: {
        contract: Number
    },
    data(){
        return {
            activeName: 'detail',
            resData: {},
            paymentInfo: {},
            dataLoading: false,

            // 合同id
            contractId: null
        }
    },
    computed: {
        // 金额格式化
        moneyFormat(){
            return (val = 0) => {
                return priceFormat(val)
            }
        }
    },
    mounted() {
        this.getFinanceInfo()
    },
    methods: {
        // 获取财务信息
        getFinanceInfo(){
            this.contractId = this.contract || this.$store.state.project.projectContractDetail.id
            if(!this.contractId) return
            this.dataLoading = true
            projectFinanceInfo({ contract: this.contractId }).then(res => {
                this.dataLoading = false
                if(res.code === this.$successCode){
                    let { materials, paymentInfo } = res.obj
                    this.resData = res.obj
                    this.paymentInfo = paymentInfo

                    this.resData.discountRate = accMul(this.resData.discountRate, 100)
                }
            })
        },

        // 显示添加付款记录窗口
        handleAddLog(data = { contract: this.contractId }){
            this.$refs.createPaymentLog.showCreatePaymentLogDialog(data, this.paymentInfo.nonPayment)
        },

        // 显示添加发票窗口
        handleAddInvoice(data = { contract: this.contractId }){
            this.$refs.createInvoice.showCreateInvoiceDialog(data)
        }
    }
}
</script>

<style lang="scss">
    .finance-wrap{
        .statistics{
            display: flex;
            margin-bottom: 20px;

            span{
                margin-right: 40px;
            }
        }

        .payment-log-top{
    
            .statistics{
                float: right;
            }
        }
    }
</style>