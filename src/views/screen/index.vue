<template>
    <div class="app-main-wrap screen-list-wrap" id="app-main-wrap">
        <search @searchResult="search" ref="search"></search>
        <div v-if="!tLoading && !resData.length" style="margin: 20px;text-align:center">
            暂无数据~
        </div>
        <div v-else class="place-content">
            <div class="place-box" v-loading="tLoading">
                <div class="place-p" :style="{width: placeW}" v-for="(item, index) in resData" :key="item.id">
                    <screen-list 
                        name="screen" 
                        :item="item" 
                        :index="index" 
                        :imageH="imageH"
                        @seeAddress="$refs.mapDialog.showMapDialog(item)"
                    ></screen-list>
                </div>

            </div>

            <el-pagination
                background
                layout="total, prev, pager, next, sizes"
                :page-sizes="[48, 80, 100]"
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
        }
        this.init();
    },
    methods: {
        init(){
            this.tLoading = true;
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
<style lang="scss" scope>
    @import '../place/list/style/place-card.scss';
</style>