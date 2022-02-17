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
                v-model="params.displayName"
                placeholder="请输入项目名称"
                @input="$debounce(handleSearch)"
            ></el-input>
        </div>

        <el-table
            class="mt20 mb20"
            :height="tableHeight"
            ref="table"
            stripe
            size="small"
            :data="resData"
            row-key="id"
            v-loading="dataLoading"
            border>
            <el-table-column 
                v-for="(item, index) in resData[0]"
                v-if="index!='projectId'"
                :key="index"
                :prop="index" 
                :label="index" 
                :min-width="index=='项目' ? 120 : 80"
            >
                <template slot-scope="scope">
                    <span v-if="scope.row[index].constructor === Object">{{ scope.row[index].amountPaid }}</span>
                    <span 
                        v-else 
                        class="project-title"
                        @click="$refs.projectDetail.showProjectPriceDetail(scope.row.projectId, scope.row['项目'])"
                    >{{ scope.row[index] }}</span>
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

        <!-- 查看项目权责明细 -->
        <project-detail ref="projectDetail"></project-detail>

    </div>
</template>

<script>
import { financeProjectInfo } from '@/api/finance'
import { formatTime } from '@/utils/index'
import { faClosedCaptioning } from '@fortawesome/free-regular-svg-icons'
import ProjectDetail from '@/views/finance/components/ProjectDetail'

export default {
    components: {
        ProjectDetail
    },
    data() {
        return {
            // 表格高度
            tableHeight: null,

            // 项目权责列表
            resData: [],

            // 总条数
            totalCount: 0,

            // 筛选条件
            params: {
                pageNo: 1,
                pageSize: 20,
                year: formatTime(new Date(), 'year').toString()
            },

            // 数据加载中
            dataLoading: faClosedCaptioning
        }
    },
    mounted() {
        this.getProjectList()
        // 表格高度
        this.tableHeight = window.innerHeight - 350

        // 监听浏览器窗口缩放  改变表格高度
        window.addEventListener('resize', () => {
            this.setTableHeight()
        })
    },
    methods: {
        // 获取项目权责列表
        getProjectList(){
            this.dataLoading = true
            financeProjectInfo(this.params).then(res => {
                this.dataLoading = false
                if(res.code === this.$successCode){
                    let { projectAccrualData, page } = res.obj
                    this.resData = projectAccrualData

                    this.totalCount = page.totalRecords
                    this.setTableHeight()
                }
            })
        },

        // 分页
        handleCurrentChange(page){
            this.params.pageNo = page
            this.getProjectList()
        },

        // 每页多少条
        handleSizeChange(size){
            this.params.pageSize = size
            this.getProjectList()
        },

        //搜索
        handleSearch(){
            this.params.pageNo = 1
            this.getProjectList()
        },

        // 表格高度
        setTableHeight(){
            this.$nextTick(() => {
                let h = window.innerHeight - 350
                // 40 = 表格行高  2 = 表格上下border高度
                let _h = (this.resData.length > 0 ? this.resData.length + 1 : 2) * 40  + 2
                this.tableHeight = h > _h ? _h : h
            })
        }
    }
}
</script>

<style lang="scss" scoped>
    .finance-project-wrap{
        .project-title{
            display: inline-block;
            width: 100%;
            height: 100%;
            cursor: pointer;
            font-weight: bold;

            &:hover{
                color: var(--color-primary);
                text-decoration: underline;
            }
        }
    }
</style>