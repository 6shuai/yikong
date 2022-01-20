<!--
 * @Author: liushuai
 * @Date: 2022-01-07 17:42:43
 * @LastEditors: liushuai
 * @LastEditTime: 2022-01-19 11:54:51
 * @Description: file content
 * @FilePath: \pclient\src\views\home\components\FinanceDetail.vue
-->
<template>
    <el-table
        class="mt20 mb20"
        stripe
        size="small"
        :data="logData"
        row-key="id"
        border>
        <el-table-column 
            prop="screenName" 
            label="点位" 
            min-width="120"
        ></el-table-column>
        <el-table-column 
            prop="price" 
            label="刊例价" 
            min-width="60"
        ></el-table-column>
        <el-table-column 
            prop="subAmount" 
            label="销售净价" 
            min-width="60"
        >
        </el-table-column>
    </el-table>
</template>

<script>
export default {
    props: {
        logData: Array
    }
}
</script>