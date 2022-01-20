<!--
 * @Author: liushuai
 * @Date: 2022-01-17 17:42:04
 * @LastEditors: liushuai
 * @LastEditTime: 2022-01-19 13:46:57
 * @Description: file content
 * @FilePath: \pclient\src\views\home\components\FinanceInvoice.vue
-->
<template>
    <div class="add_invoice">
        <el-button 
            type="primary"
            size="small"
            icon="el-icon-plus"
            class="mt20"
            @click="handleAddInvoice()"
        >
            添加发票
        </el-button>
        
        <el-table
            class="mt20 mb20"
            stripe
            size="small"
            :data="invoiceData"
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
            ></el-table-column>
            <el-table-column 
                prop="billingTimeFormat" 
                label="开票时间" 
                min-width="60"
            ></el-table-column>
            <el-table-column 
                prop="beginTime" 
                label="操作" 
                width="150"
            >
                <template slot-scope="scope">
                    <el-button
                        type="primary"
                        plain
                        size="mini"
                        @click="handleAddInvoice(scope.row)"
                    >
                        编辑
                    </el-button>
                    <el-popconfirm
                        confirm-button-text='删除'
                        cancel-button-text='取消'
                        icon="el-icon-info"
                        icon-color="red"
                        title="此操作将删除此发票, 是否继续?"
                        @confirm="handleDelete(scope.row.id, scope.$index)"
                    >
                        <el-button 
                            type="danger" 
                            slot="reference"
                            size="mini"
                            plain
                        >
                            删除
                        </el-button>
                    </el-popconfirm>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
import { projectFinanceInvoiceDelete } from '@/api/project'
export default {
    props: {
        invoiceData: Array
    },
    methods: {
        // 添加 或 编辑 发票
        handleAddInvoice(data){
            this.$emit('handleAddInvoice', data)
        },

        // 删除发票
        handleDelete(id, index){
            projectFinanceInvoiceDelete(id).then(res => {
                if(res.code === this.$successCode){
                    this.$message.success('删除成功~')
                    this.invoiceData.splice(index, 1)
                }
            })
        }
    }
}
</script>

<style lang="scss" scoped>
    .add_invoice{
        .el-image{
            width: 200px;
            height: 100px;
        }
    }
</style>