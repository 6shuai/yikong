<template>
    <div class="finance-return-money">
        <div class="add-and-search mb10">
            <div class="search-input">
                <el-date-picker
                    class="w200"
                    v-model="params.beginDate"
                    type="date"
                    placeholder="选择开始日期"
                    value-format="yyyy-MM-dd">
                </el-date-picker>
                <el-date-picker
                    class="w200"
                    v-model="params.endDate"
                    type="date"
                    placeholder="选择结束日期"
                    value-format="yyyy-MM-dd">
                </el-date-picker>
                <el-button 
                    type="primary" 
                    icon="el-icon-search"
                    @click="getFinanceInfo"
                >搜索</el-button>
            </div>
        </div>

        <el-table
            class="mt20 mb20"
            stripe
            size="small"
            :data="resData"
            row-key="id"
            v-loading="tLoading"
            border>
            <el-table-column 
                prop="projectName" 
                label="项目" 
                min-width="100"
            >
            </el-table-column>
            <el-table-column 
                prop="amount" 
                label="应付款" 
                min-width="80"
            ></el-table-column>
            <el-table-column 
                prop="payment" 
                label="已付款" 
                min-width="80"
            ></el-table-column>
            <el-table-column 
                prop="nonPayment" 
                label="未付款" 
                min-width="60"
            ></el-table-column>
            <el-table-column 
                prop="paymentDue" 
                label="预期回款时间" 
                min-width="60"
            ></el-table-column>
            <el-table-column 
                prop="beginTime" 
                label="操作"
                width="180"
            >
                <template slot-scope="scope">
                    <el-button
                        type="primary"
                        size="mini"
                        plain
                        :disabled="scope.row.nonPayment ? false : true"
                        @click="$refs.createPaymentLog.showCreatePaymentLogDialog({
                            contract: scope.row.contract,
                            nonPayment: scope.row.nonPayment
                        })"
                    >
                        付款
                    </el-button>
                    
                </template>
            </el-table-column>
        </el-table>

        <!-- 付款窗口 -->
        <create-payment-log ref="createPaymentLog"></create-payment-log>

    </div>
</template>

<script>
import { financeReturnMoneyList } from '@/api/finance'
import CreatePaymentLog from '@/views/project/components/CreatePaymentLog'

export default {
    components: {
        CreatePaymentLog
    },
    data() {
        return {
            params: {},
            tLoading: false,
            resData: []
        }
    },
    mounted() {
        this.getFinanceInfo()
    },
    methods: {
        getFinanceInfo(){
            this.tLoading = true
            financeReturnMoneyList(this.params).then(res => {
                this.tLoading = false
                if(res.code === this.$successCode){
                    this.resData = res.obj
                }
            })
        }   
    }
}
</script>