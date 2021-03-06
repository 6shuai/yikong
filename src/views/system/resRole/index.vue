<template>
    <div class="template-card">
        <el-card shadow="never">
            <div slot="header" class="clearfix">
                内容角色管理
            </div>
            <div class="top-operation-wrap">
                <el-button size="small" type="primary" icon="el-icon-plus" @click="$refs.addRole.showDialog({})">添加内容角色</el-button>
            </div>
            <el-table
                v-loading="tLoading"
                :data="resData"
                stripe
                style="width: 100%;margin-bottom: 20px;"
                size="small"
                row-key="id"
                border>
                <el-table-column
                    prop="id"
                    label="ID"
                    width="60">
                </el-table-column>
                <el-table-column
                    prop="displayName"
                    label="内容角色名称"
                    min-width="180">
                </el-table-column>
                <el-table-column
                    label="操作"
                    min-width="220">
                    <template slot-scope="scope">
                        <el-button 
                            size="mini"
                            type="success"
                            @click="$refs.addRole.showDialog(scope.row)"
                        >
                            编辑
                        </el-button>
                        <el-button 
                            size="mini"
                            type="primary"
                            @click="showRoleAuthModal(scope.row.id)"
                        >
                            授权
                        </el-button>
                        <el-popover
                            style="margin-left:10px"
                            placement="top"
                            :ref="scope.row.id"
                            width="200">
                            <p>此操作将永久删除此内容角色【{{scope.row.displayName}}】, 是否继续?</p>
                            <div style="text-align: right; margin: 0">
                                <el-button size="mini" type="text" @click="$refs[scope.row.id].doClose()">取消</el-button>
                                <el-button type="primary" size="mini" @click="delCurrentRole(scope.row.id)">确定</el-button>
                            </div>
                            <el-button 
                                size="mini"
                                type="danger"
                                slot="reference"
                                :disabled="scope.row.id===1"
                            >
                                删除
                            </el-button>
                        </el-popover>
                    </template>
                </el-table-column>
            </el-table>

            <!-- 角色授权 -->
            <el-dialog
                title="内容角色权限"
                :visible.sync="roleAutDialog"
                :close-on-click-modal="false"
                :close-on-press-escape="false"
                width="500px">
                <div v-loading="roleListLoading">
                    <el-tree
                        ref="menu"
                        :data="authorities"
                        show-checkbox
                        accordion
                        node-key="id"
                        highlight-current
                        :default-expand-all="true"
                        :default-checked-keys="selectedAuthority"
                        :props="defaultProps">
                    </el-tree>
                </div>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="roleAutDialog=false">取 消</el-button>
                    <el-button type="primary" :loading="updateBtnLoading" @click="updateRoleSureBtn">确 定</el-button>
                </span>
            </el-dialog>

        </el-card>

        <!-- 添加  编辑  角色 -->
        <add-res-role ref="addRole"></add-res-role>
    </div>
</template>

<script>
import { resRoleList, resRoleDelete, resRoleAuthorityList, resRoleAuthority, resRoleAuthorityCreated } from '@/api/resRole';
import AddResRole from './components/AddResRole';
export default {
    data(){
        return {
            resData: [],
            tLoading: false,
            defaultProps: {
                children: 'children',
                label: 'description'
            },
            authorities: [],
            selectedAuthority: [],
            roleAutDialog: false,     //角色权限 modal
            roleListLoading: false,    //加载选中的角色权限列表
            currentRoleId: null,       //当前角色id
            updateBtnLoading: false
        }
    },
    created() {
        this.init();
        this.initAuthList();
    },
    methods: {
        //初始化角色列表
        init(){
            this.tLoading = true;
            resRoleList().then(res => {
                this.tLoading = false;
                if(res.code === this.$successCode){
                    this.resData = res.obj;
                }
            })
        },

        //删除角色
        delCurrentRole(id){
            resRoleDelete(id).then(res => {
                 this.$refs[id].doClose()
                if(res.code === this.$successCode){
                    this.init();
                    this.$message.success(res.message);
                }
            })
        },

        //加载权限列表
        initAuthList(){
            resRoleAuthorityList().then(res => {
                if(res.code === this.$successCode){
                    this.authorities = res.obj;
                }
            })
        },

        //显示当前选中的角色权限
        showRoleAuthModal(id){
            this.roleAutDialog = true;
            this.roleListLoading = true;
            this.currentRoleId = id;
            if(this.selectedAuthority.length) this.$refs.menu.setCheckedKeys([])
            resRoleAuthority({resourceRoleId: id}).then(res => {
                this.roleListLoading = false;
                if(res.code === this.$successCode){
                    let spliceIndex = res.obj.indexOf(1);
                    if(spliceIndex){
                        res.obj.splice(spliceIndex, res.obj.length-1);
                    }
                    this.selectedAuthority = res.obj;
                }
            })
        },

        //更新权限
        updateRoleSureBtn(){
            let data = `?resourceRoleId=${this.currentRoleId}`;
            let halfKeys = this.$refs.menu.getHalfCheckedKeys();
            let selectedKeys = this.$refs.menu.getCheckedKeys(false).concat(halfKeys);
            
            selectedKeys.forEach(key => {
                data += '&authorityIds=' + key;
            })
            this.updateBtnLoading = true;
            resRoleAuthorityCreated(data).then(res => {
                this.updateBtnLoading = false;
                if(res.code === this.$successCode){
                    this.$message.success(res.message);
                    this.roleAutDialog = false;
                }
            })
        }

    },
    components: {
        AddResRole
    }
}
</script>