<template>
    <div class="app-main-wrap screen-list-wrap" id="app-main-wrap">
        <search @searchResult="search"></search>
        <div v-if="!tLoading && !resData.length" style="margin: 20px;text-align:center">暂无数据~</div>
            <div v-else class="place-content">
                <div class="place-box" v-loading="tLoading">
                    <div class="place-p" :style="{width: placeW}" v-for="item in resData" :key="item.id">
                        <el-card 
                            class="place-list" 
                            shadow="always"
                        >
                            <div class="place-img">
                                <img src="https://game.xfengjing.com/app/upload/market/photo/SNeDQguJTPQdWASQB0FuGF3xk5sjkooJZaAPxmAB.jpeg" class="image">
                                <!-- 屏幕状态 -->
                                <el-tag class="status" type="success" effect="dark">在线</el-tag>
                                <!-- 收藏 -->
                                <el-button 
                                    class="icon-button collect" 
                                    size="small" 
                                    type="danger" 
                                    slot="reference" 
                                    icon="el-icon-star-off"  
                                    title="收藏">
                                </el-button>
                            
                            </div>
                            <div style="padding: 14px;">
                                <div class="place-title">
                                    <span class="name" @click="$router.push('/screen/details/11')">万达</span>
                                </div>
                                <div class="specification">
                                    <ul>
                                        <li>
                                            <el-tooltip class="item" effect="dark" content="点距规格" placement="top">
                                                <span>P3</span>
                                            </el-tooltip>
                                        </li>
                                        <li>
                                            <el-tooltip class="item" effect="dark" content="分辨率" placement="top">
                                                <span>1920 x 1080</span>
                                            </el-tooltip>
                                        </li>
                                        <li>
                                            <el-tooltip class="item" effect="dark" content="宽高比" placement="top">
                                                <span>21 : 9</span>
                                            </el-tooltip>
                                        </li>
                                    </ul>
                                </div>
                                <div class="bottom clearfix">
                                    <div class="adress" title="点击查看位置" @click="showMap=true">
                                        <i class="el-icon-location-information"></i>北京市通州区
                                    </div>
                                    <div class="place-logo">
                                        <img src="https://game.xfengjing.com/app/upload/market/photo/7YmAs4QpmOCRNvD84Imkw8MQq7Ctdt1sr3d5kS8S.png" alt="中粮" title="中粮">
                                    </div>
                                </div>
                            </div>                    
                        </el-card>
                    </div>

                </div>

                <el-pagination
                    background
                    layout="total, prev, pager, next, sizes"
                    :page-sizes="[20, 30, 40, 50]"
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :total="totalCount">
                </el-pagination>
            </div>

        <!-- 查看地理位置  地图 -->
        <el-dialog
            width="640px"
            :title="currentScreen.displayName"
            :visible.sync="showMap"
            append-to-body>
            <p>{{currentScreen.address}}</p>
            <div style="width: 600px;height: 400px">
                <the-map 
                    v-if="showMap"
                    :lng="currentScreen.longitude"
                    :lat="currentScreen.latitude"
                    :visible="true"
                ></the-map>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="showMap=false">确 定</el-button>
            </span>
        </el-dialog>
        
    </div>
</template>

<script>
import Search from './components/Search';
import TheMap from '@/components/BaiduMap/index';
import { screenSizeWatch } from '@/mixins';
export default {
    mixins: [screenSizeWatch],
    data(){
        return {
            tLoading: false,
            resData: [{}, {}, {}, {}, {}, {}],
            params: {
                pageNo: 1,
                pageSize: 20,
            },
            totalCount: 0,
            currentScreen: {},    
            showMap: false,                      //显示地图   
        }
    },
    methods: {
        init(){

        },

        //搜索
        search(params){
            this.params = {
                ...this.params,
                ...params,
                pageNo: 1
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
    },
    components: {
        Search,
        TheMap
    }
}
</script>
<style lang="scss" scope>
    @import '../place/list/style/place-card.scss';
    .screen-list-wrap{
        .place-content .place-box .place-list{
            height: 265px;
        }
        .specification{
            overflow: hidden;
            margin-top: 5px;
            li{
                float: left;
                margin-right: 15px;
                font-size: 14px;
                color: #666;
            }
        }
        .place-img{
            .status{
                position: absolute;
                top: 0;
                left: 0;
                border-radius: 0;
                border-bottom-right-radius: 3px;
            }
        }
    }
</style>