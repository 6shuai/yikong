<template>
    <el-dialog
        width="800px"
        title="合同详情"
        :visible.sync="showContractDetail"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        append-to-body
    >

        <el-form 
            v-loading="dataLoading"
            label-width="100px"
            class="contract-detail-wrap"
        >
            <el-form-item label="合同号:">
                {{ contract.contractNumber }}
            </el-form-item>
    
            <el-form-item label="甲方:">
                {{ contract.firstPartyName }}
            </el-form-item>
            <el-form-item label="甲方负责人:">
                {{ contract.firstResponsibleName }}
            </el-form-item>
            <el-form-item label="乙方:">
                {{ contract.secondPartyName }}
            </el-form-item>
            <el-form-item label="乙方负责人:">
                {{ contract.secondResponsibleName }}
            </el-form-item>
            <el-form-item label="合同金额:">
                {{ moneyFormat(contract.amount) }}
            </el-form-item>
            <el-form-item label="签署日期:">
                {{ timeFormat(contract.contractDateFormat) }}
            </el-form-item>
            <el-form-item label="合同期:">
                {{ contract.validBeginFormat ? `${timeFormat(contract.validBeginFormat)}  -  ${timeFormat(contract.validEndFormat)}` : '' }}
            </el-form-item>
            <el-form-item label="付款截止日期:">
                {{ timeFormat(contract.paymentDueFormat) }}
            </el-form-item>

            <el-form-item label="提成体系:">
                {{ contract.commissionSystemName }}
            </el-form-item>
    
            <el-form-item label="合同文件">
                <div 
                    class="contract-image-list"
                >
                    <span 
                        class="item"
                        v-for="(item, index) in contract.publishedContractPrints"
                        :key="index"
                    >
                        <a 
                            v-if="item.print.substr(item.print.lastIndexOf('.')) == '.pdf'"
                            :href="item.print"
                            target="_blank"
                        >
                        </a>
                        <el-image 
                            fit="cover"
                            v-else
                            :src="item.print"
                            :preview-src-list="[item.print]"
                        >
                        </el-image>
                    </span>
                </div>
            </el-form-item>

            <el-form-item label="回款计划:">
                <div class="return-money">
                    <el-table
                        border
                        size="small"
                        :data="contract.paymentSchedules">
                        <el-table-column 
                            prop="amount" 
                            label="回款金额" 
                            min-width="100"
                        >
                            <template slot-scope="scope">
                                {{ moneyFormat(scope.row.amount) }}
                            </template>
                        </el-table-column>
                        <el-table-column 
                            prop="deadlineFormat" 
                            label="回款时间" 
                            min-width="100"
                        >
                        </el-table-column>
                    </el-table>
                </div>
            </el-form-item>

            <el-form-item label="说明:">
                {{ contract.description }}
            </el-form-item>
        </el-form>

        <span slot="footer" class="dialog-footer">
            <el-button
                type="primary"
                :loading="btnLoading"
                @click="handleApproval(1)"
            >通 过
            </el-button>
            <el-button 
                type="danger"
                :loading="btnLoading"
                @click="handleApproval(0)"
            >拒 绝
            </el-button>
        </span>
    </el-dialog>
</template>

<script>
import { contractApprovalDetail, contractApproval } from '@/api/contractApproval'
import { dateAddHMS, priceFormat } from '@/utils/index'

export default {
    data() {
        return {
            showContractDetail: false,
            dataLoading: false,
            contract: {},
            btnLoading: false
        }
    },
    computed: {
        // 金额格式化
        moneyFormat(){
            return (key) => {
                return priceFormat(key)
            }
        },

        // 时间格式化
        timeFormat(){
            return (time) => {
                return dateAddHMS(time)
            }
        }
    },
    methods: {
        getContractDetail(contract){
            this.showContractDetail = true
            this.dataLoading = true
            contractApprovalDetail({ contract }).then(res => {
                this.dataLoading = false
                if(res.code === this.$successCode){
                    this.contract = res.obj
                }
            })
        },

        // 审批合同  0 拒绝  1 通过
        handleApproval(state){
            this.$confirm(`确认审核${state ? '通过' : '拒绝'}`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
            }).then(() => {
                let data = `?contract=${this.contract.id}&isApproved=${state}`
                contractApproval(data).then(res => {
                    if(res.code === this.$successCode){
                        this.$message.success('操作成功~')
                        this.showContractDetail = false
                        this.$parent.getList()
                    }
                })

            }).catch(() => {})
        }
    }
}
</script>

<style lang="scss" scoped>
.contract-detail-wrap{
    .contract-image-list{
        display: flex;
        flex-wrap: wrap;

        .item{
            cursor: pointer;
            margin: 0 10px 10px 0;

            .el-image, a{
                width: 100px; 
                height: 100px;
                border-radius: 4px;
                border: 1px solid #e5e5e5;
                display: block;
            }

            a{
                text-align: center;
                background: url('../../../assets/images/pdf.png') no-repeat center;
            }
        }
    }

    .return-money{
        li{
            padding-bottom: 10px;
            display: flex;

            .right-icon{
                i{
                    display: inline-block;
                    width: 30px;
                    height: 100%;
                    cursor: pointer;
                    line-height: 40px;
                    text-align: center;

                    &.el-icon-plus:hover{
                        color: var(--color-primary);
                    }

                    &.el-icon-close:hover{
                        color: var(--color-danger);
                    }
                }
            }
        }
    }
}
</style>