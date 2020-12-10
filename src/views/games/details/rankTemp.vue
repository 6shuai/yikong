<template>
    <div class="gameDetail-game-list">
        <div class="game-list-top">
            <el-button
                v-if="hasPerm($store.state.permission.gamesPrem, 'AddGameAssembly')"
                type="primary"
                size="small"
                icon="el-icon-plus"
                @click="$refs.addRankTemp.showDialog()"
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
                :min-width="100"
            ></el-table-column>
            <el-table-column
                prop="description"
                label="模板描述"
                min-width="120"
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
            ></el-table-column>
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
            <el-table-column label="操作" width="220">
                <template slot-scope="scope">
                    <el-button
                        v-if="gameDetail.editAssembly"
                        size="mini"
                        type="success"
                        @click="$refs.rankDetail.showDetailDrawer(scope.row)"
                    >
                        详情
                    </el-button>
                    <el-button
                        v-if="gameDetail.editAssembly"
                        size="mini"
                        type="success"
                        @click="$refs.rankDetail.showDetailDrawer(scope.row)"
                    >
                        子周期
                    </el-button>
                    <el-button
                        v-if="gameDetail.editAssembly"
                        size="mini"
                        type="primary"
                        @click="handleEdit(scope.row.id)"
                    >
                        编辑
                    </el-button>
                    <el-popover
                        v-if="gameDetail.deleteAssembly"
                        style="margin-left: 10px"
                        placement="top"
                        :ref="scope.row.id"
                        width="200"
                    >
                        <p>
                            此操作将删除【{{ scope.row.displayName }}】,
                            是否继续?
                        </p>
                        <div style="text-align: right; margin: 0">
                            <el-button
                                size="mini"
                                type="text"
                                @click="$refs[scope.row.id].doClose()"
                                >取消</el-button
                            >
                            <el-button
                                type="primary"
                                size="mini"
                                @click="handleDelete(scope.row.id)"
                                >确定</el-button
                            >
                        </div>
                        <el-button size="mini" type="warning" slot="reference">
                            删除
                        </el-button>
                    </el-popover>
                </template>
            </el-table-column>
        </el-table>

        <!-- 添加排行榜模板-->
        <add-rank-temp ref="addRankTemp" @createdSuccess="init"></add-rank-temp>

        <!-- 添加子周期 -->
        <add-rank-period ref="rankDetail"></add-rank-period>

    </div>
</template>

<script>
import { rankTempList, gameDataDelete } from "@/api/game";
import AddRankTemp from "../components/AddRankTemp";
import AddRankPeriod from '../components/AddRankPeriod';
export default {
    data() {
        return {
            tableLoading: false,
            params: {
                appid: this.$route.params.id
            },
            resData: [],
        };
    },
    computed: {
        gameDetail(){
            return this.$store.state.game.details
        }
    },
    created() {
        // this.init();
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
        handleEdit(id) {
            this.$refs.addRankTemp.showDialog(id);
        },

        //删除
        handleDelete(id) {
            this.$refs[id].doClose()
        }
    },
    components: {
        AddRankTemp,
        AddRankPeriod
    }
};
</script>

<style lang="scss" scope>
.gameDetail-game-list {
    .game-list-top {
        margin-bottom: 10px;
        .search-input{
            width: 200px;
        }
    }
}
</style>