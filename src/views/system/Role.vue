<template>
    <el-card shadow="never">
        <div slot="header" class="clearfix">
            角色管理
        </div>
        <div class="top-operation-wrap">
            <el-button size="small" type="primary" @click="addRoleDialog=true;addParams={}">添加角色</el-button>
        </div>
        <el-table
            v-loading="tLoading"
            :data="resData"
            style="width: 100%;margin-bottom: 20px;"
            row-key="id"
            border>
            <el-table-column
                prop="displayName"
                label="角色名称"
                min-width="180">
            </el-table-column>
            <el-table-column
                prop="name"
                label="角色标识"
                min-width="180">
            </el-table-column>
            <el-table-column
                label="操作"
                min-width="180">
                <template slot-scope="scope">
                    <el-button 
                        size="mini"
                        type="success"
                        @click="editRole(scope.row)"
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
                        <p>此操作将永久删除此角色【{{scope.row.displayName}}】, 是否继续?</p>
                        <div style="text-align: right; margin: 0">
                            <el-button size="mini" type="text" @click="$refs[scope.row.id].doClose()">取消</el-button>
                            <el-button type="primary" size="mini" @click="delCurrentRole(scope.row.id)">确定</el-button>
                        </div>
                        <el-button 
                            size="mini"
                            type="danger"
                            slot="reference"
                        >
                            删除
                        </el-button>
                    </el-popover>
                </template>
            </el-table-column>
        </el-table>

        <!-- 添加角色 -->
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
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addRoleDialog=false">取 消</el-button>
                <el-button type="primary" :loading="addBtnLoading" @click="addRoleSureBtn">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 角色授权 -->
        <el-dialog
            title="角色权限"
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
</template>

<script>
import { getRoleList, roleCreated, roleUpdate, roleDelete, roleAllAuthList, currentRoleAuthList, roleAuthUpdate } from '@/api/user';
export default {
    data(){
        return {
            resData: [],
            tLoading: false,
            addRoleDialog: false,     //添加角色 modal
            addParams: {},            //添加角色参数
            addBtnLoading: false,     //添加按钮 loading
            roleAutDialog: false,     //角色权限 modal
            defaultProps: {
                children: 'children',
                label: 'displayName'
            },
            authorities: [],
            selectedAuthority: [],
            roleListLoading: false,    //加载选中的角色权限列表
            currentRoleId: null,       //当前角色id
            updateBtnLoading: false,
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
            getRoleList().then(res => {
                this.tLoading = false;
                if(res.code === this.$successCode){
                    this.resData = res.obj;
                }
            })
        },

        //添加 编辑  角色
        addRoleSureBtn(){
            if(!this.addParams.displayName){
                this.$message.warning('请填写角色名称~');
                return
            }else if(!this.addParams.name){
                this.$message.warning('请填写角色标识~');
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
                this.init();
                this.$message.success(res.message);
            }
        },

        //编辑权限
        editRole(row){
            this.addParams = JSON.parse(JSON.stringify(row));
            this.addRoleDialog = true;
        },

        //删除角色
        delCurrentRole(id){
            roleDelete(id).then(res => {
                 this.$refs[id].doClose()
                if(res.code === this.$successCode){
                    this.init();
                    this.$message.success(res.message);
                }
            })
        },

        //加载权限列表
        initAuthList(){
            roleAllAuthList().then(res => {
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
            currentRoleAuthList(id).then(res => {
                this.roleListLoading = false;
                if(res.code === this.$successCode){
                    this.selectedAuthority = res.obj;
                }
            })
        },

        //更新权限
        updateRoleSureBtn(){
            let data = `?rid=${this.currentRoleId}`;
            let selectedKeys = this.$refs.menu.getCheckedKeys(true);
            selectedKeys.forEach(key => {
                data += '&aid=' + key;
            })
            this.updateBtnLoading = true;
            roleAuthUpdate(data).then(res => {
                this.updateBtnLoading = false;
                if(res.code === this.$successCode){
                    this.$message.success(res.message);
                    this.roleAutDialog = false;
                }
            })
        }

    },
}
</script>