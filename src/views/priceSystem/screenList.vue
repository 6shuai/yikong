<template>
    <div class="app-main-wrap price-system-screen-list" id="app-main-wrap">
        
        <search 
            @searchResult="handleSearch" 
            ref="search"
            :priceSystemName="priceSystem.displayName"
        ></search>


        <el-empty v-if="!resData.length && !listLoading" description="暂无数据"></el-empty>

        <div v-else class="place-content">
            <div class="place-box" v-loading="listLoading">
            
                <div 
                    class="place-p" 
                    :style="{width: placeW}" 
                    v-for="(item, index) in resData" 
                    :key="item.id"
                    @click="handleShowAddScreen(item)"
                >
                    <!-- media 是屏幕id -->
                    <screen-list 
                        name="screenPrice" 
                        :item="item" 
                        :index="index" 
                        :imageH="imageH"
                        @seeAddress="$refs.mapDialog.showMapDialog(item)"
                    >
                        <template v-slot:default>
                            <p class="price">￥ {{ item.price ? item.price : '--' }}</p>
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

        <!-- 修改屏幕刊例价 -->
        <edit-screen-price ref="editScreenPrice"></edit-screen-price>

        <!-- 查看地图位置 -->
        <map-dialog ref="mapDialog"></map-dialog>

    </div>
</template>

<script>
import EditScreenPrice from './components/EditScreenPrice'
import ScreenList from '@/views/screen/components/ScreenList'
import { screenSizeWatch } from '@/mixins'
import { priceSystemDetail } from '@/api/priceSystem'
import MapDialog from '@/components/BaiduMap/MapDialog'
import Search from './components/Search'

export default {
    components: {
        ScreenList,
        EditScreenPrice,
        MapDialog,
        Search
    },
    mixins: [screenSizeWatch],
    data(){
        return {
            showDrawer: true,
            params: {
                pageNo: 1,
                pageSize: 40
            },

            // 数据加载中
            listLoading: false,

            // 列表
            resData: [],

            // 总条数
            totalCount: 0,

            // 价格体系
            priceSystem: {}
        }
    },
    mounted() {
        this.getDetail()
    },
    methods: {
        // 添加或修改屏幕刊例价
        handleShowAddScreen(data){
            this.$refs.editScreenPrice.showAddScreenPriceDialog(data)
        },

        // 获取屏幕列表
        getDetail(){
            this.listLoading = true
            this.params.id = this.$route.params.id
            priceSystemDetail(this.params).then(res => {
                this.listLoading = false
                if(res.code === this.$successCode){
                    let { priceSystem, page } = res.obj
                    let { list, totalRecords } = page
                    this.resData = list
                    this.totalCount = totalRecords
                    this.priceSystem = priceSystem
                }
            })
        },

        // 分页
        handleCurrentChange(page){
            this.params.pageNo = page
            this.getDetail()
        },

        // 每页多少条
        handleSizeChange(size){
            this.params.pageSize = size
            this.getDetail()
        },

        // 搜索
        handleSearch(data){
            this.params = {
                pageNo: 1,
                ...data
            }
            this.getDetail()
        }
    }
}
</script>

<style lang="scss">
    @import '../place/style/place-card.scss';
</style>