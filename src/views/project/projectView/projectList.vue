<template>
    <el-card id="app-main-wrap">
        <div class="add-and-search mb10">
            <el-button 
                type="primary" 
                icon="el-icon-plus" 
                @click="handleShowCreateProject()"
                size="small">
                创建项目
            </el-button>

            <div class="search-input">
                <el-input 
                    clearable
                    size="small"
                    v-model="params.displayName"
                    placeholder="输入项目名称搜索"
                    @input="$debounce(handleSearch)"
                ></el-input>
            </div>
        </div>

        <!-- 项目列表 -->
        <project-list
            :listLoading="listLoading"
            :resData="resData"
            :totalCount="totalCount"
            @getList="getList"
            @handleShowCreateProject="handleShowCreateProject"
            @jumpPage="jumpProjectDetail"
        ></project-list>
        

        <create-project ref="createProject" @createProjectSuccess="getList()"></create-project>

    </el-card>
</template>

<script>
import { projectList } from '@/api/project'
import ProjectList from '../components/ProjectList'
import CreateProject from '../components/CreateProject'

export default {
    components: {
        ProjectList, 
        CreateProject
    },
    data(){
        return{
            resData: [],
            totalCount: 0,
            listLoading: false,
            params: {
                pageNo: 1,
                pageSize: 40
            }
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

        // 显示创建项目
        handleShowCreateProject(item){
            this.$refs.createProject.showCreateProjectDialog(item)
        },

        // 跳转项目详情
        jumpProjectDetail({id}){
            this.$router.push(`/project/${id}`)
        },  

        // 搜索
        handleSearch(){
            this.params.pageNo = 1
            this.getList()
        }
    }
}
</script>