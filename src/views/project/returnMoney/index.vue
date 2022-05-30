<template>
    <el-card class="return-money-list">
        <div class="return-money-head mt20 mb20">
            <el-button type="primary" size="small" @click="handleShowApply()">申领</el-button>
            <el-input 
                size="small"
                suffix-icon="el-icon-search" 
                v-model="params.displayName"
                @input="$debounce(handleSearch)"
            ></el-input>
        </div>

        <el-table
            class="mb20"
            stripe
            size="small"
            :data="resData"
            row-key="id"
            :row-class-name="tableRowClassName"
            v-loading="tLoading">
            <el-table-column 
                prop="requestDate" 
                label="收款时间"
                min-width="100"
            >
                <template slot-scope="scope">
                    <div class="request-date">
                        <span v-if="scope.row.state == '退款中'" class="refund-ing">退</span>
                        <span>{{ scope.row.requestDate }}</span>
                    </div>
                </template>
            </el-table-column>
            <el-table-column 
                prop="amount" 
                label="申领金额" 
                min-width="100"
            >
                <template slot-scope="scope">
                    <span>{{ applyMoneyFormat(scope.$index, 'amount') }}</span>
                </template>
            </el-table-column>
            <el-table-column 
                prop="organizationName" 
                label="付款公司" 
                min-width="150"
            ></el-table-column>
            <el-table-column 
                prop="balance" 
                label="余额" 
                min-width="100"
            >
                <template slot-scope="scope">
                    <span v-if="scope.row.state == '未匹配'">--</span>
                    <span v-if="scope.row.state == '异常'">
                        <el-tooltip class="item" effect="dark" content="暂未找到合适的回款单" placement="top-start">
                            <i class="el-icon-warning"></i>
                        </el-tooltip>
                    </span>
                    <span v-else>{{ scope.row.state == '未匹配' ?  '--' : applyMoneyFormat(scope.$index, 'balance') }}</span>
                </template>
            </el-table-column>
            <el-table-column 
                prop="beginTime" 
                label="操作"
                width="180"
            >
                <template slot-scope="scope">
                    <el-button
                        size="mini"
                        plain
                        @click="handleShowDistribut(scope.row)"
                    >
                        查看
                    </el-button>
                    <el-button
                        type="primary"
                        size="mini"
                        plain
                        :disabled="scope.row.transactionId ? true : false"
                        @click="handleShowApply(scope.row)"
                    >
                        编辑
                    </el-button>
                    
                </template>
            </el-table-column>
        </el-table>

        <el-pagination
            background
            layout="total, prev, pager, next"
            :page-sizes="params.pageSize"
            :hide-on-single-page="false"
            :current-page="Number(params.pageNo)"
            @current-change="handleCurrentChange"
            :total="totalCount">
        </el-pagination>

        <!-- 申领 -->
        <apply ref="apply"></apply>

        <!-- 回款分配 -->
        <return-money-distribute ref="returnMoneyDistribute"></return-money-distribute>

    </el-card>
</template>

<script>
import { projectReturnMoneyApplyList } from '@/api/project'
import { priceFormat } from '@/utils/index'
import Apply from './components/Apply'
import ReturnMoneyDistribute from './components/ReturnMoneyDistribute'

export default {
    components: {
        Apply,
        ReturnMoneyDistribute
    },
    data() {
        return {
            tLoading: false,
            resData: [],

            // 搜索条件
            params: {},

            // 申领总条数
            totalCount: 0
        }
    },
    computed: {
        // 申领金额格式化
        applyMoneyFormat(){
            return (index, key) => {
                if(!this.resData[index][key]) return priceFormat(0)
                return priceFormat(this.resData[index][key])
            }
        }
    },
    mounted() {
        this.getApplyList()
    },
    methods: {
        // 申领列表
        getApplyList(){
            this.tLoading = true
            projectReturnMoneyApplyList(this.params).then(res =>{
                this.tLoading = false
                let { list, totalRecords } = res.obj
                this.resData = list
                this.totalCount = totalRecords
            })
        },

        // 分页
        handleCurrentChange(page){
            this.params.pageNo = page
            this.getApplyList()
        },

        // 搜索
        handleSearch(){
            this.params.pageNo = 1
            this.getApplyList()
        },

        tableRowClassName({row, rowIndex}) {
            if (row.state === '异常' || row.state == '已驳回') {
                return 'warning-row';
            } 
            return '';
        },

        // 显示申领
        handleShowApply(data = {}){
            if(data.organizationId) data.payer = data.organizationId
            this.$refs.apply.showApplyDialog(data)
        },

        // 查看待分配款项
        handleShowDistribut(data){
            this.$refs.returnMoneyDistribute.showDialog(data)
        }
    }
}
</script>

<style lang="scss">
    .return-money-list{
        .return-money-head{
            padding-bottom: 20px;
            display: flex;
            justify-content: space-between;

            .el-button{
                width: 120px;
            }            

            .el-input{
                margin-left: 20px;
            }
        }

        .el-table {
            .warning-row {
                color: var(--color-danger);
                
                .el-icon-warning{
                    font-size: 18px;
                }
            }

            .request-date{

                .refund-ing{
                    margin-right: 10px;
                    display: inline-block;
                    width: 20px;
                    height: 20px;
                    line-height: 20px;
                    text-align: center;
                    border-radius: 50%;
                    background: var(--color-danger);
                    color: #fff;
                }
            }
        }
    }
</style>