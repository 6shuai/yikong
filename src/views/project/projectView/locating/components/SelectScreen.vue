<template>
    <div class="locating-select-screen app-main-wrap">

        <div class="select-screen-wrap" id="app-main-wrap" v-if="!showCapturing">
            <el-card> 
                <div class="project-introduce">
                    <el-page-header 
                        @back="$router.go(-1)"
                        title="返回"
                    > </el-page-header>
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
                            
                            <!-- 全选 -->
                            <div class="right-checkbox mb10">
                                <el-checkbox v-model="isSelectedAll" @change="handleSelectAll">全选</el-checkbox>
                            </div>

                            <!-- {{ screenIds }}
                            <p>{{ againIds }}</p> -->
                            
                            <div class="place-box">
                                <div class="place-p" 
                                    :style="{width: placeW}" 
                                    v-for="(item, index) in placeData" 
                                    :key="item.id"
                                >
                                    <el-card 
                                        class="place-list" 
                                        shadow="always"
                                        @click.native="handleSelectScreen(item)"
                                    >

                                        <div class="mask" v-if="(screenIds[searchParams.pageNo-1] && screenIds[searchParams.pageNo-1].includes(item.id)) || againIds.includes(item.id)"></div>
    
                                        <div 
                                            class="place-img" 
                                            :style="{height: imageH+'px'}"
                                        >
                                            <el-image fit="cover" :style="{height: imageH+'px'}" :src="item.defaultShow" class="image"></el-image>
    
                                            <!-- 查看详情 -->
                                            <div class="place-detail-btn" @click.stop="handleShowDetail(item.id)"><i class="el-icon-tickets"> 详情</i></div>
                                            
                                            <!-- 场所名称 -->
                                            <div class="place-name" :title="item.displayName">
                                                {{item.displayName}}
                                                <span v-if="item.screenCount>1">{{ item.location }}</span>
                                            </div>
                                        </div>
                                        <div style="padding: 0 14px 14px">
                                            <div class="bottom bottom-place-detail clearfix">
                                                <p class="level-and-price">
                                                    <el-tag size="small">{{ item.levelName }}</el-tag>
                                                    <span class="price ml10">{{ item.showPrice }}</span>
                                                </p>
                                                <p class="overflow" :title="addressJoint(item) + item.address">
                                                    <font-awesome-icon :icon="['fas', 'location-arrow']" />{{addressJoint(item)}}  {{item.address}}
                                                </p>
                                            </div>
                                        </div>                    
                                    </el-card>
                                </div>
                            </div>
                        </div>
                    </div>
    
    
                    <!-- 已选的大屏 -->
                    <div class="selected-screen-list">
                        
                        <!-- 大屏列表 -->
                        <div class="screen-list-wrap" :class="{ 'show-screen-list': showSelectedList }">
                            <el-scrollbar class="hidden-scroll-x screen-scrollbar">
                                <span v-for="(item, sindex) in selectedScreenList.concat(againData)" :key="sindex">
                                   <div 
                                       class="item" 
                                       v-for="screen in item"
                                       :key="screen.id"
                                   >
                                       <div class="screen-img">
                                           <el-image fit="cover" :src="screen.defaultShow"></el-image>
                                           <i class="el-icon-error" @click="handleSelectScreen(screen)"></i>
                                       </div>
                                       <p class="screen-name overflow">{{ screen.displayName }}</p>
                                   </div>
                               </span>
                            </el-scrollbar>
                        </div>
    
    
                        <div class="screen-count-wrap">
                            <div class="screen-count mr10" @click="showSelectedList = !showSelectedList">
                                <i class="el-icon-monitor"></i>
                                预选大屏
                                <span>{{ selectedScreenList.flat().length + againData.length }}</span>
                                个
                                <i :class="showSelectedList ? 'el-icon-arrow-up' : 'el-icon-arrow-down' "></i>
                            </div>
                            <el-button 
                                type="info" 
                                size="small"
                                :disabled="!(selectedScreenList.flat().length + againData.length)"
                                @click="handleNextStep"
                            >
                                下一步 >>
                            </el-button>
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

            </el-card>
        </div>

        <!-- 场所屏幕详情 -->
        <place-screen-detail ref="placeScreenDetail"></place-screen-detail>

        <!-- 锁位 -->
        <capturing 
            ref="captuing" 
            v-if="showCapturing"
            :selectedScreenList="selectedScreenList.concat(againData)"
        ></capturing>

    </div>
