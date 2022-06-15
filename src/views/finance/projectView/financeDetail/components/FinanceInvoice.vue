<!--
 * @Author: liushuai
 * @Date: 2022-01-17 17:42:04
 * @LastEditors: liushuai
 * @LastEditTime: 2022-01-19 13:46:57
 * @Description: file content
 * @FilePath: \pclient\src\views\home\components\FinanceInvoice.vue
-->
<template>
    <div class="add-invoice">
        <div class="payment-log-top">
            <div class="statistics">
                <span>应开票金额: {{ moneyFormat(invoiceData.amount) }}</span>
                <span>已开票金额: {{ moneyFormat(invoiceData.sumInvoice) }}</span>
                <span>未开票金额: {{ moneyFormat(invoiceData.nonInvoice) }}</span>
            </div>
        </div>
        
        <el-table
            class="mt20 mb20"
            stripe
            size="small"
            :data="invoiceData.publishedInvoices"
            row-key="id"
            border>

            <el-table-column 
                prop="paymentTimeFormat" 
                label="发票图片" 
                min-width="100"
            >
                <template #default="scope">
                    <el-image
                        fit="contain"
                        :preview-src-list="[scope.row.print]"
                        :src="scope.row.print"
                    ></el-image>
                </template>
            </el-table-column>
            <el-table-column 
                prop="amount" 
                label="金额" 
                min-width="60"
            >
                <template slot-scope="scope">
                    {{ moneyFormat(scope.row.amount) }}
                </template>
            </el-table-column>
            <el-table-column 
                prop="billingTimeFormat" 
                label="开票时间" 
                min-width="60"
            ></el-table-column>
        </el-table>
    </div>
</template>

<script>
import { priceFormat } from '@/utils/index'

export default {
    props: {
        invoiceData: Object
    },
    computed: {
        // 金额格式化
        moneyFormat(){
            return (key) => {
                return priceFormat(key)
            }
        }
    }
}
</script>

<style lang="scss" scoped>
    .add-invoice{
        .el-image{
            width: 200px;
            height: 100px;
        }
    }
</style>