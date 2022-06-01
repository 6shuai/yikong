<template>
    <el-dialog
        width="1200px"
        :visible.sync="showDistributeDialog"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        append-to-body
        custom-class="return-money-distribute"
        v-loading="dataLoading"
    >
        <!-- 付款公司 -->
        <div class="reutrn-money-company">
            <div class="title">
                <span class="company-name">{{ resData.organizationName }}</span>
                <span v-if="!showDistribute">
                    <span class="balance">余额：{{ moneyFormat(resData.unassigned) }}</span>
                    <el-button 
                        v-if="applyState != '未匹配' && applyState != '退款中' && applyState != '异常' && resData.unassigned"
                        type="primary" 
                        size="mini"
                        @click="showDistribute = true"
                    >
                        继续分配
                    </el-button>
                    <span class="refund ml20">{{ applyState }}</span>
                </span>
            </div>
            <p>项目总额：{{ moneyFormat(resData.totalAmount) }}</p>
            <p class="return-money-btn clearfix">
                已回款：{{ moneyFormat(resData.totalRecovered) }}
                <el-button 
                    type="primary" 
                    size="mini"
                    :disabled="resData.unassigned <= 0 ? true : false"
                    v-if="!showDistribute && !resData.refundAmount && applyState != '异常'"
                    @click="$refs.refund.showRefund(resData.unassigned, applyId)"
                >退款</el-button>
            </p>
        </div>

        <el-scrollbar class="hidden-scroll-x list-scroll">
            <div class="project-list">
                <div 
                    class="project-item" 
                    v-for="item in resData.projects"
                    :key="item.id"
                >
                    <div class="project-content">
                        <div class="project-title">
                            <div class="name">
                                <el-tag size="mini">{{ item.scheduleCount > 1 ? '分期' : '普通' }}</el-tag>
                                <b>{{ item.displayName }}</b>
                            </div>
                            <el-tag type="info" size="mini">{{ item.organizationName }}</el-tag>
                        </div>
                        <p>项目额：{{ moneyFormat(item.amount) }}</p>
                        <p>已回款：{{ moneyFormat(item.sumAmount) }}</p>
                    </div>
                    
                    <!-- 分期回款 -->
                    <el-scrollbar class="hidden-scroll-x installment-scroll">
                        <ul class="installment">
                            <li 
                                class="installment-list" 
                                v-for="child in item.paymentSchedules"
                                :key="child.id"
                            >
                                <span class="index">{{ child.cycle }}</span>
                                <span class="price">{{ moneyFormat(child.amount) }}</span>
                                <span class="date">{{ child.deadline }}</span>
                                <span class="state" v-if="child.completed">
                                    <i class="el-icon-check"></i>
                                </span>
                            </li>
                        </ul>
                    </el-scrollbar>
    
                    <!-- 回款金额 -->
                    <div class="return-money" v-if="showDistribute">
                        <label>回款金额：￥</label>
                        <el-input-number 
                            :controls="false"
                            size="mini"
                            :precision="2"
                            :max="item.amount - item.sumAmount"
                            v-model="item.distributePrice"
                        ></el-input-number>
                        <span class="ml10">元</span>
                    </div>
    
                </div>
            </div>
        </el-scrollbar>

        <div class="distribute-wrap" v-if="showDistribute">
            <div class="distribute-info">
                <p>本次收款：{{ moneyFormat(resData.amount) }}</p>
                <p>未分配：{{ moneyFormat(resData.unassigned) }}</p>
                <p>收款日期：{{ resData.requestDate }}</p>
            </div>
            <el-button 
                type="primary" 
                :loading="distributeLoading"
                @click="handleReturnMoneyDistribute"
                :disabled="applyState == '未匹配' || applyState == '退款中'"
            >
                确 定
            </el-button>
        </div>

        <div class="distribute-wrap" v-if="applyState == '退款中'">
            <div class="distribute-info">
                <p>余额：{{ moneyFormat(resData.unassigned) }}</p>
                <p>退款金额：{{ moneyFormat(resData.refundAmount) }}</p>
            </div>
        </div>

        <!-- 退款 -->
        <refund ref="refund" @refundSuccess="getDetail()"></refund>


    </el-dialog>
</template>

<script>
import { projectReturnMoneyDistributeDetail, projectReturnMoneyDistribute } from '@/api/project'
import { priceFormat } from '@/utils/index'
import Refund from './Refund'

