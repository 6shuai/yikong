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
                            <el-tag
                                v-for="(item, index) in resData.screens"
                                :key="index"
                                class="mr10"
                                type="primary"
                                size="mini"
                                >
                                {{ item.displayName }}
                            </el-tag>
                        </el-form-item>
                        <el-form-item label="活动游戏：">
                            <el-tag
                                v-for="(item, index) in resData.contents"
                                :key="index"
                                class="mr10"
                                type="primary"
                                size="mini"
                                >
                                {{ item.displayName }}
                            </el-tag>
                        </el-form-item>
                    </el-col>
                    <el-col :md="12" :sm="12" :xs="24">
                        <el-form-item label="商场模块：">
                            {{ resData.moduleName }}
                        </el-form-item>
                        <el-form-item label="优惠券统计：">
                            <el-link type="primary" @click="handleCouponStatistics">优惠券数据统计</el-link>
                        </el-form-item>
                        <el-form-item label="商户：">
                            <el-tag
                                v-for="(item, index) in resData.merchants"
                                :key="index"
                                class="mr10"
                                type="primary"
                                size="mini"
                                >
                                {{ item.merchantName }}
                            </el-tag>
                        </el-form-item>
                        <el-form-item label="当前商户">
                            <el-select
                                v-model="currentMerchant"
                                filterable
                                placeholder="请选择商户"
                                size="small"
                                @change="handleChangeMerchant"
                            >
                                <el-option
                                    v-for="item in resData.merchants"
                                    :key="item.merchant"
                                    :label="item.merchantName"
                                    :value="item.merchant"
                                >
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="邀请链接：">
                            <div class="generate-link">
                                <div class="invite-link">
                                    <el-button type="primary" size="small" @click="handleGenerateLink">生成邀请链接</el-button>
                                    <el-link type="primary" @click="$refs.linkList.showGenerateLinkList(currentMerchant)">已生成的链接列表</el-link>
                                </div>
                                <div 
                                    class="link tag-read" 
                                    :data-clipboard-text="generateLinkUrl"
                                    @click="copy"
                                    title="点击复制链接"
                                    v-if="generateLinkUrl"
                                >
                                    {{ generateLinkUrl }}<i class="el-icon-copy-document"></i>
                                </div>
                                <div class="invite-link-qr" v-if="generateLinkUrl">
                                    <vue-qr :text="generateLinkUrl" :margin="0" colorDark="#000" colorLight="#fff" :size="200"></vue-qr>
                                </div>
                            </div>
                        </el-form-item>
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
                    <el-table
                        v-loading="pondLoading"
                        stripe
                        size="small"
                        :data="pondData"
                        style="width: 100%; margin-bottom: 20px"
                        row-key="id"
                        border
                    >   
                        <el-table-column
                            prop="displayName"
                            label="名称"
                            min-width="100"
                        ></el-table-column>
                        <el-table-column
                            prop="description"
                            label="描述"
                            min-width="150"
                        ></el-table-column>
                        <el-table-column
                            prop="awardCount"
                            label="单次发放数量"
                            min-width="100"
                        ></el-table-column>
                        <el-table-column
                            prop="awardCount"
                            label="规则"
                            min-width="100"
                        >
                            <template slot-scope="scope">
                                {{scope.row.pickSequence == 1? "随机" : "顺序"}}
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="duplicate"
                            label="允许重复"
                            min-width="100"
                        >
                            <template slot-scope="scope">
                                {{ scope.row.duplicate ? "允许" : "不允许" }}
                            </template>
                        </el-table-column>
                        <el-table-column label="操作" width="100">
                            <template slot-scope="scope">
                                <el-link
                                    type="primary"
                                    @click.stop="
                                        $refs.addPond.showAddPond(scope.row)
                                    "
                                    >编辑</el-link
                                >
                                <span class="ml20" v-if="resData.deleteAwardPool"> 
                                    <el-popover
                                        placement="top"
                                        :ref="scope.row.id"
                                        width="200"
                                    >
                                        <p>
                                            此操作将删除【{{
                                                scope.row.displayName
                                            }}】, 是否继续?
                                        </p>
                                        <div
                                            style="text-align: right; margin: 0"
                                        >
                                            <el-button
                                                size="mini"
                                                type="text"
                                                @click="
                                                    $refs[scope.row.id][0].doClose()
                                                "
                                                >取消</el-button
                                            >
                                            <el-button
                                                type="primary"
                                                size="mini"
                                                @click="
                                                    handleDeletePond(
                                                        scope.row.id,
                                                        scope.$index
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
                                </span>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-form-item>
                <el-form-item label="领取限制：">
                    <el-button
                        size="small"
                        type="primary"
                        plain
                        @click="$refs.addGetLimit.showGetLimit()"
                        >添加领取限制</el-button
                    >
                    <el-table
                        v-loading="limitLoading"
                        stripe
                        size="small"
                        :data="limitData"
                        style="width: 100%; margin-bottom: 20px"
                        row-key="id"
                        border
                    >   
                        <el-table-column
                            prop="claimLimit"
                            label="限制类型"
                            min-width="100"
                        >
                            <template slot-scope="scope">
                                {{scope.row.claimLimit == 1? "单品限制" : "总量限制"}}
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="beginType"
                            label="开始时间类型"
                            min-width="150"
                        >
                            <template slot-scope="scope">
                                {{scope.row.beginType == 1? "活动期间" : "固定时间"}}
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="beginTime"
                            label="开始时间"
                            min-width="100"
                        ></el-table-column>
                        <el-table-column
                            prop="endType"
                            label="结束时间类型"
                            min-width="100"
                        >
                            <template slot-scope="scope">
                                {{scope.row.endType == 1? "活动期间" : "固定时间"}}
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="endTime"
                            label="结束时间"
                            min-width="100"
                        >
                        </el-table-column>
                        <el-table-column
                            prop="limit"
                            label="限制数量"
                            min-width="100"
                        >
                        </el-table-column>
                        <el-table-column label="操作" width="100">
                            <template slot-scope="scope">
                                <el-link
                                    type="primary"
                                    @click.stop="
                                        $refs.addGetLimit.showGetLimit(scope.row)
                                    "
                                    >编辑</el-link
                                >
                                <span class="ml20" v-if="resData.deleteAwardPool"> 
                                    <el-popover
                                        placement="top"
                                        :ref="scope.row.id"
                                        width="200"
                                    >
                                        <p>
                                            此操作将删除此限制条件, 是否继续?
                                        </p>
                                        <div
                                            style="text-align: right; margin: 0"
                                        >
                                            <el-button
                                                size="mini"
                                                type="text"
                                                @click="
                                                    $refs[scope.row.id][0].doClose()
                                                "
                                                >取消</el-button
                                            >
                                            <el-button
                                                type="primary"
                                                size="mini"
                                                @click="
                                                    handleDeleteLimit(
                                                        scope.row.id,
                                                        scope.$index
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
                                </span>
                            </template>
                        </el-table-column>
                    </el-table>
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

        <!-- 添加领取限制 -->
        <add-get-limit
            ref="addGetLimit"
            @limitCreatedSuccess="getLimitList"
        ></add-get-limit>

        <!-- 已生成的链接列表 -->
        <link-list ref="linkList" :mid="resData.merchantId"></link-list>

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
    activityAuthorityDelete,
    activityGenerateLink,
    activityLimitList,
    activityLimitDelete
} from "@/api/activity";
import { getActivityDetail } from "./mixins/index";
import AddPond from "./components/AddPond";
import LinkList from './components/LinkList';
import AddGetLimit from './components/GetLimit';
import Clipboard from 'clipboard';
import vueQr from 'vue-qr';

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
            pondLoading: false,
            generateLinkUrl: '',  //生成的邀请链接  https://static.xfengjing.com/writeoff_invitation/index.html?mid=123&pid=234&pm=2&t=xxxxwere
            currentMerchant: null,  //当前商户
            limitData: [],           //领取限制 数据
            limitLoading: false,     //领取限制列表 loading
        };
    },
    created() {
        if (this.$route.params.id) {
            this.initDetail().then(res => {
                this.currentMerchant = this.resData.merchants[0].merchant;
            });
            this.getPondList();
            this.getLimitList();
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
                    this.pondData.splice(index, 1);
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
        },

        //生成邀请链接
        handleGenerateLink(){
            // https://static.xfengjing.com/writeoff_invitation/index.html?mid=123&pid=234&pm=2&t=xxxxwere
            //mid 商户id   pid 活动id  pm=2 固定   t 接口code
            let { id } = this.resData;
            let data = {
                id,
                merchantId: this.currentMerchant
            }
            activityGenerateLink(data).then(res => {
                if(res.code === this.$successCode){
                    let mid = this.currentMerchant,
                        pid = id,
                        pm = 3,
                        token = res.obj;
                    this.generateLinkUrl = `https://static.xfengjing.com/writeoff_invitation/index.html?mid=${mid}&pid=${pid}&pm=${pm}&t=${token}`
                }
            })
        },

        //复制链接
        copy () {
            var clipboard = new Clipboard('.tag-read')
            clipboard.on('success', e => {
                this.$message.success('复制成功', e)
                e.clearSelection()
                clipboard.destroy()
            })
            clipboard.on('error', e =>{
                // 不支持复制
                this.$message.error('该浏览器不支持复制')
            })
        },

        //优惠券数据统计
        handleCouponStatistics(){
            this.$router.push({
                path: '/game/couponStatisics',
                query: {
                    source: 'activity',
                    promotionId: this.$route.params.id,
                }
            });
        },

        //选择商户
        handleChangeMerchant(){
            this.generateLinkUrl = '';
        },

        //根据活动id 查询领取限制列表
        getLimitList() {
            this.limitLoading = true;
            activityLimitList({ promotionId: this.$route.params.id }).then(
                (res) => {
                    this.limitLoading = false;
                    if (res.code === this.$successCode) {
                        this.limitData = res.obj;
                    }
                }
            ); 
        },

        //删除限制规则
        handleDeleteLimit(id, index) {
            let data = `?id=${id}`;
            activityLimitDelete(data).then((res) => {
                if (res.code === this.$successCode) {
                    this.$message.success("删除成功~");
                    this.limitData.splice(index, 1);
                    this.$refs[id][0].doClose();
                }
            });
        },
    },
    components: {
        Permission,
        AddPond,
        vueQr,
        LinkList,
        AddGetLimit
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
}

.generate-link{
    padding: 0 20px;

    .invite-link{
        .el-link{
            margin-left: 40px;
        }
    }

    .link{
        display: block;
        line-height: 40px;
        cursor: pointer;
        display: inline-block;
        
        &:hover{
            color: #8484FF;
        }
    }

    .invite-link-qr{
        padding: 20px 0;
    }
}
</style>


