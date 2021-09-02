<template>
    <div class="gameDetail-game-list">
        <div class="game-list-top">
            <el-button
                v-if="hasPerm($store.state.permission.gamesPrem, 'AddGameAssembly')"
                type="primary"
                size="small"
                icon="el-icon-plus"
                @click="$refs.addGameData.showDialog()"
                >添加</el-button
            >
            <el-input
                size="small"
                clearable
                class="search-input"
                v-model="params.displayName"
                placeholder="游戏名称"
                @input="search"
            >
            </el-input>
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
            <el-table-column prop="id" label="游戏图片" width="100">
                <template slot-scope="scope">
                    <el-image
                        style="width: 80px; height: 80px; border-radius: 50%"
                        :src="scope.row.image"
                        fit="cover"
                    >
                    </el-image>
                </template>
            </el-table-column>
            <el-table-column
                prop="displayName"
                label="名称"
                min-width="50"
            ></el-table-column>
            <el-table-column
                prop="overallVersion"
                label="游戏包版本"
                min-width="50"
            ></el-table-column>
            <el-table-column
                prop="description"
                label="游戏包说明"
                min-width="100"
            ></el-table-column>
            <el-table-column
                prop="versionType"
                label="游戏包类型"
                min-width="50"
            >
                <template slot-scope="scope">
                    {{scope.row.versionType==2 ? '线上版本' : scope.row.versionType==1 ? '测试版本' : '开发版本'}}
                </template>
            </el-table-column>
            <el-table-column
                prop="size"
                label="游戏包大小"
                min-width="50"
            ></el-table-column>
            <el-table-column label="操作" width="200">
                <template slot-scope="scope">
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

        <el-pagination
            background
            layout="total, prev, pager, next, sizes"
            :page-sizes="[40, 80, 100]"
            :current-page="Number(params.pageNo)"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :total="totalCount"
        >
        </el-pagination>

        <!-- 添加游戏配置数据 -->
        <add-game-data ref="addGameData" @createdSuccess="init"></add-game-data>
    </div>
</template>

<script>
import { gameDataList, gameDataDelete } from "@/api/game";
import AddGameData from "../components/AddGameConfig";
export default {
    data() {
        return {
            tableLoading: false,
            params: {
                pageNo: 1,
                pageSize: 40,
                applicationId: this.$route.params.id,
            },
            totalCount: 0,
            resData: [],
        };
    },
    computed: {
        gameDetail(){
            return this.$store.state.game.details
        }
    },
    created() {
        this.init();
    },
    methods: {
        init() {
            this.tableLoading = true;
            gameDataList(this.params).then((res) => {
                this.tableLoading = false;
                this.resData = res.obj.list;
                this.totalCount = res.obj.totalRecords;
            });
        },

        //编辑
        handleEdit(id) {
            this.$refs.addGameData.showDialog(id);
        },

        //删除
        handleDelete(id) {
            gameDataDelete(id).then((res) => {
                if (res.code === this.$successCode) {
                    this.$message.success("删除成功~");
                    this.init();
                }
            });
        },

        //每页条数
        handleSizeChange(size) {
            this.params.pageSize = size;
            this.init();
        },

        //分页
        handleCurrentChange(page) {
            this.params.pageNo = page;
            this.init();
        },

        //搜索
        search(){
            this.params.pageNo = 1;
            this.init();
        }
    },
    components: {
        AddGameData,
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