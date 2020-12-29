<template>
    <div class="gameDetail-game-list">
        <div class="game-list-top">
            <el-button
                v-if="
                    hasPerm(
                        $store.state.permission.gamesPrem,
                        'AddGameAssembly'
                    )
                "
                type="primary"
                size="small"
                icon="el-icon-plus"
                @click="$refs.addRankTemp.showDialog(rankTypeData)"
                >添加排行榜模板</el-button
            >
        </div>

        <el-table
            v-loading="tableLoading"
            stripe
            size="small"
            :data="resData"
            style="width: 100%; margin-bottom: 20px"
            row-key="id"
            border
        >
            <el-table-column
                prop="displayName"
                label="模板名称"
                :min-width="150"
            ></el-table-column>
            <el-table-column
                prop="description"
                label="模板描述"
                min-width="200"
            ></el-table-column>
            <el-table-column
                prop="maxCount"
                label="最大条数"
                min-width="100"
            ></el-table-column>
            <el-table-column
                prop="rankingListType"
                label="排行榜类型"
                min-width="100"
            >
                <template slot-scope="scope">
                    {{
                        rankTypeData[scope.row.rankingListType - 1].displayName
                    }}
                </template>
            </el-table-column>
            <el-table-column
                prop="prefix"
                label="数据前缀"
                min-width="100"
            ></el-table-column>
            <el-table-column
                prop="suffix"
                label="数据后缀"
                min-width="100"
            ></el-table-column>
            <el-table-column label="操作" width="300">
                <template slot-scope="scope">
                    <el-button
                        size="mini"
                        type="success"
                        @click="$refs.rankDetail.showRankData(scope.row)"
                    >
                        详情
                    </el-button>
                    <el-button
                        size="mini"
                        type="success"
                        @click="$refs.subCycle.showDetailDrawer(scope.row)"
                    >
                        子周期
                    </el-button>
                    <el-button
                        size="mini"
                        type="primary"
                        @click="handleEdit(scope.row)"
                    >
                        编辑
                    </el-button>
                </template>
            </el-table-column>
        </el-table>

        <!-- 添加排行榜模板-->
        <add-rank-temp ref="addRankTemp" @createdSuccess="init"></add-rank-temp>

        <!-- 添加子周期 -->
        <add-rank-cycle ref="subCycle"></add-rank-cycle>

        <!-- 排行榜数据 -->
        <rank-detail ref="rankDetail"></rank-detail>
    </div>
</template>

<script>
import { rankTempList, rankTempTypeList } from "@/api/game";
import AddRankTemp from "../components/AddRankTemp";

import AddRankCycle from '../components/AddRankCycle';
import RankDetail from '../components/RankDetail';

export default {
    data() {
        return {
            tableLoading: false,
            params: {
                appid: this.$route.params.id,
            },
            resData: [],
            rankTypeData: [],
        };
    },
    computed: {
        gameDetail() {
            return this.$store.state.game.details;
        },
    },
    created() {
        this.getRankTypeData().then((res) => {
            this.init();
        });
    },
    methods: {
        init() {
            this.tableLoading = true;
            rankTempList(this.params).then((res) => {
                this.tableLoading = false;
                this.resData = res.obj;
            });
        },

        //编辑
        handleEdit(data) {
            this.$refs.addRankTemp.showDialog(this.rankTypeData, data);
        },

        //排行榜类型
        getRankTypeData() {
            return new Promise((resoleve, reject) => {
                rankTempTypeList().then((res) => {
                    this.rankTypeData = res.obj;
                    resoleve(true);
                });
            });
        },
    },
    components: {
        AddRankTemp,
        AddRankCycle,
        RankDetail
    }
};
</script>

<style lang="scss" scope>
.gameDetail-game-list {
    .game-list-top {
        margin-bottom: 10px;
        .search-input {
            width: 200px;
        }
    }
}
</style>