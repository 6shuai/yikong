<template>
    <div class="finance-project-wrap">
        
        <div class="add-and-search mb10">
            <el-date-picker
                :clearable="false"
                v-model="params.year"
                type="year"
                placeholder="选择年"
                value-format="yyyy"
                @change="handleSearch"
            >
            </el-date-picker>
            <el-input
                clearable
                v-model="params.keyword"
                placeholder="请输入员工名称或用户名"
                @input="$debounce(handleSearch)"
            ></el-input>
        </div>


        <!-- 
            应支付  = 客户应该给的钱  * 提成
            已支付 = 客户已给的钱 * 提成
            未结算 =  客户已给的钱 * 提成 - 已结算  (用客户已给的钱 * 提成   去给员工结算)
         -->
        <el-table
            class="mt20 mb20"
            :height="tableHeight"
            stripe
            size="small"
            :data="resData"
            row-key="id"
            v-loading="dataLoading"
            border>
            <el-table-column 
                v-for="(item, index) in resData[0]"
                v-if="index!='memberId'"
                :key="index"
                :prop="index" 
                :label="index" 
                :align="item.constructor===Object ? 'center' : ''"
                :min-width="index==='员工' ? 150 : 80"
                :fixed="hasFixed(index)"
            >   
                <template v-if="item.constructor===Object">
                    <el-table-column 
                        align="center" 
                        label="应支付"
                    >
                        <template slot-scope="scope">
                            <a 
                                href="javascript:;"
                                class="price residue-price"
                                @click="handleShowDetail({memberId: scope.row.memberId, displayName: scope.row['员工']}, index, scope.$index)"
                            >
                                {{ scope.row[index].amountPayable }}
                            </a>
                        </template>
                    </el-table-column>
                    <el-table-column 
                        align="center" 
                        label="已支付"
                    >
                        <template slot-scope="scope">
                            <a 
                                href="javascript:;"
                                class="price total-price" 
                                @click="handleShowDetail({memberId: scope.row.memberId, displayName: scope.row['员工']}, index, scope.$index)"
                            >
                                {{ scope.row[index].amountPaid }}
                            </a>
                        </template>
                    </el-table-column>
                </template>
            </el-table-column>
        </el-table>

        <el-pagination
            background
            hide-on-single-page
            layout="total, prev, pager, next, sizes"
            :page-sizes="[20, 40, 80, 100]"
            :page-size="Number(params.pageSize)"
            :current-page="Number(params.pageNo)"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :total="totalCount">
        </el-pagination>

        <!-- 查看当前员工  此月的 项目结算情况 -->
        <member-project-detail ref="memberProjectDetail"></member-project-detail>

    </div>
</template>

<script>
import MemberProjectDetail from "./MemberProjectDetail"
import { financeMemberInfo } from '@/api/finance'
import { formatTime } from '@/utils/index'

export default {
    components: {
        MemberProjectDetail
    },
    data() {
        return {
            // 表格高度
            tableHeight: null, 

            resData: [],

            // 总条数
            totalCount: 0,

            // 数据加载中
            dataLoading: false,

            // 筛选条件
            params: {
                pageNo: 1,
                pageSize: 20,
                year: formatTime(new Date(), 'year').toString()
            }
        }
    },
    mounted() {
        this.getMemberList()

        // 表格高度
        this.tableHeight = window.innerHeight - 350;

        // 监听浏览器窗口缩放  改变表格高度
        window.addEventListener('resize', () => {
            this.tableHeight = window.innerHeight - 350;
        })
    },
    methods: {
        // 获取员工权责列表
        getMemberList(){
            this.dataLoading = true
            financeMemberInfo(this.params).then(res => {
                this.dataLoading = false
                if(res.code === this.$successCode){
                    let { memberAccrualData, page } = res.obj
                    this.resData = memberAccrualData
                    this.totalCount = page.totalRecords

                    this.$nextTick(() => {
                        // 40 = 表格行高  2 = 表格上下border高度
                        let h = (this.resData.length > 0 ? this.resData.length + 2 : 3) * 40  + 10
                        this.tableHeight = this.tableHeight > h ? h : this.tableHeight
                    })
                }
            })
        },

        // 固定表格 列
        hasFixed(keyword){
            let fixedArr = ['员工']
            return fixedArr.includes(keyword)
        },

        // 分页
        handleCurrentChange(page){
            this.params.pageNo = page
            this.getMemberList()
        },

        // 每页多少条
        handleSizeChange(size){
            this.params.pageSize = size
            this.getMemberList()
        },

        //搜索
        handleSearch(){
            this.params.pageNo = 1
            this.getMemberList()
        },

        // 查询员工项目详情
        handleShowDetail(data, month, $index){
            if($index != this.resData.length-1 && month.indexOf('月') > -1){
                this.$refs.memberProjectDetail.showMemberProjectDetailDialog(data, month.split('月')[0], this.params.year)
            }
        }
    }
}
</script>

<style lang="scss">
    .finance-project-wrap{

        a.price{
            display: inline-block;
            width: 100%;
            height: 100%;

            &.total-price{
                color: var(--color-primary);
            }

            &.residue-price{
                color: var(--color-info);
            }

            &:hover{
                text-decoration: underline;
            }
        }
    }
</style>