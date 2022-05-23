<template>
    <div class="price-system-select-screen app-main-wrap">

        <div class="select-screen-wrap" id="app-main-wrap">
            <el-card> 
                <div class="project-introduce">
                    <el-page-header 
                        @back="$router.go(-1)"
                        title="返回"
                    > </el-page-header>
                </div>

                <div class="price-system-detail-content mt20">
                    <span class="play-type" v-if="priceSystemDetail.lockType==1">轮播</span>
                    <span class="play-type insert" v-if="priceSystemDetail.lockType==3">插播</span>

                    <div class="title">{{ priceSystemDetail.displayName }}</div>
                    <p v-if="priceSystemDetail.lockType == 1 && priceSystemDetail.priceSystemConfigCarouselTimes">
                        <span>{{ priceSystemDetail.priceSystemConfigCarouselTimes.duration }}秒</span>
                        <span>{{ priceSystemDetail.priceSystemConfigCarouselTimes.times }}次</span>
                        <span>{{ priceSystemDetail.priceSystemConfigCarouselTimes.days }}天</span>
                    </p>
                    <p v-if="priceSystemDetail.lockType == 3 && priceSystemDetail.priceSystemConfigSpot">
                        <span>{{ priceSystemDetail.priceSystemConfigSpot.duration }}秒</span>
                        <span>{{ priceSystemDetail.priceSystemConfigSpot.days }}天</span>
                    </p>
                    <p class="clearfix">失效日期：{{ priceSystemDetail.dueDateFormat || "--" }}
                        <span class="edit" @click="$refs.createPriceSystem.init(priceSystemDetail)">编辑 >></span>
                    </p>
                    <p>{{ priceSystemDetail.description }}</p>
                </div>

                <div class="mt20">
                    <div class="search-list-wrap">
                        <el-row class="search-list">
                            <el-input 
                                class="dispaly-name" 
                                size="small" 
                                clearable 
                                placeholder="屏幕名称" 
                                v-model="searchParams.displayName" 
                                @input="$debounce(getScreenList)"
                            ></el-input>
                        </el-row>
                        <el-row class="search-list">
                            <ul class="screen-type-filter">
                                <li>
                                    <span :class="{ active: !searchParams.hotPlace }" @click="$delete(searchParams, 'hotPlace'); getScreenList()">全部</span>
                                    <span :class="{ active: searchParams.hotPlace }" @click="searchParams.hotPlace=1;getScreenList()">热门商场</span>
                                    <el-divider direction="vertical"></el-divider>
                                </li>
                                <li>
                                    <span :class="{ active: !searchParams.indoor && !isNaN(searchParams.indoor) }" @click="searchParams.indoor==0 && !isNaN(searchParams.indoor) ? $delete(searchParams, 'indoor') : searchParams.indoor=0;getScreenList()">室内</span>
                                    <span :class="{ active: searchParams.indoor }" @click="searchParams.indoor==1 ? $delete(searchParams, 'indoor') : searchParams.indoor=1;getScreenList()">室外</span>
                                    <el-divider direction="vertical"></el-divider>
                                </li>
                                <li>
                                    <span :class="{ active: searchParams.resourceType==1 }" @click="searchParams.resourceType==1 ? $delete(searchParams, 'resourceType') : searchParams.resourceType=1;getScreenList()">硬广资源</span>
                                    <span :class="{ active: searchParams.resourceType==2 }" @click="searchParams.resourceType==2 ? $delete(searchParams, 'resourceType') : searchParams.resourceType=2;getScreenList()">互动资源</span>
                                </li>
                            </ul>
                        </el-row>
                        <el-row class="search-list">
                            <el-col :md="2" :sm="24"  class="title">选择地区</el-col>
                            <el-col :md="22" :sm="24">
                                <select-region @selectArea="searchParams={...searchParams, ...$event};getScreenList()"></select-region>
                            </el-col>
                        </el-row>
                        <el-row class="search-list">
                            <el-col :md="2" :sm="24"  class="title">商场品牌</el-col>
                            <el-col :md="22" :sm="24">
                                <el-button 
                                    :class="{focus: !searchParams.brand}" 
                                    @click="$delete(searchParams, 'brand');getScreenList()" 
                                    size="small">全部
                                </el-button>
                                <el-button 
                                    v-for="item in groupData"
                                    :key="item.id"
                                    @click="$set(searchParams, 'brand', item.id);getScreenList()"
                                    :class="{focus: searchParams.brand == item.id}"
                                    size="small">
                                    {{item.displayName}}
                                </el-button>
                            </el-col>
                        </el-row>
                    </div>
    
                    <div 
                        class="screen-list" 
                        v-loading="dataLoading"
                    >
                        <div class="place-content">
    
                            <div class="place-box">
                                <div class="place-p" 
                                    :style="{width: placeW}" 
                                    v-for="(item, index) in screenData" 
                                    :key="item.id"
                                >
                                    <el-card 
                                        class="place-list" 
                                        shadow="always"
                                        @click.native="$refs.editScreenPrice.showAddScreenPriceDialog(item)"
                                    >

                                        <div 
                                            class="place-img" 
                                            :style="{height: imageH+'px'}"
                                        >
                                            <el-image fit="cover" :style="{height: imageH+'px'}" :src="item.defaultShow" class="image"></el-image>
    
                                            <!-- 查看详情 -->
                                            <div class="place-detail-btn" @click.stop="handleShowDetail(item)"><i class="el-icon-tickets"> 详情</i></div>
                                            
                                            <!-- 场所名称 -->
                                            <div class="place-name" :title="item.screenName">
                                                {{item.screenName}}
                                            </div>
                                        </div>
                                        <div style="padding: 0 14px 14px">
                                            <div class="bottom bottom-place-detail clearfix">
                                                <p>大屏位置：{{ item.location }}</p>
                                                <p>大屏价格： {{ moneyFormat(item.price) }}</p>
                                            </div>
                                        </div>                    
                                    </el-card>
                                </div>
                            </div>
                        </div>
                    </div>
    
                </div>

                <el-pagination
                    class="mt20"
                    background
                    :hide-on-single-page="true"
                    layout="total, prev, pager, next, sizes"
                    :current-page="Number(searchParams.pageNo)"
                    :page-size="Number(searchParams.pageSize)"
                    @current-change="handleCurrentChange"
                    @size-change="handleSizeChange"
                    :total="totalCount">
                </el-pagination>   

                <!-- 已选择大屏的数量 -->
                <div class="price-system-bottom" v-if="priceSystemDetail.effect == 2">
                    <!-- <div class="mr20">已选择<span class="count">{{  }}</span>个大屏</div> -->
                    <el-button 
                        class="mr20" 
                        type="danger" 
                        size="small"
                        :loading="btnLoading"
                        @click="handleEffect"
                    >
                        生 效
                    </el-button>
                </div>

            </el-card>
        </div>

        <!-- 场所屏幕详情 -->
        <place-screen-detail ref="placeScreenDetail"></place-screen-detail>

        <!-- 编辑大屏价格 -->
        <edit-screen-price ref="editScreenPrice"></edit-screen-price>

        <!-- 编辑价格体系 -->
        <create-price-system 
            ref="createPriceSystem"
            @createSuccess="getScreenList()"
        ></create-price-system>

    </div>
