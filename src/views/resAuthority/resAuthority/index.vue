<template>
    <div class="template-card">
        <el-card shadow="never">
            <div slot="header" class="clearfix">内容权限</div>
            <div class="top-operation-wrap">
                <el-button
                    size="small"
                    type="primary"
                    icon="el-icon-plus"
                    @click="$refs.addAuth.addAuthDialog = true"
                    >添加内容权限</el-button
                >
            </div>
            <el-table
                v-loading="tLoading"
                :data="treeData"
                stripe
                style="width: 100%; margin-bottom: 20px"
                row-key="id"
                border
                size="small"
                :tree-props="{
                    children: 'children',
                    hasChildren: 'hasChildren',
                }"
            >
                <el-table-column
                    prop="displayName"
                    label="名称"
                    min-width="180"
                >
                </el-table-column>
                <el-table-column
                    prop="description"
                    label="描述"
                    min-width="180"
                >
                </el-table-column>
                <el-table-column label="操作" min-width="180">
                    <template slot-scope="scope">
                        <el-button
                            size="mini"
                            type="success"
                            @click="$refs.addAuth.editAuth(scope.row)"
                        >
                            编辑
                        </el-button>
                        <el-popover
                            placement="top"
                            :ref="scope.row.id"
                            width="200"
                        >
                            <p>
                                此操作将永久删除权限：【{{
                                    scope.row.displayName
                                }}】, 是否继续?
                            </p>
                            <div style="text-align: right; margin: 0">
                                <el-button
                                    size="mini"
                                    type="text"
                                    @click="$refs[scope.row.id].doClose()"
                                    >取消</el-button
                                >
                                <el-button
                                    type="primary"
                                    size="mini"
                                    @click="delCurrentAuth(scope.row.id)"
                                    >确定</el-button
                                >
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
        </el-card>

        <!-- 添加 编辑权限 -->
        <add-auth :authList="authList" ref="addAuth"></add-auth>
    </div>
</template>
<script>
import {
    resAuthorityList,
    resAuthorityDelete,
    resAuthorityParentList,
} from "@/api/resAuthority";
import AddAuth from "./components/AddAuthority";
export default {
    data() {
        return {
            tLoading: false,
            treeData: [],
            authList: [],
        };
    },
    created() {
        this.init();
        this.parentAuthList();
    },
    methods: {
        //加载权限列表 table
        init() {
            this.tLoading = true;
            resAuthorityList().then((res) => {
                if (res.code === this.$successCode) {
                    this.tLoading = false;
                    this.treeData = res.obj;
                }
            });
        },

        //删除
        delCurrentAuth(id) {
            resAuthorityDelete(id).then((res) => {
                this.$refs[id].doClose();
                if (res.code === this.$successCode) {
                    this.init();
                    this.$message.success(res.message);
                }
            });
        },

        //父权限列表
        parentAuthList() {
            resAuthorityParentList().then((res) => {
                if (res.code === this.$successCode) {
                    this.authList = res.obj;
                }
            });
        },
    },
    components: {
        AddAuth,
    },
};
</script>