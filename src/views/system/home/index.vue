<template>
    <div class="template-card">
        <el-card shadow="never">
            <div slot="header" class="clearfix">
                主页管理
            </div>
            <div class="top-operation-wrap">
                <el-button 
                    size="small" 
                    type="primary" 
                    icon="el-icon-plus" 
                    @click="handleHomePageCreate()"
                >添加主页</el-button>
            </div>
            <el-table
                v-loading="tLoading"
                :data="resData"
                stripe
                size="small"
                row-key="id"
                border>
                <el-table-column
                    prop="displayName"
                    label="主页名称"
                    min-width="180">
                </el-table-column>
                <el-table-column
                    prop="frontRoute"
                    label="路由"
                    min-width="180">
                </el-table-column>

                <el-table-column
                    prop="frontRoute"
                    label="角色"
                    min-width="200">
                    <template slot-scope="scope">
                        <el-tag 
                            size="mini"
                            class="mr10"
                            v-for="(item, index) in scope.row.roles"
                            :key="index"
                        >{{ item.displayName }}</el-tag>
                    </template>
                </el-table-column>
                
                <el-table-column
                    label="操作"
                    width="200">
                    <template slot-scope="scope">
                        <el-button 
                            size="mini"
                            type="success"
                            @click="handleHomePageCreate(scope.row)"
                        >
                            编辑
                        </el-button>
                        <el-button 
                            size="mini"
                            type="primary"
                            @click="handleHomePageUpdateRole(scope.row)"
                        >
                            更新主页角色
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>

        </el-card>

        <!-- 创建 或 编辑 主页 -->
        <add-home-page ref="addHomePage"></add-home-page>

        <!-- 更新主页角色 -->
        <update-home-page-role ref="updateHomePageRole"></update-home-page-role>

    </div>
</template>

<script>
import { getHomePageList } from '@/api/common'
import AddHomePage from './AddHomePage'
import UpdateHomePageRole from './UpdateHomePageRole'

export default {
    components: {
        AddHomePage,
        UpdateHomePageRole
    },
    data(){
        return {
            resData: [],
            tLoading: false
        }
    },
    created() {
        this.init();
    },
    methods: {
        //初始化角色列表
        init(){
            this.tLoading = true
            getHomePageList(this.params).then(res => {
                this.tLoading = false
                if(res.code === this.$successCode){
                    this.resData = res.obj
                }
            })
        },

        // 创建主页
        handleHomePageCreate(data){
            this.$refs.addHomePage.showDialog(data)
        },

        // 更新主页角色
        handleHomePageUpdateRole(row){
            this.$refs.updateHomePageRole.showDialog(row)
        }

    }
}
</script>