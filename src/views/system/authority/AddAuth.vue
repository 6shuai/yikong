<template>
    <!-- 添加权限 编辑权限 -->
    <el-dialog
        :title="addParams.id ? '编辑权限' : '添加权限'"
        :visible.sync="addAuthDialog"
        :before-close="handleClose"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        width="500px">
        <el-form 
            label-width="80px"
            :rules="addRules"
            ref="addParams"
            :model="addParams"
        >
            <el-form-item label="父权限" prop="parentID">
                <el-select v-model="addParams.parentID" placeholder="请选择父权限">
                    <el-option v-for="item in authList" :label="item.displayName" :key="item.id" :value="item.id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="权限名" prop="displayName">
                <el-input v-model="addParams.displayName"></el-input>
            </el-form-item>
            <el-form-item label="模块名" prop="moduleName">
                <el-input v-model="addParams.moduleName"></el-input>
            </el-form-item>
            <el-form-item label="请求路由" prop="requestUrl">
                <el-input v-model="addParams.requestUrl"></el-input>
            </el-form-item>
            <el-form-item label="前端路由" prop="route">
                <el-input v-model="addParams.route"></el-input>
            </el-form-item>
            <el-form-item label="是否启用">
                <el-switch v-model="addParams.enabled"></el-switch>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="handleClose">取 消</el-button>
            <el-button type="primary" :loading="addBtnLoading" @click="addAuthSureBtn">确 定</el-button>
        </span>
    </el-dialog>
</template>

<script>
import { createdMenuAuth, eidtMenuAuth } from '@/api/user';
export default {
    props: ['authList'],
    data(){
        return {
            addAuthDialog: false,     //添加权限modal
            addParams: {enabled: true},            //添加权限参数
            addBtnLoading: false,     //添加按钮 loading
            addRules: {
                parentID: [{required: true, message: '前选择父权限', trigger: 'change'}],
                displayName: [{required: true, message: '请输入权限名', trigger: 'blur'}],
                moduleName: [{required: true, message: '请输入模块名', trigger: 'blur'}],
                route: [{required: true, message: '请输入前端路由', trigger: 'blur'}],
                requestUrl: [{required: true, message: '请输入请求路由', trigger: 'blur'}],
            },
        }
    },
    methods: {
        //添加 和 更新 权限
        addAuthSureBtn(){
            this.$refs.addParams.validate((valid) => {
			    if (valid) {
                    this.addBtnLoading = true;
                    //添加权限
                    if(!this.addParams.id){
                        createdMenuAuth(this.addParams).then(res => {
                            this.authRes(res);
                        })
                    }else{
                        //更新权限
                        eidtMenuAuth(this.addParams).then(res => {
                            this.authRes(res);
                        })
                    }
                }
            })
        },

        //编辑权限
        editAuth(row){
            this.addParams = this.copyCurrentAuth(row);
            this.addAuthDialog = true;
        },

        copyCurrentAuth(data){
            let obj = JSON.parse(JSON.stringify(data));
            return obj;
        },

        //添加或编辑 权限 接口返回
        authRes(res){
            this.addAuthDialog = false;
            this.addBtnLoading = false;
            if(res.code === this.$successCode){
                this.$parent.init();
                this.handleClose();
                this.$message.success(res.message);
            }
        },

        //关掉模态框 清空验证状态
        handleClose(){
            this.$refs['addParams'].resetFields();
            this.addParams = {
                enabled: true
            }
            this.addAuthDialog = false;
        }
    },
}
</script>