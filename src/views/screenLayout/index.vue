<template>
    <div class="app-main-wrap layout-list-wrap" id="app-main-wrap">
        <el-card shadow="always">
            <div class="content-top mb20 clearfix add-and-search">
                <el-button
                    class="created-btn"
                    type="primary"
                    icon="el-icon-plus"
                    @click="$router.push('/screen/layout/add')"
                    size="small"
                >
                    新建布局
                </el-button>

                <div class="search-input">
                    <el-input
                        class="w200 ml20"
                        prefix-icon="el-icon-search"
                        clearable
                        size="small"
                        v-model="params.displayName"
                        placeholder="屏幕布局名称"
                        @input="$debounce(search)"
                    ></el-input>
                </div>
            </div>

            <!-- 屏幕布局模板列表 -->
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
                    prop="id"
                    label="id"
                    width="50"
                ></el-table-column>
                <el-table-column
                    prop="displayName"
                    label="名称"
                    min-width="50"
                ></el-table-column>
                <el-table-column
                    prop="width"
                    label="宽度"
                    min-width="50"
                ></el-table-column>
                <el-table-column
                    prop="height"
                    label="高度"
                    min-width="50"
                ></el-table-column>
                <el-table-column label="操作" width="200">
                    <template slot-scope="scope">
                        <el-button
                            size="mini"
                            type="primary"
                            @click="handleDetail(scope.row.id)"
                        >
                            查看详情
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>

            <el-pagination
                v-if="resData.length"
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
        </el-card>
    </div>
</template>
<script>
import { layoutTempList } from "@/api/screenLayout";
export default {
    data() {
        return {
            tableLoading: false,
            params: {
                pageNo: 1,
                pageSize: 48,
            },
            totalCount: 0,
            resData: [],
        };
    },
    mounted() {
        this.init();
    },
    methods: {
        init() {
            this.tableLoading = true;
            layoutTempList(this.params).then((res) => {
                this.tableLoading = false;
                this.resData = res.obj.list;
                this.totalCount = res.obj.totalRecords;
            });
        },

        //查看详情
        handleDetail(id) {
            this.$router.push("/screen/layout/detail/" + id);
        },

        //搜索
        search() {
            this.params.pageNo = 1;
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
    },
};
</script>
