<!--
 * @Author: liushuai
 * @Date: 2022-02-10 15:28:49
 * @LastEditors: liushuai
 * @LastEditTime: 2022-02-10 15:46:02
 * @Description: 财务权责 
 * @FilePath: \pclient\src\views\finance\index.vue
-->
<template>
    <el-card class="app-main-wrap">
        <el-tabs 
            v-model="tabActiveName" 
            class="mb20"
            @tab-click="handleTab"
        >
            <el-tab-pane 
                label="项目视图" 
                name="projectView"
            ></el-tab-pane>
            <el-tab-pane 
                label="合同" 
                name="contract"
            ></el-tab-pane>
            <el-tab-pane 
                label="回款类目" 
                name="returnMoney"
            ></el-tab-pane>
            <el-tab-pane 
                label="发票" 
                name="invoice"
            ></el-tab-pane>
            <el-tab-pane 
                label="项目权责" 
                name="projectAuthority"
            ></el-tab-pane>
            <el-tab-pane 
                label="员工提成" 
                name="employeeCommission"
            ></el-tab-pane>
            <el-tab-pane 
                label="提成体系" 
                name="commissionSystem"
            ></el-tab-pane>
            <el-tab-pane 
                label="发票中心" 
                name="invoiceCenter"
            >
                <el-dropdown 
                    slot="label" 
                    @command="handleCommand"
                >
                    <span class="el-dropdown-link">
                        发票中心<i class="el-icon-arrow-down el-icon--right"></i>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item>未处理</el-dropdown-item>
                        <el-dropdown-item command="history">历史开票</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </el-tab-pane>
            <el-tab-pane 
                label="合同审核" 
                name="contractApproval"
            ></el-tab-pane>
        </el-tabs> 

        <router-view></router-view>

    </el-card>
    
</template>

<script>
export default {
    data() {
        return {
            tabActiveName: 'projectView'
        }
    },
    mounted() {
        if(this.$route.path.split('finance/')) this.tabActiveName = this.$route.path.split('finance/')[1]
    },
    methods: {
        handleTab(){
            this.$router.push(`/finance/${this.tabActiveName}`)
        },

        // 发票中心
        handleCommand(command){
            this.$router.push({
                path: '/finance/invoiceCenter',
                query: {
                    type: command
                }
            })
        }
    },
    watch: {
        '$route.path'(n, o){
            if(this.$route.path.split('finance/')) this.tabActiveName = this.$route.path.split('finance/')[1]
        }
    }
}
</script>