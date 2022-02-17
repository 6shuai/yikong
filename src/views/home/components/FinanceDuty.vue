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
                </el-table-column>
            </el-table>
        </div>
        <el-empty description="暂无数据" v-else></el-empty>
    </div>
</template>

<script>
export default {
    props: {
        dutyData: Array,
        projectId: Number,
    },
    methods: {
        download(){
            window.open(
				`${document.location.origin}/project/exportAccrualDetails?contract=${this.projectId}`
			)
        }
    }
}
</script>