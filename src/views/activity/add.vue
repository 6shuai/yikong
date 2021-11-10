<!--
 * @Author: liushuai
 * @Date: 2020-12-30 14:34:31
 * @LastEditors: liushuai
 * @LastEditTime: 2021-11-10 11:18:16
 * @Description: file content
 * @FilePath: \pclient\src\views\activity\activityAdd.vue
-->
<template>
    <el-card class="game-add-wrap">
        <el-page-header @back="$router.go(-1)">
            <div slot="content">
                {{ $route.params.id ? "编辑活动" : "创建活动" }}
            </div>
        </el-page-header>
        <el-row :gutter="10" class="mt30">
            <el-col :xs="24" :sm="24" :md="12">
                <add-activity :id="$route.params.id"></add-activity>
            </el-col>
        </el-row>


    </el-card>
</template>

<script>
import AddActivity from '@/views/activity/components/AddActivity'
export default {
    components: {
        AddActivity
    }
}
</script>