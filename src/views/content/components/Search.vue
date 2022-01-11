<template>
    <el-card class="mb20" shadow="never">
        <div class="mb10">
            <el-button 
                v-if="hasPerm($route.meta.permission, 'AddContent')"
                type="primary" 
                icon="el-icon-plus" 
                @click="$router.push('/content/add')"
                size="small">
                创建内容
            </el-button>
        </div>
        <div class="search-list-wrap">

            <el-row class="search-list">
                <el-col :md="2" :sm="24"  class="title">内容名称</el-col>
                <el-col :md="22" :sm="24">
                    <el-input 
                        class="dispaly-name" 
                        size="small" 
                        clearable 
                        placeholder="内容名称" 
                        v-model="searchParams.displayName" 
                        @input="$debounce(searchContent)"
                    ></el-input>
                </el-col>
            </el-row>
            <el-row class="search-list">
                <el-col :md="2" :sm="24"  class="title">品牌</el-col>
                <el-col :md="22" :sm="24">
                    <el-button 
                        :class="{focus: !searchParams.brand}" 
                        @click="$delete(searchParams, 'brand');searchContent()" 
                        size="small">不限
                    </el-button>
                    <el-button 
                        v-for="item in groupData"
                        :key="item.id"
                        @click="$set(searchParams, 'brand', item.id);searchContent()"
                        :class="{focus: searchParams.brand == item.id}"
                        size="small">
                        {{item.displayName}}
                    </el-button>
                </el-col>
            </el-row>
            <el-row class="search-list">
                <el-col :md="2" :sm="24"  class="title">内容类型</el-col>
                <el-col :md="22" :sm="24">
                    <el-button 
                        :class="{focus: !searchParams.contentType && searchParams.contentType !== 0}" 
                        @click="$delete(searchParams, 'contentType');searchContent()" 
                        size="small">不限
                    </el-button>
                    <el-button
                        size="small"
                        v-for="item in typeList"
                        :key="item.id"
                        :class="{focus: searchParams.contentType == item.id}"
                        @click="$set(searchParams, 'contentType', item.id);searchContent()"
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
                        @click="$set(searchParams, 'sortType', item.id);searchContent()"
                        :value="item.id">{{item.label}}
                    </el-button>
                </el-col>
            </el-row>
            <el-row class="search-list">
                <el-col :md="2" :sm="24"  class="title">收藏</el-col>
                <el-col :md="22" :sm="24">
                    <el-button 
                        :class="{focus: !searchParams.isFavorite}" 
                        @click="$delete(searchParams, 'isFavorite');searchContent()" 
                        size="small">不限
                    </el-button>
                    <el-button 
                        size="small" 
                        :class="{focus: searchParams.isFavorite}" 
                        @click="$set(searchParams, 'isFavorite', 1);searchContent()"
                        >已收藏
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
        searchContent(){
            this.$emit('searchResult', this.searchParams);
        },

        //内容类型列表
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