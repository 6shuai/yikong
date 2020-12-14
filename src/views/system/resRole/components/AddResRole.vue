<template>
    <el-dialog
        :title="addParams.id ? '编辑资源角色' : '添加资源角色'"
        :visible.sync="addRoleDialog"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        width="500px">
        <el-form 
            label-width="80px"
        >
            <el-form-item label="角色名称">
                <el-input v-model="addParams.displayName"></el-input>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="addRoleDialog=false">取 消</el-button>
            <el-button type="primary" :loading="addBtnLoading" @click="addRoleSureBtn">确 定</el-button>
        </span>
    </el-dialog>

</template>

<script>
import { resRoleCreated } from '@/api/resRole';
export default {
    data(){
        return {
            addRoleDialog: false,     //添加角色 modal
            addParams: {},            //添加角色参数
            addBtnLoading: false,     //添加按钮 loading
        }
    },
    methods: {
        //添加 编辑  角色
        addRoleSureBtn(){
            if(!this.addParams.displayName){
                this.$message.warning('请填写角色名称~');
                return
            }
            this.addBtnLoading = true;
            resRoleCreated(this.addParams).then(res => {
                this.roleRes(res);
            })
        },

        roleRes(res){
            this.addRoleDialog = false;
            this.addBtnLoading = false;
            if(res.code === this.$successCode){
                this.$parent.init();
                this.$message.success(res.message);
            }
        },

        //显示模态框
        showDialog(row){
            this.addParams = JSON.parse(JSON.stringify(row));
            this.addRoleDialog = true;
        },

    }
}
</script>