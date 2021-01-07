<template>
    <el-card class="template-card content-details activity-detail">
        <div class="header-wrap detail-header-wrap mb30">
            <el-page-header @back="$router.go(-1)"> </el-page-header>
            <div class="header-right">
                <span
                    v-if="resData.authorize"
                    @click="
                        $refs.pagePermission.showPermission({
                            promotionId: $route.params.id,
                        })
                    "
                    ><i class="el-icon-lock" title="授权"></i>授权<el-divider
                        direction="vertical"
                    ></el-divider
                ></span>
                <span
                    v-if="resData.editPromotion"
                    @click="$router.push(`/activity/edit/${$route.params.id}`)"
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
            <div class="title">
                <h2>{{ resData.displayName }}</h2>
            </div>
        </div>
        <div class="content" v-loading="loading">
            <el-form 
                label-width="100px" 
                class="screen-form" 
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
                        <el-form-item label="活动屏幕：">
                            {{ resData.screen }}
                        </el-form-item>
                        <el-form-item label="活动游戏：">
                            {{ resData.game }}
                        </el-form-item>
                    </el-col>
                    <el-col :md="12" :sm="12" :xs="24">
                        <el-form-item label="商场模块：">
                            {{ resData.moduleName }}
                        </el-form-item>
                        <el-form-item label="需要支付：">
                            {{ resData.needCost ? '需要' : '不需要' }}
                        </el-form-item>
                        <div v-if="resData.needCost">
                            <el-form-item label="支付方式：">
                                {{ resData.costName }}
                            </el-form-item>
                            <el-form-item label="支付类型：">
                                {{ resData.costType == 1 ? '一次性' : '按游戏次数' }}
                            </el-form-item>
                            <el-form-item label="价格：">
                                {{ resData.costValue }}
                            </el-form-item>
                        </div>
                    </el-col>
                </el-row>
                <el-form-item label="奖池：">
                    <el-button
                        v-if="resData.addAwardPool"
                        size="small"
                        type="primary"
                        plain
                        @click="$refs.addPond.showAddPond()"
                        >添加奖池</el-button
                    >
                    <el-scrollbar class="pond-wrap" v-loading="pondLoading">
                        <el-row
                            v-for="(item, index) in pondData"
                            class="item"
                            :key="index"
                        >
                            <el-col :span="20">
                                <p class="title">{{ item.displayName }}</p>
                                <p>{{ item.description }}</p>
                                <p>
                                    <span
                                        >单次发放数量:{{
                                            item.awardCount
                                        }}</span
                                    >
                                    <el-divider
                                        direction="vertical"
                                    ></el-divider>
                                    <span
                                        >规则：{{
                                            item.pickSequence == 1
                                                ? "随机"
                                                : "顺序"
                                        }}</span
                                    >
                                    <el-divider
                                        direction="vertical"
                                    ></el-divider>
                                    <span
                                        >允许重复：{{
                                            item.duplicate ? "允许" : "不允许"
                                        }}</span
                                    >
                                </p>
                            </el-col>
                            <el-col :span="4" class="operation">
                                <p v-if="resData.editAwardPool">
                                    <el-link
                                        type="primary"
                                        @click.stop="
                                            $refs.addPond.showAddPond(item)
                                        "
                                        >编辑</el-link
                                    >
                                </p>
                                <p v-if="resData.deleteAwardPool"> 
                                    <el-popover
                                        placement="top"
                                        :ref="item.id"
                                        width="200"
                                    >
                                        <p>
                                            此操作将删除【{{
                                                item.displayName
                                            }}】, 是否继续?
                                        </p>
                                        <div
                                            style="text-align: right; margin: 0"
                                        >
                                            <el-button
                                                size="mini"
                                                type="text"
                                                @click="
                                                    $refs[item.id][0].doClose()
                                                "
                                                >取消</el-button
                                            >
                                            <el-button
                                                type="primary"
                                                size="mini"
                                                @click="
                                                    handleDeletePond(
                                                        item.id,
                                                        index
                                                    )
                                                "
                                                >确定</el-button
                                            >
                                        </div>
                                        <el-link
                                            type="danger"
                                            slot="reference"
                                            >删除</el-link
                                        >
                                    </el-popover>
                                </p>
                            </el-col>
                        </el-row>
                    </el-scrollbar>
                </el-form-item>
            </el-form>
        </div>

        <!-- 授权 -->
        <permission
            ref="pagePermission"
            :premissionApi="premissionApi"
        ></permission>

        <!-- 添加奖池 -->
        <add-pond 
            ref="addPond" 
            :detailData="resData"
            @pondCreatedSuccess="getPondList"
        ></add-pond>

    </el-card>
</template>

<script>
import Permission from "@/components/permission/index";
import {
    activityDelete,
    activityPondList,
    activityPondDelete,
    activityFavorite, 
    activityAuthority,
    activityAuthorityUpdate,
    activityAuthorityDelete
} from "@/api/activity";
import { getActivityDetail } from "./mixins/index";
import AddPond from "./components/AddPond";

export default {
    mixins: [getActivityDetail],
    data() {
        return {
            premissionApi: {
                list: activityAuthority,
                update: activityAuthorityUpdate,
                delete: activityAuthorityDelete
            },
            pondData: [], //奖池列表
            pondLoading: false
        };
    },
    created() {
        if (this.$route.params.id) {
            this.initDetail();
            this.getPondList();
        }
    },
    methods: {
        //根据活动id 查询奖池列表
        getPondList() {
            this.pondLoading = true;
            activityPondList({ promotionId: this.$route.params.id }).then(
                (res) => {
                    this.pondLoading = false;
                    if (res.code === this.$successCode) {
                        this.pondData = res.obj;
                    }
                }
            );
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
                activityDelete(`?id=${this.$route.params.id}`).then((res) => {
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

        //删除奖池
        handleDeletePond(id, index) {
            let data = `?id=${id}`;
            activityPondDelete(data).then((res) => {
                if (res.code === this.$successCode) {
                    this.$message.success("删除成功~");
                    this.pondList.splice(index, 1);
                    this.$refs[id][0].doClose();
                }
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
        AddPond,
    },
};
</script>

<style lang="scss" scope>
.activity-detail {
    .pond {
        width: 250px;
        p {
            line-height: 25px;
            color: #999;
            &.title {
                color: #333;
            }
        }
    }
    .pond-wrap {
        margin-top: 10px;
        max-width: 870px;
        .item {
            display: flex;
            align-items: center;
            margin-bottom: 10px;
            border: 1px solid #ebeef5;
            border-radius: 6px;
            box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.1);
            padding: 5px 10px;
            cursor: pointer;
            overflow: hidden;

            &:hover {
                background: #f6fcfc;
            }

            p {
                line-height: 26px;
                color: #999;
                &.title {
                    font-size: 15px;
                    color: #000;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }
            }

            .operation {
                text-align: center;
                p{
                    line-height: 30px;
                    a{
                        line-height: 1;
                    }
                }
            }
        }
    }
}
</style>


