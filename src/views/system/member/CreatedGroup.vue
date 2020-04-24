<template>
    <!-- 新建组织 -->
    <el-dialog
        title="新建组织"
        :visible.sync="addGroupDialog"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        width="500px">
        <el-form 
            label-width="80px"
        >
            <el-form-item label="组织名称">
                <el-input v-model="addParams.displayName"></el-input>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="addGroupDialog=false">取 消</el-button>
            <el-button type="primary" :loading="addBtnLoading" @click="addGroupSureBtn">确 定</el-button>
        </span>
    </el-dialog>
</template>
<script>
import { organizationCreated } from '@/api/user';
export default {
    data(){
        return {
            addParams:{}, 
            addGroupDialog: false,      //添加组织modal
            addBtnLoading: false,       //添加按钮loading
        }
    },
    methods: {
        //showdialog
        showDialog(){
            this.addParams = {};
            this.addGroupDialog = true;
        },

        //添加组织
        addGroupSureBtn(){
            if(!this.addParams.displayName){
                this.$message.warning('请填写组织名称~');
                return
            }
            
            this.addBtnLoading = true;
            this.addParams.owner = this.$store.state.user.loginData.id;
            organizationCreated(this.addParams).then(res => {
                this.addBtnLoading = false;
                if(res.code === this.$successCode){
                    this.$message.success('添加成功~');
                    this.addGroupDialog = false;
                    this.$parent.searchGroupInfo();
                }
            })
        },
    },
}
</script>