<template>
    <el-table
        class="mt20 mb20"
        stripe
        size="small"
        :data="resData.data"
        row-key="id"
        border>
        <el-table-column 
            prop="screenName" 
            label="点位" 
            min-width="120"
        ></el-table-column>
        <el-table-column 
            prop="days" 
            label="投放天数" 
            min-width="60"
        ></el-table-column>
        <el-table-column 
            prop="price" 
            label="刊例价" 
            min-width="60"
        ></el-table-column>
        <el-table-column 
            prop="duration" 
            label="销售净价" 
            min-width="60"
        >
            <template slot-scope="scope">
                {{ salesPrice(scope.row.price) }}
            </template>
        </el-table-column>
    </el-table>
</template>

<script>
import { accMul } from '@/utils/index'

export default {
    data(){
        return {
            resData: []
        }
    },
    methods: {
        salesPrice(price){
            return accMul(price, this.resData.discountRate)
        } 
    }
}
</script>