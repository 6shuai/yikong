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
        </el-tabs>
        
        <!-- 项目视图 -->
        <project-view v-if="tabActiveName=='project'"></project-view>

        <!-- 屏幕视图 -->
        <screen-view v-if="tabActiveName=='screen'"></screen-view>

    </div>
</template>

<script>
import projectView from "./components/projectView"
import screenView from './components/screenView'

export default {
    components: {
        projectView,
        screenView
    },
    data() {
        return {
            tabActiveName: 'project'
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
        }   
    }
}
</script>