<!--
 * @Author: liushuai
 * @Date: 2022-01-07 17:46:11
 * @LastEditors: liushuai
 * @LastEditTime: 2022-01-19 11:53:18
 * @Description: file content
 * @FilePath: \pclient\src\views\home\components\FinancePayment.vue
-->
<template>
    <div class="finance-payment-wrap">
        <el-table
            class="mt20 mb20"
            stripe
            size="small"
            :data="paymentData"
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
    props: {
        paymentData: Array
    },
    methods: {
        handleEdit(data){
            data.paymentTime = data.paymentTimeFormat
            this.$emit('editPayment', data)
        }
    }
}
</script>