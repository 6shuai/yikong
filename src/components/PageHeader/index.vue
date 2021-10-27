<template>
    <div class="header-wrap detail-header-wrap mb30">
        <el-page-header @back="$router.go(-1)"> </el-page-header>
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
    props: ['title']
}
</script>