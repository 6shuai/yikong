<template>
    <div 
        class="project-list-wrap app-main-wrap" 
        id="app-main-wrap"
    >
        <div class="add-and-search mb10">
            <el-button 
                type="primary" 
                icon="el-icon-plus" 
                @click="handleShowCreateProject()"
                size="small">
                新建项目
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

        <div class="project-list" v-loading="listLoading">
            <div 
                class="item" 
                :style="{ width: placeW }" 
                v-for="item in resData"
                :key="item.id"
                @click="jumpProjectDetail(item.id)"
            >
                <el-card shadow="hover">
                    <div class="name overflow">{{ item.displayName }}</div>
                    <div class="desc" :title="item.description">{{ item.description }}</div>
                    <el-tag 
                        type="primary" 
                        plain
                        size="mini"
                    >
                        {{ item.clientName }}
                    </el-tag>

                    <div class="edit" @click.stop="handleShowCreateProject(item)">
                        <i class="el-icon-edit"></i>编辑
                    </div>
                    
                </el-card>
            </div>
        </div>
        <el-empty v-if="!resData.length && !listLoading" description="暂无项目"></el-empty>

        <el-pagination
            v-if="resData.length"
            background
            :hide-on-single-page="true"
            layout="total, prev, pager, next, sizes"
            :current-page="Number(params.pageNo)"
            :page-size="Number(params.pageSize)"
            @current-change="handleCurrentChange"
            @size-change="handleSizeChange"
            :total="totalCount">
        </el-pagination>   
        

        <create-project ref="createProject"></create-project>

    </div>
</template>

<script>
import { screenSizeWatch } from '@/mixins'
import { projectList } from '@/api/project'
import CreateProject from './components/CreateProject'

export default {
    components: { 
        CreateProject
    },
    mixins: [screenSizeWatch],
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
        getList(){
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
        jumpProjectDetail(id){
            this.$router.push(`/project/${id}`)
        },

        // 分页
        handleCurrentChange(page){
            this.params.pageNo = page
            this.getList()
        },

        // 每页多少条
        handleSizeChange(size){
            this.params.pageSize = size
            this.getList()
        },

        // 搜索
        handleSearch(){
            this.params.pageNo = 1
            this.getList()
        }
    }
}
</script>

<style lang="scss">
    .project-list-wrap{
        .project-list{
            display: flex;
            flex-wrap: wrap;
            margin-left: -10px;

            .item{
                cursor: pointer;

                .el-card{
                    margin: 10px;
                    position: relative;

                    .el-card__body{
                        padding: 0;
                        margin: 20px 20px 15px;
                    }
                    
                    .desc{
                        font-size: 12px;
                        color: #999;
                        line-height: 14px;
                        height: 14px;
                        overflow: hidden;
                        margin: 10px 0;
                    }

                    .edit{
                        font-size: 14px;
                        position: absolute;
                        right: 0;
                        bottom: 0px;
                        height: 30px;
                        line-height: 30px;
                        padding: 0 20px;
                        text-align: center;
                        color: #999;
                        background: #f9fafcd1;
                        display: none;

                        &:hover{
                            color: var(--color-primary);
                        }
                    }

                }

                &:hover{
                    .edit{
                        display: block;
                    }
                }
            }
        }
    }
</style>