export default {
    components: {
        Refund
    },
    data () {
        return {
            showDistributeDialog: false,

            // 申领id
            applyId: null,

            // 申领状态
            applyState: undefined,

            // 项目金额分配信息
            resData: {},

            // 数据加载中
            dataLoading: true,

            // 分配按钮loading
            distributeLoading: false,

            // 是否显示继续分配
            showDistribute: true
        }
    },
    computed: {
        // 金额格式化
        moneyFormat(){
            return (val = 0) => {
                return priceFormat(val)
            }
        }
    },
    methods: {
        showDialog({ id, state }){
            this.applyId = id
            this.applyState = state
            this.showDistributeDialog = true
            this.getDetail()
        },
        
        // 获取分配详情
        getDetail(){
            this.dataLoading = true
            projectReturnMoneyDistributeDetail({ id: this.applyId }).then(res => {
                this.dataLoading = false
                this.resData = res.obj
                let { unassigned, amount } = res.obj

                if(unassigned != amount){
                    this.showDistribute = false
                }
            })
        },

        // 申领金额分配
        async handleReturnMoneyDistribute(){

            let { params, unassigned } = await this.returnMoneyDistributeParams()
            if(!params.length) return   

            let msg = '您确定提交本次的回款分配吗?'
            if(unassigned > 0){
                msg = `您目前还有${ priceFormat(unassigned) }未进行分配,您确定要提交吗?`
            }


            this.$confirm(msg, '提示', {
                    confirmButtonText: '提交',
                    cancelButtonText: '我再想想',
                    type: 'warning'
            }).then(() => {
                this.distributeLoading = true
                projectReturnMoneyDistribute(params).then(res => {
                    this.distributeLoading = false
                    if(res.code === this.$successCode){
                        this.$message.success('操作成功~')
                        this.getDetail()
                    }
                })
            })
            
        },

        // 申领金额分配 参数
        returnMoneyDistributeParams(){
            let params = []

            // 未分配金额
            let unassigned = this.resData.unassigned 

            for(let i = 0; i < this.resData.projects.length; i++){
                let { distributePrice, paymentSchedules } = this.resData.projects[i]

                if(distributePrice){

                    unassigned -= distributePrice

                    for(let j = 0; j < paymentSchedules.length; j++){
                        let item = paymentSchedules[j]
                        if(!item.completed && distributePrice){
                            params.push({
                                collection: this.applyId,
                                amount: distributePrice > item.toBeRecovered ? item.toBeRecovered : distributePrice,
                                scheduleId: item.id
                            })
                            distributePrice -= params[params.length-1].amount
                        }
                    }
                }
            }

            return {
                params,
                unassigned
            }
        }
    }
}
</script>

<style lang="scss">
    .return-money-distribute{
        .reutrn-money-company{
            padding-bottom: 20px;

            .title{
                padding-bottom: 10px;
                
                .company-name, .balance{
                    margin-right: 20px;

                    &.company-name{
                        font-weight: bold;
                        font-size: 18px;
                    }
                }

                .refund{
                    color: var(--color-danger);
                }
            }

            p{
                line-height: 26px;

                &.return-money-btn .el-button{
                    float: right;
                }
            }
        }

        .list-scroll{
            height: 600px;
        }

        .project-list{
            display: flex;
            flex-wrap: wrap;

            .project-item{
                width: 300px;
                border: 1px solid #e5e5e5;
                border-radius: 10px;
                box-shadow: 0 2px 12px 0 rgba(0,0,0, 0.3);
                margin: 0 20px 20px;
                overflow: hidden;

                .project-content{
                    padding: 10px;
                    border-bottom: 1px solid #e5e5e5;

                    .project-title{
                        display: flex;
                        justify-content: space-between;
                        padding-bottom: 10px;

                        .name{
                            b{
                                margin-left: 5px;
                            }
                        }
                    }

                    p{
                        line-height: 26px;
                    }
                }

                .installment-scroll{
                    height: 100px;
                }

                .installment{
                    padding: 5px 10px;

                    li{
                        height: 30px;
                        line-height: 30px;
                        color: #666;

                        span{
                            display: inline-block;
                            text-align: left;

                            &.index{
                                width: 40px;
                            }

                            &.price{
                                width: 100px;
                            }

                            &.date{
                                width: 90px;
                            }

                            &.state{
                                width: 30px;
                                color: green;
                            }
                        }
                    }
                }

                .return-money{
                    padding: 10px;
                    background: rgb(116, 116, 116);
                    color: #fff;
                    display: flex;
                    align-items: center;

                    label{
                        width: 90px;
                    }

                    .el-input-number{
                        flex: 1;
                    }

                    span{
                        width: 20px;
                    }
                }
            }
        }

        .distribute-wrap{
            padding: 10px 20px;
            border-top: 1px solid #e5e5e5;
            background: #eeeeee;
            display: flex;
            justify-content: space-between;
            align-items: center;

            .distribute-info p{
                line-height: 26px;
            }
        }
    }
</style>