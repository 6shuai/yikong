<template>
    <div class="finance-return-money">
        <div v-if="!showRefundReview">
            <div class="head-wrap">
                <div class="search-and-btn">
                    <el-input 
                        suffix-icon="el-icon-search"
                        v-model="params.displayName"
                        @input="$debounce(handleSearch)"
                    ></el-input>
                    <div class="right-btn">
                        <el-badge :is-dot="reviewCount>0" class="mr10">
                            <el-button type="primary" @click="handleShowRefoundReview">退款处理</el-button>
                        </el-badge>
                        <el-button type="primary" @click="handleShowCollectMoney">收款</el-button>
                    </div>
                </div>
                <div class="period-search mt20">
                    <el-date-picker
                        v-model="filterDate"
                        @change="handleChangeDate"
                        type="daterange"
                        value-format="yyyy-MM-dd"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期">
                    </el-date-picker>
                </div>
            </div>

            <div class="return-money-list" v-loading="tLoading">
                <el-row class="head">
                    <el-col :span="6">公司名称</el-col>
                    <el-col :span="5">金额</el-col>
                    <el-col :span="5">责任人</el-col>
                    <el-col :span="4">时间</el-col>
                    <el-col :span="4">操作</el-col>
                </el-row>
                
                <el-empty v-if="!resData || !resData.length"></el-empty>

                <el-row type="flex" align="middle" v-for="item in resData" :key="item.id">
                    <el-col :span="6">{{ item.organizationName }}</el-col>
                    <el-col :span="5">
                        <ul v-if="item.state == '多销售分配'">
                            <li v-for="child in item.collectionRequests" :key="'amount'+child.id">{{ collectMoneyFormat(child.amount) }}</li>
                        </ul>
                        <span v-else>{{ collectMoneyFormat(item.amount) }}</span>
                    </el-col>
                    <el-col :span="5">
                        <ul v-if="item.state == '多销售分配'">
                            <li v-for="child in item.collectionRequests" :key="'nickNames'+child.id">{{ child.nickname }}</li>
                        </ul>
                        <div v-else-if="item.state == '异常' && item.collectionRequests && item.collectionRequests.length">
                            <el-popover
                                popper-class="sale-checkbox-list"
                                placement="bottom"
                                width="250"
                                trigger="click">
        
                                    <p v-for="(c, cIndex) in item.collectionRequests" :key="c.id">
                                        <el-checkbox 
                                            :label="c.nickname" 
                                            :value="c.checked" 
                                            @change="$set(item.collectionRequests[cIndex], 'checked', !c.checked)"
                                        ></el-checkbox>
                                        <span>{{ collectMoneyFormat(c.amount) }}</span>
                                    </p>
                                <span slot="reference"> -- <i class="el-icon-arrow-down"></i></span>
        
                                <div class="distribute-btn mt10">
                                    <el-button 
                                        size="small" 
                                        :disabled="!distributeSuitable(item.collectionRequests)"
                                        @click="handleDistribute(item.id, item.collectionRequests, item.amount)"
                                    >确定分配
                                    </el-button>
                                </div>
                            </el-popover>
                        </div>
                        <span v-else>{{ item.nicknames ? item.nicknames : '--' }}</span>
                    </el-col>
                    <el-col :span="4">
                        <ul v-if="item.state == '多销售分配'">
                            <li v-for="child in item.collectionRequests" :key="child.id">{{ child.requestDateFormat }}</li>
                        </ul>
                        <span v-else>{{ item.occurTime }}</span>
                    </el-col>
                    <el-col :span="4">
                        <el-button
                            type="primary"
                            size="mini"
                            plain
                            :disabled="((item.collectionRequests && item.collectionRequests.lengt) || item.nicknames || item.transactionId) ? true : false"
                            @click="handleShowCollectMoney(item)"
                        >
                            编辑
                        </el-button>
                    </el-col>
                </el-row>
            </div>

    
            <el-pagination
                background
                :hide-on-single-page="true"
                layout="total, prev, pager, next, sizes"
                :page-size="params.pageSize"
                :page-sizes="[40, 80, 100]"
                :current-page="Number(params.pageNo)"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :total="totalCount">
            </el-pagination>

        </div>

        <!-- 收款 -->
        <collect-money ref="collectMoney"></collect-money>

        <!-- 退款审核 -->
        <refund-review v-if="showRefundReview"></refund-review>

    </div>
