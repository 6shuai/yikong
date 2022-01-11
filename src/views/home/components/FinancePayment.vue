<template>
    <div class="finance_payment_wrap">
        <el-table
            class="mt20 mb20"
            stripe
            size="small"
            :data="resData.contractPayments"
            row-key="id"
            border>
            <el-table-column 
                prop="paymentTimeFormat" 
                label="付款时间" 
                min-width="100"
            >
            </el-table-column>
            <el-table-column 
                prop="payment" 
                label="付款金额" 
                min-width="60"
            ></el-table-column>
            <el-table-column 
                prop="beginTime" 
                label="操作" 
                width="100"
            >
                <template slot-scope="scope">
                    <el-button
                        type="primary"
                        plain
                        size="mini"
                        @click="handleEdit(scope.row)"
                    >
                        编辑
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
export default {
    data(){
        return {
            resData: {}
        }
    },
    methods: {
        handleEdit(data){
            data.paymentTime = data.paymentTimeFormat
            this.$emit('editPayment', data)
        }
    }
}
</script>