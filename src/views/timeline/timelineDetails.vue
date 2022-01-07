<template>
    <div class="timeline-details-wrap" v-loading="loading">
        <page-header :title="resData.displayName">
            <div slot="headerRight">
                <span
                    v-if="resData.authorize"
                    @click="$refs.pagePermission.showPermission({containerId: $route.params.id})"
                    ><i class="el-icon-lock" title="授权"></i>授权<el-divider
                        direction="vertical"
                    ></el-divider
                ></span>
                <span 
                    v-if="resData.importTimeline"
                    @click="handleImportTimelinBtn"
                    ><i class="el-icon-download" title="导入时间轴"></i
                    >导入时间轴<el-divider direction="vertical"></el-divider
                ></span>
                <span
                    v-if="resData.editTimelineContainer"
                    @click="$router.push(`/timeline/edit/${$route.params.id}`)"
                    ><i class="el-icon-edit" title="编辑"></i>编辑<el-divider
                        direction="vertical"
                    ></el-divider
                ></span>
                <span 
                    v-if="resData.deleteTimelineContainer"
                    @click="handelDeleteTimelineBtn"
                    ><i class="el-icon-delete" title="删除"></i>删除</span
                >
            </div>
        </page-header>

        <div
            v-if="resData.id"
            class="timeline-content clearfix"
            :style="{ bottom: 366 }"
        >
            <!-- 左侧tab栏 内容选择  投放屏幕 -->
            <div class="left-tabs">
                <left-tabs :timeData="resData"></left-tabs>
            </div>

            <!-- 右侧屏幕 预览画面 -->
            <div class="right-screen">
                <el-scrollbar style="height: 100%">
                    <div
                        class="screen-content"
                        :style="{
                            width: rectangleW + 10 + 'px',
                            height: rectangleH + 10 + 'px',
                        }"
                    >
                        <div
                            class="screen-item"
                            v-for="(item, index) in screenLayout"
                            :key="index"
                            :title="item.content ? item.content.displayName : ''"
                            :style="{
                                width: item.width + 'px',
                                height: item.height + 'px',
                                left: item.x + 'px',
                                top: item.y + 'px',
                            }"
                        >
                            <img
                                v-if="item.content && item.content.contentTypeId!=4"
                                :src="item.content.image"
                            />
                            <div v-if="item.content  && item.content.contentTypeId==4" class="thumb-wrap">
                                <div class="arrow left" @click.stop="prevNextChange('pre', index, item.content.subContentsData.length)">
                                    <i class="el-icon-arrow-left"></i>
                                </div>
                                <div class="arrow right" @click.stop="prevNextChange('next', index, item.content.subContentsData.length)">
                                    <i class="el-icon-arrow-right"></i>
                                </div>
                                <img :src="item.content.subContentsData[subIndex].contentPath" />
                                    
                            </div>
                            <div 
                                class="content-title overflow" 
                                v-if="item.content && item.content.contentTypeId!=4"
                            >{{ item.content.displayName }}</div>
                            <div 
                                class="content-title overflow" 
                                v-if="item.content && item.content.contentTypeId==4"
                            > {{ subIndex + 1 }}/{{item.content.subContentsData.length}}  {{ item.content.displayName }}</div>
                        </div>
                    </div>
                </el-scrollbar>
            </div>
        </div>

        <!-- 时间轴 -->
        <!-- screenLayout.timelineRegions.length 为屏幕数量-->
        <div class="timeline-bottom" v-if="resData.id">
            <div
                class="axis-wrap"
            >
                <!-- :style="{ height: screenLayout.length * timelineHeight.tool + timelineHeight.rotation + 'px' }" -->
                <axis
                    @updateScreen="updateScreen"
                    @previewCover="previewCover"
                    :startTime="startTime"
                    :timelineData="resData"
                ></axis>
            </div>
        </div>

        <!-- 预览 -->
        <el-dialog
            :title="previewData.displayName"
            :visible.sync="dialogVisible"
            width="60%"
        >
            <div v-if="dialogVisible">
                <div class="preview">
                    <!-- 图片 -->
                    <el-image
                        v-if="previewData.contentTypeId == 1"
                        fit="cover"
                        :src="previewData.contentPath"
                    ></el-image>

                    <!-- 视频 -->
                    <video
                        v-if="previewData.contentTypeId == 2"
                        :src="previewData.contentPath"
                        controls="controls"
                        :autoplay="true"
                        :loop="true"
                    ></video>
                </div>

            </div>
        </el-dialog>

        <!-- 导入时间轴 列表 -->
        <import-timeline ref="importTimeline"></import-timeline>

        <!-- 授权 -->
        <permission  
            ref="pagePermission" 
            :premissionApi="premissionApi"
        ></permission>

    </div>
