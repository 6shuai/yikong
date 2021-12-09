<template>
    <el-card class="template-card content-details layout-detail">
        <page-header :title="resData.displayName">
            <div slot="headerRight">
                <!-- <span 
                    @click="$router.push(`/screen/layout/edit/${$route.params.id}`)">
                    <i class="el-icon-edit" title="编辑"></i>编辑
                    <el-divider direction="vertical"></el-divider>
                </span>
                <span 
                    @click="handleDelete">
                    <i class="el-icon-delete" title="删除"></i>删除
                </span> -->
            </div>
        </page-header>

        <div v-loading="dataLoading">
            <div class="content">

                <el-form
                    label-width="100px"
                    class="screen-form"
                    :model="resData"
                >
                    <el-form-item label="模板名称" prop="displayName">
                        {{resData.displayName}}
                    </el-form-item>
                    <el-form-item label="宽度" prop="width">
                        {{resData.width}}
                    </el-form-item>
                    <el-form-item label="高度" prop="height">
                        {{resData.height}}
                    </el-form-item>
                </el-form>

                <div
                    class="layout-warp clearfix"
                    style="height: 100%"
                    v-if="rectangleW && rectangleH"
                >
                    <div
                        ref="rectangleWrap"
                        class="rectangle-wrap"
                        :style="{ width: rectangleW + 'px', height: rectangleH + 'px' }"
                    >
                        <div
                            class="rectangle"
                            v-for="(item, index) in timelineBox" 
                            :key="index"
                            :style="{
                                width: item.width + 'px',
                                height: item.height + 'px',
                                top: item.y + 'px',
                                left: item.x + 'px'
                            }"
                        >
                            <p class="title">{{item.displayName}}</p>
                        </div>
                    </div>
                </div>  
            </div>

            <el-table
                stripe
                size="small"
                :data="resData.logicRegionSubs"
                style="width: 100%; margin-top: 20px"
                row-key="id"
                border
            >
                <el-table-column
                    prop="displayName"
                    label="屏幕区域"
                    min-width="50"
                ></el-table-column>
                <el-table-column
                    prop="width"
                    label="宽"
                    min-width="50"
                ></el-table-column>
                <el-table-column
                    prop="height"
                    label="高"
                    min-width="50"
                ></el-table-column>
                <el-table-column
                    prop="x"
                    label="x"
                    min-width="50"
                ></el-table-column>
                <el-table-column
                    prop="y"
                    label="y"
                    min-width="50"
                ></el-table-column>
            </el-table>
        </div>

    </el-card>
</template>
<script>

import { layoutTempDetail, layoutTempDelete } from "@/api/screenLayout";
import PageHeader from '@/components/PageHeader';

export default {
    components: {
        PageHeader
    },
    data() {
        return {
            dataLoading: false,
            timelineBox: [],
            resData: {},
            ratio: 0,
            rectangleW: 0,
            rectangleH: 0,
            premission: [
                {
                    label: '查看列表',
                    value: 'list'
                },
                {
                    label: '编辑布局模板',
                    value: 'edit'
                },
                {
                    label: '删除',
                    value: 'deleteRight'
                }
            ]
        };
    },
    created() {
        this.hasPagePerm('Layout').then(res => {
            if(res){
                this.init();
            }
        })
    },
    methods: {
        //屏幕模板 缩小比例
        //根据自身屏幕大小  缩小屏幕比例
        screenShrink() {
            let w = this.resData.width,
                h = this.resData.height;

            if (w && h) {
                //创建时间轴填写的宽度  除以 屏幕的宽度的二分之一
                this.ratio = w / (document.body.clientWidth / 2);
                this.rectangleW = Math.ceil((w / this.ratio).toFixed(6));
                this.rectangleH = Math.ceil((h / this.ratio).toFixed(6));
            }
        },

        //查询逻辑区域集合 屏幕布局集合
        init() {
            this.dataLoading = true;
            layoutTempDetail({ id: this.$route.params.id }).then((res) => {
                this.dataLoading = false;
                if (res.code === this.$successCode) {
                    this.resData = {
                        ...res.obj
                    };
                    this.screenShrink();

                    this.timelineBox = this.ratioShow(JSON.parse(JSON.stringify(res.obj.logicRegionSubs)));
                }
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
        handleDelete() {
            this.$confirm(`此操作将删除${this.resData.displayName} 是否继续?`, "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
                center: true,
            }).then(() => {
                layoutTempDelete(`?id=${this.$route.params.id}`).then((res) => {
                    if (res.code === this.$successCode) {
                        this.$message.success({
                            message: "删除成功~",
                            duration: 1000,
                            onClose: () => {
                                this.$router.push("/screen/layout");
                            },
                        });
                    }
                });
            });
        },
    }
};
</script>
<style lang="scss" scope>
    .layout-detail{
        .rectangle-wrap{
            border: 5px solid #000;
            border-radius: 4px;
            position: relative;
            overflow: hidden;
            .rectangle{
                position: absolute;
                border: 1px solid #f6f6f6;
                background: #233142;
                color: #f6f6f6;
                display: flex;
                align-items: center;
                justify-content: center;
            }
        }
    }
</style>


