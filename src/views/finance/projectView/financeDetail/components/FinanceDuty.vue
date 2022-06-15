<!--
 * @Author: liushuai
 * @Date: 2022-01-19 11:57:35
 * @LastEditors: liushuai
 * @LastEditTime: 2022-01-19 11:57:35
 * @Description: file content
 * @FilePath: \pclient\src\views\home\components\FinanceDuty.vue
-->

<template>
    <div class="finance-payment-wrap">
        
        <div v-if="dutyData && dutyData.length">
            <div class="add-and-search">
                <div class="search-input">
                    <el-button
                        :disabled="!dutyData.length"
                        type="primary"
                        size="small"
                        icon="el-icon-download"
                        @click="download"
                    >
                        导出
                    </el-button>
                </div>
            </div>
            <el-table
                class="mt20 mb20"
                stripe
                size="small"
                :data="dutyData"
                row-key="id"
                border>
                <el-table-column 
                    v-for="(item, index) in dutyData[0]"
                    :key="index"
                    :prop="index" 
                    :label="index=='screenName' ? '点位' : index" 
                    min-width="100"
                >
                    <template slot-scope="scope">
                        {{ index == 'screenName' ? scope.row.screenName : moneyFormat(scope.row[index]) }}
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <el-empty description="暂无数据" v-else></el-empty>
    </div>
</template>

<script>
import { priceFormat } from '@/utils/index'

export default {
    props: {
        dutyData: Array,
        projectId: Number,
    },
    computed: {
        // 金额格式化
        moneyFormat(){
            return (key) => {
                return priceFormat(key)
            }
        }
    },
    methods: {
        download(){
            window.open(
				`${document.location.origin}/project/exportAccrualDetails?projectId=${this.projectId}`
			)
        }
    }
}
</script>