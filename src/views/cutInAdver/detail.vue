<template>
    <el-card 
        class="template-card content-details cutin-adver-detail"
        :class="{ 'from-game': $route.params.id }"
    >
        <page-header 
            v-if="!$route.params.id"
            :title="resData.displayName"
        >
            <div slot="headerRight">
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
        </page-header>
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
                    <el-form-item label="广告轴：">
                        <el-tag 
                            class="mr10"
                            v-for="(item, index) in resData.spotContainerRelation" 
                            :key="index"
                        >{{ item.containerName }}</el-tag>
                    </el-form-item>
                    <el-form-item label="游戏阶段：">
                        <el-table
                            class="round-data"
                            :data="resData.spotGameStageRelation"
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
                                    <el-tag 
                                        size="mini" 
                                        type="danger"
                                        @click="$refs.screenList.getScreenList(scope.row.id)"
                                    >
                                        {{ scope.row.gameStage }}
                                    </el-tag>
                                </template>
                            </el-table-column>
                            <el-table-column
                                prop="description"
                                label="阶段描述"
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

        <!-- 屏幕列表 -->
        <screen-list 
            ref="screenList"
            :timelineList="resData.spotContainerRelation"
        ></screen-list>

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
import ScreenList from './components/ScreenList';
import PageHeader from '@/components/PageHeader';

export default {
    data() {
        return {
            dataLoading: false,
            resData: {},
            cutinAdverId: null,    //插播id
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
            this.cutinAdverId = this.$route.params.adverId;
            this.dataLoading = true;
            cutInAdverDetail({ id: this.cutinAdverId }).then((res) => {
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
                cutInAdverDelete(this.cutinAdverId).then((res) => {
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
        ScreenList,
        PageHeader
    },
};
</script>