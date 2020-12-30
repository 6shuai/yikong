<template>
    <!-- 操作权限授权 -->
    <el-dialog
        class="res-auth-group-list"
        title="资源所属权限群组列表"
        :visible.sync="dialogVisible"
        width="1200px"
    >   
        <el-button
            type="primary"
            size="small"
            icon="el-icon-plus"
            @click="$refs.addGroup.showAddGroup(groupIds)"
        >
            添加权限群组
        </el-button>

        <el-table
            ref="multipleTable"
            :data="tableData"
            tooltip-effect="dark"
            v-loading="tableLoading"
            border
            stripe>
            <el-table-column
                label="权限群组名称"
                prop="groupName"
                min-width="150">
            </el-table-column>
            <el-table-column
                label="群组说明"
                prop="description"
                min-width="200">
            </el-table-column>
            <el-table-column
                label="操作"
                prop="description"
                min-width="80">
                <template slot-scope="scope">
                    <el-popover
                        v-if="tableData.length>1"
                        style="margin-left: 10px"
                        placement="top"
                        :ref="scope.row.id"
                        width="200"
                    >
                        <p>
                            此操作将删除【{{ scope.row.groupName }}】,
                            是否继续?
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
                                @click="handleDelete(scope.row.id, scope.$index)"
                                >确定</el-button
                            >
                        </div>
                        <el-button slot="reference" type="info" size="mini">删除</el-button>
                    </el-popover>
                </template>
            </el-table-column>
        </el-table>

        <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">关 闭</el-button>
        </span>

        <!-- 添加权限群组 -->
        <add-group
            ref="addGroup"
            :updateGroup="premissionApi"
            :resParams="params"
            @updateSuccess="init"
        ></add-group>

    </el-dialog>
</template>

<script>
import AddGroup from './AddGroup';

export default {
    props: ['premissionApi'],
    data() {
        return {
            dialogVisible: false,
            tableLoading: false,
            tableData: [],
            groupIds: [],
            params: {}
        };
    },
    methods: {
        showPermission(params) {
            this.dialogVisible = true;
            this.params = {
                ...params
            }
            
            if(this.premissionApi.list){
                this.init();
            }
        },

        init(){
            this.tableLoading = true;
            this.premissionApi.list(this.params).then(res => {
                this.tableLoading = false;
                if(res.code === this.$successCode){
                    this.tableData = res.obj;
                    this.findGroupIds();
                }
            })
        },

        //查找已添加的权限组 id
        findGroupIds(){
            this.groupIds = [];
            this.tableData.forEach((item) => {
                this.groupIds.push(item.groupId);
            })
        },

        //删除
        handleDelete(id, index){
            this.premissionApi.delete(`?id=${id}`).then(res => {
                this.$refs[id].doClose()
                if(res.code === this.$successCode){
                    this.$message.success('删除成功~');
                    this.tableData.splice(index, 1);
                    this.findGroupIds();
                }
            })
        }, 

        //页码
        handleCurrentChange(page){
            this.params.pageNo = page;
        },

        //每页条数
        handleSizeChange(size){
            this.params.pageSize = size;
        },
    },
    components: {
        AddGroup
    }
};
</script>

<style lang="scss" scope>
    .res-auth-group-list{
        .el-table{
            width: 100%;
            margin-top: 10px;
        }
    }
</style>