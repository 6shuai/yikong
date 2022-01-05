<template>
    <el-card class="mb20" shadow="never">
        <div class="mb10">
            <el-button 
                v-if="hasPerm($route.meta.permission, 'AddScreen')"
                type="primary" 
                icon="el-icon-plus" 
                @click="$router.push('/screen/add')"
                size="small">
                创建大屏
            </el-button>
        </div>
        <div class="search-list-wrap">
            <el-row class="search-list">
                <el-col :md="2" :sm="24"  class="title">屏幕名称</el-col>
                <el-col :md="22" :sm="24">
                    <el-input class="dispaly-name" size="small" clearable placeholder="屏幕名称" v-model="searchParams.displayName" @input="searchScreen"></el-input>
                </el-col>
            </el-row>
            <el-row class="search-list">
                <el-col :md="2" :sm="24"  class="title">地区</el-col>
                <el-col :md="22" :sm="24">
                    <select-region @selectArea="searchParams={...searchParams, ...$event};searchScreen()"></select-region>
                </el-col>
            </el-row>
            <el-row class="search-list">
                <el-col :md="2" :sm="24"  class="title">点距规格</el-col>
                <el-col :md="22" :sm="24">
                    <el-select 
                        clearable
                        size="small"
                        placeholder="点距规格"
                        v-model="searchParams.dotPitch"
                        @change="searchScreen"
                    >
                        <el-option
                            v-for="item in dotpitchData"
                            :key="item.id"
                            :label="item.displayName"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </el-col>
            </el-row>
            <el-row class="search-list">
                <el-col :md="2" :sm="24"  class="title">宽高比</el-col>
                <el-col :md="22" :sm="24">
                    <el-select 
                        clearable
                        size="small"
                        placeholder="宽高比"
                        v-model="searchParams.aspectRatio"
                        @change="searchScreen"
                    >
                        <el-option
                            v-for="item in aspectRatioData"
                            :key="item.id"
                            :label="item.width + ' : ' + item.height"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </el-col>
            </el-row>
            <el-row class="search-list">
                <el-col :md="2" :sm="24"  class="title">品牌</el-col>
                <el-col :md="22" :sm="24">
                    <el-button 
                        :class="{focus: !searchParams.brand}" 
                        @click="$delete(searchParams, 'brand');searchScreen()" 
                        size="small">不限
                    </el-button>
                    <el-button 
                        v-for="item in groupData"
                        :key="item.id"
                        @click="$set(searchParams, 'brand', item.id);searchScreen()"
                        :class="{focus: searchParams.brand == item.id}"
                        size="small">
                        {{item.displayName}}
                    </el-button>
                </el-col>
            </el-row>
            <el-row class="search-list">
                <el-col :md="2" :sm="24"  class="title">状态</el-col>
                <el-col :md="22" :sm="24">
                    <el-button 
                        :class="{focus: !searchParams.state && searchParams.state !== 0}" 
                        @click="$delete(searchParams, 'state');searchScreen()" 
                        size="small">不限
                    </el-button>
                    <el-button
                        size="small"
                        v-for="item in statusList"
                        :key="item.id"
                        :class="{focus: searchParams.state == item.id}"
                        @click="$set(searchParams, 'state', item.id);searchScreen()"
                        :value="item.id">{{item.label}}
                    </el-button>
                </el-col>
            </el-row>
            <el-row class="search-list">
                <el-col :md="2" :sm="24"  class="title">收藏</el-col>
                <el-col :md="22" :sm="24">
                    <el-button 
                        :class="{focus: !searchParams.isFavorite}" 
                        @click="$delete(searchParams, 'isFavorite');searchScreen()" 
                        size="small">不限
                    </el-button>
                    <el-button 
                        size="small" 
                        :class="{focus: searchParams.isFavorite}" 
                        @click="$set(searchParams, 'isFavorite', 1);searchScreen()"
                        >已收藏
                    </el-button>
                </el-col>
            </el-row>
        </div>
    </el-card>
</template>
<script>
import { getOrganizationList } from '@/mixins';
import { getDotPitch, getAspectRatio } from '@/views/screen/mixins';
import SelectRegion from '@/components/SelectRegion/index';

export default {
    mixins: [getOrganizationList, getDotPitch, getAspectRatio],
    data(){
        return{
            searchParams: {},
            statusList: [
                { id: 0, label: '建设中' },
                { id: 1, label: '在线' },
                { id: 2, label: '离线' }
            ]
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
        SelectRegion
    }
}
</script>
