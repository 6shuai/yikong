<template>
    <el-card shadow="never" class="organizations-list-wrap">
        <div slot="header" class="clearfix">
            品牌管理
        </div>
        <div class="top-operation-wrap">
            <div class="operation-item">
                <!-- <el-button 
                    size="small" 
                    icon="el-icon-plus" 
                    type="primary" 
                    @click="$refs.createdGroup.showDialog()"
                >新建品牌组织</el-button> -->
            </div>
            <div class="operation-item">
                <el-input 
                    size="small" 
                    v-model="params.displayName" 
                    @input="search" 
                    clearable
                    placeholder="品牌名称" 
                    style="width: 200px"
                ></el-input>
            </div>
            <div class="operation-item">
                <el-select 
                    size="small" 
                    v-model="params.organizationType" 
                    clearable  
                    @change="search" 
                    placeholder="请选择品牌类别" 
                    style="width: 200px"
                >
                    <el-option
                        v-for="item in groupTypeList"
                        :key="item.id"
                        :label="item.displayName"
                        :value="item.id">
                    </el-option>
                </el-select>
            </div>
        </div>
        <el-table
            v-loading="tLoading"
            size="small"
            :data="resData"
            style="width: 100%;margin-bottom: 20px;"
            row-key="id"
            border>
            <el-table-column label="logo" width="100">
                <template slot-scope="scope">
                    <el-image
                        class="logo-img"
                        fit="cover"
                        :src="scope.row.logo">
                    </el-image>
                </template>
            </el-table-column>
            <el-table-column prop="displayName" label="品牌名称" min-width="80"></el-table-column>
            <el-table-column prop="description" label="说明" min-width="100"></el-table-column>
            <el-table-column
                label="操作"
                min-width="80">
                <template slot-scope="scope">
                    <el-button type="success" size="mini" @click="$refs.createdGroup.getGroupDetail(scope.row.id)">编辑</el-button>
                    <el-popover
                        style="margin-left:10px"
                        placement="top"
                        :ref="scope.row.id"
                        width="200">
                        <p>此操作将删除此品牌组织【{{scope.row.displayName}}】, 是否继续?</p>
                        <div style="text-align: right; margin: 0">
                            <el-button size="mini" type="text" @click="$refs[scope.row.id].doClose()">取消</el-button>
                            <el-button type="primary" size="mini" @click="delCurrentGroup(scope.row.id)">确定</el-button>
                        </div>
                        <el-button 
                            size="mini"
                            type="danger"
                            slot="reference"
                        >
                            删除品牌
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

        <!-- 添加品牌组织 -->
        <created-organizations 
            ref="createdGroup"
            @createdSuccess="init"
        ></created-organizations>

    </el-card>
</template>

<script>
import { brandOrganizationList, organizationCreated, organizationDelete } from '@/api/user';
import CreatedOrganizations from './components/CreatedOrganizations';
import { getOrganizationTypeList } from '@/mixins/index';

export default {
    mixins: [getOrganizationTypeList],
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
        this.getGroupType(null);
    },
    methods: {
        init(){
            this.tLoading = true;
            brandOrganizationList(this.params).then(res => {
                this.tLoading = false
                if(res.code === this.$successCode){
                    this.resData = res.obj.list;
                    this.totalCount = res.obj.totalRecords;
                }
            })
        },

        //删除组织
        delCurrentGroup(id){
            organizationDelete(id).then(res => {
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
        CreatedOrganizations
    }
}
</script>
<style lang="scss">
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