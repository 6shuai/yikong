<template>
    <div class="app-main-wrap games-list-wrap" id="app-main-wrap">
        <div class="content-top mb20">
            <el-button 
                v-if="hasPerm($route.meta.permission, 'AddGame')"
                class="created-btn"
                type="primary" 
                icon="el-icon-plus" 
                @click="$router.push('/games/add')"
                size="small">
                创建游戏
            </el-button>
            
            <el-input 
                class="ml20 w220"
                prefix-icon="el-icon-search" 
                clearable
                v-model="params.displayName" 
                placeholder="游戏名称" size="small"
                @input="search"
            ></el-input>

            <el-radio-group 
                class="ml20"
                v-model="params.isFavorite" 
                size="small"
                @change="search"
            >
                <el-radio-button label="0">不限</el-radio-button>
                <el-radio-button label="1">已收藏</el-radio-button>
            </el-radio-group>
            
        </div>

        <!-- 游戏列表 -->
        <div v-if="!dataLoading && !resData.length" style="margin: 20px;text-align:center">
            暂无数据~
        </div>
        <div v-else class="place-content" v-loading="dataLoading">
            <div class="place-box">
                <div class="place-p" 
                    :style="{width: placeW}" 
                    v-for="(item, index) in resData" 
                    :key="index">
                    <game-list 
                        :item="item" 
                        :index="index" 
                        :imageH="imageH"
                    ></game-list>
                </div>
            </div>
        </div>

        <el-pagination
            v-if="resData.length"
            background
            hide-on-single-page
            layout="total, prev, pager, next, sizes"
            :page-sizes="[48, 80, 100]"
            :current-page="Number(params.pageNo)"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :total="totalCount">
        </el-pagination>

    </div>
</template>
<script>
import { gameList } from '@/api/game';
import { screenSizeWatch } from '@/mixins';
import GameList from '@/views/games/components/GameList';
export default {
    mixins: [screenSizeWatch],
    data(){
        return {
            dataLoading: false,
            params: {
                pageNo: 1,
                pageSize: 48,
                isFavorite: 0
            },
            totalCount: 0,
            resData: []
        }
    },
    mounted() {
        this.init();
    },
    methods: {
        init(){
            this.dataLoading = true;
            gameList(this.params).then(res => {
                this.dataLoading = false;
                if(res.code === this.$successCode){
                    this.resData = res.obj.list;
                    this.totalCount = res.obj.totalRecords;
                }
            })
        },

        //分页
        handleCurrentChange(page){
            this.params.pageNo = page;
            this.init();
        },

        //每页多少条
        handleSizeChange(size){
            this.params.pageSize = size;
            this.init();
        },

        //搜索
        search(){
            this.params.pageNo = 1;
            this.init();
        }

    },
    components: {
        GameList
    }
}
</script>
<style lang="scss" scope>
    .games-list-wrap{
        .place-content{
            min-height: 100px;
        }
    }
</style>