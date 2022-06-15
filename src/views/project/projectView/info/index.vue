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

        <!-- 编辑项目 -->
        <create-project ref="createProject" @createProjectSuccess="editSuccess"></create-project>

    </div>
</template>

<script>
import CreateProject from '../../components/CreateProject'

export default {
    components: { 
        CreateProject
    },
    data(){
        return {
            project: {},
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
            let { displayName, description, clientName, priceSystemName, allowInvoicing } = this.$store.state.project.projectDetail
            this.project = {
                displayName,
                description,
                clientName,
                priceSystemName,
                allowInvoicing
            }
        },

        // 查看发票  
        handleShowInvoiceDetail(){
            this.$router.push(`/invoiceApply?projectId=${this.$route.params.id}&clientId=${this.$store.state.project.projectDetail.publishedContract.firstParty}`)
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