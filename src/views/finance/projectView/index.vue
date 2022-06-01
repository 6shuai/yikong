<template>
    <div class="finance-project-view" id="app-main-wrap">

        <div class="add-and-search mb10">
            <div class="search-input">
                <el-input 
                    clearable
                    v-model="params.displayName"
                    placeholder="输入项目名称搜索"
                    @input="$debounce(handleSearch)"
                ></el-input>

                <el-input 
                    clearable
                    v-model="params.contractNumber"
                    placeholder="输入合同号搜索"
                    @input="$debounce(handleSearch)"
                ></el-input>
            </div>
        </div>

        <!-- 项目列表 -->
        <project-list
            :listLoading="listLoading"
            :resData="resData"
            :totalCount="totalCount"
            :hideEdit="true"
            @getList="getList"
            @jumpPage="showProjectFinanceDetail"
        ></project-list>


        <!-- 项目财务详情 -->
        <el-dialog
            width="1200px"
            :title="projectName"
            :visible.sync="showFinanceDetail"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            append-to-body
        >
            <project-finance v-if="showFinanceDetail" :projectId="projectId" :contract="contractId"></project-finance>
        </el-dialog>

    </div>
</template>

<script>
import { projectList } from '@/api/project'
import ProjectList from '@/views/project/components/ProjectList'
import ProjectFinance from './financeDetail/index'

export default {
    components: {
        ProjectList,
        ProjectFinance
    },
    data() {
        return {
            listLoading: false,
            resData: [],
            totalCount: 0,
            params: {
                pageNo: 1,
                pageSize: 40,
                haveContract: 1
            },

            // 显示财务详情
            showFinanceDetail: false,

            // 项目名称
            projectName: '',

            // 合同id
            contractId: null,

            // 项目id
            projectId: null
        }
    },
    mounted() {
        this.getList()
    },
    methods: {
        // 项目列表
        getList(data){
            if(data) {
                this.params = {
                    ...data,
                    ...this.params
                }
            }
            this.listLoading = true
            projectList(this.params).then(res => {
                this.listLoading = false
                if(res.code === this.$successCode){
                    let { list, totalRecords } = res.obj
                    this.resData = list
                    this.totalCount = totalRecords
                }
            })
        },

        // 显示项目财务详情
        showProjectFinanceDetail({displayName, contract, id}){
            this.contractId = contract
            this.projectId = id
            this.projectName = displayName
            this.showFinanceDetail = true
        },

        // 搜索
        handleSearch(){
            this.params.pageNo = 1
            this.getList()
        }

    }
}
</script>