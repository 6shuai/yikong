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
        >
            <el-tab-pane 
                label="项目权责" 
                name="project"
            ></el-tab-pane>
            <el-tab-pane 
                label="员工权责" 
                name="staff"
            ></el-tab-pane>
        </el-tabs> 

        <!-- 项目权责 -->
        <project-list
            v-if="tabActiveName === 'project'"
        ></project-list>

        <!-- 员工职责 -->
        <staff-list
            v-if="tabActiveName === 'staff'"
        ></staff-list>

    </el-card>
    
</template>

<script>
import ProjectList from './components/Project'
import StaffList from './components/Staff'

export default {
    components: {
        ProjectList,
        StaffList
    },
    data() {
        return {
            tabActiveName: 'project'
        }
    },
    methods: {

    }
}
</script>