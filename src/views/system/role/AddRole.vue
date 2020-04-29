<template>
    <el-dialog
        :title="addParams.id ? '编辑角色' : '添加角色'"
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
            <el-form-item label="角色标识">
                <el-input type="textarea" :rows="2" v-model="addParams.name"></el-input>
            </el-form-item>
            <el-form-item label="组织类型">
                <el-select v-model="addParams.organizationType" placeholder="请选择组织类型" style="width:100%">
                    <el-option 
                        v-for="item in groupTypeList" 
                        :key="item.id" 
                        :label="item.displayName" 
                        :value="item.id"
                    ></el-option>
                </el-select>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="addRoleDialog=false">取 消</el-button>
            <el-button type="primary" :loading="addBtnLoading" @click="addRoleSureBtn">确 定</el-button>
        </span>
    </el-dialog>

</template>

<script>
import { roleCreated, roleUpdate, organizationType } from '@/api/user';
export default {
    data(){
        return {
            addRoleDialog: false,     //添加角色 modal
            addParams: {},            //添加角色参数
            addBtnLoading: false,     //添加按钮 loading
            groupTypeList: [],
        }
    },
    created() {
        this.initGroupTypeList();
    },
    methods: {
        //添加 编辑  角色
        addRoleSureBtn(){
            if(!this.addParams.displayName){
                this.$message.warning('请填写角色名称~');
                return
            }else if(!this.addParams.name){
                this.$message.warning('请填写角色标识~');
                return
            }else if(!this.addParams.organizationType){
                this.$message.warning('请选择组织类型~');
                return
            }
            this.addBtnLoading = true;
            if(!this.addParams.id){
                //添加角色
                roleCreated(this.addParams).then(res => {
                    this.roleRes(res);
                })
            }else{
                //更新角色
                roleUpdate(this.addParams).then(res => {
                    this.roleRes(res);
                })
            }
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

        //组织类型列表
        initGroupTypeList(){
            organizationType(null).then(res => {
                this.groupTypeList = res.obj;
            })
        }

    }
}
</script>