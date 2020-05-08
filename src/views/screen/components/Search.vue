<template>
    <el-card class="mb20" shadow="never">
        <div class="mb10">
            <el-button 
                type="primary" 
                icon="el-icon-plus" 
                @click="$router.push('/screen/add')"
                size="small">
                创建大屏
            </el-button>
        </div>
        <div class="search-list-wrap">
            <el-row class="search-list">
                <el-col :md="2" :sm="24"  class="title">大屏名称</el-col>
                <el-col :md="22" :sm="24">
                    <el-input size="small" placeholder="大屏名称"></el-input>
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
                        size="small"
                        placeholder="点距规格"
                        v-model="searchParams.dot_pitch"
                    >
                        <el-option
                            v-for="item in ['p3','p4']"
                            :key="item"
                            :label="item"
                            :value="item">
                        </el-option>
                    </el-select>
                </el-col>
            </el-row>
            <el-row class="search-list">
                <el-col :md="2" :sm="24"  class="title">宽高比</el-col>
                <el-col :md="22" :sm="24">
                    <el-select 
                        size="small"
                        placeholder="宽高比"
                        v-model="searchParams.dot_pitch"
                    >
                        <el-option
                            v-for="item in ['16 : 9','16 : 10']"
                            :key="item"
                            :label="item"
                            :value="item">
                        </el-option>
                    </el-select>
                </el-col>
            </el-row>
            <el-row class="search-list">
                <el-col :md="2" :sm="24"  class="title">品牌</el-col>
                <el-col :md="22" :sm="24">
                    <el-button 
                        :class="{focus: !searchParams.owner}" 
                        @click="$delete(searchParams, 'owner');searchScreen()" 
                        size="small">不限
                    </el-button>
                    <el-button 
                        v-for="item in groupData"
                        :key="item.id"
                        @click="$set(searchParams, 'owner', item.id);searchScreen()"
                        :class="{focus: searchParams.owner == item.id}"
                        size="small">
                        {{item.displayName}}
                    </el-button>
                </el-col>
            </el-row>
            <el-row class="search-list">
                <el-col :md="2" :sm="24"  class="title">状态</el-col>
                <el-col :md="22" :sm="24">
                    <el-button class="focus" size="small">不限</el-button>
                    <el-button size="small">在线</el-button>
                    <el-button size="small">离线</el-button>
                </el-col>
            </el-row>
            <el-row class="search-list">
                <el-col :md="2" :sm="24"  class="title">收藏</el-col>
                <el-col :md="22" :sm="24">
                    <el-button class="focus" size="small">不限</el-button>
                    <el-button size="small">已收藏</el-button>
                </el-col>
            </el-row>
        </div>
    </el-card>
</template>
<script>
import { placeProvincesData, placeCitysData, placeAreasData } from '@/api/place';
import { getOrganizationList } from '@/mixins';
import SelectRegion from '@/components/SelectRegion/index';

export default {
    mixins: [getOrganizationList],
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
            }
            .focus{
                color: #8484FF;
                border-color: #dadaff;
                background-color: #f3f3ff;
            }
        }
    }
</style>