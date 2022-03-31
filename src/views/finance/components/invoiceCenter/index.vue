<template>
    <div class="invoice-center-wrap" v-loading="listLoading">

        <div class="add-and-search mb10" v-if="invoiceParams.isExamine">

            <el-input
                clearable
                v-model="invoiceParams.displayName"
                placeholder="请输入项目名称"
                @input="$debounce(handleSearch)"
            ></el-input>

            <div class="nav-list">
                <span 
                    v-for="(item, index) in invoiceTypeData"
                    :key="index"
                    :class="activeIndex == index ? 'active' : ''"
                    @click="handleSelectInvoiceType(item.id, index)"
                >{{ item.name }}</span>
            </div>

        </div>


        <div 
            v-for="(item, index) in resData"
            :key="index"
            class="invoice-list"
            @click="handleShowInvoiceDetail(item.id)"
            :class="{ turnDown: item.merge }"
        >
            <ul class="project-info">
                <li class="title">
                    <span 
                        class="state"
                        :class="item.state=='混合' ? 'mix' : item.state=='已下刊' ? 'down' : ''"
                    >
                        {{ item.state }}
                    </span>
                    <span 
                        class="project-name overflow" 
                        :class="{ multiple: item.merge }"
                        @click.stop="handleShowProjectDetail(item.id)"
                    >
                        {{ item.projectName }}
                    </span>
                </li>
                <li>投放客户： {{ item.organizationName }}</li>
                <li>申请时间： {{ item.applyTime }}</li>
            </ul>
            <ul class="contract-info">
                <li>合同{{ item.merge ? '总额' : '金额' }}： {{ item.contractAmount ? '￥' + item.contractAmount + '元' : '' }}</li>
                <li>回款{{ item.merge ? '总额' : '金额' }}： {{ item.sumPayment ? '￥' + item.sumPayment + '元' : ''  }}</li>
                <li>开票{{ item.merge ? '总额' : '金额' }}： {{ item.amount ? '￥' + item.amount + '元' : ''  }}</li>
            </ul>
            <div class="right-btn-wrap">
                <p v-if="!invoiceParams.isExamine"><el-button type="primary" size="mini" @click.stop="handleShowInvoiceDetail(item.id)">查看审批</el-button></p>
                <p v-if="!invoiceParams.isExamine && !item.lastOne">
                    <el-button 
                        type="primary"
                        plain 
                        size="mini" 
                        @click.stop="handleApproved(item)"
                    >
                        审批通过
                    </el-button></p>
            </div>
        </div>


        <el-empty v-if="!resData.length" description="暂无发票"></el-empty>
        <el-pagination
            background
            :hide-on-single-page="true"
            layout="total, prev, pager, next, sizes"
            :current-page="Number(invoiceParams.pageNo)"
            :page-size="Number(invoiceParams.pageSize)"
            @current-change="handleCurrentChange"
            @size-change="handleSizeChange"
            :total="totalCount">
        </el-pagination>   

        <!-- 项目明细 -->
        <el-dialog
            width="900px"
            title="项目明细"
            :visible.sync="showProjectDetail"
            :close-on-click-modal="false"
            append-to-body
            v-loading="projectDetailLoading"
        >
            <invoice-project-detail :projectDetailData="projectDetailData"></invoice-project-detail>
        </el-dialog>

    </div>
</template>

<script>
import { financeCommissionInvoiceList, financeCommissionInvoiceProjectDetail, financeCommissionInvoiceReview } from '@/api/finance'
import InvoiceProjectDetail from '@/views/project/invoiceCenter/components/ProjectDetail'
import qs from 'qs'

