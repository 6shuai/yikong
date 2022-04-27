<template>
    <el-card class="app-main-wrap"> 
        <el-tabs 
            v-model="tabActiveName" 
            class="mb20"
            @tab-click="handleClickTab"
        >
            <el-tab-pane 
                label="项目视图" 
                name="view"
            ></el-tab-pane>
            <el-tab-pane 
                label="回款列表" 
                name="returnMoney"
            ></el-tab-pane>
        </el-tabs>

        <router-view></router-view>

    </el-card>
</template>

<script>
export default {
    data(){
        return {
            tabActiveName: 'view'
        }
    },
    mounted() {
        this.tabActiveName = this.$route.name == 'Projcet--view' ? 'view' : 'returnMoney'
    },
    methods: {
        handleClickTab(){
            this.$router.push(`/project/${this.tabActiveName}`)
        }   
    }
}
</script>