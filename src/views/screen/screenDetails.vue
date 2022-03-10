<template>
    <el-card class="template-card screen-details" v-loading="loading">

        <page-header 
            :title="resData.displayName"
            backPath="/screen/index"
        >
            <div slot="headerRight" v-if="resData">
                <span @click="$refs.pagePermission.showPermission({screenId: $route.params.id})"
                    v-if="resData.authorize"
                    ><i class="el-icon-lock" title="授权"></i>授权<el-divider
                        direction="vertical"
                    ></el-divider
                ></span>
                <span @click="editScreen"
                    v-if="resData.edit"
                    ><i class="el-icon-edit" title="编辑"></i>编辑<el-divider
                        direction="vertical"
                    ></el-divider
                ></span>
                <span @click="collectScreen" v-if="!resData.isFavorite"
                    ><i class="el-icon-star-off" title="收藏"></i>收藏
                    <el-divider direction="vertical"></el-divider
                ></span>
                <span @click="collectScreen" v-else
                    ><i class="el-icon-star-on" title="取消收藏"></i
                    >取消收藏<el-divider direction="vertical"></el-divider
                ></span>
                <span 
                    v-if="resData.deleteRight"
                    @click="deleteScreen"
                    ><i class="el-icon-delete" title="删除"></i>删除</span
                >
            </div>
        </page-header>

        <el-tabs 
            v-model="tabActiveName" 
            class="mb20"
            @tab-click="handleTab"
        >
            <el-tab-pane label="基本信息" :name="`/screen/details/${$route.params.id}`"></el-tab-pane>
            <!-- 监播数据 -->
            <el-tab-pane label="监播数据(时序)" :name="`/screen/details/${$route.params.id}/timeSeries`"></el-tab-pane>
            <el-tab-pane label="监播数据(统计)" :name="`/screen/details/${$route.params.id}/statistics`"></el-tab-pane>
            <el-tab-pane label="时间轴数据" :name="`/screen/details/${$route.params.id}/timeline`"></el-tab-pane>
            <el-tab-pane label="占位情况" :name="`/screen/details/${$route.params.id}/occupy`"></el-tab-pane>
        </el-tabs>   

        <div 
            class="content"
            v-show="tabActiveName === `/screen/details/${$route.params.id}`"
        >
            <el-row :gutter="20">
                <el-col :xs="24" :sm="12" :md="16" class="screen-info-left">
                    <div class="screen-img">
                        <img
                            v-if="resData.screenshotUri"
                            :src="resData.screenshotUri"
                        />
                        <img
                            v-else-if="
                                resData.screenShowData &&
                                resData.screenShowData[0]
                            "
                            :src="resData.screenShowData[0].uri"
                        />
                        <el-tag
                            v-if="!resData.state"
                            class="status ing"
                            type="info"
                            effect="dark"
                            >建设中</el-tag
                        >
                        <el-tag
                            v-if="resData.state == 1"
                            class="status"
                            type="success"
                            effect="dark"
                            >在线</el-tag
                        >
                        <el-tag
                            v-if="resData.state == 2"
                            class="status"
                            type="warning"
                            effect="dark"
                            >离线</el-tag
                        >
                    </div>
                    <ul class="tool-wrap clearfix" v-if="resData.operate">
                        <li>
                            <el-button
                                type="primary"
                                icon="el-icon-refresh"
                                size="small"
                                :disabled="resData.state !== 1"
                                :loading="screenshotLoading"
                                @click="updateImg"
                                >更新截图</el-button
                            >
                        </li>
                        <li>
                            音量:<el-input-number
                                size="small"
                                v-model="resData.volume"
                                controls-position="right"
                                :min="0"
                                :max="100"
                            ></el-input-number>
                        </li>
                        <li>
                            <el-button
                                type="primary"
                                icon="el-icon-finished"
                                size="small"
                                :disabled="resData.state !== 1"
                                :loading="setVolumeLoading"
                                @click="setVolume"
                                >提交</el-button
                            >
                        </li>
                        <!-- <li>
                            <el-button
                                type="primary"
                                icon="el-icon-close-notification"
                                size="small"
                                :disabled="resData.state !== 1"
                                :loading="setMuteLoading"
                                @click="setMute"
                                >静音</el-button
                            >
                        </li> -->
                        <li>
                            <el-button
                                type="primary"
                                icon="el-icon-lock"
                                size="small"
                                :disabled="resData.state !== 1"
                                :loading="bindLoading"
                                @click="macBind"
                                >硬件绑定</el-button
                            >
                        </li>
                        <li>
                            <el-button
                                type="primary"
                                icon="el-icon-unlock"
                                size="small"
                                :disabled="resData.state !== 1"
                                :loading="unboundLoading"
                                @click="macUnbound"
                                >解除绑定</el-button
                            >
                        </li>
                    </ul>
                </el-col>
                <el-col :xs="24" :sm="12" :md="8" class="screen-info-right">
                    <el-divider
                        >实景图片<i class="el-icon-caret-bottom"></i
                    ></el-divider>
                    <div class="info-item photo">
                        <el-image
                            v-for="item in resData.screenShowData"
                            :key="item.id"
                            fit="cover"
                            :src="item.uri"
                            :preview-src-list="previewList"
                        >
                        </el-image>
                    </div>

                    <el-divider
                        >屏幕规格<i class="el-icon-caret-bottom"></i
                    ></el-divider>
                    <div class="info-item">
                        <el-form label-width="85px">
                            <el-form-item label="屏幕序列号">
                                <span>{{ resData.serialNumber }}</span>
                            </el-form-item>
                            <el-form-item label="点距规格">
                                <span>{{ resData.dotPitchName }}</span>
                            </el-form-item>
                            <el-form-item label="分辨率">
                                <span
                                    >{{ resData.resolutionWidth }} x
                                    {{ resData.resolutionHeight }}</span
                                >
                            </el-form-item>
                            <el-form-item label="宽高比">
                                <span
                                    >{{ resData.aspectRatioWidth }} :
                                    {{ resData.aspectRatioHeight }}</span
                                >
                            </el-form-item>
                            <el-form-item label="物理尺寸">
                                <span
                                    >{{ resData.physicalWidth }}mm x
                                    {{ resData.physicalHeight }}mm</span
                                >
                            </el-form-item>
                        </el-form>
                    </div>

                    <el-divider
                        >详细信息<i class="el-icon-caret-bottom"></i
                    ></el-divider>
                    <div class="info-item">
                        <el-form label-width="85px">
                            <el-form-item label="开始时间">
                                <span>{{ handleFindTimeHasYtd(resData.beginTime) }}</span>
                            </el-form-item>
                            <el-form-item label="结束时间">
                                <span>{{ handleFindTimeHasYtd(resData.endTime) }}</span>
                            </el-form-item>
                            <el-form-item label="探针数据">
                                <el-link
                                    v-if="resData.placeId"
                                    type="primary"
                                    @click="
                                        $router.push(
                                            `/screen/probeData/${$route.params.id}`
                                        )
                                    "
                                    >查看探针数据</el-link
                                >
                            </el-form-item>
                            <el-form-item label="数据统计" v-if="resData.statisics"> 
                                <el-link
                                    @click="handleStatistics"
                                    v-if="resData.placeId"
                                    type="primary"
                                    >游戏数据统计</el-link
                                >
                            </el-form-item>
                            <el-form-item label="优惠券统计" v-if="resData.statisics"> 
                                <el-link
                                    @click="handleCouponStatistics"
                                    v-if="resData.placeId"
                                    type="primary"
                                    >优惠券数据统计</el-link
                                >
                            </el-form-item>
                            <el-form-item label="所属场所">
                                <el-link
                                    v-if="resData.placeId"
                                    type="primary"
                                    @click="
                                        $router.push(
                                            `/place/details/${resData.placeId}`
                                        )
                                    "
                                    >{{ resData.placeName }}</el-link
                                >
                            </el-form-item>
                            <el-form-item label="时间轴">
                                <el-link
                                    type="primary"
                                    v-if="resData.timelineContainer && resData.timelineContainer.id"
                                    @click="
                                        $router.push(
                                            `/timeline/details/${resData.timelineContainer.id}`
                                        )
                                    "
                                    >{{
                                        resData.timelineContainer.displayName
                                    }}</el-link
                                >
                            </el-form-item>
                            <el-form-item label="描述">
                                <span>{{ resData.description }}</span>
                            </el-form-item>

                            <el-form-item label="定时时间轴">
                                <el-card
                                    class="box-card timeline-list"
                                    :body-style="{ padding: '0px' }"
                                    v-for="item in resData.timelineTimings"
                                    :key="item.id"
                                >
                                    <div class="screen-info">
                                        <el-link
                                            type="primary"
                                            @click="
                                                $router.push(
                                                    `/timeline/details/${item.containerId}`
                                                )
                                            "
                                            ><i class="el-icon-link"></i
                                            >{{ item.containerName }}</el-link
                                        >
                                        <div class="time">
                                            {{ item.playTime }} -
                                            {{ item.endTime }}
                                        </div>
                                    </div>
                                </el-card>
                            </el-form-item>
                        </el-form>
                    </div>

                     <el-divider
                        v-if="resData.publishedPrices && resData.publishedPrices.length"
                        >刊例价格<i class="el-icon-caret-bottom"></i
                    ></el-divider>
                    <el-table
                        class="mb20"
                        stripe
                        size="small"
                        v-if="resData.publishedPrices && resData.publishedPrices.length"
                        :data="resData.publishedPrices"
                    >
                        <el-table-column 
                            prop="price" 
                            label="刊例价" 
                            min-width="60"
                        >
                        </el-table-column>
                        <el-table-column 
                            prop="priceSystem" 
                            label="价格体系" 
                            min-width="100"
                        >
                            <template slot-scope="scope">
                                {{ findPriceType(scope.row.priceSystem) }}
                            </template>
                        </el-table-column>
                    </el-table>

                </el-col>
            </el-row>
        </div>

        <!-- 授权 -->
        <permission 
            ref="pagePermission" 
            :premissionApi="premissionApi"
        ></permission>

        <router-view v-if="tabActiveName != `/screen/details/${$route.params.id}`"></router-view>

    </el-card>
