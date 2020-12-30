<template>
    <!-- 创建群 -->
    <el-dialog
        :title="groupParams.id ? '编辑权限群组' : '新建权限群组'"
        :visible.sync="addGroupDialog"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        width="500px">
        <el-form 
            label-width="80px"
            ref="groupForm"
            :model="groupParams"
            :rules="groupRules"
            v-loading="loading"
        >
            <el-form-item label="群组名称" prop="displayName">
                <el-input placeholder="群组名称" v-model="groupParams.displayName"></el-input>
            </el-form-item>
            <el-form-item label="说明">
                <el-input 
                    placeholder="说明" 
                    type="textarea" 
                    :rows="3" 
                    v-model="groupParams.description"
                ></el-input>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="addGroupDialog=false">取 消</el-button>
            <el-button type="primary" :loading="addBtnLoading" @click="addGroupSureBtn">确 定</el-button>
        </span>
    </el-dialog>
</template>

<script>
import { groupCreated } from '@/api/group';

export default {
    data(){
        return {
            groupParams:{}, 
            addGroupDialog: false,      
            addBtnLoading: false,   
            groupRules: {
                displayName: [{ required: true, trigger: "blur", message: '请输入群组名称~' }]
            },
            loading: false
        }
    },
    methods: {
        //显示创建群 模态框
        showDialog(data){
            this.groupParams = data || {};
            this.addGroupDialog = true;
            this.$nextTick(() => {
                this.$refs['groupForm'].clearValidate();
            })
        },

        //创建或修改 品牌组织
        addGroupSureBtn(){
            this.$refs.groupForm.validate((valid) => {
                if (valid) {
                    this.addBtnLoading = true;
                    groupCreated(this.groupParams).then(res => {
                        this.addBtnLoading = false;
                        if(res.code === this.$successCode){
                            this.$message.success(this.groupParams.id ? '编辑成功~' : '创建成功~');
                            this.addGroupDialog = false;
                            this.$emit('groupCreateSuccess');
                        }
                    })
                }
            })
        }

    }
}
</script>