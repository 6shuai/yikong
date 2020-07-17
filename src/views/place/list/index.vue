<template>
    <div class="place-list-wrap" id="app-main-wrap">
        <div class="app-main-wrap">
            <!-- 筛选 -->
            <search @searchResult="search" ref="search"></search>

            <div v-if="!tLoading && !resData.length" style="margin: 20px;text-align:center">暂无数据~</div>
            <div v-else class="place-content">
                <div class="place-box" v-loading="tLoading">
                    <div class="place-p" :style="{width: placeW}" v-for="(item, index) in resData" :key="item.id">
                        <el-card 
                            class="place-list" 
                            shadow="always"
                        >
                            <div 
                                class="place-img" 
                                :style="{height: imageH+'px'}"
                                @click.stop="$router.push(`/place/details/${item.id}`)"
                            >
                                <el-image fit="cover" :style="{height: imageH+'px'}" :src="item.defaultShow" class="image"></el-image>
                                <!-- 收藏 -->
                                <el-button 
                                    v-if="item.isFavorite"
                                    class="icon-button collect" 
                                    size="small" 
                                    type="info" 
                                    slot="reference" 
                                    icon="el-icon-star-off" 
                                    title="已收藏"
                                >
                                </el-button>
                            
                            </div>
                            <div style="padding: 14px;">
                                <div class="place-title">
                                    <span class="name" @click="$router.push(`/place/details/${item.id}`)">({{item.id}}){{item.displayName}}</span>
                                    <span class="place-type">
                                        <el-tag
                                            size="mini"
                                            effect="plain">
                                            {{item.placeTypeName}}
                                        </el-tag>
                                    </span>
                                </div>
                                <div class="bottom clearfix">
                                    <div class="adress overflow" :title="addressJoint(item) + item.address" @click="showMapDialog(item)">
                                        <font-awesome-icon :icon="['fas', 'location-arrow']" />{{addressJoint(item)}}  {{item.address}}
                                    </div>
                                    <div class="place-logo" :title="item.organizationName">
                                        <span><font-awesome-icon :icon="['far', 'building']"></font-awesome-icon>{{item.organizationName}}</span>
                                    </div>
                                </div>
                            </div>                    
                        </el-card>
                    </div>

                </div>
                <el-pagination
                    v-if="pageshow"
                    background
                    layout="total, prev, pager, next, sizes"
                    :page-sizes="[48, 80, 100]"
                    :current-page="Number(params.pageNo)"
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :total="totalCount">
                </el-pagination>
            </div>
        </div>

        <!-- 查看地理位置  地图 -->
        <map-dialog ref="mapDialog"></map-dialog>

        <div id="allmap"></div>
    </div>
</template>

<script>
import { placeList } from '@/api/place';
import Search from './components/Search';
import TheMap from '@/components/BaiduMap/index';
import BMap from 'BMap'
import MapDialog from '@/components/BaiduMap/MapDialog';
import { screenSizeWatch } from '@/mixins';

export default {
    mixins: [screenSizeWatch],
    data(){
        return {
            params: {
                pageNo: 1,
                pageSize: 48,
                userId: this.$store.state.user.loginData.id
            },
            showMap: false,                //地图
            currentPlace: {},              //选中的场所参数
            resData: [],
            totalCount: 0,                //总条数
            tLoading: true,
            pageshow: false
        }
    },
    mounted() {
        this.getLocation();
        if(this.$route.query.pageNo) {
            this.params = JSON.parse(JSON.stringify(this.$route.query));
            this.$refs.search.searchParams = this.params;
        }
        this.init();
    },
    methods: {
        //场所列表
        init(){
            this.tLoading = true;
            placeList(this.params).then(res => {
                this.tLoading = false;
                this.pageshow = true;
                this.$nextTick(() => {
                    this.$router.push({
                        query: {
                            ...this.params,
                        }
                    })
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
        },

        //场所地址  省市区 拼接
        addressJoint(row){
            return `${row.proName ? row.proName+'  ' : ''}${row.cityName ? row.cityName+'  ' : ''}${row.areaName ? row.areaName : ''}`;
        },

        //定位 获取浏览器定位
        getLocation(){
            if(!localStorage.lng || !localStorage.lat){
                var map = new BMap.Map("allmap");
                var geolocation = new BMap.Geolocation();
                geolocation.getCurrentPosition(function(r){
                    if(this.getStatus() == BMAP_STATUS_SUCCESS){
                        localStorage.lng = r.point.lng;
                        localStorage.lat = r.point.lat;
                    }       
                });
            }
        },

        //点击位置 显示地图信息
        showMapDialog(data){
            if(data.longitude && data.latitude){
                this.$refs.mapDialog.showMapDialog(data);
            }
        }
    },
    components: {
        Search,
        TheMap,
        MapDialog
    }
}
</script>
<style lang="scss" scope>
    @import '../../../styles/variables.scss';
    @import './style/place-card.scss';
</style>