</template>
<script>
import {
    screenDelete,
    screenSetVolume,
    screenSetMute,
    screenshotUpdate,
    bindScreen,
    unboundScreen,
    screenAuthority, 
    screenAuthorityUpdate,
    screenAuthorityDelete
} from "@/api/screen";
import { getScreenDetail, screenIsFavorite } from "@/views/screen/mixins";
import { getPriceTypeList } from '@/api/common';
import { findTimeHasYtd } from '@/utils/index';
import Permission from '@/components/permission/index';
import PageHeader from '@/components/PageHeader';

export default {
    mixins: [getScreenDetail, screenIsFavorite],
    computed: {
        previewList() {
            let arr = [];
            this.resData.screenShowData.forEach((item) => {
                arr.push(item.uri);
            });
            return arr;
        },
    },
    data() {
        return {
            loading: false,
            screenshotLoading: false, //更新截图按钮loading
            setVolumeLoading: false, //设置音量按钮loading
            setMuteLoading: false, //设置静音按钮loading
            bindLoading: false, //绑定硬件loading
            unboundLoading: false, //解除绑定loading
            premissionApi: {
                list: screenAuthority,
                update: screenAuthorityUpdate,
                delete: screenAuthorityDelete
            },
            tabActiveName: `/content/details/${this.$route.params.id}`
        };
    },
    mounted() {
        this.tabActiveName = this.$route.path
        this.hasPagePerm('Screen').then(res => {
            if(res){
                this.getPriceType()
                this.initDetail();
            }
        })
    },
    methods: {
        //编辑屏幕
        editScreen() {
            this.$router.push(`/screen/edit/${this.$route.params.id}`);
        },

        //删除屏幕
        deleteScreen() {
            this.$confirm("此操作将删除该屏幕 是否继续?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
                center: true,
            }).then(() => {
                screenDelete(this.$route.params.id).then((res) => {
                    if (res.code === this.$successCode) {
                        this.$message.success({
                            message: "删除成功~",
                            duration: 1000,
                            onClose: () => {
                                this.$router.push("/screen/index");
                            },
                        });
                    }
                });
            });
        },

        //收藏
        collectScreen() {
            let p = {
                isFavorite: this.resData.isFavorite ? 0 : 1,
                screenId: this.resData.id,
                userId: this.$store.state.user.loginData.id,
            };
            let s = `?isFavorite=${p.isFavorite}&screenId=${p.screenId}&userId=${p.userId}`;
            new Promise((resolve) => {
                this.handleFavorite(s, resolve);
            }).then((res) => {
                this.$set(this.resData, "isFavorite", p.isFavorite);
            });
        },

        //设置音量 提交
        setVolume() {
            let data = `?screenId=${this.resData.id}&value=${this.resData.volume}`;
            this.setVolumeLoading = true;
            screenSetVolume(data).then((res) => {
                this.setVolumeLoading = false;
                if (res.code == this.$successCode) {
                    this.$message.success("音量操作成功~");
                }
            });
        },

        //设置静音
        setMute() {
            let data = `?screenId=${this.resData.id}`;
            this.setMuteLoading = true;
            screenSetMute(data).then((res) => {
                this.setMuteLoading = false;
                if (res.code === this.$successCode) {
                    this.$message.success("设置静音操作成功~");
                }
            });
        },

        //更新屏幕截图
        updateImg() {
            let data = `?screenId=${this.resData.id}`;
            this.screenshotLoading = true;
            screenshotUpdate(data).then((res) => {
                this.screenshotLoading = false;
                if (res.code === this.$successCode) {
                    this.$message.success({
                        message: "更新屏幕截图操作成功~",
                        duration: 4000,
                        onClose: () => {
                            this.initDetail();
                        },
                    });
                }
            });
        },

        //硬件绑定
        macBind() {
            let data = `?screenId=${this.resData.id}`;
            this.bindLoading = true;
            bindScreen(data).then((res) => {
                this.bindLoading = false;
                if (res.code === this.$successCode) {
                    this.$message.success("硬件绑定成功~");
                }
            });
        },

        //解除硬件绑定
        macUnbound() {
            let data = `?screenId=${this.resData.id}`;
            this.unboundLoading = true;
            unboundScreen(data).then((res) => {
                this.unboundLoading = false;
                if (res.code === this.$successCode) {
                    this.$message.success("解除硬件绑定成功~");
                }
            });
        },

        //数据统计
        handleStatistics(){
            this.$router.push({
                path: '/game/statisics',
                query: {
                    source: 'screen',
                    screenId: this.$route.params.id
                }
            });
        },

        //优惠券数据统计
        handleCouponStatistics(){
            this.$router.push({
                path: '/game/couponStatisics',
                query: {
                    source: 'screen',
                    screenId: this.$route.params.id
                }
            });
        },

        //切换tab
        handleTab(){
            this.$router.push(this.tabActiveName)
        },

        // 价格体系列表
        getPriceType(){
            let p = this.$store.state.user.priceTypeData
            if(p.length) return
            getPriceTypeList().then(res => {
                this.$store.state.user.priceTypeData = res.obj
            })
        },

        // 根据刊例价体系id 查找刊例价体系名称
        findPriceType(id){
            try {
                let p = this.$store.state.user.priceTypeData || []
                let obj = {}
                obj = p.find(item => {
                    return item.id == id
                })
                return obj.displayName
            } catch (error) {
                
            }
        },

        handleFindTimeHasYtd(data){
            return findTimeHasYtd(data)
        }
        
    },
    watch:{
        $route(to, from) {
            this.tabActiveName = to.path
        }
    },
    components: {
        Permission,
        PageHeader
    }
};
</script>
<style lang="scss">
@import "../../styles/variables.scss";
@import "./style/screen-details.scss";
</style>