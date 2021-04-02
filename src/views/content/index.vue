<template>
    <div class="app-main-wrap content-list-wrap" id="app-main-wrap">
        <!-- 筛选项 -->
        <search @searchResult="search" ref="search"></search>

        <el-pagination
            v-if="resData.length"
            small
            class="mb10"
            background
            layout="total, prev, pager, next"
            :current-page="Number(params.pageNo)"
            @current-change="handleCurrentChange"
            :total="totalCount">
        </el-pagination>

        <!-- 内容列表 -->
        <div v-if="!dataLoading && !resData.length" style="margin: 20px;text-align:center">
            暂无数据~
        </div>
        <div v-else class="place-content" v-loading="dataLoading">
            <div class="place-box">
                <div class="place-p" :style="{width: placeW}" v-for="(item, index) in resData" :key="index">
                    <content-list :item="item" :index="index" :imageH="imageH"></content-list>
                </div>
            </div>
        </div>

        <el-pagination
            v-if="resData.length"
            background
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
import { contentList } from '@/api/content';
import { screenSizeWatch } from '@/mixins';
import Search from './components/Search';
import ContentList from '@/views/content/components/ContentList';
export default {
    mixins: [screenSizeWatch],
    data(){
        return {
            sort: 1,
            showList: true,
            dataLoading: false,
            resData: [],
            params: {
                userId: this.$store.state.user.loginData.id,
                pageNo: 1,
                pageSize: 48
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
            this.dataLoading = true;
            contentList(this.params).then(res => {
                this.dataLoading = false;
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

        //筛选 搜索
        search(params){
            this.params = {
                ...params,
                pageNo: 1,
                pageSize: this.params.pageSize,
                userId: this.$store.state.user.loginData.id
            };
            this.init();
        }
    },
    components: {
        Search,
        ContentList
    }
}
</script>
<style lang="scss" scope>
    .content-list-wrap{
        .content-top{
            padding-bottom: 20px;
            .created-btn{
                margin-right: 20px;
            }
            .sort{
                display: inline-block;
                &-title{
                    color: #999;
                    margin-right: 5px;
                    font-size: 14px;
                }
            }
            .el-input{
                display: inline-block;
                width: 200px;
                margin-left: 10px;
            }
        }
        .group-title{
            line-height: 24px;
            color: #4c4c4c;
            margin-bottom: 12px;
            cursor: pointer;
            &:hover{
                color: red;
            }
            span{
                margin-left: 5px;
            }
        }
    }
</style>