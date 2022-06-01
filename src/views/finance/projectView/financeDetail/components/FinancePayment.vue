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
                prop="occurTimeFormat" 
                label="付款时间" 
                min-width="100"
            >
            </el-table-column>
            <el-table-column 
                prop="amount" 
                label="付款金额" 
                min-width="60"
            >
                <template slot-scope="scope">
                    {{ moneyFormat(scope.row.amount) }}
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
import { priceFormat } from '@/utils/index'

export default {
    props: {
        paymentData: Array
    },
    computed: {
        // 金额格式化
        moneyFormat(){
            return (key) => {
                return priceFormat(key)
            }
        },
    }
}
</script>