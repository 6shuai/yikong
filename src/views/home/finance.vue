<template>
    <div class="finance_wrap" v-loading="dataLoading">
        <div class="statistics">
            <span>刊例价: {{ resData.totalPrice }}</span>
            <span>投放价: {{ resData.amount }}</span>
            <span>折扣: {{ resData.discountRate }} %</span>
        </div>

        <el-tabs v-model="activeName" type="card" @tab-click="handleTabClick">
            <el-tab-pane label="明细" name="detail">
                <finance-detail 
                    ref="financeDetail"
                ></finance-detail>
            </el-tab-pane>

            <el-tab-pane label="付款" name="payment">

                <div class="payment_log_top">
                    <el-button 
                        type="primary"
                        size="small"
                        icon="el-icon-plus"
                        @click="handleAddLog()"
                    >
                        添加付款记录
                    </el-button>

                    <div class="statistics">
                        <span>应付款: {{ paymentInfo.amount}}</span>
                        <span>已付款: {{ paymentInfo.sumPayment}}</span>
                        <span>未付款: {{ paymentInfo.nonPayment}}</span>
                    </div>
                </div>

                <finance-payment 
                    ref="financePayment"
                    @editPayment="handleAddLog"
                ></finance-payment>
            </el-tab-pane>

            <el-tab-pane label="发票" name="invoice">
                
            </el-tab-pane>

        </el-tabs>


        <!-- 添加付款记录 -->
        <create-payment-log ref="createPaymentLog"></create-payment-log>

    </div>
</template>

<script>
import { projectFinanceInfo } from '@/api/project'
import { accMul } from '@/utils/index'
import FinanceDetail from './components/FinanceDetail'
import FinancePayment from './components/FinancePayment'
import CreatePaymentLog from './components/CreatePaymentLog'

export default {
    components: {
        FinanceDetail,
        FinancePayment,
        CreatePaymentLog
    },
    data(){
        return {
            activeName: 'detail',
            resData: {},
            paymentInfo: {},
            dataLoading: false
        }
    },
    computed: {
        contractId(){
            return this.$store.state.user.projectContractDetail.id
        }
    },
    mounted() {
        this.getFinanceInfo()
    },
    methods: {
        // 获取财务信息
        getFinanceInfo(){
            let id = this.$store.state.user.projectContractDetail.id
            if(!id) return
            this.dataLoading = true
            projectFinanceInfo({ contract: id }).then(res => {
                this.dataLoading = false
                if(res.code === this.$successCode){
                    let { materialMedias, paymentInfo } = res.obj
                    this.resData = res.obj
                    this.paymentInfo = paymentInfo

                    // 明细
                    this.$refs.financeDetail.resData = {
                        data: materialMedias,
                        amount: this.resData.amount,
                        // 折扣
                        discountRate: this.resData.amount / this.resData.totalPrice
                    }
                    this.$refs.financeDetail.priceTotal()
                    this.resData.discountRate = accMul(this.resData.discountRate, 100)

                    // 付款记录
                    this.$refs.financePayment.resData = this.paymentInfo
                }
            })
        },

        // 显示添加付款记录窗口
        handleAddLog(data){
            this.$refs.createPaymentLog.showCreatePaymentLogDialog(data)
        },
        
        // 
        handleTabClick(){
            
        }
    },
    watch: {
        contractId(newData, oldData){
            if(newData) this.getFinanceInfo()
        }   
    }
}
</script>

<style lang="scss">
    .finance_wrap{
        .statistics{
            display: flex;
            margin-bottom: 20px;

            span{
                margin-right: 40px;
            }
        }

        .payment_log_top{
    
            .statistics{
                float: right;
            }
        }
    }
</style>