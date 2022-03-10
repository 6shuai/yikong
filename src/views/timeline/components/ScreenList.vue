<template>
    <div class="screen-wrap clearfix">
        <el-scrollbar style="height: 100%">
            <el-button
                v-if="hasPerm($store.state.permission.timelinePrem, 'AddScreen')"
                type="primary"
                icon="el-icon-plus"
                size="mini"
                @click="addScreenBtn"
                >添加屏幕
            </el-button>
            <div class="clearfix screen-wrap" v-loading="screenListLoading">
                <el-card
                    class="box-card screen-list"
                    :body-style="{ padding: '0px' }"
                    v-for="(item, index) in resData"
                    :key="index"
                >
                    <div class="screen-info">
                        <div class="title">
                            {{ item.displayName }}
                            <el-tooltip
                                v-if="!item.timelineUpdate"
                                class="item"
                                effect="dark"
                                content="此时间轴未更新~"
                                placement="top"
                            >
                                <i class="el-icon-warning"></i>
                            </el-tooltip>
                        </div>
                        <div 
                            v-if="timelineData.deleteDropScreen"
                            class="delete" 
                            @click="deleteScreen(index)">
                            <i class="el-icon-delete"></i>删除
                        </div>
                    </div>
                </el-card>
                <div v-if="!resData.length" class="no-data">暂无数据~</div>
            </div>
        </el-scrollbar>

        <!-- 添加屏幕 -->
        <el-dialog
            width="500px"
            title="添加屏幕"
            :visible.sync="showAddScreen"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            @close="updateTimelineScreen"
            append-to-body
        >
            <div class="clearfix screen-wrap" v-loading="dataLoading">
                <el-input
                    placeholder="屏幕名称"
                    clearable
                    v-model="params.displayName"
                    @input="
                        params.pageNo = 1;
                        getScreenList();
                    "
                ></el-input>
                <el-card
                    class="box-card screen-list"
                    :body-style="{ padding: '0px' }"
                    v-for="(item, index) in screenData"
                    :key="item.id"
                >
                    <div class="screen-info">
                        <div class="title">{{ item.displayName }}</div>
                        <div
                            class="delete add-btn"
                            v-if="!item.hide"
                            @click="addScreen(index)"
                        >
                            <i class="el-icon-plus"></i>添加
                        </div>
                    </div>
                </el-card>
                <el-pagination
                    background
                    hide-on-single-page
                    layout="total, prev, pager, next"
                    :current-page="Number(params.pageNo)"
                    @current-change="handleCurrentChange"
                    :total="totalCount"
                >
                </el-pagination>
            </div>

            <span slot="footer" class="dialog-footer">
                <el-button 
                    @click="showAddScreen = false"
                    >取 消</el-button
                >
                <el-button 
                    type="primary" 
                    @click="updateTimelineScreen"
                    >确 定</el-button
                >
            </span>
        </el-dialog>
    </div>
</template>
<script>
import {
    timelinePutScreenList,
    timelineAddScreen,
    timelineDeleteScreen,
} from "@/api/timeline";
import { screenList } from "@/api/screen";
export default {
    props: ['timelineData'],
    data() {
        return {
            screenListLoading: false,
            resData: [], //已添加的屏幕列表
            showAddScreen: false, //添加屏幕 弹框
            haveAdd: false, //是否点击了添加屏幕  如果点击了， 关闭弹框时会重新调init()
            screenData: [], //所有的屏幕列表
            totalCount: 0, //总条数
            dataLoading: false,
            params: {
                pageNo: 1,
                pageSize: 10,
            },
        };
    },
    mounted() {
        this.init();
    },
    methods: {
        //已添加的屏幕列表
        init() {
            this.screenListLoading = true;
            timelinePutScreenList(this.$route.params.id).then((res) => {
                this.screenListLoading = false;
                if (res.code === this.$successCode) {
                    this.resData = res.obj;
                }
            });
        },

        //点击添加  显示所有的屏幕列表
        getScreenList() {
            this.dataLoading = true;
            screenList(this.params).then((res) => {
                this.dataLoading = false;
                this.screenData = res.obj.list;
                this.totalCount = res.obj.totalRecords;
                this.resData.forEach((item, index) => {
                    for (let i = 0; i < this.screenData.length; i++) {
                        if (item.id == this.screenData[i].id) {
                            this.screenData[i].hide = true;
                        }
                    }
                });
            });
        },

        //页码
        handleCurrentChange(page) {
            this.params.pageNo = page;
            this.getScreenList();
        },

        //删除
        deleteScreen(index) {
            this.$confirm(
                `此操将删除屏幕【${this.resData[index].displayName}】, 是否继续?`,
                "提示",
                {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning",
                }
            ).then(() => {
                timelineDeleteScreen(this.resData[index].id).then((res) => {
                    if (res.code === this.$successCode) {
                        this.$message.success("删除成功~");
                        this.resData.splice(index, 1);
                    }
                });
            });
        },

        //点击添加屏幕按钮  显示添加弹框
        addScreenBtn() {
            this.showAddScreen = true;
            this.getScreenList();
        },

        //添加屏幕
        addScreen(index) {
            let params = `?screenId=${this.screenData[index].id}&containerId=${this.$route.params.id}`;
            timelineAddScreen(params).then((res) => {
                if (res.code === this.$successCode) {
                    this.haveAdd = true;
                    this.$message.success("添加成功~");
                    let obj = this.screenData[index];
                    obj.hide = true;
                    this.$set(this.screenData, index, obj);
                }
            });
        },

        //关闭添加屏幕弹框
        updateTimelineScreen() {
            this.showAddScreen = false;
            if (this.haveAdd) {
                this.init();
                this.haveAdd = false;
            }
        },
    },
};
</script>
<style lang="scss">
@import "../../../styles/variables.scss";
.screen-wrap {
    height: 100%;
    .screen-list {
        width: 100%;
        height: 50px;
        line-height: 50px;
        margin: 10px 0;
        cursor: pointer;
        position: relative;

        .screen-info {
            display: flex;
            .title {
                padding: 0 10px;
                flex: 1;
            }
            .delete {
                float: right;
                width: 80px;
                color: var(--color-info);
                &:hover {
                    color: var(--color-danger);
                    text-decoration: underline;
                }
                &.add-btn {
                    color: var(--color-success);
                    &:hover {
                        color: #5ee192;
                    }
                }
            }
        }

        .el-icon-warning {
            color: red;
            margin-left: 5px;
        }
    }
}
</style>