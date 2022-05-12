<template>
    <el-dialog
        width="520px"
        :title="addParams.id ? '编辑项目' : '新建项目'"
        :visible.sync="showCreateProject"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        append-to-body
    >
        <el-form 
            label-width="80px"
            ref="addForm"
            :model="addParams"
            :rules="addParamsRules"
        >
            <el-form-item label="项目名称" prop="displayName">
                <el-input v-model="addParams.displayName" placeholder="项目名称"></el-input>
            </el-form-item>
            <!-- 客户就是品牌 -->
            <el-form-item label="投放客户" prop="client">
                <el-select 
                    v-model="addParams.client" 
                    filterable 
                    style="width: 100%"
                    placeholder="请选择客户"
                >   
                    <el-option 
                        v-for="item in groupData" 
                        :key="item.id"
                        :label="item.displayName" 
                        :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="说明">
                <el-input
                    v-model="addParams.description" 
                    type="textarea"
                    :rows="3"
                    placeholder="说明"
                ></el-input>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="showCreateProject = false">取 消</el-button>
            <el-button
                type="primary"
                :loading="createdLoading"
                @click="handleCreate"
                >确 定</el-button
            >
        </span>
    </el-dialog>
</template>

<script>
import { organizationListProject } from '@/api/user'
import { projectCreate } from '@/api/project'

export default {
    data(){
        return {
            showCreateProject: false,
            createdLoading: false,
            addParams: {},

            // 组织品牌列表
            groupData: [],

            // 表单验证
            addParamsRules: {
                displayName: [{ required: true, message: '请输入项目名称~', trigger: 'blur' }],
                client: [{ required: true, message: '请选择客户~', trigger: 'change' }],
                priceSystem: [{ required: true, message: '请选择价格体系~', trigger: 'change' }]
            }
        }
    },
    methods: {
        // 显示新建项目窗口
        showCreateProjectDialog(data = {}){
            this.addParams = JSON.parse(JSON.stringify(data))
            this.showCreateProject = true
            this.getGroupList()
            this.$nextTick(() => {
                this.$refs["addForm"].clearValidate();
            })
        },

        // 组织列表
        getGroupList(){
            organizationListProject().then(res => {
                this.groupData = res.obj
            })
        },

        // 新建项目
        handleCreate(){
            this.$refs.addForm.validate((valid) => {
                if(valid){
                    this.createdLoading = true
                    projectCreate(this.addParams).then(res => {
                        this.createdLoading = false
                        if(res.code === this.$successCode){
                            this.showCreateProject = false 
                            this.$parent.getList()
                        }
                    })
                }
            })
        }
    },
}
</script>