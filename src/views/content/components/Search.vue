<template>
    <el-card class="mb20" shadow="never">
        <div class="mb10">
            <el-button 
                v-if="hasPerm($route.meta.permission, 'AddContent')"
                type="primary" 
                icon="el-icon-plus" 
                @click="$router.push('/content/add')"
                size="small">
                创建资源
            </el-button>
        </div>
        <div class="search-list-wrap">

            <el-row class="search-list">
                <el-col :md="2" :sm="24"  class="title">资源名称</el-col>
                <el-col :md="22" :sm="24">
                    <el-input class="dispaly-name" size="small" clearable placeholder="资源名称" v-model="searchParams.displayName" @input="searchScreen"></el-input>
                </el-col>
            </el-row>
            <el-row class="search-list">
                <el-col :md="2" :sm="24"  class="title">品牌</el-col>
                <el-col :md="22" :sm="24">
                    <el-button 
                        :class="{focus: !searchParams.contentOwner}" 
                        @click="$delete(searchParams, 'contentOwner');searchScreen()" 
                        size="small">不限
                    </el-button>
                    <el-button 
                        v-for="item in groupData"
                        :key="item.id"
                        @click="$set(searchParams, 'contentOwner', item.id);searchScreen()"
                        :class="{focus: searchParams.contentOwner == item.id}"
                        size="small">
                        {{item.displayName}}
                    </el-button>
                </el-col>
            </el-row>
            <el-row class="search-list">
                <el-col :md="2" :sm="24"  class="title">资源类型</el-col>
                <el-col :md="22" :sm="24">
                    <el-button 
                        :class="{focus: !searchParams.contentType && searchParams.contentType !== 0}" 
                        @click="$delete(searchParams, 'contentType');searchScreen()" 
                        size="small">不限
                    </el-button>
                    <el-button
                        size="small"
                        v-for="item in typeList"
                        :key="item.id"
                        :class="{focus: searchParams.contentType == item.id}"
                        @click="$set(searchParams, 'contentType', item.id);searchScreen()"
                        :value="item.id">{{item.displayName}}
                    </el-button>
                </el-col>
            </el-row>
            <el-row class="search-list">
                <el-col :md="2" :sm="24"  class="title">排列</el-col>
                <el-col :md="22" :sm="24">
                    <el-button
                        size="small"
                        v-for="item in timeSortList"
                        :key="item.id"
                        :class="{focus: searchParams.sortType == item.id}"
                        @click="$set(searchParams, 'sortType', item.id);searchScreen()"
                        :value="item.id">{{item.label}}
                    </el-button>
                </el-col>
            </el-row>

        </div>
    </el-card>
</template>
<script>
import { getOrganizationList } from '@/mixins';
import { getContentTypeList } from '@/api/content'
import { getDotPitch, getAspectRatio } from '@/views/screen/mixins';
import SelectRegion from '@/components/SelectRegion/index';

export default {
    mixins: [getOrganizationList],
    data(){
        return{
            searchParams: {},
            typeList: [],
            timeSortList: [
                {
                    label: '创建时间',
                    id: 0
                },
                {
                    label: '计划开始',
                    id: 1
                },
                {
                    label: '计划结束',
                    id: 2
                }
            ]
        }
    },
    mounted() {
        this.contentTypeList();
    },
    methods:{
        searchScreen(){
            this.$emit('searchResult', this.searchParams);
        },

        //资源类型列表
        contentTypeList(){
            getContentTypeList().then(res => {
                this.typeList = res.obj;
            })
        },
    },
    components: {
        SelectRegion
    }
}
</script>