</template>

<script>
import { projectLocationScreenList } from '@/api/project'
import SelectRegion from '@/components/SelectRegion/index'
import { getOrganizationList, screenSizeWatch } from '@/mixins'
import Capturing from './Capturing'
import PlaceScreenDetail from './PlaceScreenDetail'

export default {
    components: {
        SelectRegion,
        Capturing,
        PlaceScreenDetail
    },
    mixins: [getOrganizationList, screenSizeWatch],
    data(){
        return {
            searchParams: {
                pageNo: 1,
                pageSize: 20
            },

            // 屏幕列表加载中
            dataLoading: false,
            
            // 屏幕列表
            placeData: [],

            // 屏幕总数
            totalCount: 0,

            // 屏幕开始结束 默认日期
            defaultDate: {},

            addParams: {},

            // 是否全选
            isSelectedAll: false,

            // 显示已选中的屏幕列表
            showSelectedList: false,

            // 已选中场所id
            screenIds: [],

            // 已选中的屏幕
            selectedScreenList: [],

            // 再次预定的屏幕
            againData: [],

            // 再次预定的屏幕id
            againIds: [],

            // 寻位提交loading
            btnLoading: false,

            // 是否显示下一步
            showCapturing: false
        }
    },
    mounted() {
        if(!this.$store.state.project.playRuleData){
            this.$router.push(`/project/${this.$route.params.id}/locating`)
        }else{
            this.getScreenList()
            if(this.$store.state.project.againReserveData){
                let { orderedScreens } = this.$store.state.project.againReserveData
                this.againData = []
                for(let i = 0; i < orderedScreens.length; i++){
                    let { name, id, photo, price, location } = orderedScreens[i]

                    let data = {
                        displayName: name,
                        defaultShow: photo,
                        location,
                        id,
                        price
                    }
                    this.againIds.push(id)
                    this.againData.push(data)
                }
            }
        }
    },
    methods: {
        // 获取屏幕列表
        getScreenList(){
            this.dataLoading = true
            this.searchParams.priceSystem = this.$store.state.project.playRuleData.priceSystem
            projectLocationScreenList(this.searchParams).then(res => {
                this.dataLoading = false
                if(res.code === this.$successCode){
                    let { list, totalRecords } = res.obj
                    this.placeData = list
                    this.totalCount = totalRecords

                    this.isSelectedAll = !this.screenIds[this.searchParams.pageNo-1] ? false : this.screenIds[this.searchParams.pageNo-1].length === this.placeData.length


                    for(let i = 0; i < list.length; i++){
                        if(this.againIds.includes(list[i].id)){
                            // this.screenIds[this.searchParams.pageNo-1].push(list[i].id)
                            this.handleSelectScreen(list[i])
                            let index = this.againIds.findIndex((item) => item == list[i].id)
                            this.$delete(this.againIds, index)
                            this.$delete(this.againData, index)
                        }
                    }
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
            this.screenIds = []
            this.selectedScreenList = []
            this.getScreenList()
        },

        // 大屏地址  省市区 拼接
        addressJoint(row){
            return `${row.proName ? row.proName+'  ' : ''}${row.cityName ? row.cityName+'  ' : ''}${row.areaName ? row.areaName : ''}`;
        },

        // 选择屏幕
        handleSelectScreen(data){
            let page = this.searchParams.pageNo - 1

            if(!this.screenIds[page]) this.screenIds[page] = []
            if(!this.selectedScreenList[page]) this.selectedScreenList[page] = []

            if(this.screenIds[page].includes(data.id)){
                let index = this.screenIds[page].findIndex((item) => item == data.id)
                this.$delete(this.screenIds[page], index)
                this.$delete(this.selectedScreenList[page], index)
            }else{
                this.screenIds[page].push(data.id)
                this.$set(this.screenIds, page, this.screenIds[page])
                this.selectedScreenList[page].push(data)
                this.$set(this.selectedScreenList, page, this.selectedScreenList[page])
            }
            this.isSelectedAll = this.screenIds[page].length === this.placeData.length
        },

        // 全选
        handleSelectAll(){
            let page = this.searchParams.pageNo - 1

            if(!this.screenIds[page]) this.screenIds[page] = []
            if(!this.selectedScreenList[page]) this.selectedScreenList[page] = []

            if(this.screenIds[page].length === this.placeData.length){
                this.screenIds[page] = []
                this.selectedScreenList[page] = []
                this.isSelectedAll = false
            }else{
                this.screenIds[page] = []
                this.selectedScreenList[page] = []
                for(let i = 0 ; i < this.placeData.length; i++){
                    this.screenIds[page].push(this.placeData[i].id)
                    this.selectedScreenList[page].push(this.placeData[i])
                }
                this.isSelectedAll = true
            }
        },

        // 查看屏幕详情
        handleShowDetail(id){
            this.$refs.placeScreenDetail.showDetail(id)
        },

        // 点击下一步
        handleNextStep(){
            this.showCapturing = true
        }
    }
}
</script>

<style lang="scss">
@import '../../../../place/style/place-card.scss';
    .locating-select-screen{
        position: relative;
        
        .select-screen-wrap{
            padding-bottom: 50px;

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

            .right-checkbox{
                text-align: right;
                font-size: 18px;
            }

            .place-list{
                cursor: pointer;
                position: relative;

                .mask{
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    z-index: 10;
                    background: rgba(32,160,255,0.4);
                }

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

                    .price{
                        font-size: 18px;
                        font-weight: bold;
                    }
                }
            }
        }

        .selected-screen-list{
            position: fixed;
            bottom: 0;
            left: 0;
            z-index: 99;
            width: 100%;
            height: 50px;
            background: #fff;
            border-top: 1px solid rgb(177, 177, 177);

            .screen-count-wrap{
                height: 50px;
                display: flex;
                justify-content: flex-end;
                align-items: center;
                padding-right: 20px;

                .screen-count{
                    cursor: pointer;

                    .el-icon-monitor, span{
                        color: var(--color-info);
                        font-weight: bold;
                        font-size: 18px;
                    }
                }
            }

            .screen-list-wrap{
                position: absolute;
                top: 50px;
                z-index: 9999;
                right: 45px;
                width: 500px;
                height: 200px;
                background: #f2f2f2;
                border-radius: 6px;
                box-shadow: 0 2px 12px 0 rgba(0,0,0,0.5);
                cursor: pointer;
                opacity: 0;
                transition: all .3s;

                &.show-screen-list{
                    opacity: 1;
                    top: -206px;
                }

                .screen-scrollbar{
                    height: 180px;
                }

                .item{
                    display: inline-block;
                    width: 140px;
                    padding: 20px 0 0 20px;
                    margin-right: 20px;

                    .screen-img{
                        width: 136px;
                        height: 80px;
                        background: #fff;
                        border: 2px solid transparent;
                        position: relative;

                        .el-image{
                            width: 100%;
                            height: 100%;
                        }

                        .el-icon-error{
                            position: absolute;
                            top: -5px;
                            right: -5px;
                            color: var(--color-info);
                            background: #fff;
                            border-radius: 50%;
                            font-size: 20px;
                            opacity: 0;
                            cursor: pointer;
                            transition: all .3s;

                            &:hover{
                                transform: scale(1.2);
                            }
                        }
                    }

                    .screen-name{
                        text-align: center;
                        line-height: 24px;
                    }


                    &:hover{
                        .screen-img{
                            border-color: var(--color-info);
                            .el-icon-error{
                                opacity: 1;
                            }
                        }
                    }
                }
            }
        }
    }
</style>
