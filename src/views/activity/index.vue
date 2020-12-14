<template>
    <div class="app-main-wrap activity-wrap">
        <div class="content-top mb20 clearfix">
            <el-button
                class="created-btn"
                type="primary"
                icon="el-icon-plus"
                size="small"
                @click="$router.push('/activity/add')"
            >
                新建活动
            </el-button>

            <el-input
                class="w200 ml20"
                prefix-icon="el-icon-search"
                clearable
                v-model="params.displayName"
                placeholder="活动名称"
                size="small"
            ></el-input>
        </div>

        <div class="activity-list">
            <div class="content">

            </div>
        </div>

    </div>
</template>

<script>
export default {
    data(){
        return {
            params: {}
        }
    }
}
</script>