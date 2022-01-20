<template>
    <div class="project-member-wrap">
        <div class="add-and-search">
            <el-button
                type="primary"
                icon="el-icon-plus"
                size="small"
                @click="handleShowCreateMember"
            >
                添加成员
            </el-button>
    
            <div class="search-input">
                <el-input 
                    clearable
                    size="small"
                    v-model="params.name"
                    placeholder="输入用户名或昵称搜索"
                    @input="$debounce(handleSearch)"
                ></el-input>
            </div>
        </div>


        <el-table
            class="mt20 mb20"
            v-loading="tLoading"
            stripe
            size="small"
            :data="resData"
            row-key="id"
            border>
            <el-table-column 
                prop="avatar" 
                label="用户" 
                min-width="100"
            >
                <template slot-scope="scope">
                    <el-image fit="cover" :src="scope.row.avatar"></el-image>
                    <span>{{ scope.row.accountName }}</span>
                </template>
            </el-table-column>
            <el-table-column 
                prop="nickname" 
                label="昵称" 
                min-width="100"
            ></el-table-column>
            <el-table-column 
                prop="beginTime" 
                label="操作" 
                min-width="100"
            >
                <template slot-scope="scope">
                    <el-popconfirm
                        confirm-button-text='删除'
                        cancel-button-text='取消'
                        icon="el-icon-info"
                        icon-color="red"
                        title="此操作将删除此成员, 是否继续?"
                        @confirm="handleDelete(scope.row.id)"
                    >
                        <el-button 
                            type="danger" 
                            slot="reference"
                            size="mini"
                            plain
                        >
                            删除
                        </el-button>
                    </el-popconfirm>
                </template>
            </el-table-column>
        </el-table>

        <el-pagination
            v-if="resData.length"
            background
            layout="total, prev, pager, next"
            :current-page="Number(params.pageNo)"
            :page-size="Number(params.pageSize)"
            @current-change="handleCurrentChange"
            :total="totalCount">
        </el-pagination>        

        <!-- 添加项目成员 -->
        <create-member ref="createMember"></create-member>

    </div>
</template>

<script>
import { projectMemberList, projectMemberDelete } from '@/api/project'
import CreateMember from './components/CreateMember'

export default {
    components: { 
        CreateMember
    },
    data(){
        return {
            resData: [],
            params: {},

            // 总条数
            totalCount: 0,

            // 数据loading
            tLoading: false
        }
    },
    mounted() {
        this.getProjectMemberList()
    },
    methods: {
        // 获取项目成员列表
        getProjectMemberList(){
            this.params.project = this.$route.params.id
            projectMemberList(this.params).then(res => {
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
            this.getProjectMemberList()
        },

        // 搜索
        handleSearch(){
            this.handleCurrentChange(1)
        },

        // 显示添加成员窗口
        handleShowCreateMember(){
            this.$refs.createMember.showAddMemberDialog()
        },

        // 删除项目成员
        handleDelete(id){
            projectMemberDelete(id).then(res => {
                if(res.code === this.$successCode){
                    this.$message.success('删除成功~')
                    this.getProjectMemberList()
                }
            })
        }
    }
}
</script>

<style lang="scss" scoped>
    .project-member-wrap{
        .el-image{
            width: 40px;
            height: 40px;
            border-radius: 50%;
            vertical-align: middle;
            margin-right: 10px;
        }
    }
</style>