</template>

<script>
import { priceSystemDetail, priceSystemEffect } from '@/api/priceSystem'
import SelectRegion from '@/components/SelectRegion/index'
import { getOrganizationList, screenSizeWatch } from '@/mixins'
import PlaceScreenDetail from '@/views/project/projectView/locating/components/PlaceScreenDetail'
import EditScreenPrice from './components/EditScreenPrice'
import CreatePriceSystem from './components/CreatePriceSystem'
import { priceFormat } from '@/utils/index'

export default {
    components: {
        SelectRegion,
        PlaceScreenDetail,
        EditScreenPrice,
        CreatePriceSystem
    },
    mixins: [getOrganizationList, screenSizeWatch],
    data(){
        return {
            searchParams: {
                pageNo: 1,
                pageSize: 20
            },

            // 价格体系详情
            priceSystemDetail: {},

            // 屏幕列表加载中
            dataLoading: false,
            
            // 屏幕列表
            screenData: [],

            // 屏幕总数
            totalCount: 0,

            // 屏幕开始结束 默认日期
            defaultDate: {},

            addParams: {},

            // 生效提交loading
            btnLoading: false
        }
    },
    computed: {
        // 金额格式化
        moneyFormat(){
            return (key) => {
                return priceFormat(key)
            }
        },
    },
    mounted() {
        this.getScreenList()
    },
    methods: {
        // 获取屏幕列表
        getScreenList(){
            this.dataLoading = true
            this.searchParams.id = this.$route.params.id
            priceSystemDetail(this.searchParams).then(res => {
                this.dataLoading = false
                if(res.code === this.$successCode){
                    let { list, totalRecords } = res.obj.page
                    this.screenData = list
                    this.totalCount = totalRecords
                    this.priceSystemDetail = res.obj.priceSystem
                }
            })
        },

        // 屏幕列表分页
        handleCurrentChange(page){
            this.searchParams.pageNo = page
            this.getScreenList()
        },

        // 每页多少条
        handleSizeChange(size){
            this.searchParams.pageSize = size
            this.getScreenList()
        },

        // 大屏地址  省市区 拼接
        addressJoint(row){
            return `${row.proName ? row.proName+'  ' : ''}${row.cityName ? row.cityName+'  ' : ''}${row.areaName ? row.areaName : ''}`;
        },


        // 查看屏幕详情
        handleShowDetail({ media, priceSystem }){
            this.$refs.placeScreenDetail.showDetail(media, priceSystem)
        },

        // 价格体系生效
        handleEffect(){
            this.$confirm(
                '此价格体系生效后将被投入使用',
                "提示",
                {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning",
                    center: true,
                }
            ).then(() => {
                this.btnLoading = true
                priceSystemEffect(this.$route.params.id).then(res => {
                    this.btnLoading = false
                    if(res.code === this.$successCode){
                        this.$message.success('操作成功~')
                        this.getScreenList()
                    }
                })
            })
        }
    }
}
</script>

