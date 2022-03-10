<template>
    <el-card class="mb20" shadow="never">
        <div class="mb10">
            <el-button 
                v-if="hasPerm($route.meta.permission, 'AddMerchant')"
                type="primary" 
                icon="el-icon-plus" 
                size="small"
                @click="$router.push('/merchant/add')">
                创建商户
            </el-button>
        </div>
        <div class="search-list-wrap">
            <el-row class="search-list">
                <el-col :md="2" :sm="24" class="title">商户</el-col>
                <el-col :md="22" :sm="24">
                    <el-input 
                        size="small" 
                        clearable
                        class="dispaly-name"
                        v-model="searchParams.displayName" 
                        placeholder="商户名称"
                        @input="searchPlace"
                    ></el-input>
                </el-col>
            </el-row>
            <el-row class="search-list">
                <el-col :md="2" :sm="24" class="title">地区</el-col>
                <el-col :md="22" :sm="24">
                    <select-region @selectArea="searchParams={...searchParams, ...$event};searchPlace()"></select-region>
                </el-col>
            </el-row>
        </div>
    </el-card>
</template>
<script>

import SelectRegion from '@/components/SelectRegion/index';
export default {
    data(){
        return{
            searchParams: {}
        }
    },
    methods:{
        searchPlace(){
            this.$emit('searchResult', this.searchParams);
        }
    },
    components: {
        SelectRegion
    }
}
</script>

<style lang="scss">
    .search-list-wrap{
        .search-list{
            padding-bottom: 10px;
            .title{
                font-size: 14px;
                color: #515a6e;
                line-height: 30px;
            }
            .region-select{
                width: 128px;
                margin-right: 10px;
            }
            .focus{
                color: #8484FF;
                border-color: #dadaff;
                background-color: #f3f3ff;
            }
        }
    }
</style>