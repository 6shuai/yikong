<template>
    <div class="project-member-wrap">

        <el-descriptions 
            :column="1"
            title="项目信息"
        >
            <el-descriptions-item label="项目名称">{{ project.displayName }}</el-descriptions-item>
            <el-descriptions-item label="投放客户">
                <el-tag size="small">{{ project.clientName }}</el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="说明">{{ project.description }}</el-descriptions-item>
        </el-descriptions>

        <div class="add-and-search mt20">
            <el-button
                type="primary"
                icon="el-icon-plus"
                size="small"
                @click="handleShowCreateMember()"
            >
                添加受益人
            </el-button>
        </div>


        <el-table
            class="mt20 mb20"
            stripe
            size="small"
            :data="resData"
            row-key="id"
            border>
            <el-table-column 
                prop="personName" 
                label="昵称" 
                min-width="100"
            ></el-table-column>
            <el-table-column 
                prop="percent" 
                label="提点" 
                min-width="100"
            >
                <template slot-scope="scope">
                    <el-tag 
                        type="primary"
                        effect="plain">
                        {{ handleAccMul(scope.row.percent) }} %
                    </el-tag>
                </template>
            </el-table-column>
            <el-table-column 
                prop="beginTime" 
                label="操作" 
                min-width="100"
            >
                <template slot-scope="scope">
                    <el-button
                        type="primary"
                        plain
                        size="mini"
                        @click="handleShowCreateMember(scope.row, scope.$index)"
                    >
                        编辑
                    </el-button>
                    <el-popconfirm
                        confirm-button-text='删除'
                        cancel-button-text='取消'
                        icon="el-icon-info"
                        icon-color="red"
                        title="此操作将删除此用户, 是否继续?"
                        @confirm="handleDelete(scope.row.id, scope.$index)"
                    >
                        <el-button 
                            plain
                            type="danger" 
                            slot="reference"
                            size="mini"
                        >
                            删除
                        </el-button>
                    </el-popconfirm>
                </template>
            </el-table-column>
        </el-table>  

        <!-- 添加受益人 -->
        <create-beneficiary 
            ref="createBeneficiary"
            @addSuccess="addSuccess"
        ></create-beneficiary>

    </div>
</template>

<script>
import { projectBeneficiaryDelete } from '@/api/project'
import { accMul } from '@/utils/index'
import CreateBeneficiary from './components/CreateBeneficiary'

export default {
    components: { 
        CreateBeneficiary
    },
    data(){
        return {
            project: {},
            resData: [],
            params: {}
        }
    },
    mounted() {
        let { displayName, description, clientName, publishedBeneficiaries } = this.$store.state.user.projectDetail
        this.project = {
            displayName,
            description,
            clientName
        }
        this.resData = publishedBeneficiaries
    },
    methods: {
        // 显示添加受益人窗口
        handleShowCreateMember(data, index){
            this.$refs.createBeneficiary.showAddBeneficiaryDialog(data, index)
        },

        // 添加项目受益人
        addSuccess(data){
            if(this.resData[data.index]){
                this.$set(this.resData, data.index, data)
            }else{
                this.resData.push(data)
            }
        },

        // 删除项目受益人
        handleDelete(id, index){
            projectBeneficiaryDelete(id, index).then(res => {
                if(res.code === this.$successCode){
                    this.$message.success('删除成功~')
                    this.resData.splice(index, 1)
                }
            })
        },

        handleAccMul(val){
            return accMul(val, 100)
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