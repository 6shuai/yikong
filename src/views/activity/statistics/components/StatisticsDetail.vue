<template>
    <el-dialog
        class="statistics-detail"
        title="统计数据详情"
        :visible.sync="dialogVisible"
        width="1000px"
    >
        <el-table
            class="mb20"
            v-loading="tableLoading"
            stripe
            size="small"
            :data="resData"
            row-key="id"
        >
            <el-table-column
                prop="name"
                label="头像"
                min-width="120"
            >
                <template slot-scope="scope">
                    <el-image
                        class="head-img"
                        :src="scope.row.headimgurl"
                        fit="cover"
                    >
                    </el-image>
                </template>
            </el-table-column>
            <el-table-column
                prop="name"
                label="昵称"
                min-width="120"
            ></el-table-column>
            <el-table-column
                prop="placeName"
                label="场所名称"
                min-width="120"
            ></el-table-column>
            <el-table-column
                prop="screenName"
                label="屏幕名称"
                min-width="120"
            ></el-table-column>
            <el-table-column
                prop="contentName"
                label="游戏名称"
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
                prop="logoutTimes"
                label="退出次数"
                min-width="80"
            ></el-table-column>
            <el-table-column
                prop="playtime"
                label="时长"
                min-width="80"
            >
                <template slot-scope="scope">
                    {{ scope.row.playtime }} 秒
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

        <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">关 闭</el-button>
        </span>
    </el-dialog>
</template>

<script>
import { activityStatisticsDetail } from '@/api/activity';

export default {
    data() {
        return {
            dialogVisible: false,
            params: {
                pageNo: 1,
                pageSize: 48,
            },
            tableLoading: false,
            resData: [],
            totalCount: 0,
        };
    },
    methods: {
        showDialog(data) {
            this.dialogVisible = true;
            this.params = {
                ...this.params,
                ...data
            }
            this.getDetail();
        },

        getDetail(){
            this.tableLoading = true;
            activityStatisticsDetail(this.params).then(res => {
                this.tableLoading = false;
                if(res.code === this.$successCode){
                    let { list, totalRecords } = res.obj;
                    this.resData = list;
                    this.totalCount = totalRecords;
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
    },
};
</script>

<style lang="scss" scope>
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
}
</style>