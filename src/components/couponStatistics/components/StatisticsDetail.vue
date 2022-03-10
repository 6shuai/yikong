<template>
    <el-dialog
        class="statistics-detail"
        title="优惠券统计数据详情"
        :visible.sync="dialogVisible"
        width="1200px"
    >
        <div class="filter-wrap">
            <el-select
                v-model="params.state"
                clearable
                placeholder="请选择优惠券状态"
                @change="handleSearch"
                @clear="$delete(params, 'state')"
                class="mb20"
            >
                <el-option
                    v-for="item in [{ id: 0, name: '未核销' }, { id: 1, name: '已核销' }, { id: 2, name: '已过期' }]"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                >
                </el-option>
            </el-select>
            <el-select
                v-model="params.couponDefinitionId"
                clearable
                placeholder="请选择优惠券"
                @change="handleSearch"
                @clear="$delete(params, 'couponDefinitionId')"
                class="mb20 ml20"
            >
                <el-option
                    v-for="item in couponData"
                    :key="item.id"
                    :label="item.displayName" 
                    :value="item.id"
                >
                </el-option>
            </el-select>

            <div class="tag-wrap">
                <el-tag type="primary">发券量: {{ couponInfo.couponCount }}</el-tag>
                <el-tag type="primary">核销量: {{ couponInfo.writeOffCount }}</el-tag>
                <el-tag type="primary">核销率: {{ couponInfo.writeOffRate}}</el-tag>
            </div>

        </div>

        <el-table
            class="mb20"
            v-loading="tableLoading"
            stripe
            size="small"
            :data="resData"
            row-key="id"
        >
            <el-table-column
                prop="playerName"
                label="昵称"
                min-width="120"
            ></el-table-column>
            <el-table-column
                prop="couponDefinitionName"
                label="优惠券名称"
                min-width="120"
            ></el-table-column>
            <el-table-column
                prop="state"
                label="优惠券状态"
                min-width="120"
            ></el-table-column>
            <el-table-column
                prop="applicationName"
                label="游戏名称"
                min-width="120"
            ></el-table-column>
            <el-table-column
                prop="collectionTime"
                label="发券时间"
                min-width="100"
            ></el-table-column>
            <el-table-column
                prop="usedTime"
                label="使用时间"
                min-width="100"
            ></el-table-column>
            <el-table-column
                prop="expire"
                label="过期时间"
                min-width="100"
            ></el-table-column>
            <el-table-column
                prop="writeOffUser"
                label="核销员"
                min-width="80"
            ></el-table-column>
        </el-table>

        <el-pagination
            background
            layout="total, prev, pager, next, sizes"
            :page-sizes="[48, 80, 100]"
            :current-page="Number(params.pageNo)"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :total="totalCount"
        >
        </el-pagination>

        <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">关 闭</el-button>
        </span>
    </el-dialog>
</template>

<script>
import { couponStatisticsDetailCouponList } from '@/api/activity';
export default {
    data() {
        return {
            dialogVisible: false,
            params: {},
            tableLoading: false,
            resData: [],
            totalCount: 0,
            statisticsDetailApi: undefined,
            couponData: [],    //优惠券列表
            couponInfo: {}
        };
    },
    methods: {
        showDialog(data, statisticsDetailApi, state) {
            this.statisticsDetailApi = statisticsDetailApi;
            this.dialogVisible = true;
            this.params = {
                ...data,
                pageNo: 1,
                pageSize: 48,
                state
            }
            this.getDetail();
            this.getCouponList(data)
        },

        getDetail(){
            this.tableLoading = true;
            this.statisticsDetailApi(this.params).then(res => {
                this.tableLoading = false;
                if(res.code === this.$successCode){
                    let { page, couponCount, writeOffCount, writeOffRate } = res.obj;
                    let { list, totalRecords } = page;
                    this.resData = list;
                    this.totalCount = totalRecords;
                    this.couponInfo = {
                        couponCount,
                        writeOffCount,
                        writeOffRate
                    }
                }
            })
        },

        //分页
        handleCurrentChange(page) {
            this.params.pageNo = page;
            this.getDetail();
        },

        //每页多少条
        handleSizeChange(size) {
            this.params.pageSize = size;
            this.getDetail();
        },

        //筛选
        handleSearch(){
            this.params.pageNo = 1;
            this.getDetail();
        },

        //获取当前详细下的优惠券列表
        getCouponList(data){
            couponStatisticsDetailCouponList(data).then(res => {
                if(res.code === this.$successCode){
                    this.couponData = res.obj;
                }
            })
        }
    },
};
</script>

<style lang="scss"d>
.statistics-detail {
    .statistics-tool {
        text-align: right;
        margin-bottom: 10px;
    }

    .head-img{
        width: 60px; 
        height: 60px; 
        border-radius: 50%;
    }

    .filter-wrap{
        .tag-wrap{
            float: right;
            
            .el-tag{
                margin-left: 5px;
            }
        }
    }
}
</style>