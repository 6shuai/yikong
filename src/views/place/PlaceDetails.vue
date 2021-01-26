<template>
    <el-card class="template-card place-detail" v-loading="loading">
        <div class="header-wrap detail-header-wrap mb30">
            <el-page-header @back="$router.go(-1)"> </el-page-header>
            <div class="header-right">
                <span
                    @click="
                        $refs.pagePermission.showPermission({
                            placeId: $route.params.id,
                        })
                    "
                    v-if="resData.authorize"
                    ><i class="el-icon-lock" title="授权"></i>授权<el-divider
                        direction="vertical"
                    ></el-divider
                ></span>
                <span @click="editPlace"
                    v-if="resData.edit"
                    ><i class="el-icon-edit" title="编辑"></i>编辑<el-divider
                        direction="vertical"
                    ></el-divider
                ></span>
                <span @click="collectPlace" v-if="!resData.isFavorite"
                    ><i class="el-icon-star-off" title="收藏"></i>收藏
                    <el-divider direction="vertical"></el-divider
                ></span>
                <span @click="collectPlace" v-else
                    ><i class="el-icon-star-on" title="取消收藏"></i
                    >取消收藏<el-divider direction="vertical"></el-divider
                ></span>
                <span 
                    v-if="resData.delete"
                    @click="deletePlace"
                    ><i class="el-icon-delete" title="删除"></i>删除</span
                >


            </div>
            <div class="title">
                <h2>{{ resData.displayName }}</h2>
            </div>
        </div>

        <div class="place-info">
            <div class="place-photo left">
                <div class="carousel">
                    <el-carousel
                        ref="carouse"
                        indicator-position="none"
                        :autoplay="false"
                        height="470px"
                        :initial-index="imgIndex"
                        @change="
                            imgIndex = $event;
                            prevNextChange();
                        "
                    >
                        <el-carousel-item
                            v-for="item in resData.placeShowData"
                            :key="item.id"
                        >
                            <img :src="item.uri" />
                        </el-carousel-item>
                    </el-carousel>
                </div>
                <div class="thumb-wrap mt10">
                    <div class="arrow left" @click="prevNextChange('pre')">
                        <i class="el-icon-arrow-left"></i>
                    </div>
                    <div class="arrow right" @click="prevNextChange('next')">
                        <i class="el-icon-arrow-right"></i>
                    </div>
                    <ul
                        class="thumb"
                        v-if="
                            resData.placeShowData &&
                            resData.placeShowData.length > 1
                        "
                        :style="{
                            width: 162 * resData.placeShowData.length + 'px',
                            marginLeft: distance + 'px',
                        }"
                    >
                        <li
                            class="ml10"
                            v-for="(item, index) in resData.placeShowData"
                            :key="item.id"
                            :class="{ active: imgIndex == index }"
                            @click="
                                imgIndex = index;
                                $refs.carouse.setActiveItem(index);
                            "
                        >
                            <el-image :src="item.uri" fit="cover"> </el-image>
                        </li>
                    </ul>
                </div>

                <h2 class="p-info-title mt20 mb20">地址信息</h2>
                <div class="place-info">
                    <div class="address-name">
                        <span>{{ resData.address }}</span>
                    </div>
                    <div class="map" v-if="resData.longitude">
                        <the-map
                            :disableZoom="true"
                            :lng="resData.longitude"
                            :lat="resData.latitude"
                            :visible="true"
                        ></the-map>
                    </div>
                </div>
            </div>

            <div class="place-brand right clearfix" id="app-main-wrap">
                <div class="place-logo">
                    <el-image
                        v-if="resData.logo"
                        :src="resData.logo"
                        fit="cover"
                    >
                    </el-image>
                </div>
                <div class="place-info-r">
                    <div class="place-name mt20 mb20">
                        {{ resData.organizationName }}
                    </div>
                    <div class="place-desc">
                        <span v-if="resData.description">{{
                            resData.description
                        }}</span>
                        <span v-else>还没有介绍~</span>
                    </div>
                </div>

                <h2 class="p-info-title mt20 mb20">屏幕信息</h2>
                <div class="place-info">
                    <div
                        class="place-content"
                        v-if="
                            resData.placeScreenData &&
                            resData.placeScreenData.length
                        "
                    >
                        <div class="place-box">
                            <div
                                class="place-p"
                                :style="{ width: placeW }"
                                v-for="item in resData.placeScreenData"
                                :key="item.id"
                            >
                                <screen-list
                                    name="place"
                                    :auth="resData.jumpToScreen"
                                    :item="item"
                                    :imageH="imageH"
                                    @seeAddress="
                                        $refs.mapDialog.showMapDialog(item)
                                    "
                                ></screen-list>
                            </div>
                        </div>
                    </div>
                    <div v-else>暂无屏幕信息~</div>
                </div>

                <h2 class="p-info-title mt20 mb20">场管信息</h2>
                <div class="place-info">
                    <ul
                        class="service"
                        v-if="
                            resData.placeContactData &&
                            resData.placeContactData.length
                        "
                    >
                        <li
                            v-for="item in resData.placeContactData"
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
                                                :icon="['fas', 'mobile-alt']"
                                        /></span>
                                        <span>{{ item.mobile || "--" }}</span>
                                    </label>
                                    <el-divider
                                        direction="vertical"
                                    ></el-divider>
                                    <label title="微信">
                                        <span class="label"
                                            ><font-awesome-icon
                                                :icon="['fab', 'weixin']"
                                        /></span>
                                        <span>{{ item.wechat || "--" }}</span>
                                    </label>
                                </p>
                            </div>
                        </li>
                    </ul>
                    <div v-else>暂无场管信息~</div>
                </div>
            </div>
        </div>

        <!-- 查看地图位置 -->
        <map-dialog ref="mapDialog"></map-dialog>

        <!-- 授权 -->
        <permission
            ref="pagePermission"
            :premissionApi="premissionApi"
        ></permission>
    </el-card>
