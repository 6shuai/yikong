<template>
    <el-table
        class="mt20 mb20"
        stripe
        size="small"
        :data="priceInfo"
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
            prop="lastPrice" 
            label="销售净价" 
            min-width="60"
        >
        </el-table-column>
    </el-table>
</template>

<script>
import { accMul } from '@/utils/index'

export default {
    data(){
        return {
            resData: {},
            priceInfo: []
        }
    },
    methods: {
        // 小数点精确计算  保留小数点后两位  四舍五入
        salesPrice(price){
            return accMul(price, this.resData.discountRate).toFixed(2)
        },

        // 统计所有的销售净价总和  是否和投放价相等
        priceTotal(){
            let { data, amount } = this.resData
            let total = 0
            data.forEach((item) => {
                let p = this.salesPrice(item.price)
                this.priceInfo.push({
                    ...item,
                    lastPrice: p
                })
                total += Number(p)
            })
            
            // 最后一行的销售净价
            let lastRowPrice = this.priceInfo[this.priceInfo.length-1].lastPrice

            // 计算总和  大于 投放价
            if(total > amount){
                this.priceInfo[this.priceInfo.length-1].lastPrice = (lastRowPrice - (total - amount)).toFixed(2)
            }else if(total < amount){
                // 计算总和  小于 投放价
                this.priceInfo[this.priceInfo.length-1].lastPrice = (lastRowPrice + (amount - total)).toFixed(2)
            }
        }
    }
}
</script>