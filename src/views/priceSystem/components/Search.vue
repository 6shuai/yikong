<template>
    <el-card class="mb20" shadow="never">
        
        <page-header 
            :title="priceSystemName"
            backPath="/priceSystem"
        >
        </page-header>

        <div class="search-list-wrap">
            <el-row class="search-list">
                <el-col :md="2" :sm="24"  class="title">屏幕名称</el-col>
                <el-col :md="22" :sm="24">
                    <el-input 
                        class="dispaly-name" 
                        size="small" 
                        clearable 
                        placeholder="屏幕名称" 
                        v-model="searchParams.displayName" 
                        @input="$debounce(searchScreen)"
                    ></el-input>
                </el-col>
            </el-row>
            <el-row class="search-list">
                <el-col :md="2" :sm="24"  class="title">地区</el-col>
                <el-col :md="22" :sm="24">
                    <select-region @selectArea="searchParams={...searchParams, ...$event};searchScreen()"></select-region>
                </el-col>
            </el-row>
        </div>
    </el-card>
</template>
<script>
import SelectRegion from '@/components/SelectRegion/index'
import PageHeader from '@/components/PageHeader'

export default {
    props: ['priceSystemName'],
    data(){
        return{
            searchParams: {}
        }
    },
    mounted() {

    },
    methods:{
        searchScreen(){
            this.$emit('searchResult', this.searchParams);
        }
    },
    components: {
        SelectRegion,
        PageHeader
    }
}
</script>
