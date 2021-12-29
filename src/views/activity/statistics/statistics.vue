<template>
    <el-card class="template-card content-details statistics-list">

        <page-header :title="title"></page-header>

        <el-form label-width="110px" :inline="true">
            <el-form-item label="场所">
                <el-select
                    v-model="params.placeId"
                    filterable
                    clearable
                    placeholder="请选择场所"
                    @change="search();getScreen()"
                >
                    <el-option
                        v-for="item in placeData"
                        :key="item.id"
                        :label="item.displayName"
                        :value="item.id"
                    >
                    </el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="屏幕" v-if="params.placeId">
                <el-select
                    v-model="params.screenId"
                    filterable
                    clearable=""
                    placeholder="请选择屏幕"
                    @change="search"
                >
                    <el-option
                        v-for="item in screenData"
                        :key="item.id"
                        :label="item.displayName"
                        :value="item.id"
                    >
                    </el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="App">
                <el-select
                    v-model="params.contentId"
                    filterable
                    clearable=""
                    placeholder="请选择App"
                    @change="search"
                >
                    <el-option
                        v-for="item in gameData"
                        :key="item.id"
                        :label="item.displayName"
                        :value="item.id"
                    >
                    </el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="时间范围">
                <el-date-picker
                    @change="search"
                    v-model="datePicker"
                    type="datetimerange"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    :default-time="['00:00:00', '23:59:59']"
                >
                </el-date-picker>
            </el-form-item>
        </el-form>

        <div class="statistics-tool">
            <el-button
                :disabled="!resData.length"
                class="right-btn"
                plain
                type="primary"
                size="small"
                icon="el-icon-upload2"
                @click="download"
                >导出</el-button
            >
        </div>

        <el-table
            class="mb20"
            v-loading="tableLoading"
            stripe
            size="small"
            :data="resData"
            row-key="id"
            border
        >
            <el-table-column
                prop="occur"
                label="时间段"
                min-width="120"
            ></el-table-column>
            <el-table-column
                prop="loginTimes"
                label="登录次数"
                min-width="80"
            ></el-table-column>
            <el-table-column
                prop="playTimes"
                label="游戏次数"
                min-width="80"
            ></el-table-column>
            <el-table-column
                prop="playerCount"
                label="游戏人数"
                min-width="80"
            >
            </el-table-column>
            <el-table-column label="详情" width="110">
                <template slot-scope="scope">
                    <el-button
                        size="mini"
                        type="primary"
                        @click="handleDetail(scope.row)"
                    >
                        查看详情
                    </el-button>
                </template>
            </el-table-column>
        </el-table>

        <el-pagination
            background
            hide-on-single-page
            layout="total, prev, pager, next, sizes"
            :page-sizes="[48, 80, 100]"
            :current-page="Number(params.pageNo)"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :total="totalCount"
        >
        </el-pagination>

        <!-- 统计数据 详情 -->
        <statistics-detail ref="statisticsDetail"></statistics-detail>
    </el-card>
</template>

<script>
import qs from 'qs';
import StatisticsDetail from "./components/StatisticsDetail";
import PageHeader from '@/components/PageHeader';
import { activityPlaceList, activityScreenList, activityConditionGameList, activityStatisticsList } from '@/api/activity';

export default {
    data() {
        return {
            title: '',             //活动名称
            params: {
                pageNo: 1,
                pageSize: 48,
            },
            datePicker: [],
            placeData: [],          //场所列表
            screenData: [],         //屏幕列表
            gameData: [],           //游戏列表
            tableLoading: false,
            resData: [],
            totalCount: 0,
        };
    },
    created() {
        this.init();
        this.getPlaceList();
        this.getGameList();
        this.params.promotionId = this.$route.params.id;
    },
    methods: {
        init(){
            this.tableLoading = true;
            activityStatisticsList(this.params).then(res => {
                this.tableLoading = false;
                if(res.code === this.$successCode){
                    let { list, totalRecords } = res.obj.page;
                    this.resData = list;
                    this.totalCount = totalRecords;
                    this.title = res.obj.promotion.displayName;
                }
            })
        },

        //场所列表
        getPlaceList(){
            activityPlaceList().then(res => {
                this.placeData = res.obj;
            })
        },

        //屏幕列表
        getScreen(){
            activityScreenList({ placeId: this.params.placeId }).then(res => {
                this.screenData = res.obj;
            })
        },

        //游戏列表
        getGameList(){
            activityConditionGameList().then(res => {
                this.gameData = res.obj;
            })
        },

        //查看详情
        handleDetail(row) {
            this.$refs.statisticsDetail.showDialog(
                {
                    promotionId: this.$route.params.id,
                    occur: row.occur,
                    placeId: this.params.placeId,
                    screenId: this.params.screenId,
                    contentId: this.params.contentId
                }
            );
        },

        //搜索
        search() {
            this.params.pageNo = 1;
            this.params.startTime = this.datePicker ? this.datePicker[0] : "";
            this.params.endTime = this.datePicker ? this.datePicker[1] : "";
            this.init();
        },

        //分页
        handleCurrentChange(page) {
            this.params.pageNo = page;
            this.init();
        },

        //每页多少条
        handleSizeChange(size) {
            this.params.pageSize = size;
            this.init();
        },

        //导出
        download(){
            window.open(`http://172.19.112.212:8181/promotion/export?${qs.stringify(this.params)}`);
        }
    },
    components: {
        StatisticsDetail,
        PageHeader
    },
};
</script>

<style lang="scss" scope>
.statistics-list {
    .statistics-tool {
        text-align: right;
        margin-bottom: 10px;
    }
}
</style>

