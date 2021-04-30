<template>
    <el-dialog
        class="statistics-detail"
        title="统计数据详情"
        :close-on-click-modal="false"
		:close-on-press-escape="false"
        :visible.sync="dialogVisible"
        width="1100px"
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
            >
                <template slot-scope="scope">
                    {{ scope.row.loginTimes || 0 }}
                </template>
            </el-table-column>
            <el-table-column
                prop="playTimes"
                label="游戏次数"
                min-width="80"
            >
                <template slot-scope="scope">
                    {{ scope.row.playTimes || 0 }}
                </template>
            </el-table-column>
            <el-table-column
                prop="logoutTimes"
                label="退出次数"
                min-width="80"
            >
                <template slot-scope="scope">
                    {{ scope.row.logoutTimes || 0 }}
                </template>
            </el-table-column>
            <el-table-column
                prop="playtime"
                label="时长"
                min-width="80"
            >
                <template slot-scope="scope">
                    {{ scope.row.playtime }} 秒
                </template>
            </el-table-column>
            <el-table-column
                prop="playtime"
                label="操作"
                min-width="80"
            >
                <template slot-scope="scope">
                    <el-link type="primary" @click="handlePlayerTimeline(scope.row)">游戏轨迹</el-link>
                </template>
            </el-table-column>
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

        <player-timeline ref="playerTimeline"></player-timeline>

    </el-dialog>
</template>

<script>
import PlayerTimeline from '../charts/timeline';

export default {
    data() {
        return {
            dialogVisible: false,
            params: {},
            tableLoading: false,
            resData: [],
            totalCount: 0,
            statisticsDetailApi: undefined
        };
    },
    methods: {
        showDialog(data, statisticsDetailApi) {
            this.statisticsDetailApi = statisticsDetailApi;
            this.dialogVisible = true;
            this.params = {
                ...data,
                pageNo: 1,
                pageSize: 48
            }
            this.getDetail();
        },

        getDetail(){
            this.tableLoading = true;
            this.statisticsDetailApi(this.params).then(res => {
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

        //查看玩家行为轨迹
        handlePlayerTimeline(data){
            let { placeId, screenId, contentId, startTime, endTime, occur } = this.params;
            this.$refs.playerTimeline.showPlayerTimeline({
                playerId: data.playerId,
                occur,
                placeId,
                screenId,
                contentId,
                startTime,
                endTime
            })
        }
    },
    components: {
        PlayerTimeline
    }
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