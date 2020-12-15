<template>
    <el-card shadow="never" class="organizations-list-wrap">
        <div slot="header" class="clearfix">
            权限群组管理
        </div>
        <div class="top-operation-wrap">
            <div class="operation-item">
                <el-button 
                    size="small" 
                    icon="el-icon-plus" 
                    type="primary" 
                    @click="$refs.createdGroup.showDialog()"
                >新建权限群组</el-button>
            </div>
            <div class="operation-item">
                <el-input 
                    size="small" 
                    v-model="params.displayName" 
                    @input="search" 
                    clearable
                    placeholder="群名称" 
                    style="width: 200px"
                ></el-input>
            </div>
        </div>
        <el-table
            v-loading="tLoading"
            size="small"
            :data="resData"
            style="width: 100%;margin-bottom: 20px;"
            row-key="id"
            border>
            <el-table-column prop="displayName" label="群组名称" min-width="80"></el-table-column>
            <el-table-column prop="description" label="说明" min-width="100"></el-table-column>
            <el-table-column
                label="操作"
                min-width="80">
                <template slot-scope="scope">
                    <el-button 
                        @click="$refs.groupDetail.showGroupDetail(scope.row.id)"
                        type="primary" 
                        size="mini"
                    >详情</el-button>
                    <el-button 
                        type="success" 
                        size="mini" 
                        @click="$refs.createdGroup.showDialog(scope.row)"
                    >编辑</el-button>
                    <el-popover
                        style="margin-left:10px"
                        placement="top"
                        :ref="scope.row.id"
                        width="200">
                        <p>此操作将删除此群组【{{scope.row.displayName}}】, 是否继续?</p>
                        <div style="text-align: right; margin: 0">
                            <el-button size="mini" type="text" @click="$refs[scope.row.id].doClose()">取消</el-button>
                            <el-button type="primary" size="mini" @click="delCurrentGroup(scope.row.id)">确定</el-button>
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

        <!-- 分页 -->
        <el-pagination
            background
            layout="total, prev, pager, next, sizes"
            :page-sizes="[48, 80, 100]"
            :current-page="Number(params.pageNo)"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :total="totalCount">
        </el-pagination>

        <!-- 添加群 -->
        <created-group 
            ref="createdGroup"
            @groupCreateSuccess="init"
        ></created-group>

        <!-- 群成员 -->
        <group-detail
            ref="groupDetail"
        ></group-detail>

    </el-card>
</template>

<script>
import { groupList, groupDelete } from '@/api/group';
import CreatedGroup from './components/CreatedGroup';
import GroupDetail from './components/GroupDetail';

export default {
    data(){
        return {
            resData: [],
            tLoading: false,
            params: {
                pageNo: 1,
                pageSize: 48,
            },
            totalCount: 0,                //总条数
        }
    },
    created() {
        this.init();
    },
    methods: {
        init(){
            this.tLoading = true;
            groupList(this.params).then(res => {
                this.tLoading = false
                if(res.code === this.$successCode){
                    this.resData = res.obj.list;
                    this.totalCount = res.obj.totalRecords;
                }
            })
        },

        //删除群组
        delCurrentGroup(id){
            groupDelete(id).then(res => {
                if(res.code === this.$successCode){
                    this.$message.success('删除成功~');
                    this.init();
                }
            })
        },

        //搜索
        search(){
            this.params.pageNo = 1;
            this.init();
        },

        //页码
        handleCurrentChange(page){
            this.params.pageNo = page;
            this.init();
        },

        //每页多少条
        handleSizeChange(num){
            this.params.pageSize = num;
            this.init();
        },
    },
    components:{
        CreatedGroup,
        GroupDetail
    }
}
</script>
<style lang="scss" scope>
    .organizations-list-wrap{
        .operation-item{
            display: inline-block;
            margin: 0 10px 10px 0;
        }
        .logo-img{
            width: 70px;
            min-height: 30px;
        }
    }
</style>