export default {
    components: {
        InvoiceProjectDetail
    },
    data() {
        return {
            // 发票列表数据
            resData: [],

            // 发票类型
            invoiceTypeData: [
                { id: 2, name: '全部' },
                { id: 0, name: '普通开票' },
                { id: 1, name: '合并开票' }
            ],

            // 当前选择的发票类型
            activeIndex: 0,

            // 发票列表加载中
            listLoading: true,

            // 发票筛选参数
            invoiceParams: {
                // 是否处理 0 未处理  1 历史开票
                isExamine: 0,
                pageNo: 1,
                pageSize: 20
            },

            // 总条数
            totalCount: 0,

            // 显示项目明细
            showProjectDetail: false,

            // 项目明细加载中
            projectDetailLoading: false,

            // 项目明细
            projectDetailData: []
        }
    },
    mounted() {
        this.invoiceParams.isExamine = this.$route.query.type ? 1 : 0
        this.getInvoiceList()
    },
    methods: {
        // 获取发票列表
        getInvoiceList(){
            this.listLoading = true
            financeCommissionInvoiceList(this.invoiceParams).then(res => {
                this.listLoading = false
                if(res.code === this.$successCode){
                    let { list, totalRecords } = res.obj
                    this.resData = list
                    this.totalCount = totalRecords
                }
            })
        },

        // 分页
        handleCurrentChange(page){
            this.invoiceParams.pageNo = page
            this.getInvoiceList()
        },

        // 每页多少条
        handleSizeChange(size){
            this.invoiceParams.pageSize = size
            this.getInvoiceList()
        },

        handleSelectInvoiceType(id, index){
            this.invoiceParams.merge = id
            this.activeIndex = index
            if(id == 2) this.$delete(this.invoiceParams, 'merge')
            this.handleSearch()
        },

        // 搜索
        handleSearch(){
            this.invoiceParams.pageNo = 1
            this.getInvoiceList()
        },

        // 查看发票详情  
        handleShowInvoiceDetail(id = null){
            this.$router.push(`/invoiceApply?invoiceId=${id}`)
        },

        // 查看项目明细
        handleShowProjectDetail(id){
            this.showProjectDetail = true
            this.projectDetailLoading = true
            financeCommissionInvoiceProjectDetail({ invoice: id }).then(res => {
                this.projectDetailLoading = false
                if(res.code === this.$successCode){
                    this.projectDetailData = res.obj
                }
            })
        },

        // 通过审批
        handleApproved({ id, lastOne }){
            let data = {
                invoice: id, 
                isApproved: 1
            }
            
            if(lastOne){
                this.handleShowInvoiceDetail(id)
                return
            }

            financeCommissionInvoiceReview(qs.stringify(data)).then(res => {
                if(res.code === this.$successCode){
                    this.$message.success('审批通过成功~')
                    this.getInvoiceList()
                }
            })
        }
    },
    watch: {
        $route(n, o){
            if(n.query.type != o.query.type){
                this.invoiceParams.isExamine = n.query.type ? 1 : 0
                this.getInvoiceList()
            }
        }
    },
}
</script>

<style lang="scss" scoped>
    .invoice-center-wrap{

        .nav-list{
            display: inline-block;
            padding-left: 20px;
            
            span{
                display: inline-block;
                padding: 5px 10px;
                border-radius: 4px;
                cursor: pointer;

                &.active{
                    background: var(--color-primary);
                    color: #fff;
                }
            }
        }

        .invoice-list{
            padding: 20px 40px;
            margin: 20px 0;
            border-radius: 10px;
            display: flex;
            flex-wrap: wrap;
            align-items: center;    
            background: #63D998;
            justify-content: space-between;
            cursor: pointer;

            &.pass{
                background: #D9D9D9;
            }

            &.turnDown{
                background: #FAB958;
            }

            li{
                line-height: 26px;
            }

            .project-info {
                flex: 1;

                .title{
                    padding: 5px 0 15px 0;
                    display: flex;

                    .state{
                        padding: 2px 5px;
                        border-radius: 4px;
                        background: #2C66D9;
                        color: #fff;
                        white-space: nowrap;

                        &.down{
                            background: #D9632C;
                        }

                        &.mix{
                            background: linear-gradient(to right, #D9632C 50%, #2C66D9 0);
                            padding: 2px 10px;
                        }
                    }

                    .project-name{
                        padding-left: 10px;
                        font-size: 18px;
                        font-weight: bold;

                        &.multiple{
                            color: var(--color-primary);
                            text-decoration: underline;
                            cursor: pointer;
                        }
                    }
                }
            }

            .contract-info{
                flex: 1;

                .text{
                    color: var(--color-danger);
                    text-decoration: underline;
                    padding-left: 10px;
                }
            }
            
            .right-btn-wrap{
                flex: 1;

                width: 120px;
                text-align: right;

                p{
                    padding: 5px 0;
                }
            }
        }
    }
</style>