</template>

<script>
import { financeReturnMoneyLogList, financeReturnMoneyReviewCount, financeReturnMoneyDistribute } from '@/api/finance'
import { priceFormat } from '@/utils/index'
import CollectMoney from './components/CollectMoney'
import RefundReview from './components/RefundReview'
import qs from 'qs'

export default {
    components: {
        CollectMoney,
        RefundReview
    },
    data() {
        return {
            // 日期筛选
            filterDate: [],

            params: {},
            tLoading: false,

            // 收款列表
            resData: [],

            // 列表总条数
            totalCount: 0,

            // 显示退款审核
            showRefundReview: false,

            // 退款处理数量
            reviewCount: 0
        }
    },
    computed: {
        // 收款金额格式化
        collectMoneyFormat(){
            return (key) => {
                return priceFormat(key)
            }
        },

        // 分配是否选中
        distributeSuitable(){
            return (collectionRequests) => {
                let result = false
                for(let i = 0; i < collectionRequests.length; i++){
                    if(collectionRequests[i].checked){
                        result = true
                    }
                }
                console.log(result)
                return result
            }
        }
    },
    mounted() {
        this.getCollectMoneyList()
        this.getReviewListCount()
    },
    methods: {
        getCollectMoneyList(){
            this.tLoading = true
            financeReturnMoneyLogList(this.params).then(res => {
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
            this.getCollectMoneyList()
        },

        // 每页条数
        handleSizeChange(size){
            this.params.pageSize = size
            this.getCollectMoneyList()
        },  

        // 日期筛选
        handleChangeDate(){
            if(!this.filterDate || !this.filterDate.length){
                this.$delete(this.params, 'beginTime')
                this.$delete(this.params, 'endTime')
            }else{
                this.params.beginTime = this.filterDate[0]
                this.params.endTime = this.filterDate[1]
            }
            this.handleSearch()
        },

        // 搜索
        handleSearch(){
            this.params.pageNo = 1
            this.getCollectMoneyList()
        },

        // 获取退款处理列表数量
        getReviewListCount(){
            financeReturnMoneyReviewCount().then(res => {
                this.reviewCount = res.obj
            })
        },

        // 打开收款窗口
        handleShowCollectMoney({ amount, payer, occurTime, id }){
            this.$refs.collectMoney.showCollectMoney({ amount, payer, occurTime, id })
        },

        // 打开退款审核窗口
        handleShowRefoundReview(){
            this.$router.push({
                path: '/finance/returnMoney',
                query: {
                    target: 'refundReview'
                }
            })
            this.showRefundReview = true
        },

        // 回款分配
        handleDistribute(id, collectionRequests, amount){
            let collectionIds = []
            let money = 0

            for(let i = 0; i < collectionRequests.length; i++){
                if(collectionRequests[i].checked){
                    money += collectionRequests[i].amount
                    collectionIds.push(collectionRequests[i].id)
                }
            }

            if(money != amount){
                this.$message.warning('分配金额和收款金额不相符~')
                return
            }

            let data = {
                transactionId: id,
                collectionIds: collectionIds.join(',')
            }

            financeReturnMoneyDistribute(qs.stringify(data)).then(res => {
                if(res.code === this.$successCode){
                    this.$message.success('操作成功~')
                    this.getCollectMoneyList()
                }
            })
        }
    },
    watch: {
        '$route.query'(n , o){
            if(this.$route.query.target && this.$route.query.target === 'refundReview'){
                this.showRefundReview = true
            }else {
                this.showRefundReview = false
            }
        }
    }
}
</script>

<style lang="scss">
    .finance-return-money{
        .head-wrap{
            .search-and-btn{
                display: flex;
                
                .el-input{
                    flex: 1;
                }

                .right-btn{
                    text-align: right;
                    width: 300px;
                }
            }
        }

    }

    .return-money-list{
        padding: 20px;
        
        .el-row{
            padding: 15px 0;
            border-bottom: 1px solid #e5e5e5;

            &:last-child{
                border: none;
            }

            &.head{
                font-size: 16px;
                font-weight: bold;
            }

            ul>li {
                line-height: 26px;
            }
        }
    }

    .sale-checkbox-list{
        p{
            display: flex;
            justify-content: space-between;

            span{
                font-size: 14px;
            }
        }

        .distribute-btn{
            text-align: right;
        }
    }
</style>