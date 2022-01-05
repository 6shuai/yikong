<template>
    <div class="app-main-wrap content-list-wrap" id="app-main-wrap">
        <div class="content-top">
            <el-button 
                v-if="hasPerm($route.meta.permission, 'AddTimeline')"
                class="created-btn"
                type="primary" 
                icon="el-icon-plus" 
                @click="$router.push('/timeline/add')"
                size="small">
                创建时间轴
            </el-button>
            <el-input 
                prefix-icon="el-icon-search" 
                clearable
                v-model="params.name" 
                placeholder="时间轴名称" size="small"
                @input="search"
            ></el-input>

            <el-select 
                v-model="params.brand" 
                size="small" 
                clearable 
                filterable 
                @change="search" 
                placeholder="请选择品牌"
            >
                <el-option 
                    v-for="item in groupData" 
                    :key="item.id"
                    :label="item.displayName" 
                    :value="item.id">
                </el-option>
            </el-select>
        </div>

        <el-pagination
            v-if="resData.length"
            class="mb10"
            small
            background
            layout="total, prev, pager, next"
            :page-size="Number(params.pageSize)"
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
                <div class="place-p" :style="{width: placeW}" v-for="(item, index) in resData" :key="item.id">
                    <timeline-list 
                        :item="item" 
                        :index="index" 
                        :imageH="imageH"
                        @seeAddress="$refs.mapDialog.showMapDialog(item)"
                    ></timeline-list>
                </div>

            </div>

            <el-pagination
                v-if="resData.length"
                background
                layout="total, prev, pager, next, sizes"
                :page-sizes="[48, 80, 100]"
                @size-change="handleSizeChange"
                :current-page="Number(params.pageNo)"
                @current-change="handleCurrentChange"
                :total="totalCount">
            </el-pagination>
        </div>

    </div>
</template>
<script>
import { timelineContainerList } from '@/api/timeline';
import { screenSizeWatch, getOrganizationList } from '@/mixins';
import TimelineList from '@/views/timeline/components/TimelineList';
export default {
    mixins: [screenSizeWatch, getOrganizationList],
    data(){
        return {
            dataLoading: false,
            resData: [],
            params: {
                pageNo: 1,
                pageSize: 48
            },
            totalCount: 0
        }
    },
    mounted() {
        if(this.$route.query.pageNo){
            this.params = JSON.parse(JSON.stringify(this.$route.query));
            if(this.params.brand) this.params.brand = Number(this.params.brand);
        }else if(this.$store.state.app.timelineSearchParams){
            this.params = this.$store.state.app.timelineSearchParams;
        }
        this.init();
    },
    methods: {
        init(){
            this.dataLoading = true;
            this.$store.state.app.timelineSearchParams = this.params;
            timelineContainerList(this.params).then(res => {
                this.dataLoading = false;
                this.$router.push({
                    query: {
                        ...this.params
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

        //搜索 筛选
        search(){
            this.params.pageNo = 1;
            this.init()
        }
    },
    components: {
        TimelineList
    }
}
</script>
<style lang="scss" scope>
    @import '../place/style/place-card.scss';
    .content-list-wrap{
        .content-top{
            padding-bottom: 20px;
            .created-btn{
                margin-right: 20px;
            }
            .el-input{
                display: inline-block;
                width: 200px;
                margin-left: 10px;
            }
        }
        .place-content{
            min-height: 100px;
        }
    }
</style>