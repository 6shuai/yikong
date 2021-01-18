<template>
    <el-card class="template-card content-details layout-detail">
        <div class="header-wrap detail-header-wrap mb30">
            <el-page-header @back="$router.go(-1)"> </el-page-header>
            <div class="header-right">
                <span
                    @click="
                        $refs.pagePermission.showPermission({
                            screenId: $route.params.id,
                        })
                    "
                    ><i class="el-icon-lock" title="授权"></i>授权<el-divider
                        direction="vertical"
                    ></el-divider
                ></span>
                <span
                    @click="
                        $router.push(`/cutInAdvertising/edit/${$route.params.id}`)
                    "
                >
                    <i class="el-icon-edit" title="编辑"></i>编辑
                    <el-divider direction="vertical"></el-divider>
                </span>
                <span @click="handleDelete">
                    <i class="el-icon-delete" title="删除"></i>删除
                </span>
            </div>
            <div class="title">
                <h2>{{ resData.displayName }}</h2>
            </div>
        </div>
        <div v-loading="dataLoading">
            <div class="content">
                <el-form
                    label-width="100px"
                    class="screen-form"
                    :model="resData"
                >
                    <el-form-item label="名称">
                        {{ resData.displayName }}
                    </el-form-item>
                    <el-form-item label="时间轴">
                        {{ resData.timeline }}
                    </el-form-item>
                    <el-form-item label="轮次">
                        <el-table
                            class="round-data"
                            :data="resData.tableData"
                            size="mini"
                            border
                            stripe
                        >
                            <el-table-column
                                prop="round"
                                label="轮次"
                                :min-width="60"
                            >
                            </el-table-column>
                            <el-table-column
                                prop="stage"
                                label="阶段"
                                :min-width="60"
                            >
                            </el-table-column>
                        </el-table>
                    </el-form-item>
                </el-form>
            </div>
        </div>
    </el-card>
</template>
<script>
import { layoutTempDetail, layoutTempDelete } from "@/api/screenLayout";

export default {
    data() {
        return {
            dataLoading: false,
            resData: {
                displayName: "一行白鹭上青天",
                timeline: "madongdong",
                tableData: [
                    {
                        round: '1',
                        stage: '阶段1'
                    },
                    {
                        round: '2',
                        stage: '阶段2'
                    }
                ]
            },
        };
    },
    created() {},
    methods: {
        //查询逻辑区域集合 屏幕布局集合
        init() {
            this.dataLoading = true;
            layoutTempDetail({ id: this.$route.params.id }).then((res) => {
                this.dataLoading = false;
                if (res.code === this.$successCode) {
                }
            });
        },

        //删除
        handleDelete() {
            this.$confirm(
                `此操作将删除${this.resData.displayName} 是否继续?`,
                "提示",
                {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning",
                    center: true,
                }
            ).then(() => {
                layoutTempDelete(`?id=${this.$route.params.id}`).then((res) => {
                    if (res.code === this.$successCode) {
                        this.$message.success({
                            message: "删除成功~",
                            duration: 1000,
                            onClose: () => {
                                this.$router.push("/screen/layout");
                            },
                        });
                    }
                });
            });
        },
    },
};
</script>

