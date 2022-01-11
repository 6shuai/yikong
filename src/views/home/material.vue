<template>
    <div class="material_wrap">
        <div class="add_and_search">
            <el-button
                icon="el-icon-plus"
                type="primary"
                size="small"
                @click="handleShowCreate"
            >
                新建物料
            </el-button>

            <div class="search_input">
                <el-input 
                    clearable
                    size="small"
                    v-model="params.screenName"
                    placeholder="屏幕名称"
                    @input="$debounce(handleSearch)"
                ></el-input>
                <el-input 
                    clearable
                    size="small"
                    v-model="params.contentName"
                    placeholder="内容名称"
                    @input="$debounce(handleSearch)"
                ></el-input>
            </div>

        </div>

        <el-table
            class="mt20 mb20"
            v-loading="tLoading"
            stripe
            size="small"
            :data="resData"
            row-key="id"
            border>
            <el-table-column 
                prop="screenName" 
                label="屏幕名称" 
                min-width="120"
            ></el-table-column>
            <el-table-column 
                prop="contentName" 
                label="内容名称" 
                min-width="60"
            ></el-table-column>
            <el-table-column 
                prop="effectiveTime" 
                label="上刊时间" 
                min-width="60"
            ></el-table-column>
            <el-table-column 
                prop="dueTime" 
                label="下刊时间" 
                min-width="60"
            ></el-table-column>
            <el-table-column 
                prop="beginTime" 
                label="操作" 
                width="110"
            >
                <template slot-scope="scope">
                    <el-popconfirm
                        confirm-button-text='删除'
                        cancel-button-text='取消'
                        icon="el-icon-info"
                        icon-color="red"
                        title="此操作将删除此条数据, 是否继续?"
                        @confirm="handleDelete(scope.row.id)"
                    >
                        <el-button 
                            type="danger" 
                            slot="reference"
                            size="mini"
                        >
                            删除
                        </el-button>
                    </el-popconfirm>
                </template>
            </el-table-column>
        </el-table>

        <el-pagination
            v-if="resData.length"
            background
            layout="total, prev, pager, next"
            :current-page="Number(params.pageNo)"
            :page-size="Number(params.pageSize)"
            @current-change="handleCurrentChange"
            :total="totalCount">
        </el-pagination>         

        <!-- 新建物料 -->
        <create-material ref="createMaterial"></create-material>

    </div>
</template>

<script>
import { projectMaterialList, projectMaterialDelete } from '@/api/project'
import { dateAddHMS } from '@/utils/index'
import CreateMaterial from './components/CreateMaterial'

export default {
    components: { 
        CreateMaterial
    },
    data() {
        return {
            // 列表加载loading
            tLoading: false,
            
            // 列表数据
            resData: [],

            // 列表总条数
            totalCount: 0,

            // 搜索条件
            params: {
                pageNo: 1,
                pageSize: 20,
            }
        }
    },
    mounted() {
        this.getMaterial()
    },
    methods: {
        // 获取物料列表
        getMaterial(){
            this.params.project = this.$route.params.id
            this.tLoading = true
            projectMaterialList(this.params).then(res => {
                this.tLoading = false
                if(res.code === this.$successCode){
                    let { list, totalRecords } = res.obj
                    this.resData = list
                    this.totalCount = totalRecords

                    this.resData.forEach((item, index) => {
                        this.resData[index].effectiveTime = dateAddHMS(item.effectiveTime)
                        this.resData[index].dueTime = dateAddHMS(item.dueTime)
                    })
                }
            })
        },
        
        // 显示创建
        handleShowCreate(){
            this.$refs.createMaterial.showCreateMaterialDialog()
        },

        // 分页
        handleCurrentChange(page){
            this.params.pageNo = page
            this.getMaterial()
        },

        // 搜索
        handleSearch(){
            this.params.pageNo = 1
            this.getMaterial()
        },

        // 删除
        handleDelete(id){
            projectMaterialDelete(id).then(res => {
                if(res.code === this.$successCode){
                    this.$message.success('删除成功~')
                    this.getMaterial()
                }
            })
        }
    }
}
</script>