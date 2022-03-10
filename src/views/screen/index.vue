<template>
    <div class="app-main-wrap screen-list-wrap" id="app-main-wrap">
        <search @searchResult="search" ref="search"></search>
        <div class="download">
            <el-pagination
                v-if="resData.length"
                small
                background
                class="mb10"
                layout="total, prev, pager, next"
                :page-size="Number(params.pageSize)"
                :current-page="Number(params.pageNo)"
                @current-change="handleCurrentChange"
                :total="totalCount">
            </el-pagination>
        </div>
        
        <el-empty v-if="!resData.length && !tLoading" description="暂无数据"></el-empty>

        <div v-else class="place-content">
            <div class="place-box" v-loading="tLoading">
                <div 
                    class="place-p" 
                    :style="{width: placeW}" 
                    v-for="(item, index) in resData" :key="item.id"
                    @click="$router.push(`/screen/details/${item.id}`)"
                >
                    <screen-list 
                        name="screen" 
                        :item="item" 
                        :index="index" 
                        :imageH="imageH"
                        @seeAddress="$refs.mapDialog.showMapDialog(item)"
                    >
                        <template v-slot:default>
                            <div class="specification">
                                <ul>
                                    <li title="点距规格">
                                        <span>{{item.dotPitchName}}</span>
                                    </li>
                                    <li title="分辨率">
                                        <span>{{item.resolutionWidth}} x {{item.resolutionHeight}}</span>
                                    </li>
                                    <li title="宽高比">
                                        <span>{{item.aspectRatioWidth}} : {{item.aspectRatioHeight}}</span>
                                    </li>
                                </ul>
                            </div>
                        </template>
                    </screen-list>
                </div>

            </div>

            <el-pagination
                v-if="resData.length"
                background
                layout="total, prev, pager, next, sizes"
                :page-sizes="[48, 80, 100]"
                :page-size="Number(params.pageSize)"
                :current-page="Number(params.pageNo)"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :total="totalCount">
            </el-pagination>
        </div>

        <!-- 查看地图位置 -->
        <map-dialog ref="mapDialog"></map-dialog>
    </div>
</template>

<script>
import Search from './components/Search';
import ScreenList from '@/views/screen/components/ScreenList';
import MapDialog from '@/components/BaiduMap/MapDialog';
import { screenSizeWatch } from '@/mixins';
import { screenList } from '@/api/screen';
export default {
    mixins: [screenSizeWatch,],
    data(){
        return {
            tLoading: false,
            resData: [],
            params: {
                pageNo: 1,
                pageSize: 48,
            },
            totalCount: 0
        }
    },
    mounted() {
        if(this.$route.query.pageNo) {
            this.params = {
                ...this.params,
                ...JSON.parse(JSON.stringify(this.$route.query))
            }
            this.$refs.search.searchParams = this.params;
        }else if(this.$store.state.app.screenSearchParams){
            this.params = this.$store.state.app.screenSearchParams;
            this.$refs.search.searchParams = this.params;
        }
        this.init();
    },
    methods: {
        init(){
            this.tLoading = true;
            this.$store.state.app.screenSearchParams = this.params;
            screenList(this.params).then(res => {
                this.tLoading = false;
                let data = JSON.parse(JSON.stringify(this.params));
                delete data.userId;
                this.$router.push({
                    query: {
                        ...data
                    }
                })
                if(res.code === this.$successCode){
                    this.resData = res.obj.list;
                    this.totalCount = res.obj.totalRecords;
                }
            })
        },

        //搜索
        search(params){
            this.params = {
                ...params,
                pageNo: 1,
                pageSize: this.params.pageSize,
                userId: this.$store.state.user.loginData.id
            }
            this.init();
        },

        //页码
        handleCurrentChange(page){
            this.params.pageNo = page;
            this.init();
        },

        //每页多少条
        handleSizeChange(num){
            this.params.pageSize = num;
            this.init();
        }
        
    },
    components: {
        Search,
        ScreenList,
        MapDialog
    }
}
</script>
<style lang="scss">
    @import '../place/style/place-card.scss';
</style>