<style lang="scss">
@import '../place/style/place-card.scss';
    .price-system-select-screen{
        position: relative;
        
        .select-screen-wrap{
            padding-bottom: 50px;

            .price-system-detail-content{
                background: #e3fdfd;
                padding: 20px;
                border-radius: 6px;
                overflow: hidden;
                position: relative;

                .play-type{
                    font-size: 14px;
                    position: absolute;
                    top: 0;
                    right: 0;
                    padding: 10px 20px;
                    background: #CEB5FF;
                    z-index: 99;

                    &.insert{
                        background: #ECDDC7;
                    }
                }

                .title{
                    font-weight: bold;
                    padding-bottom: 10px;
                }

                p{
                    line-height: 26px;
                    font-size: 14px;

                    span.edit{
                        float: right;
                        color: var(--color-primary);
                        text-decoration: underline;
                        cursor: pointer;
                    }
                }
            }

            .screen-type-filter{
                display: flex;

                li{

                    span{
                        font-size: 14px;
                        display: inline-block;
                        padding: 5px 10px;
                        border-radius: 4px;
                        margin: 0 10px;
                        cursor: pointer;

                        &.active{
                            background: var(--color-primary);
                            color: #fff;
                        }
                    }

                    &:first-child {
                        span:first-child{
                            margin-left: 0;
                        }
                    }
                }
            }
        }
        
        .place-content{
            padding: 20px;
            background: #f2f2f2;
            border-radius: 16px;
            position: relative;

            .place-list{
                cursor: pointer;
                position: relative;

                .place-img{
                    border-radius: 4px;
                }

                .place-detail-btn{
                    position: absolute;
                    top: 0;
                    right: 0;
                    z-index: 99;
                    padding: 8px;
                    background: var(--color-primary);
                    color: #fff;
                    font-size: 14px;
                    border-radius: 4px;
                }

                .place-name{
                    font-size: 16px;
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    z-index: 99;
                    width: 100%;
                    height: 25px;
                    line-height: 25px;
                    text-indent: 10px;
                    background: rgba(0, 0, 0, 0.7);
                    color: #fff;

                    span{
                        float: right;
                        padding-right: 10px;
                    }
                }

                .bottom-place-detail p{
                    font-size: 13px;
                    color: #999;
                    line-height: 24px;
                }
            }
        }

        .price-system-bottom{
            position: fixed;
            bottom: 0;
            left: 0;
            z-index: 999;
            width: 100%;
            height: 60px;
            display: flex;
            align-items: center;
            justify-content: end;
            background: #eeeeee;
            border-top: 1px solid #e5e5e5;

            span.count{
                color: var(--color-danger);
                font-weight: bold;
                font-size: 18px;
                padding: 0 10px;
            }

            .el-button{
                margin-right: 40px;
            }
        }
    }
</style>
