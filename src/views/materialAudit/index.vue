<template>
    <div 
        class="material-audit-wrap app-main-wrap"
        id="app-main-wrap"
    >
        <el-tabs 
            v-model="tabActiveName" 
            class="mb20"
            @tab-click="handelChangeTab"
        >
            <el-tab-pane 
                label="项目视图" 
                name="project"
            >
            </el-tab-pane>
            <el-tab-pane
                label="屏幕视图"
                name="screen"
            >
            </el-tab-pane>
            <el-tab-pane 
                v-if="financeTabs.includes('InvoiceCenter')"
                label="发票中心" 
                name="invoice"
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
        </el-tabs>
        
        <!-- 项目视图 -->
        <project-view v-if="tabActiveName=='project'"></project-view>

        <!-- 屏幕视图 -->
        <screen-view v-if="tabActiveName=='screen'"></screen-view>

        <!-- 发票中心 -->
        <invoice-center v-if="tabActiveName=='invoice'"></invoice-center>

    </div>
</template>

<script>
import projectView from "./components/projectView"
import screenView from './components/screenView'
import invoiceCenter from '@/views/finance/invoiceCenter'

export default {
    components: {
        projectView,
        screenView,
        invoiceCenter
    },
    data() {
        return {
            tabActiveName: 'project'
        }
    },
    computed: {
        financeTabs(){
            let data = localStorage.financeTabs ? JSON.parse(localStorage.financeTabs) : []
            let arr = []
            for(let i = 0; i < data.length; i++){
                arr.push(data[i].moduleName)
            }
            return arr
        }
    },
    mounted() {
        if(this.$route.query.tab) this.tabActiveName = this.$route.query.tab
    },
    methods: {
        handelChangeTab(){
            this.$router.push({
                query: {
                    tab: this.tabActiveName
                }
            })
        },
        
        // 发票中心
        handleCommand(command){
            this.$router.push({
                path: '/materialAudit?tab=invoice',
                query: {
                    type: command
                }
            })
        }
    }
}
</script>