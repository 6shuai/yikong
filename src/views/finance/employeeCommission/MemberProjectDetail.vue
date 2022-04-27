<template>
    <el-dialog
        width="700px"
        :title="`${title}月项目结算详情`"
        :visible.sync="showMemberProjectDetail"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        append-to-body
    >
        <!-- 项目结算窗口 -->
        <project-price-clearing 
            ref="projectPriceClearing"
            @settleSuccess="getMemberProjectSettleDetail"
        ></project-price-clearing>
        
        <el-table
            class="mt20 mb20"
            stripe
            size="small"
            :data="resData"
            row-key="id"
            v-loading="dataLoading"
            border>
            <el-table-column 
                label="项目名称"
                prop="displayName" 
            >
            </el-table-column>
            <el-table-column 
                label="应支付金额"
                prop="amountPayable" 
            >
            </el-table-column>
            <el-table-column 
                label="已支付金额"
                prop="amountPaid" 
            >
            </el-table-column>
            <el-table-column 
                label="已结算金额"
                prop="amountSettle" 
            >
            </el-table-column>
            <el-table-column 
                label="操作"
                prop="projectName" 
            >
                <template slot-scope="scope">
                    <el-button
                        :disabled="scope.row.amountPaid - scope.row.amountSettle <= 0"
                        type="primary"
                        plain
                        size="mini"
                        @click="handleShowSettle(scope.row)"
                    >结算</el-button>
                </template>
            </el-table-column>
        </el-table>

    </el-dialog>
</template>

<script>
import ProjectPriceClearing from './ProjectPriceClearing'
import { financeMemberMonthInfo } from '@/api/finance'
import { Subtr } from '@/utils/index'

export default {
    components: {
        ProjectPriceClearing
    },
    data(){
        return {
            showMemberProjectDetail: false,
            resData: [],
            params: {},

            title: '',

            // 数据加载中
            dataLoading: false
        }
    },
    methods: {
        // 显示当前用户 此月的项目结算情况
        showMemberProjectDetailDialog({ memberId, displayName }, month, year){
            this.showMemberProjectDetail = true
            this.title = displayName + ' - ' + month.replace(/\b(0+)/gi,"") 
            this.params = {
                memberId,
                month: year + '-' + month
            }

            this.getMemberProjectSettleDetail()
        },

        // 获取用户项目结算详情
        getMemberProjectSettleDetail(){
            this.dataLoading = true
            financeMemberMonthInfo(this.params).then(res => {
                this.dataLoading = false
                if(res.code === this.$successCode){
                    this.resData = res.obj
                }
            })
        },

        // 显示结算
        handleShowSettle({ beneficiary, displayName, amountPaid, amountSettle }){
            this.$refs.projectPriceClearing.showProjectPriceClearingDialog({
                month: this.params.month,
                beneficiary,
                displayName,
                noSettle: Subtr(amountPaid, amountSettle)
            })
        }

    }
}
</script>