</template>
<script lange="ts">
import LeftTabs from "@/views/timeline/components/DetailTabs";
import Axis from "@/views/timeline/components/Axis";
import ImportTimeline from "@/views/timeline/components/ImportTimeline";
import Permission from '@/components/permission/index';
import PageHeader from '@/components/PageHeader';
import {
    timelineContainerDelete,
    timelineContainerDetail,
    timelineAuthority,
    timelineAuthorityUpdate, 
    timelineAuthorityDelete
} from "@/api/timeline";
export default {
    data() {
        return {
            resData: {},
            screenLayout: [], //屏幕集合
            coverData: [], //屏幕逻辑区域 预览图片
            startTime: "", //时间轴开始时间
            endTime: "", //时间轴结束时间
            dialogVisible: false,
            previewData: {}, //点击内容  预览的数据
            loading: false,
            ratio: 0, //与原始宽高比例
            rectangleW: 480, //编辑区域的宽
            rectangleH: 270, //编辑区域的高
            timelineHeight: {
                tool: 66,       //时间轴工具栏高度
                rotation: 90    //时间轴单个逻辑区域的高度
            },
            premissionApi: {
                list: timelineAuthority,
                update: timelineAuthorityUpdate,
                delete: timelineAuthorityDelete
            },
            subIndex: 0,    //图集默认显示第一个
        };
    },
    mounted() {
        this.hasPagePerm('Timeline').then(res => {
            if(res){
                this.init();
            }
        })
    },
    methods: {
        init() {
            this.loading = true;
            timelineContainerDetail(this.$route.params.id).then((res) => {
                this.loading = false;
                this.resData = res.obj;
                let sTime = res.obj.beginTimeFormat.split("1970-01-01 ")[1];
                let eTime = res.obj.endTimeFormat.split("1970-01-01 ")[1];
                this.startTime = sTime;
                this.endTime = eTime;
                this.$store.commit("timeline/SET_SCREEN_SIZE", {
                    width: this.resData.width,
                    height: this.resData.height,
                });
            });
        },

        //真实宽高 除以 比例 = 现在的宽高
        ratioShow(data) {
            data.sort((a, b) => {
                return b.layer - a.layer;
            });
            data.forEach((item) => {
                item.width = item.width / this.ratio;
                item.height = item.height / this.ratio;
                item.x = item.x / this.ratio;
                item.y = item.y / this.ratio;
            });
            return data;
        },

        //删除
        handelDeleteTimelineBtn() {
            this.$confirm(
                `此操作将删除时间轴【${this.resData.displayName}】, 是否继续?`,
                "提示",
                {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning",
                }
            )
                .then(() => {
                    timelineContainerDelete(this.$route.params.id).then(
                        (res) => {
                            if (res.code === this.$successCode) {
                                this.$message.success("删除成功~");
                                this.$router.push("/timeline/index");
                            }
                        }
                    );
                })
                .catch(() => {});
        },

        //点击导入时间轴， 打开选择要导入的时间轴列表
        handleImportTimelinBtn() {
            this.$refs.importTimeline.init();
        },

        //更新屏幕内容
        updateScreen(data, index) {
            this.coverData = [];
            //根据自身屏幕大小  缩小屏幕比例
            let w = this.resData.width,
                h = this.resData.height;
            //创建时间轴填写的宽度  除以 屏幕的宽度的三分之一
            this.ratio = w / (document.body.clientWidth / 3);
            this.rectangleW = Math.ceil((w / this.ratio).toFixed(6));
            this.rectangleH = Math.ceil((h / this.ratio).toFixed(6));
            this.screenLayout = this.ratioShow(
                JSON.parse(JSON.stringify(data))
            );
        },

        //真实宽高 除以 比例 = 现在的宽高
        ratioShow(data) {
            data.forEach((item) => {
                item.width = item.width / this.ratio;
                item.height = item.height / this.ratio;
                item.x = item.x / this.ratio;
                item.y = item.y / this.ratio;
            });
            return data;
        },

        //预览屏幕
        previewCover({ Pindex, index, data, item }) {
            this.subIndex = 0;
            if(!this.screenLayout.length) return;
            try {
                if(data){
                    data.forEach((item, i) => {
                        this.$set(this.screenLayout[i], 'content', item[0])
                    });
                }else{
                    this.$set(this.screenLayout[Pindex], 'content', item)
                }
            } catch (error) {
                
            }
        },

        //图集预览
        prevNextChange(type, index, total){
            if(type == 'pre' && this.subIndex > 0){
                this.subIndex -= 1;
            }else if(type == 'next' && this.subIndex < total-1){
                this.subIndex += 1;
            }
        }
    },
    components: {
        LeftTabs,
        Axis,
        ImportTimeline,
        Permission,
        PageHeader
    },
};
</script>

<style lang="scss" scope>
@import "./style/timelineDetails.scss";
</style>