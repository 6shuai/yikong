<template>
    <div 
        class="gameDetail-game-list" 
        id="app-main-wrap"
    >
        <div class="game-list-top">
            <el-button
                v-if="hasPerm($store.state.permission.gamesPrem, 'AddGameAssembly')"
                type="primary"
                size="small"
                icon="el-icon-plus"
                @click="handleAddGame"
                >添加游戏</el-button
            >
            <el-input
                size="small"
                clearable
                class="search-input"
                v-model="params.displayName"
                placeholder="游戏名称"
                @input="search"
            >
            </el-input>
        </div>

        <div class="place-content" v-loading="dataLoading">
            <el-empty 
                v-if="!resData.length"
                description="还没有游戏">
            </el-empty>
            <div class="place-box">
                <div class="place-p" 
                    :style="{width: placeW}" 
                    v-for="(item, index) in resData" 
                    :key="index">

                    <div style="height: 100%" class="timeline-wrap">
                        <el-card 
                            class="place-list" 
                            shadow="always"
                        >
                            <div class="place-img" 
                                :style="{height: imageH+'px'}"
                                @click.stop="handleEdit(item.id)">
                                <el-image fit="cover" :style="{height: imageH+'px'}" :src="item.image" class="image"></el-image>
                            </div>
                            <div style="padding: 14px;">
                                <div class="place-title">
                                    <span class="name" @click="handleEdit(item.id)">{{item.displayName}}</span>
                                </div>
                                <div class="desc">
                                    <p class="overflow">{{ item.overallVersion }} {{ item.description }}</p>
                                </div>
                            </div>                    
                        </el-card>
                    </div>

                </div>
            </div>
        </div>

        <el-pagination
            background
            :hide-on-single-page="true"
            layout="total, prev, pager, next, sizes"
            :page-sizes="[40, 80, 100]"
            :current-page="Number(params.pageNo)"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :total="totalCount"
        >
        </el-pagination>

    </div>
</template>

<script>
import { gameDataList } from "@/api/game";
import { screenSizeWatch } from '@/mixins';
export default {
    mixins: [screenSizeWatch],
    data() {
        return {
            dataLoading: false,
            params: {
                pageNo: 1,
                pageSize: 40,
                applicationId: this.$route.params.id,
            },
            totalCount: 0,
            resData: [],
        };
    },
    computed: {
        gameDetail(){
            return this.$store.state.game.details
        }
    },
    created() {
        this.init();
    },
    methods: {
        init() {
            this.dataLoading = true;
            gameDataList(this.params).then((res) => {
                this.dataLoading = false;
                this.resData = res.obj.list;
                this.totalCount = res.obj.totalRecords;
            });
        },

        //添加游戏
        handleAddGame(){
            this.$router.push(`/games/details/${this.$route.params.id}/gameData/0`)
        },

        //编辑
        handleEdit(id) {
            if(this.gameDetail.editAssembly){
                this.$router.push(`/games/details/${this.$route.params.id}/gameData/${id}`)
            }
        },

        //每页条数
        handleSizeChange(size) {
            this.params.pageSize = size;
            this.init();
        },

        //分页
        handleCurrentChange(page) {
            this.params.pageNo = page;
            this.init();
        },

        //搜索
        search(){
            this.params.pageNo = 1;
            this.init();
        }
    }
};
</script>


<style lang="scss">
@import '../../place/style/place-card.scss';
.timeline-wrap{
    .place-list .place-title .name{
        width: 100% !important;
    }
    .place-img{
        background: #222831;
        background: -webkit-radial-gradient(0 100%,ellipse cover,rgba(104,128,138,.4) 10%,rgba(138,114,76,0) 40%),linear-gradient(180deg,rgba(57,173,219,.25) 0,rgba(42,60,87,.4)),linear-gradient(135deg,#670d10,#092756) !important;;
    }
}
.gameDetail-game-list {
    .game-list-top {
        margin-bottom: 20px;
        .search-input{
            width: 200px;
        }
    }
}
</style>