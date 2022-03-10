<template>
    <el-card class="adv-add-wrap">
        <el-page-header @back="$router.go(-1)">
            <div slot="content">
                {{ $route.params.id ? "编辑插播广告" : "创建插播广告" }}
            </div>
        </el-page-header>
        <el-row
            :gutter="10"
            class="mt30"
            v-loading="$route.params.id && loading"
        >
            <el-col :xs="24" :sm="24" :md="12">

                <add-cutin-adver :id="$route.params.id"></add-cutin-adver>

            </el-col>
        </el-row>

    </el-card>
</template>
<script>
import AddCutinAdver from '@/views/cutInAdver/components/AddCutinAdver.vue';

export default {
    components: {
        AddCutinAdver
    },
};
</script>
<style lang="scss">
.adv-add-wrap {
    .el-input {
        width: 100%;
    }
}
</style>