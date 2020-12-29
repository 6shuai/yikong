<template>
    <div class="content-wrap clearfix">
        <el-scrollbar style="height: 100%" v-loading="loading">
            <div class="search-wrap mb10 ml10">
                <el-radio-group
                    size="small"
                    @change="handleClickTab"
                    v-model="params.radio"
                >
                    <el-radio-button :label="1">图片</el-radio-button>
                    <el-radio-button :label="2">视频</el-radio-button>
                    <el-radio-button :label="4">图集</el-radio-button>
                    <el-radio-button :label="3">游戏</el-radio-button>
                    <el-radio-button :label="5">剪贴板</el-radio-button>
                </el-radio-group>

                <el-input
                    clearable
                    size="small"
                    placeholder="资源名称"
                    v-model="params.keyword"
                    @input="filtration"
                ></el-input>
                <el-select
                    v-if="params.radio != 3"
                    v-model="contentOwner"
                    size="small"
                    clearable
                    filterable
                    @change="init"
                    placeholder="请选择品牌"
                >
                    <el-option
                        v-for="item in groupData"
                        :key="item.id"
                        :label="item.displayName"
                        :value="item.id"
                    >
                    </el-option>
                </el-select>
            </div>
            <div v-if="contentData.length">
                <draggable
                    :options="dragOption"
                    :list="contentData"
                    :clone="onClone"
                    :group="{
                        name: 'componentLibrary',
                        pull: 'clone',
                        put: false,
                    }"
                    ghostClass="ghost"
                    dragClass="drag-module"
                >
                    <div
                        class="box-card content-list"
                        ref="contentList"
                        v-for="(item, index) in contentData"
                        :key="item.id"
                        @click="handlePreview(item)"
                        :title="item.displayName"
                    >
                        <div class="cover"></div>

                        <!-- 剪贴板 -->
                        <div
                            class="atlas"
                            v-if="item.list && params.radio == 5"
                            :class="`atlas-${
                                item.list.length > 4 ? '4' : item.list.length
                            }`"
                        >
                            <div
                                v-for="(img, index) in item.list"
                                :key="index"
                                class="img"
                            >
                                <el-image
                                    v-if="index <= 3"
                                    fit="cover"
                                    :src="img.image"
                                ></el-image>
                            </div>
                        </div>

                        <!-- 图集 -->
                        <div
                            v-else-if="
                                item.subContentsData && item.contentTypeId == 4
                            "
                            class="atlas"
                            :class="`atlas-${
                                item.subContentsData.length > 4
                                    ? '4'
                                    : item.subContentsData.length
                            }`"
                        >
                            <el-image
                                fit="cover"
                                class="img"
                                v-for="(img, index) in filterVideo(
                                    item.subContentsData
                                )"
                                v-if="img.contentType == 1 && index <= 3"
                                :key="index"
                                :src="img.contentPath"
                            ></el-image>
                        </div>
                        <el-image
                            v-else
                            fit="cover"
                            class="img"
                            :src="item.image"
                        ></el-image>
                        <div class="desc">
                            <p class="title" :title="item.displayName">
                                {{ item.displayName }}
                            </p>
                            <p class="duration" v-if="item.duration">
                                <font-awesome-icon :icon="['far', 'clock']" />{{
                                    item.duration
                                }}秒
                            </p>
                        </div>
                    </div>
                </draggable>
            </div>
            <div v-else class="no-data">暂无数据~</div>
        </el-scrollbar>

        <!-- 预览 -->
        <el-dialog
            :title="previewData.displayName"
            :visible.sync="dialogVisible"
            width="60%"
        >
            <div v-if="dialogVisible">
                <!-- 图片 -->
                <div class="preview" v-if="previewData.contentTypeId == 1">
                    <el-image
                        fit="cover"
                        :src="previewData.contentPath"
                    ></el-image>
                </div>

                <!-- 视频 -->
                <div class="preview" v-if="previewData.contentTypeId == 2">
                    <video
                        :src="previewData.contentPath"
                        controls="controls"
                        :autoplay="true"
                        :loop="true"
                    ></video>
                </div>

                <!-- 图集 -->
                <content-preview
                    v-if="previewData.contentTypeId == 4"
                    ref="contentPreview"
                ></content-preview>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import {
    timelineContentList,
    timelineAtlasContentList,
    timelineGameList,
} from "@/api/timeline";
import ContentPreview from "@/views/content/components/ContentPreview";
import { getOrganizationList } from "@/mixins";
import Draggable from "vuedraggable";
export default {
    mixins: [getOrganizationList],
    data() {
        return {
            resData: [], //图片 视频资源
            contentData: [],
            otherData: [],
            dialogVisible: false, //显示预览弹框
            previewData: {}, //点击资源  预览的数据
            params: {
                radio: 1, //资源类型
            },
            contentOwner: null, //品牌id  筛选
            loading: false,
            dragOption: {
                fallbackOnBody: false,
                sort: false,
                scrollSpeed: 20,
            },
        };
    },
    mounted() {
        this.init();
    },
    methods: {
        init() {
            this.loading = true;
            let data = {
                contentOwner: this.contentOwner,
            };
            timelineContentList(data).then((res) => {
                this.loading = false;
                if (res.code === this.$successCode) {
                    this.resData = res.obj;
                    this.filtration();
                }
            });
        },

        //选择资源类型
        handleClickTab() {
            switch (this.params.radio) {
                case 3:
                    this.gameList();
                    break;
                case 4:
                    this.atlasContentList();
                    break;
                case 5:
                    this.clipboardList();
                    break;
                default:
                    this.filtration();
                    break;
            }
        },

        //筛选
        filtration() {
            if (this.params.radio === 1 || this.params.radio === 2) {
                this.contentData = this.resData.filter((item) => {
                    return (
                        item.contentTypeId == this.params.radio &&
                        (this.params.keyword
                            ? item.displayName.indexOf(this.params.keyword) > -1
                            : true)
                    );
                });
            } else {
                this.contentData = this.otherData.filter((item) => {
                    return this.params.keyword
                        ? item.displayName.indexOf(this.params.keyword) > -1
                        : true;
                });
            }
        },

        //获取所有图集资源
        atlasContentList() {
            let data = {
                contentOwner: this.contentOwner,
            };
            this.loading = true;
            timelineAtlasContentList(data).then((res) => {
                this.loading = false;
                if (res.code === this.$successCode) {
                    this.otherData = res.obj;
                    this.filtration();
                }
            });
        },

        //获取所有游戏列表
        gameList() {
            this.loading = true;
            timelineGameList().then((res) => {
                this.loading = false;
                if (res.code === this.$successCode) {
                    this.otherData = res.obj;
                    this.filtration();
                }
            });
        },

        //预览
        handlePreview(data) {
            if (data.contentTypeId == 3) return;
            this.previewData = data;
            let msg =
                this.previewData.contentTypeId == 4
                    ? this.previewData.subContentsData
                    : this.previewData;
            this.dialogVisible = true;
            this.$nextTick(() => {
                try {
                    this.$refs.contentPreview.contentPreviewData(msg);
                } catch (error) {}
            });
        },

        //过滤视频
        filterVideo(data) {
            return data.filter((item) => {
                return item.contentType == 1;
            });
        },

        onClone(item) {
            const data = {
                ...item,
            };
            return data;
        },

        //剪贴板内容
        clipboardList() {
            let data = localStorage.timelineCopyDataList
                ? JSON.parse(localStorage.timelineCopyDataList)
                : [];

            this.contentData = data;
        },
    },
    components: {
        ContentPreview,
        Draggable,
    },
};
</script>

<style lang="scss">
.content-wrap {
    margin-left: -10px;
    height: 100%;

    .search-wrap {
        .el-input,
        .el-select {
            width: 200px;
        }
    }

    .content-list {
        width: 100px;
        margin: 0 0 10px 10px;
        padding-bottom: 2px;
        float: left;
        cursor: pointer;
        border: 1px solid #eee;
        border-radius: 3px;
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
        background: #fff;
        position: relative;
        overflow: hidden;

        .cover {
            position: absolute;
            width: 100%;
            height: 100%;
            z-index: 10;
        }

        .el-image {
            width: 100%;
            height: 60px;
            background: #000;
        }

        img {
            width: 100px;
            height: 60px;
            z-index: 99;
        }

        .atlas {
            width: 100px;
            height: 60px;
            background: #000;
            overflow: hidden;

            &-2 .img {
                display: inline-block;
                width: 50px;
                height: 60px;
            }

            &-3,
            &-4 {
                display: flex;
                flex-wrap: wrap;

                .img {
                    width: 50px;
                    height: 30px;

                    img {
                        width: 50px;
                        height: 30px;
                    }
                }
            }
        }

        .desc {
            width: 100px;
            background: #fff;

            .duration {
                font-size: 12px;
                color: #999;
                padding: 0 5px;

                svg {
                    margin-right: 3px;
                }
            }

            .title {
                line-height: 20px;
                font-size: 12px;
                width: 100%;
                margin: 0 3px;
                overflow: hidden;
                white-space: nowrap;
            }
        }
    }
}
</style>
