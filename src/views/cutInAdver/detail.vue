<template>
    <el-card class="template-card content-details layout-detail">
        <div class="header-wrap detail-header-wrap mb30">
            <el-page-header @back="$router.go(-1)"> </el-page-header>
            <div class="header-right">
                <span
                    v-if="resData.authorize"
                    @click="
                        $refs.pagePermission.showPermission({
                            spotId: $route.params.id,
                        })
                    "
                    ><i class="el-icon-lock" title="授权"></i>授权<el-divider
                        direction="vertical"
                    ></el-divider
                ></span>
                <span
                    v-if="resData.edit"
                    @click="
                        $router.push(
                            `/cutInAdver/edit/${$route.params.id}`
                        )
                    "
                >
                    <i class="el-icon-edit" title="编辑"></i>编辑
                    <el-divider direction="vertical"></el-divider>
                </span>
                <span v-if="resData.delete" @click="handleDelete">
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
                    <el-form-item label="名称：">
                        {{ resData.displayName }}
                    </el-form-item>
                    <el-form-item label="时间轴：">
                        {{ resData.timelineContainerName }}
                    </el-form-item>
                    <el-form-item label="游戏阶段：">
                        <el-table
                            class="round-data"
                            :data="resData.spotStageMaps"
                            size="mini"
                            border
                            stripe
                        >
                            <el-table-column
                                prop="gameStage"
                                label="游戏阶段"
                                :min-width="60"
                            >
                                <template slot-scope="scope">
                                    <el-tag size="mini" type="danger">
                                        {{ scope.row.gameStage }}
                                    </el-tag>
                                </template>
                            </el-table-column>
                            <el-table-column
                                prop="timelineStageName"
                                label="时间轴阶段"
                                :min-width="60"
                            >
                            </el-table-column>
                        </el-table>
                    </el-form-item>
                </el-form>
            </div>
        </div>

        <!-- 授权 -->
        <permission
            ref="pagePermission"
            :premissionApi="premissionApi"
        ></permission>
    </el-card>
</template>
<script>
import {
    cutInAdverDetail,
    cutInAdverDelete,
    cutInAdverAuthority,
    cutInAdverAuthorityUpdate,
    cutInAdverAuthorityDelete,
} from "@/api/cutInAdver";
import Permission from "@/components/permission/index";

export default {
    data() {
        return {
            dataLoading: false,
            resData: {},
            premissionApi: {
                list: cutInAdverAuthority,
                update: cutInAdverAuthorityUpdate,
                delete: cutInAdverAuthorityDelete,
            },
        };
    },
    created() {
        this.init();
    },
    methods: {
        //查询逻辑区域集合 屏幕布局集合
        init() {
            this.dataLoading = true;
            cutInAdverDetail({ id: this.$route.params.id }).then((res) => {
                this.dataLoading = false;
                if (res.code === this.$successCode) {
                    this.resData = res.obj;
                }
            });
        },

        //删除
        handleDelete() {
            this.$confirm(
                `此操作将删除【${this.resData.displayName}】 是否继续?`,
                "提示",
                {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning",
                    center: true,
                }
            ).then(() => {
                cutInAdverDelete(this.$route.params.id).then((res) => {
                    if (res.code === this.$successCode) {
                        this.$message.success({
                            message: "删除成功~",
                            duration: 1000,
                            onClose: () => {
                                this.$router.push("/cutInAdver");
                            },
                        });
                    }
                });
            });
        },
    },
    components: {
        Permission,
    },
};
</script>

