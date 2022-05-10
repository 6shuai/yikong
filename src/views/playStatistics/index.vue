<template>
    <div class="play-statistics-wrap">
        <div class="left-screen-list" v-loading="screenLoading">
            <div class="head-wrap">
                <el-input 
                    clearable
                    prefix-icon="el-icon-search"
                    v-model="screenName"
                    @input="$debounce(getScreenList)"
                ></el-input>
            </div>
            <el-scrollbar class="screen-list hidden-scroll-x">
                <div 
                    class="screen-group-wrap"
                    v-for="(group, groupName, index) in screenData"
                    :key="index"
                >
                    <div class="group-title">{{ groupName }}</div>
                    <ul>
                        <li 
                            v-for="(item, subIndex) in group" 
                            :key="item.id"
                            :class="{ 'active': screenId == item.id }"
                            @click="getScreenPlayDate(item)"
                        >
                            <span class="title overflow">{{ item.displayName }} {{ item.location ? `(${item.location})` : '' }}</span>
                            <span class="collection" @click="handleFavorite(item)"><i :class="item.isFavorite ? 'el-icon-star-on' : 'el-icon-star-off'"></i></span>
                        </li>
                    </ul>
                </div>

            </el-scrollbar>
        </div>
        <div class="right-content" v-if="!selectedScreenName">
            <el-empty></el-empty>
        </div>
        <div class="right-content" v-if="selectedScreenName">
            <div class="title">{{ selectedScreenName }}</div>
            <div class="fliter-wrap mt10">
                <el-input 
                    prefix-icon="el-icon-search" 
                    clearable
                    v-model="params.displayName"
                    @input="$debounce(handleSearch)"
                ></el-input>
                <div class="filter-item mt10">
                    <div class="play-date">
                        <span>监播日期</span>
                        <el-date-picker
                            v-model="filterDate"
                            @change="handleChangeDate()"
                            type="daterange"
                            value-format="yyyy-MM-dd"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期">
                        </el-date-picker>
                    </div>
                    <ul>
                        <li 
                            v-for="(type, tIndex) in contentType" 
                            :key="tIndex"
                            :class="{ active: type.id == currentContentType }"
                            @click="currentContentType = type.id; params.contentType = type.id; handleSearch()"
                        >
                            {{ type.name }}
                        </li>
                    </ul>
                </div>
            </div>  

            <div class="content-wrap" v-loading="dataLoading">
                <div class="download-wrap">
                    <el-button 
                        type="primary" 
                        size="small"
                        icon="el-icon-upload"
                        @click="download"
                    >导出</el-button>
                </div>

                <el-scrollbar class="mt10 hidden-scroll-x">
                    <screen-play-list v-if="!params.displayName" ref="screenPlayList"></screen-play-list>
                    <content-play-list v-else ref="contentPlayList"></content-play-list>

                    <el-empty v-if="!dataLoading && !this.resData.length"></el-empty>

                    <el-pagination
                        background
                        :hide-on-single-page="true"
                        layout="total, prev, pager, next, sizes"
                        :current-page="Number(params.pageNo)"
                        :page-size="Number(params.pageSize)"
                        @current-change="handleCurrentChange"
                        @size-change="handleSizeChange"
                        :total="totalCount">
                    </el-pagination>   

                </el-scrollbar>
                
            </div>
        </div>

    </div>
</template>

<script>
import { getScreenGoupList } from '@/api/contentManage'
import { operateContentPlayStatistics } from '@/api/playStatistics'
import { screenFavorite } from '@/api/screen'
import ScreenPlayList from './components/ScreenPlayList'
import ContentPlayList from './components/ContentPlayList'
import qs from 'qs'

