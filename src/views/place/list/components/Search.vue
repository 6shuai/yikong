<template>
    <el-card class="mb20" shadow="never">
        <div class="mb10">
            <el-button 
                type="primary" 
                icon="el-icon-plus" 
                size="small"
                @click="$router.push('/place/add')">
                创建场所
            </el-button>
        </div>
        <div class="search-list-wrap">
            <el-row class="search-list">
                <el-col :md="2" :sm="24" class="title">场所名称</el-col>
                <el-col :md="22" :sm="24">
                    <el-input 
                        size="small" 
                        class="dispaly-name"
                        v-model="searchParams.displayName" 
                        placeholder="场所名"
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
            <el-row class="search-list">
                <el-col :md="2" :sm="24" class="title">品牌</el-col>
                <el-col :md="22" :sm="24">
                    <el-button 
                        :class="{focus: !searchParams.owner}" 
                        @click="$delete(searchParams, 'owner');searchPlace()" 
                        size="small">不限
                    </el-button>
                    <el-button 
                        v-for="item in groupData"
                        :key="item.id"
                        @click="$set(searchParams, 'owner', item.id);searchPlace()"
                        :class="{focus: searchParams.owner == item.id}"
                        size="small">
                        {{item.displayName}}
                    </el-button>
                </el-col>
            </el-row>
            <el-row class="search-list">
                <el-col :md="2" :sm="24" class="title">场所类型</el-col>
                <el-col :md="22" :sm="24">
                    <el-button 
                        :class="{focus: !searchParams.placeType}" 
                        @click="$delete(searchParams, 'placeType');searchPlace()" 
                        size="small"
                    >不限</el-button>
                    <el-button 
                        v-for="item in placeTypeData"
                        :key="item.id"
                        @click="$set(searchParams, 'placeType', item.id);searchPlace()"
                        :class="{focus: searchParams.placeType == item.id}"
                        size="small">
                        {{item.displayName}}
                    </el-button>
                </el-col>
            </el-row>
            <el-row class="search-list">
                <el-col :md="2" :sm="24" class="title">收藏</el-col>
                <el-col :md="22" :sm="24">
                    <el-button 
                        :class="{focus: !searchParams.isFavorite}" 
                        @click="$delete(searchParams, 'isFavorite');searchPlace()" 
                        size="small">不限
                    </el-button>
                    <el-button 
                        size="small" 
                        :class="{focus: searchParams.isFavorite}" 
                        @click="$set(searchParams, 'isFavorite', 1);searchPlace()"
                        >已收藏
                    </el-button>
                </el-col>
            </el-row>
        </div>
    </el-card>
</template>
<script>

import SelectRegion from '@/components/SelectRegion/index';
import { getOrganizationList } from '@/mixins';
import { getPlaceTypeList } from '@/views/place/mixins';
export default {
    mixins: [getOrganizationList, getPlaceTypeList],
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

<style lang="scss" scope>
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