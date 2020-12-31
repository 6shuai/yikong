<template>
    <el-card class="screen-layout">
        <el-page-header @back="$router.go(-1)">
            <div slot="content">
                {{ $route.params.id ? "编辑屏幕布局模板" : "创建屏幕布局模板" }}
            </div>
        </el-page-header>
        <div v-loading="dataLoading">
            <el-form
                label-width="100px"
                class="screen-form"
                ref="screenForm"
                :model="screenParams"
                :rules="screenRules"
            >
                <el-form-item label="模板名称" prop="displayName">
                    <el-input
                        class="w220"
                        v-model="screenParams.displayName"
                        placeholder="模板名称"
                    ></el-input>
                </el-form-item>
                <el-form-item label="宽度" prop="width">
                    <el-input
                        class="w220"
                        type="number"
                        v-model="screenParams.width"
                        placeholder="宽度"
                        @change="screenShrink"
                    ></el-input>
                </el-form-item>
                <el-form-item label="高度" prop="height">
                    <el-input
                        class="w220"
                        type="number"
                        v-model="screenParams.height"
                        placeholder="高度"
                        @change="screenShrink"
                    ></el-input>
                </el-form-item>
            </el-form>

            <div
                class="layout-warp clearfix"
                style="height: 100%"
                v-if="rectangleW && rectangleH"
            >
                <div class="tool">
                    <el-button
                        type="primary"
                        size="mini"
                        @click="addScreenDialog = true"
                        >添加</el-button
                    >
                    <el-button
                        type="info"
                        size="mini"
                        :disabled="currentScreenIndex == -1"
                        @click="deleteScreen"
                        >删除</el-button
                    >
                </div>

                <div
                    ref="rectangleWrap"
                    class="rectangle-wrap"
                    :style="{ width: rectangleW + 'px', height: rectangleH + 'px' }"
                >
                    <!-- 
                        activated 激活
                        refLineParams  吸附对齐
                        dragging   拖动时
                        dragstop   拖动结束时
                        resizing   改变大小时
                        -->
                    <vue-draggable-resizable
                        v-for="(item, index) in timelineBox"
                        :key="index"
                        :w="item.width"
                        :h="item.height"
                        :x="item.x"
                        :y="item.y"
                        :z-index="Number(item.layer)"
                        :style="{ 'z-index': item.layer }"
                        :title="item.displayName"
                        :parent="true"
                        :debug="false"
                        :min-width="20"
                        :min-height="20"
                        :snap="true"
                        :snapTolerance="0"
                        @activated="
                            currentRectangle = item;
                            currentScreenIndex = index;
                        "
                        @refLineParams="getRefLineParams"
                        @dragging="onDrag(arguments, index)"
                        @dragstop="onDrag(arguments, index)"
                        @resizing="onResize(arguments, index)"
                        :class="currentScreenIndex == index ? 'new-rectangle' : ''"
                        class="rectangle"
                    >
                        <div class="content">
                            <span>{{ item.displayName }}</span>
                        </div>
                    </vue-draggable-resizable>

                    <!--辅助线-->
                    <span
                        class="ref-line v-line"
                        v-for="(item, index) in vLine"
                        :key="'v' + index"
                        v-show="item.display"
                        :style="{
                            left: item.position,
                            top: item.origin,
                            height: item.lineLength,
                        }"
                    />
                    <span
                        class="ref-line h-line"
                        v-for="(item, index) in hLine"
                        :key="'h' + index"
                        v-show="item.display"
                        :style="{
                            top: item.position,
                            left: item.origin,
                            width: item.lineLength,
                        }"
                    />
                    <!--辅助线END-->
                </div>

                <div class="toolbar">
                    <el-form label-width="80px">
                        <el-form-item label="名称">
                            <el-input
                                size="mini"
                                v-model="currentRectangle.displayName"
                            ></el-input>
                        </el-form-item>
                        <el-form-item label="x">
                            <el-input
                                size="mini"
                                :value="getNum(currentRectangle.x)"
                                @input="inputChange($event, 'x')"
                                :min="0"
                                :max="screenParams.width"
                                type="number"
                            ></el-input>
                        </el-form-item>
                        <el-form-item label="y">
                            <el-input
                                size="mini"
                                :value="getNum(currentRectangle.y)"
                                @input="inputChange($event, 'y')"
                                :min="0"
                                :max="screenParams.height"
                                type="number"
                            ></el-input>
                        </el-form-item>
                        <el-form-item label="宽">
                            <el-input
                                size="mini"
                                :value="getNum(currentRectangle.width, 'width')"
                                @input="inputChange($event, 'width')"
                                :min="20"
                                :max="screenParams.width"
                                type="number"
                            ></el-input>
                        </el-form-item>
                        <el-form-item label="高">
                            <el-input
                                size="mini"
                                :value="getNum(currentRectangle.height, 'height')"
                                @input="inputChange($event, 'height')"
                                :min="20"
                                :max="screenParams.height"
                                type="number"
                            ></el-input>
                        </el-form-item>
                    </el-form>
                </div>
            </div>

            <div class="save-btn">
                <el-button @click="$router.go(-1)">取消</el-button>
                <el-button
                    type="primary"
                    :disabled="!isUpdate"
                    @click="sureCurrentLayout"
                    >保存</el-button
                >
            </div>
        </div>

        <!-- 添加屏幕布局 -->
        <el-dialog
            width="300px"
            title="添加屏幕模块"
            :visible.sync="addScreenDialog"
            @open="customerDialogOpen"
            append-to-body
        >
            <el-input
                v-model="screenName"
                ref="input"
                placeholder="屏幕模块名称"
            ></el-input>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addScreenDialog = false">取 消</el-button>
                <el-button type="primary" @click="handleAddScreen"
                    >确 定</el-button
                >
            </span>
        </el-dialog>
    </el-card>
