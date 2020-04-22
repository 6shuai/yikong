<template>
    <el-card shadow="never">
        <div slot="header" class="clearfix">
            权限管理
        </div>
        <div class="top-operation-wrap">
            <el-button size="small" type="primary" @click="addAuthDialog=true">添加权限</el-button>
        </div>
        <el-table
            v-loading="tLoading"
            :data="treeData"
            style="width: 100%;margin-bottom: 20px;"
            row-key="id"
            border
            :row-key="getRowKeys"
            :expand-row-keys="expandRowKeys"
            :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
            <el-table-column
                prop="displayName"
                label="菜单"
                min-width="180">
            </el-table-column>
            <el-table-column
                prop="moduleName"
                label="模块"
                min-width="180">
            </el-table-column>
            <el-table-column
                prop="requestUrl"
                label="请求路由"
                min-width="180">
            </el-table-column>
            <el-table-column
                prop="route"
                label="前端路由"
                min-width="180">
            </el-table-column>
            <el-table-column
                label="是否启用"
                min-width="180">
                <template slot-scope="scope">
                    <span v-if="scope.row.enabled">是</span>
                    <span v-else>否</span>
                </template>
            </el-table-column>
            <el-table-column
                label="操作"
                min-width="180">
                <template slot-scope="scope">
                    <el-button 
                        size="mini"
                        type="success"
                        @click="editAuth(scope.row)"
                    >
                        编辑
                    </el-button>
                    <el-popover
                        placement="top"
                        :ref="scope.row.id"
                        width="200">
                        <p>此操作将永久删除权限：【{{scope.row.displayName}}】, 是否继续?</p>
                        <div style="text-align: right; margin: 0">
                            <el-button size="mini" type="text" @click="$refs[scope.row.id].doClose()">取消</el-button>
                            <el-button type="primary" size="mini" @click="delCurrentAuth(scope.row.id)">确定</el-button>
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

        <!-- 添加权限 -->
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

    </el-card>
</template>
<script>
import { createdMenuAuth, eidtMenuAuth, getAuthList, delMenuAuth } from '@/api/user';
export default {
    data(){
        return {
            tLoading: false,
            expandRowKeys: ['1'],       //默认展开第一个
            treeData: [],
            authList: [],             //所有权限列表
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
            getRowKeys(row) {
                return row.id;
            },
        }
    },
    created() {
        this.init();
    },
    methods: {
        //加载权限列表 table
        init(){
            this.tLoading = true;
            getAuthList().then(res => {
                this.tLoading = false;
                this.treeData = [];
                this.authList = res.obj;
                for (let i = 0; i < res.obj.length; i++) {
                    this.addRecordToTree(this.treeData, res.obj[i]);
                }
            })
        },

        // 把一个数据库记录，添加到树应该有的位置
        addRecordToTree(treeRoot, record) {
            // 先构造树节点：
            let treeNode = {
                id: record.id,
                displayName: record.displayName,
                moduleName: record.moduleName, 
                route: record.route, 
                parentID: record.parentID, 
                enabled: record.enabled, 
                requestUrl: record.requestUrl,
                children: []
            };

            // 添加总根
            if (treeRoot.length == 0) {
                // 直接添加
                treeRoot.push(treeNode);
            } else {
                let parentNode = this.findNode(treeRoot[0], treeNode.parentID);
                if (parentNode != null) {
                    parentNode.children.push(treeNode);
                } else {
                    console.log("为毛找不到父节点？？？");
                }
            }
        },

        // 查找父节点
        findNode(fromNode, nodeID) {
            if (fromNode == null) {
                return null;
            }
            if (fromNode.id == nodeID) {
                return fromNode;
            } else {
                if (fromNode.children == null) {
                    return null;
                } else {
                    // 从自己子节点找
                    for (let i = 0; i < fromNode.children.length; i++) {
                        let foundNode = this.findNode(fromNode.children[i], nodeID);
                        if (foundNode != null) {
                            return foundNode;
                        }
                    }

                    return null;
                }
            }
        }, 

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
                this.init();
                this.handleClose();
                this.$message.success(res.message);
            }
        },

        //删除
        delCurrentAuth(id){
            delMenuAuth(id).then(res => {
                this.$refs[id].doClose()
                if(res.code === this.$successCode){
                    this.init();
                    this.$message.success(res.message);
                }
            })
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