</template>
<script>
import {
    placeDelete,
    placeAuthority,
    placeAuthorityUpdate,
    placeAuthorityDelete,
} from "@/api/place";
import { screenSizeWatch } from "@/mixins";
import { placeIsFavorite, placeDetailData } from "@/views/place/mixins";
import TheMap from "@/components/BaiduMap/index";
import ScreenList from "@/views/screen/components/ScreenList";
import MapDialog from "@/components/BaiduMap/MapDialog";
import Permission from "@/components/permission/index";

export default {
    mixins: [screenSizeWatch, placeIsFavorite, placeDetailData],
    data() {
        return {
            imgIndex: 0, //幻灯片的索引
            loading: false,
            resData: {},
            distance: -10,
            premissionApi: {
                list: placeAuthority,
                update: placeAuthorityUpdate,
                delete: placeAuthorityDelete,
            },
        };
    },
    mounted() {
        this.hasPagePerm("Place").then((res) => {
            if (res) {
                this.initDetail();
            }
        });
    },
    methods: {
        //编辑场所
        editPlace() {
            this.$router.push(`/place/edit/${this.$route.params.id}`);
        },

        //删除场所
        deletePlace() {
            this.$confirm("此操作将删除该场所 是否继续?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
                center: true,
            }).then(() => {
                placeDelete(this.$route.params.id).then((res) => {
                    if (res.code === this.$successCode) {
                        this.$message.success({
                            message: "删除成功~",
                            duration: 1000,
                            onClose: () => {
                                this.$router.push("/place/index");
                            },
                        });
                    }
                });
            });
        },

        //收藏
        collectPlace() {
            let p = {
                isFavorite: this.resData.isFavorite ? 0 : 1,
                placeId: this.resData.id,
                userId: this.$store.state.user.loginData.id,
            };
            let s = `?isFavorite=${p.isFavorite}&placeId=${p.placeId}&userId=${p.userId}`;
            new Promise((resolve) => {
                this.handleFavorite(s, resolve);
            }).then((res) => {
                this.$set(this.resData, "isFavorite", p.isFavorite);
            });
        },

        prevNextChange(type) {
            if (type) {
                this.imgIndex =
                    type == "pre" ? this.imgIndex - 1 : this.imgIndex + 1;
                if (this.imgIndex < 0) {
                    this.imgIndex = this.resData.placeShowData.length - 1;
                    this.distance =
                        -162 * (this.resData.placeShowData.length - 4) + -10;
                } else if (
                    this.imgIndex + 1 >
                    this.resData.placeShowData.length
                ) {
                    this.imgIndex = 0;
                    this.distance = -10;
                }
                this.$refs.carouse.setActiveItem(this.imgIndex);
            }
            if (
                this.distance != -10 &&
                this.imgIndex < this.resData.placeShowData.length - 4
            ) {
                this.distance = -162 * this.imgIndex + -10;
            } else if (
                this.distance !=
                    -162 * (this.resData.placeShowData.length - 4) + -10 &&
                this.imgIndex > 3
            ) {
                this.distance = -162 * (this.imgIndex - 3) + -10;
            }
        },
    },
    components: {
        TheMap,
        ScreenList,
        MapDialog,
        Permission,
    },
};
</script>
<style lang="scss" scope>
@import "../../styles/variables.scss";
@import "./style/place-card.scss";
@import "./style/place-detail.scss";
</style>