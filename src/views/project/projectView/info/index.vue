<template>
    <div class="project-member-wrap">

        <div class="invoice-apply-btn">
            <el-button
                type="primary"
                size="small"
                :disabled="allowInvoicing ? false : true"
                @click="handleShowInvoiceDetail"
            >
                申请发票
            </el-button>
        </div>

        <el-descriptions 
            :column="1"
            title="项目信息"
        >
            <template slot="extra">
                <a href="javascript:;" class="edit" @click="handleShowCreateProject">编辑</a>
            </template>
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

        <!-- 编辑项目 -->
        <create-project ref="createProject" @createProjectSuccess="editSuccess"></create-project>

    </div>
</template>

<script>
import { projectBeneficiaryDelete } from '@/api/project'
import { accMul } from '@/utils/index'
import CreateBeneficiary from './components/CreateBeneficiary'
import CreateProject from '../../components/CreateProject'

export default {
    components: { 
        CreateBeneficiary,
        CreateProject
    },
    data(){
        return {
            project: {},
            resData: [],
            params: {}
        }
    },
    computed: {
        // 可开票金额
        allowInvoicing(){
            return this.$store.state.project.projectDetail.allowInvoicing
        }
    },
    mounted() {
        this.init()
    },
    methods: {
        init(){
            let { displayName, description, clientName, priceSystemName, publishedBeneficiaries, allowInvoicing } = this.$store.state.project.projectDetail
            this.project = {
                displayName,
                description,
                clientName,
                priceSystemName,
                allowInvoicing
            }
            this.resData = publishedBeneficiaries
        },

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

        // 查看发票  
        handleShowInvoiceDetail(){
            this.$router.push(`/invoiceApply?projectId=${this.$route.params.id}&clientId=${this.$store.state.project.projectDetail.client}`)
        },

        // 编辑项目
        handleShowCreateProject(){
            let { id, displayName, client, description } = this.$store.state.project.projectDetail
            let data = {
                id,
                displayName,
                client,
                description
            }
            this.$refs.createProject.showCreateProjectDialog(data)
        },

        // 编辑成功
        editSuccess(data){
            this.$store.state.project.projectDetail = {
                ...this.$store.state.project.projectDetail,
                ...data
            }
            this.init()
        },

        handleAccMul(val){
            return accMul(val, 100)
        }
    }
}
</script>

<style lang="scss">
    .project-member-wrap{
        position: relative;

        .el-image{
            width: 40px;
            height: 40px;
            border-radius: 50%;
            vertical-align: middle;
            margin-right: 10px;
        }

        .el-descriptions__header{
            justify-content: flex-start;

            a.edit{
                margin-left: 20px;
                color: var(--color-primary);
            }
        }

        .el-descriptions-item__label{
            font-weight: bold;
        }

        .invoice-apply-btn{
            position: absolute;
            top: 20px;
            right: 20px;
        }
    }
</style>