</template>
<script>
import VueDraggableResizable from "vue-draggable-resizable-gorkys";
import "vue-draggable-resizable-gorkys/dist/VueDraggableResizable.css";
import {
    layoutTempCreated,
    layoutTempDetail,
    layoutTempSubDelete,
} from "@/api/screenLayout";
export default {
    data() {
        return {
            vLine: [],
            hLine: [],
            screenParams: {}, //屏幕模板尺寸
            timelineBox: [],
            currentRectangle: {}, //选中的矩形 xy 宽高信息
            addScreenDialog: false, //添加屏幕模块  填写名称 弹出框
            screenName: "", //添加屏幕模块的名称
            currentScreenIndex: -1, //已激活的屏幕模块 下标
            rectangleW: 0, //编辑区域的宽
            rectangleH: 0, //编辑区域的高
            deleteIdArr: [], //要删除的屏幕区域id数组
            ratio: 0, //与原始宽高比例
            isUpdate: false, //是否修改过屏幕布局  修改过可以点击保存按钮
            copyData: [],
            screenParams: {},
            dataLoading: false,
            screenRules: {
                displayName: [
                    {
                        required: true,
                        trigger: "blur",
                        message: "请输入屏幕模板名称~",
                    },
                ],
                width: [
                    {
                        required: true,
                        trigger: "blur",
                        message: "请输入屏幕模板宽度~",
                    },
                ],
                height: [
                    {
                        required: true,
                        trigger: "blur",
                        message: "请输入屏幕模板高度~",
                    },
                ],
            },
        };
    },
    mounted() {
        this.hasPagePerm('Layout').then(res => {
            if(res){
                if (this.$route.params.id) this.init();
            }
        })
    },
    methods: {
        //屏幕模板 缩小比例
        //根据自身屏幕大小  缩小屏幕比例
        screenShrink() {
            let w = this.screenParams.width,
                h = this.screenParams.height;

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
                    this.screenParams = {
                        ...res.obj
                    };
                    this.screenShrink();

                    this.timelineBox = this.ratioShow(res.obj.logicRegionSubs);
                    this.screenParams.logicRegionSubs = this.timelineBox;
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

        //添加屏幕模块
        handleAddScreen() {
            let obj = {
                width:
                    this.rectangleH > this.rectangleW ? this.rectangleW : 100,
                height:
                    this.rectangleH < this.rectangleW ? this.rectangleH : 100,
                x: 0,
                y: 0,
                layer: this.timelineBox.length + 1,
                displayName: this.screenName,
            };
            this.timelineBox.unshift(obj);
            this.copyData.unshift(obj);
            this.screenName = "";
            this.addScreenDialog = false;
            this.currentScreenIndex = 0;
            this.currentRectangle = this.timelineBox[0];
            this.isUpdate = true;
        },

        // 辅助线回调事件
        getRefLineParams(params) {
            const { vLine, hLine } = params;
            this.vLine = vLine;
            this.hLine = hLine;
            if (vLine.origin) {
                this.currentRectangle.x = vLine;
            }
        },

        //改变位置时触发 data【0】x轴距离，  data【1】 y轴距离
        onDrag(data, index) {
            this.timelineBox[index] = {
                ...this.timelineBox[index],
                x: data[0] < 0 ? 0 : data[0],
                y: data[1] < 0 ? 0 : data[1],
            };
            this.currentRectangle = this.timelineBox[index];
            this.copyData = JSON.parse(JSON.stringify(this.timelineBox));
            this.isUpdate = true;
        },

        //调整组件大小时触发  data[x, y, width, height]
        onResize(data, index) {
            let p = {
                ...this.timelineBox[index],
                x: data[0] < 0 ? 0 : data[0],
                y: data[1] < 0 ? 0 : data[1],
                width: data[2],
                height: data[3],
            };
            let s = this.rectangleH * this.ratio;
            if (
                this.rectangleH * this.ratio - p.height * this.ratio <
                this.ratio
            ) {
                p.height = this.rectangleH;
            }
            if (
                this.rectangleW * this.ratio - p.width * this.ratio <
                this.ratio
            ) {
                p.width = this.rectangleW;
            }
            this.$set(this.timelineBox, index, p);
            this.currentRectangle = p;
            this.copyData = JSON.parse(JSON.stringify(this.timelineBox));
            this.isUpdate = true;
        },

        //保存当前的布局
        sureCurrentLayout() {
            let [x1, x2, w] = [false, false, false];
            let totalW = 0;
            let copyData = JSON.parse(JSON.stringify(this.timelineBox));
            copyData.forEach((item, index) => {
                //保存时宽高x，y 要乘以比例， 真实的宽高
                item.width = this.getNum(item.width);
                item.height = this.getNum(item.height);
                item.x = this.getNum(item.x);
                item.y = this.getNum(item.y);

                if (item.x == 0) x1 = true;
                console.log(item.x , item.width, item.x + item.width, this.screenParams.width);
                if (item.x + item.width >= this.screenParams.width) x2 = true;
                totalW += item.width;
            });

            let data = {
                ...this.screenParams,
                logicRegionSubs: copyData,
            };

            if (totalW >= this.screenParams.width) w = true;

            if (x1 && x2 && w) {
                this.deleteSelectedId();
                layoutTempCreated(data).then((res) => {
                    if (res.code === this.$successCode) {
                        this.$message.success("保存成功~");
                        this.$router.go(-1);
                    }
                });
            } else {
                this.$message.warning("请添加或拖拽布局充满整个红框区域~");
            }
        },

        //删除屏幕
        deleteScreen() {
            if (this.currentScreenIndex < 0) {
                this.$message.warning("请先选中要删除的屏幕(#`O′)");
            } else if (this.timelineBox.length <= 1) {
                this.$message.warning("至少保留一个屏幕~");
            } else {
                this.$confirm(
                    `此操将删除选中的屏幕【${
                        this.timelineBox[this.currentScreenIndex].displayName
                    }】, 是否继续?`,
                    "提示",
                    {
                        confirmButtonText: "确定",
                        cancelButtonText: "取消",
                        type: "warning",
                    }
                ).then(() => {
                    let id = this.timelineBox[this.currentScreenIndex].id;
                    if (id) {
                        //把要删除的id push到数组，  点击保存时再去删除
                        this.deleteIdArr.push(id);
                    }
                    this.timelineBox.splice(this.currentScreenIndex, 1);
                    this.copyData.splice(this.currentScreenIndex, 1);
                    this.currentScreenIndex = 0;
                    this.currentRectangle = this.timelineBox[0];
                });
            }
        },

        //保存时 deleteIdArr 要删除的数组是否有值
        deleteSelectedId() {
            if (this.deleteIdArr.length) {
                for (let i = 0; i < this.deleteIdArr.length; i++) {
                    layoutTempSubDelete(`?id=${this.deleteIdArr[i]}`).then(
                        (res) => {
                            if (res.code === this.$successCode) {
                                this.deleteIdArr.splice(i, 1);
                            }
                        }
                    );
                }
            }
        },

        //显示添加窗口时  input获取焦点
        customerDialogOpen() {
            this.addScreenDialog = true;
            this.$nextTick(function () {
                this.$refs.input.focus();
            });
        },

        //输入框双向绑定
        inputChange(value, label) {
            this.$set(this.currentRectangle, label, value / this.ratio);
            let obj = this.timelineBox;
            obj[this.currentScreenIndex][label] = value / this.ratio;
            this.timelineBox = [];
            this.$nextTick(() => {
                this.timelineBox = obj;
            });
        },

        //乘以比例后的数值
        getNum(num, type) {
            let result = Math.ceil((num * this.ratio).toFixed(6));
            if (type == "width" && result > this.screenParams.width) {
                result = this.screenParams.width;
            }
            if (type == "height" && result > this.screenParams.height) {
                result = this.screenParams.height;
            }
            return result;
        },
    },
    components: {
        VueDraggableResizable,
    },
};
</script>
<style lang="scss" scope>
.screen-layout {
    height: 100%;
    padding-bottom: 10px;

    .layout-warp {
        margin: 30px 0;
    }

    .screen-form {
        margin-top: 30px;
    }

    .rectangle {
        background-color: rgb(239, 154, 154);
        text-align: center;
        display: flex;
        justify-content: center;
        align-items: center;
        &.new-rectangle {
            background: #f35b5b;
        }
    }
    .change-hierarchy {
        width: 100px;
        display: inline-block;
        margin-right: 10px;
        .explain {
            font-size: 12px;
        }
        .el-card {
            margin-top: 10px;
            cursor: move;
        }
    }
    .rectangle-wrap {
        border: 1px solid #f99ad5;
        box-sizing: initial;
        display: inline-block;
        vertical-align: top;
        position: relative;
        float: left;
    }
    .el-scrollbar__view {
        height: 100%;
    }
    .tool {
        margin-bottom: 10px;
    }
    .toolbar {
        float: left;
        font-size: 14px;
        .el-button {
            display: block;
        }
        & > span {
            display: block;
            margin-bottom: 20px;
            margin-left: 10px;
            .el-input {
                width: 80px;
                display: inline-block;
            }
        }
    }
}
</style>