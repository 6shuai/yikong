<template>
    <el-dialog
        :title="addParams.id ? '编辑主页' : '添加主页'"
        :visible.sync="showHomePageCreate"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        width="500px">
        <el-form 
            label-width="80px"
            ref="addRoleForm"
            :model="addParams"
            :rules="roleRules"
        >
            <el-form-item label="主页名称" prop="displayName">
                <el-input v-model="addParams.displayName"></el-input>
            </el-form-item>
            <el-form-item label="主页路由" prop="frontRoute">
                <el-input v-model="addParams.frontRoute"></el-input>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="showHomePageCreate=false">取 消</el-button>
            <el-button type="primary" :loading="addBtnLoading" @click="addRoleSureBtn">确 定</el-button>
        </span>
    </el-dialog>

</template>

<script>
import { homePageCreate } from '@/api/basicRole'

export default {
    data(){
        return {
            showHomePageCreate: false,     
            addParams: {},           
            addBtnLoading: false,
            roleRules: {
                displayName: [{ required: true, trigger: "blur", message: "请输入主页名称~" }],
                frontRoute: [{ required: true, trigger: "blur", message: "请选择输入主页路由~" }]
            },
        }
    },
    methods: {
        //显示模态框
        showDialog(data){
            this.addParams = JSON.parse(JSON.stringify(data))
            this.showHomePageCreate = true
            this.$nextTick(() => {
                this.$refs['addRoleForm'].clearValidate()
            })
        },

        //添加 编辑  角色
        addRoleSureBtn(){            
            this.$refs.addRoleForm.validate((valid) => {
                if (valid) {
                    this.addBtnLoading = true
        
                    homePageCreate(this.addParams).then(res => {
                        this.addBtnLoading = false
                        if(res.code === this.$successCode){
                            this.showHomePageCreate = false
                            this.$message.success('操作成功~')
                            this.$parent.init()
                        }
                    })
                }
            })
        }

    }
}
</script>