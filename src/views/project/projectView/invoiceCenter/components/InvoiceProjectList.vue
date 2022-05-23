<!--
 * @Author: liushuai
 * @Date: 2022-03-29 18:05:44
 * @LastEditors: liushuai
 * @LastEditTime: 2022-03-31 14:59:42
 * @Description: file content
 * @FilePath: \pclient\src\views\project\invoiceCenter\components\InvoiceProjectList.vue
-->
<template>
    <el-table
        class="mt20 mb20"
        stripe
        show-summary
        size="small"
        :data="projectData"
        row-key="id"
        :summary-method="getSummaries"
        border>
        <el-table-column 
            prop="displayName" 
            label="项目名称" 
            min-width="150"
        >
        </el-table-column>
        <el-table-column 
            prop="nickname" 
            label="素材状态" 
            min-width="200"
        >
            <template slot-scope="scope">
                <el-scrollbar 
                    class="hidden-scroll-y"
                    style="{width: 100%}"
                >   
                    <div 
                        class="layout-list-wrap"
                        :style="{ width: scope.row.materials.length * 110 + 'px' }"
                    >
                        <div 
                            class="content-list" 
                            v-for="(item, index) in scope.row.materials" :key="index"
                        >   
                            
                            <screen-layout 
                                :screen="item" 
                                :maxWidth="100"
                                :showBorder="false"
                            >
                                <template v-slot:state>
                                    <div 
                                        class="material-state"
                                        :class="item.state=='已下刊' ? 'state-1' : 'state-2'"
                                    ></div>
                                </template>

                                <template v-slot="dataDefalut">
                                    <img 
                                        class="content-image"
                                        :src="dataDefalut.data.image" 
                                    >
                                </template>
                            </screen-layout>
                        </div>
                    </div>
                </el-scrollbar>
            </template>
        </el-table-column>
        <el-table-column 
            prop="amount" 
            label="合同金额" 
            min-width="100"
        >
            <template slot-scope="scope">
                {{ moneyFormat(scope.row.amount) }}
            </template>
        </el-table-column>
        <el-table-column 
            prop="payment" 
            label="回款金额" 
            min-width="100"
        >
            <template slot-scope="scope">
                {{ moneyFormat(scope.row.payment) }}
            </template>
        </el-table-column>
        <el-table-column 
            :prop="(projectData[0] && projectData[0].allowInvoicing) ? 'allowInvoicing' : 'invoiceAmount'" 
            label="开票金额" 
            min-width="100"
        >
            <template slot-scope="scope">
               {{ moneyFormat(scope.row.allowInvoicing || scope.row.invoiceAmount) }}
            </template>
        </el-table-column>
    </el-table>
</template>

<script>
import ScreenLayout from '@/views/screenLayout/components/ScreenLayout'
import { priceFormat } from '@/utils/index'

export default {
    components: {
        ScreenLayout
    },
    props: {
        projectData: Array
    },
    computed: {
        // 金额格式化
        moneyFormat(){
            return (key) => {
                return priceFormat(key)
            }
        },
    },
    methods: {
        getSummaries(param) {
            const { columns, data } = param
            const sums = [];
            columns.forEach((column, index) => {
                if (index === 0) {
                    sums[index] = '总计'
                    return
                }
                const values = data.map(item => Number(item[column.property]));
                if (!values.every(value => isNaN(value))) {
                    sums[index] = values.reduce((prev, curr) => {
                        const value = Number(curr)
                        if (!isNaN(value)) {
                            return prev + curr
                        } else {
                            return prev
                        }
                    }, 0)
                    sums[index] = '￥' + sums[index] + ' 元'
                }
            })
            return sums
        }
    }
}
</script>