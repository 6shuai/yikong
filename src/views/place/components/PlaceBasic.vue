<!--
 * @Author: liushuai
 * @Date: 2022-04-08 13:56:45
 * @LastEditors: liushuai
 * @LastEditTime: 2022-04-08 13:59:29
 * @Description: file content
 * @FilePath: \pclient\src\views\place\components\PlaceBasic.vue
-->

<template>
    <div>
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
                            v-for="item in placeDetail.placeShowData"
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
                            placeDetail.placeShowData &&
                            placeDetail.placeShowData.length > 1
                        "
                        :style="{
                            width: 162 * placeDetail.placeShowData.length + 'px',
                            marginLeft: distance + 'px',
                        }"
                    >
                        <li
                            class="ml10"
                            v-for="(item, index) in placeDetail.placeShowData"
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
                        <span>{{ placeDetail.address }}</span>
                    </div>
                    <div class="map" v-if="placeDetail.longitude">
                        <the-map
                            :disableZoom="true"
                            :lng="placeDetail.longitude"
                            :lat="placeDetail.latitude"
                            :visible="true"
                        ></the-map>
                    </div>
                </div>
            </div>

            <div class="place-brand right clearfix" id="app-main-wrap">
                <div class="place-logo">
                    <el-image
                        v-if="placeDetail.logo"
                        :src="placeDetail.logo"
                        fit="cover"
                    >
                    </el-image>
                </div>
                <div class="place-info-r">
                    <div class="place-name mt20 mb20">
                        {{ placeDetail.organizationName }}
                    </div>
                    <div class="place-desc">
                        <span v-if="placeDetail.description">{{
                            placeDetail.description
                        }}</span>
                        <span v-else>还没有介绍~</span>
                    </div>
                </div>

                <h2 class="p-info-title mt20 mb20">屏幕信息</h2>
                <div class="place-info">

                    <el-form label-width="100px">
                        <el-form-item label="游戏数据统计:" v-if="placeDetail.statisics">
                            <el-link type="primary" @click="handleStatistics">游戏数据统计</el-link>
                        </el-form-item>
                        <el-form-item label="优惠券统计:" v-if="placeDetail.statisics">
                            <el-link type="primary" @click="handleCouponStatistics">优惠券数据统计</el-link>
                        </el-form-item>
                    </el-form>

                    <div
                        class="place-content"
                        v-if="
                            placeDetail.placeScreenData &&
                            placeDetail.placeScreenData.length
                        "
                    >
                        <div class="place-box">
                            <div
                                class="place-p"
                                :style="{ width: placeW }"
                                v-for="item in placeDetail.placeScreenData"
                                :key="item.id"
                            >
                                <screen-list
                                    name="place"
                                    :auth="placeDetail.jumpToScreen"
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
                            placeDetail.placeContactData &&
                            placeDetail.placeContactData.length
                        "
                    >
                        <li
                            v-for="item in placeDetail.placeContactData"
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

    </div>
</template>

<script>
import MapDialog from "@/components/BaiduMap/MapDialog"
import TheMap from "@/components/BaiduMap/index"
import ScreenList from "@/views/screen/components/ScreenList"
import { screenSizeWatch } from "@/mixins"

export default { 
    components: {
        ScreenList,
        MapDialog,
        TheMap
    },
    mixins: [screenSizeWatch],
    props: {
        placeDetail:  Object,
    },
    data(){
        return{
            imgIndex: 0, //幻灯片的索引
            distance: -10
        }
    },
    methods: {
        prevNextChange(type) {
            if (type) {
                this.imgIndex =
                    type == "pre" ? this.imgIndex - 1 : this.imgIndex + 1;
                if (this.imgIndex < 0) {
                    this.imgIndex = this.placeDetail.placeShowData.length - 1;
                    this.distance =
                        -162 * (this.placeDetail.placeShowData.length - 4) + -10;
                } else if (
                    this.imgIndex + 1 >
                    this.placeDetail.placeShowData.length
                ) {
                    this.imgIndex = 0;
                    this.distance = -10;
                }
                this.$refs.carouse.setActiveItem(this.imgIndex);
            }
            if (
                this.distance != -10 &&
                this.imgIndex < this.placeDetail.placeShowData.length - 4
            ) {
                this.distance = -162 * this.imgIndex + -10;
            } else if (
                this.distance !=
                    -162 * (this.placeDetail.placeShowData.length - 4) + -10 &&
                this.imgIndex > 3
            ) {
                this.distance = -162 * (this.imgIndex - 3) + -10;
            }
        },

         //数据统计
        handleStatistics(){
            this.$router.push({
                path: '/game/statisics',
                query: {
                    source: 'place',
                    placeId: this.$route.params.id
                }
            });
        },

        //优惠券数据统计
        handleCouponStatistics(){
            this.$router.push({
                path: '/game/couponStatisics',
                query: {
                    source: 'place',
                    placeId: this.$route.params.id
                }
            });
        }

    }
}
</script>