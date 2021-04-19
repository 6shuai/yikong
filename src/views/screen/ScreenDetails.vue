<template>
    <el-card class="template-card screen-details" v-loading="loading">
        <div class="header-wrap detail-header-wrap mb30">
            <el-page-header @back="$router.go(-1)"> </el-page-header>
            <div class="header-right" v-if="resData">
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
            <div class="title">
                <h2>{{ resData.displayName }}</h2>
            </div>
        </div>
        <div class="content">
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
                            <el-form-item label="奖励统计" v-if="resData.statisics">
                                <el-link
                                    v-if="resData.placeId"
                                    @click="handleAwardStatistics"
                                    type="primary"
                                    >游戏奖励统计</el-link
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
                        >联系信息<i class="el-icon-caret-bottom"></i
                    ></el-divider>
                    <div class="info-item">
                        <ul
                            class="service"
                            v-if="
                                resData.screenContactData &&
                                resData.screenContactData.length
                            "
                        >
                            <li
                                v-for="item in resData.screenContactData"
                                :key="item.userId"
                            >
                                <el-image src="" fit="cover">
                                    <div slot="error" class="image-slot">
                                        <svg-icon
                                            icon-class="defalut-header-img"
                                        ></svg-icon>
                                    </div>
                                </el-image>
                                <div class="desc">
                                    <p class="nickname">
                                        {{ item.accountName }}
                                        <span class="role">{{
                                            item.description
                                        }}</span>
                                    </p>

                                    <p class="place-lx">
                                        <label title="电话">
                                            <span class="label"
                                                ><font-awesome-icon
                                                    :icon="[
                                                        'fas',
                                                        'mobile-alt',
                                                    ]"
                                            /></span>
                                            <span>{{
                                                item.mobile || "--"
                                            }}</span>
                                        </label>
                                        <el-divider
                                            direction="vertical"
                                        ></el-divider>
                                        <label title="微信">
                                            <span class="label"
                                                ><font-awesome-icon
                                                    :icon="['fab', 'weixin']"
                                            /></span>
                                            <span>{{
                                                item.wechat || "--"
                                            }}</span>
                                        </label>
                                    </p>
                                </div>
                            </li>
                        </ul>
                        <div v-else>暂无信息~</div>
                    </div>
                </el-col>
            </el-row>
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
import Permission from '@/components/permission/index';

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
            }
        };
    },
    mounted() {
        this.hasPagePerm('Screen').then(res => {
            if(res){
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

        //游戏奖励统计
        handleAwardStatistics(){
            this.$router.push({
                path: '/game/awardStatisics',
                query: {
                    source: 'screen',
                    screenId: this.$route.params.id
                }
            });
        }
    },
    components: {
        Permission
    }
};
</script>
<style lang="scss" scope>
@import "../../styles/variables.scss";
@import "./style/screen-details.scss";
</style>