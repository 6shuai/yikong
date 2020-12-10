<template>
    <div class="template-card">
        <el-card shadow="never">
            <div slot="header" class="clearfix">
                权限管理
            </div>
            <div 
                class="top-operation-wrap">
                <el-button 
                    size="small" 
                    type="primary" 
                    icon="el-icon-plus" 
                    @click="$refs.addAuth.addAuthDialog=true"
                >添加权限</el-button>
            </div>
            <el-table
                v-loading="tLoading"
                :data="treeData"
                stripe
                style="width: 100%;margin-bottom: 20px;"
                row-key="id"
                border
                size="small"
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
                            @click="$refs.addAuth.editAuth(scope.row)"
                            :disabled="scope.row.id===1"
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
                                :disabled="scope.row.id===1"
                            >
                                删除
                            </el-button>
                        </el-popover>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>

        <!-- 添加 编辑权限 -->
        <add-auth :authList="authList" ref="addAuth"></add-auth>
    </div>
</template>
<script>
import { getAuthList, delMenuAuth } from '@/api/user';
import AddAuth  from './AddAuth';
export default {
    data(){
        return {
            tLoading: false,
            expandRowKeys: ['1'],       //默认展开第一个
            treeData: [],
            authList: [],              
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

        //删除
        delCurrentAuth(id){
            delMenuAuth(id).then(res => {
                this.$refs[id].doClose()
                if(res.code === this.$successCode){
                    this.init();
                    this.$message.success(res.message);
                }
            })
        }
    },
    components:{
        AddAuth
    }
}
</script>