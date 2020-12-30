<template>
    <div class="template-card">
        <el-card shadow="never">
            <div slot="header" class="clearfix">
                基础角色管理
            </div>
            <div class="top-operation-wrap">
                <el-button size="small" type="primary" icon="el-icon-plus" @click="$refs.addRole.showDialog({})">添加基础角色</el-button>
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
                    prop="roleName"
                    label="角色名称"
                    min-width="180">
                </el-table-column>
                <el-table-column
                    prop="organizationTypeName"
                    label="组织类型名称"
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
                        <el-popover
                            style="margin-left:10px"
                            placement="top"
                            :ref="scope.row.id"
                            width="200">
                            <p>此操作将删除此基础角色【{{scope.row.roleName}}】, 是否继续?</p>
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

            <el-pagination
                background
                layout="total, prev, pager, next, sizes"
                :page-sizes="[40, 80, 100]"
                :current-page="Number(params.pageNo)"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :total="totalCount">
            </el-pagination>

        </el-card>

        <!-- 添加  编辑  角色 -->
        <add-role 
            ref="addRole"
            @addRoleSuccess="init()"
        ></add-role>
    </div>
</template>

<script>
import { basicRoleList, basicRoleDelete } from '@/api/basicRole';
import AddRole from './AddRole';
export default {
    data(){
        return {
            resData: [],
            tLoading: false,
            params: {
                pageNo: 1,
                pageSize: 40
            },
            totalCount: 0
        }
    },
    created() {
        this.init();
    },
    methods: {
        //初始化角色列表
        init(){
            this.tLoading = true;
            basicRoleList(this.params).then(res => {
                this.tLoading = false;
                if(res.code === this.$successCode){
                    this.resData = res.obj.list;
                    this.totalCount = res.obj.totalRecords;
                }
            })
        },

        //删除角色
        delCurrentRole(id){
            basicRoleDelete(id).then(res => {
                this.$refs[id].doClose()
                if(res.code === this.$successCode){
                    this.init();
                    this.$message.success(res.message);
                }
            })
        },

        //分页、
        handleCurrentChange(page){
            this.params.page = page;
            this.init();
        },

        //每页条数
        handleSizeChange(size){
            this.params.pageSize = size;
            this.init();
        }

    },
    components: {
        AddRole
    }
}
</script>