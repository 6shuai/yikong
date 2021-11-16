<template>
    <el-card 
        class="template-card content-details activity-detail"
        :class="{ 'from-game': $route.params.id }"
    >
        <page-header 
            v-if="!$route.params.id"
            :title="resData.displayName"
            backPath="/activity"
        >
            <div slot="headerRight">
                <span
                    v-if="resData.authorize"
                    @click="
                        $refs.pagePermission.showPermission({
                            promotionId: $route.params.activityId,
                        })
                    "
                    ><i class="el-icon-lock" title="授权"></i>授权<el-divider
                        direction="vertical"
                    ></el-divider
                ></span>
                <span
                    v-if="resData.editPromotion"
                    @click="$router.push(`/activity/edit/${$route.params.activityId}`)"
                >
                    <i class="el-icon-edit" title="编辑"></i>编辑
                    <el-divider direction="vertical"></el-divider>
                </span>
                <span @click="collectContent" v-if="!resData.isFavorite"
                    ><i class="el-icon-star-off" title="收藏"></i>收藏
                    <el-divider direction="vertical"></el-divider>
                </span>
                <span @click="collectContent" v-else
                    ><i class="el-icon-star-on" title="取消收藏"></i>取消收藏
                    <el-divider direction="vertical"></el-divider>
                </span>
                <span @click="handleDelete" v-if="resData.deletePromotion">
                    <i class="el-icon-delete" title="删除"></i>删除
                </span>
            </div>
        </page-header>
        <div class="content" v-loading="loading">
            <el-tabs 
                v-model="currentActive" 
                @tab-click="$router.push($event.name)"
                class="mb20"
            >
                <el-tab-pane 
                    label="基本信息" 
                    :name="routerPath"
                >
                </el-tab-pane>
                <el-tab-pane 
                    label="屏幕" 
                    :name="`${routerPath}/screen`"
                >
                </el-tab-pane>
                <el-tab-pane 
                    label="游戏" 
                    :name="`${routerPath}/game`"
                >
                </el-tab-pane>
                <el-tab-pane 
                    label="商户" 
                    :name="`${routerPath}/merchant`"
                >
                </el-tab-pane>
                <el-tab-pane 
                    label="奖池" 
                    :name="`${routerPath}/pond`"
                >
                </el-tab-pane>
                <el-tab-pane 
                    label="领取限制" 
                    :name="`${routerPath}/limit`"
                >
                </el-tab-pane>
                <el-tab-pane 
                    label="数据" 
                    :name="`${routerPath}/data?source=activity&promotionId=${activityId}`"
                >
                </el-tab-pane>
            </el-tabs>

            <el-form 
                label-width="100px" 
                class="screen-form" 
                v-if="currentActive == routerPath"
                :model="resData">
                <el-row>
                    <el-col :md="12" :sm="24" :xs="24">
                        <el-form-item label="活动名称：">
                            {{ resData.displayName }}
                        </el-form-item>
                        <el-form-item label="活动描述：">
                            {{ resData.description }}
                        </el-form-item>
                        <el-form-item label="开始时间：">
                            {{ resData.beginTime }}
                        </el-form-item>
                        <el-form-item label="结束时间：">
                            {{ resData.endTime }}
                        </el-form-item>
                        <el-form-item label="功能模块：">
                            {{ resData.moduleName }}
                        </el-form-item>
                    </el-col>
                </el-row>

            </el-form>
        </div>

        <router-view></router-view>

        <!-- 授权 -->
        <permission
            ref="pagePermission"
            :premissionApi="premissionApi"
        ></permission>

    </el-card>
</template>

<script>
import Permission from "@/components/permission/index";
import {
    activityDelete,
    activityFavorite, 
    activityAuthority,
    activityAuthorityUpdate,
    activityAuthorityDelete,
} from "@/api/activity";
import { getActivityDetail } from "../mixins/index";
import PageHeader from '@/components/PageHeader';

export default {
    mixins: [getActivityDetail],
    data() {
        return {
            premissionApi: {
                list: activityAuthority,
                update: activityAuthorityUpdate,
                delete: activityAuthorityDelete
            },
            activityId: null,       //活动id
            currentActive: '',
            routerPath: '',        //路由地址
        };
    },
    created() {

        this.routerPath = this.$route.params.id ? `/games/details/${this.$route.params.id}/gameData/${this.$route.params.gameId}/activity/${this.$route.params.activityId}`  : `/activity/detail/${this.$route.params.activityId}`

        this.currentActive = this.$route.path;
        this.activityId = this.$route.params.activityId;
        if (this.activityId) {
            this.initDetail(this.activityId);
        }
    },
    methods: {
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
                activityDelete(`?id=${this.activityId}`).then((res) => {
                    if (res.code === this.$successCode) {
                        this.$message.success({
                            message: "删除成功~",
                            duration: 1000,
                            onClose: () => {
                                this.$router.push("/activity");
                            },
                        });
                    }
                });
            });
        },


        //收藏
        collectContent() {
            let p = {
                isFavorite: this.resData.isFavorite ? 0 : 1,
                id: this.resData.id,
                userId: this.$store.state.user.loginData.id,
            };
            let s = `?isFavorite=${p.isFavorite}&promotionId=${p.id}&userId=${p.userId}`;

            activityFavorite(s).then((res) => {
                if (res.code === this.$successCode) {
                    this.$message.success("操作成功~");
                    this.$set(this.resData, "isFavorite", p.isFavorite);
                }
            });
        }
    },
    components: {
        Permission,
        PageHeader
    },
    watch: {
        '$route.path' (n, o) {
            let { source, promotionId } = this.$route.query;
            n = source ? n += '?source=activity' : n + '';
            n = promotionId ? n += `&promotionId=${promotionId}` : n + '';
            this.currentActive = n;
        }
    }
};
</script>