export default {
    components: {
        ScreenPlayList, 
        ContentPlayList
    },
    data() {
        return {
            // 屏幕列表
            screenData: {},

            // 按屏幕名称搜索
            screenName: '',

            // 屏幕列表数据加载中
            screenLoading: false,

            // 选中的屏幕id
            screenId: null,

            // 选中屏幕名称
            selectedScreenName: undefined,

            // 筛选日期
            filterDate: undefined,

            // 内容类型
            contentType: [
                { id: 0, name: '全部' },
                { id: 4, name: '图集' },
                { id: 2, name: '视频' },
                { id: 1, name: '图片' },
                { id: 3, name: '游戏' },
            ],

            // 当前内容类型
            currentContentType: 0,

            // 监播数据
            resData: [],

            // 数据加载中 
            dataLoading: [],

            // 监播数据总条数
            totalCount: 0,

            params: {}
        }
    },
    mounted() {
        this.getScreenList()
    },
    methods: {
        getScreenList(){
            this.screenLoading = true
            getScreenGoupList({ displayName: this.screenName }).then(res => {
                this.screenLoading = false
                this.screenData = res.obj
            })
        },

        // 收藏或取消收藏
        handleFavorite({ isFavorite, id }){
            let data = {
                isFavorite: isFavorite ? 0 : 1,
                screenId: id,
                userId: this.$store.state.user.loginData.id,
            };
            let s = `?isFavorite=${data.isFavorite}&screenId=${data.screenId}&userId=${data.userId}`
            screenFavorite(s).then(res => {
                if(res.code === this.$successCode){
                    this.$message.success('操作成功~')
                    this.getScreenList()
                }
            })
        },

        // 点击左侧屏幕列表
        getScreenPlayDate({ id, displayName, location }){
            this.selectedScreenName = displayName + (location ? `(${location})` : '')
            this.screenId = id

            this.params = {
                screenId: id,
                pageNo: 1,
                pageSize: 40
            }
            this.getPlayData(id)
        },

        // 监播数据
        getPlayData(){
            this.dataLoading = true
            if(!this.params.contentType) delete this.params.contentType
            operateContentPlayStatistics(this.params).then(res => {
                this.dataLoading = false
                let { list, totalRecords } = res.obj
                this.resData = list
                this.totalCount = totalRecords
                if(!this.params.displayName) this.$refs.screenPlayList.contentPlayData(this.resData, this.params.screenId)
                else this.$refs.contentPlayList.contentPlayData(this.resData, this.params.screenId)
            })
        },

        // 选择监播日期
        handleChangeDate(){
            if(this.filterDate && this.filterDate.length){
                this.params.beginTime = this.filterDate[0]
                this.params.endTime = this.filterDate[1]
            }else{
                delete this.params.beginTime
                delete this.params.endTime
            }
            this.handleSearch()
        },

        // 分页
        handleCurrentChange(page){
            this.params.pageNo = page
            this.getPlayData()
        },

        // 每页多少条
        handleSizeChange(size){
            this.params.pageSize = size
            this.getPlayData()
        },

        // 搜索
        handleSearch(){
            this.params.pageNo = 1
            this.getPlayData()
        },

        //导出
		download() {
			window.open(
				`${document.location.origin}/user/project/exportMaterialPlaybackData?${qs.stringify(this.params)}`
			);
		}
    }

}
</script>

<style lang="scss" scoped>
    $bgColor: #F2F3F5;
    $mainColor: #0283C6;

    .play-statistics-wrap{
        display: flex;
        height: calc(100vh - 72px);
        background: #fff;
        
        .left-screen-list{
            width: 300px;
            background: #F3F3F4;

            .head-wrap{
                padding: 20px;
                display: flex;
                align-items: center;
                border-bottom: 1px solid #e5e5e5;
                
                .head-right-icon{
                    font-size: 18px;
                    margin-left: 10px;
                    cursor: pointer;
                }

                .el-input{
                    flex: 1;
                }
            }

            .screen-list{
                height: calc(100vh - 153px);

                .screen-group-wrap{
                    .group-title{
                        font-size: 12px;
                        color: #999;
                        padding: 10px;
                    }

                    li{
                        padding: 15px 20px;
                        line-height: 21px;
                        cursor: pointer;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                        display: flex;
                        align-items: center;

                        &.active{
                            background: #0283C6;
                            color: #fff;
                        }

                        &:hover{
                            background: #0283C6;
                            color: #fff;

                            .collection{
                                display: block;
                            }
                        }

                        .title{
                            flex: 1;
                        }

                        .collection{
                            width: 30px;
                            font-size: 20px;
                            display: none;

                            .el-icon-star-on{
                                color: #e6a23c;
                            }
                        }
                    }
                }
            }
        }

        .right-content{
            margin: 10px 20px;
            flex: 1;
            display: flex;
            flex-direction: column;

            .title{
                padding: 20px;
                border-radius: 12px;
                background: $bgColor;
            }

            .fliter-wrap{
                padding: 20px;
                background: $bgColor;
                border-radius: 12px;

                .filter-item{
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    font-size: 14px;

                    .play-date{
                        height: 40px;
                        line-height: 40px;
                        background: #fff;
                        border-radius: 6px;
                        overflow: hidden;

                        span{
                            display: inline-block;
                            padding: 0 10px;
                            background: $mainColor;
                            color: #fff;
                        }

                        .el-range-editor.el-input__inner{
                            border: none;
                        }
                    }

                    ul{
                        background: #fff;
                        border-radius: 6px;
                        overflow: hidden;

                        li{
                            display: inline-block;
                            height: 40px;
                            line-height: 40px;
                            padding: 0 20px;
                            color: $mainColor;
                            cursor: pointer;

                            &.active{
                                background: $mainColor;
                                color: #fff;
                            }
                        }
                    }
                }
            }

            .content-wrap{
                margin-top: 20px;
                flex: 1;
                background: $bgColor;
                border-radius: 6px;
                padding: 20px;

                .download-wrap{
                    text-align: right;
                }

                .el-scrollbar{
                    height: calc(100% - 50px);
                }
            }
        }
    }
</style>