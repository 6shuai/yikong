<template>
    <el-dialog
        :title="addParams.id ? '编辑基础角色' : '添加基础角色'"
        :visible.sync="addRoleDialog"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        width="500px">
        <el-form 
            label-width="80px"
            ref="addRoleForm"
            :model="addParams"
            :rules="roleRules"
        >
            <el-form-item label="角色" prop="roleId">
                <el-select v-model="addParams.roleId" placeholder="请选择角色" style="width:100%">
                    <el-option 
                        v-for="item in roleData" 
                        :key="item.id" 
                        :label="item.displayName" 
                        :value="item.id"
                    ></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="角色类型" prop="roleType">
                <el-select v-model="addParams.roleType" placeholder="请选择组织类型" style="width:100%">
                    <el-option 
                        v-for="item in roleTypeData" 
                        :key="item.id" 
                        :label="item.label" 
                        :value="item.id"
                    ></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="组织类型" prop="organizationTypeId">
                <el-select v-model="addParams.organizationTypeId" placeholder="请选择组织类型" style="width:100%">
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
import { organizationType } from '@/api/user';
import { roleList, basicRoleCreated } from '@/api/basicRole';
export default {
    data(){
        return {
            addRoleDialog: false,     //添加角色 modal
            addParams: {},            //添加角色参数
            addBtnLoading: false,     //添加按钮 loading
            groupTypeList: [],
            roleData: [],
            roleTypeData: [
                {
                    id: 0,
                    label: '基础角色'
                },
                {
                    id: 1,
                    label: '组织管理员角色'
                }
            ],
            roleRules: {
                roleId: [{ required: true, trigger: "blur", message: "请选择角色~" }],
                roleType: [{ required: true, trigger: "blur", message: "请选择角色类型~" }],
                organizationTypeId: [{ required: true, trigger: "blur", message: "请选择组织类型~" }]
            },
        }
    },
    methods: {
        roleList(){
            roleList().then(res =>{
                this.roleData = res.obj;
            })
        },

        //添加 编辑  角色
        addRoleSureBtn(){            
            this.$refs.addRoleForm.validate((valid) => {
                if (valid) {
                    this.addBtnLoading = true;
        
                    basicRoleCreated(this.addParams).then(res => {
                        this.addBtnLoading = false;
                        if(res.code === this.$successCode){
                            this.addRoleDialog = false;
                            this.$message.success('操作成功~');
                        }
                    })
                }
            });
        },

        //显示模态框
        showDialog(row){
            this.addParams = JSON.parse(JSON.stringify(row));
            this.addRoleDialog = true;
            this.initGroupTypeList();
            this.roleList();
            this.$nextTick(() => {
                this.$refs['addRoleForm'].clearValidate();
            })
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