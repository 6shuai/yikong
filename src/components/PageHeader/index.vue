<template>
    <div class="header-wrap detail-header-wrap mb30">
        <el-page-header 
            @back="backPath ? $router.push(backPath) : $router.go(-1)"
            :title="backTitle"
        > </el-page-header>
        <div class="title">
            <h2>{{ title }}</h2>
        </div>
        <div class="header-right">
            <slot name="headerRight"></slot>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        title: String,
        backTitle: {
            type: String,
            default: '返回'
        },
        backPath: String
    }
}
</script>