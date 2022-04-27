<template>
    <div>
        <el-table
            class="mt20 mb20"
            stripe
            size="small"
            :data="resData"
            row-key="id"
            v-loading="tLoading">
            <el-table-column 
                prop="occurTime" 
                label="收款时间" 
                min-width="100"
            >
            </el-table-column>
            <el-table-column 
                prop="organizationName" 
                label="公司名称" 
                min-width="100"
            >
            </el-table-column>
            <el-table-column 
                prop="nickname" 
                label="责任人" 
                min-width="100"
            >
            </el-table-column>
            <el-table-column 
                prop="amount" 
                label="金额" 
                min-width="100"
            >
                <template slot-scope="scope">
                    <span>{{ amountFormat(scope.$index, 'amount') }}</span>
                </template>
            </el-table-column>
            <el-table-column 
                prop="balance" 
                label="余额" 
                min-width="100"
            >
                <template slot-scope="scope">
                    <span>{{ amountFormat(scope.$index, 'balance') }}</span>
                </template>
            </el-table-column>
            <el-table-column 
                prop="refundAmount" 
                label="退款" 
                min-width="100"
            >
                <template slot-scope="scope">
                    <span>{{ amountFormat(scope.$index, 'refundAmount') }}</span>
                </template>
            </el-table-column>
            <el-table-column 
                prop="projectName" 
                label="操作" 
                min-width="100"
            >
                <template slot-scope="scope">
                    <el-button 
                        type="danger" 
                        size="small"
                        @click="handleRefundReview(scope.row.id, 2)"
                    >
                        驳回
                    </el-button>
                    <el-button 
                        type="primary" 
                        size="small"
                        @click="handleRefundReview(scope.row.id, 1)"
                    >
                        同意
                    </el-button>
                </template>
            </el-table-column>
        </el-table>

        <el-pagination
            v-if="resData.length"
            background
            layout="total, prev, pager, next, sizes"
            :page-sizes="[40, 80, 100]"
            :page-size="Number(params.pageSize)"
            :current-page="Number(params.pageNo)"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :total="totalCount">
        </el-pagination>

    </div>
</template>

<script>
import { financeReturnMoneyReviewList, financeReturnMoneyReview } from '@/api/finance'
import { priceFormat } from '@/utils/index'
import qs from 'qs'

export default {
    data(){
        return {
            resData: [],

            params: {
                pageNo: 1,
                pageSize: 40
            },

            // 总条数
            totalCount: 0,

            tLoading: false
        }
    },
    computed: {
        // 金额格式化 
        amountFormat(){
            return (index, key) => {
                return priceFormat(this.resData[index][key])
            }
        }
    },
    mounted() {
        this.getReviewList()
    },
    methods: {
        // 获取审核列表
        getReviewList(){
            this.tLoading = true
            financeReturnMoneyReviewList(this.params).then(res => {
                this.tLoading = false
                if(res.code === this.$successCode){
                    let { list, totalRecords } = res.obj
                    this.resData = list
                    this.totalCount = totalRecords
                }
            })
        },

        // 分页
        handleCurrentChange(page){
            this.params.pageNo = page
            this.getReviewList()
        },

        // 每页多少条
        handleSizeChange(size){
            this.params.pageSize = size
            this.getReviewList()
        },

        // 审核  1同意  2驳回
        handleRefundReview(id, state){
            let msg = '为确保系统数据统一,建议您先退款后再进行操作。'

            if(state == 2) msg = '您确认要驳回本次退款申请吗?'

            this.$confirm(
                msg,
                "提示",
                {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning",
                    center: true
                }
            ).then(() => {
                financeReturnMoneyReview(qs.stringify({ id, state })).then(res => {
                    if(res.code === this.$successCode){
                        this.$message.success('操作成功~')
                        this.getReviewList()
                    }
                })
            })
        }

    }
}
</script>