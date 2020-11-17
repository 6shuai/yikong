<template>
    <div class="time-interval-screen-wrap clearfix">
        <el-scrollbar style="height: 100%">
            <el-button
                type="primary"
                icon="el-icon-plus"
                size="mini"
                @click="addScreenBtn"
                >定时发布
            </el-button>
            <div class="clearfix screen-wrap" v-loading="screenListLoading">
                <el-card
                    class="box-card screen-list"
                    :body-style="{ padding: '0px' }"
                    v-for="(item, index) in resData"
                    :key="index"
                    @click.native.prevent="showCurrentScreenTimelineList(item.screenId)"
                >
                    <div class="screen-info">
                        <div class="title">
                            {{ item.screenName }}
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
                        <div class="delete" @click="deleteScreen(index)"><i class="el-icon-delete"></i>删除</div>
                    </div>
                    <div class="time">
                        <i class="el-icon-time"></i>{{item.formatPlayTime}}
                    </div>
                </el-card>
                <div v-if="!resData.length" class="no-data">暂无数据~</div>
            </div>
        </el-scrollbar>

        <!-- 选择屏幕 -->
        <el-dialog
            width="500px"
            title="定时发布"
            :visible.sync="showAddScreen"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            class="time-interval-pub"
            @close="showAddScreen = false"
            append-to-body
        >
            <div class="clearfix screen-wrap" v-loading="dataLoading">
                <el-form label-width="80px">
                    <el-form-item label="选择时间" class="is-required">
                        <el-date-picker
                            v-model="addParams.time"
                            type="datetime"
                            format="yyyy-MM-dd HH:mm:ss"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            placeholder="选择日期时间"
                        >
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="选择屏幕" class="is-required">
                        <el-input
                            size="small"
                            placeholder="搜索屏幕"
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
                            v-for="item in screenData"
                            :key="item.id"
                            :class="{
                                active:
                                    addParams.selectedId.indexOf(item.id) > -1,
                            }"
                            @click.native="selectedCurrentScreen(item.id)"
                        >
                            <div class="screen-info">
                                <div class="title">{{ item.displayName }}</div>
                            </div>
                        </el-card>
                    </el-form-item>
                </el-form>
                <el-pagination
                    background
                    layout="total, prev, pager, next"
                    :current-page="Number(params.pageNo)"
                    @current-change="handleCurrentChange"
                    :total="totalCount"
                >
                </el-pagination>
            </div>

            <span slot="footer" class="dialog-footer">
                <el-button
                    type="primary"
                    :loading="btnLoading"
                    @click="addTimeIntervalPub()"
                    >确 定</el-button
                >
            </span>
        </el-dialog>

        <!-- 屏幕对应的 定时时间轴列表 -->
        <el-dialog
            width="500px"
            title="定时时间轴列表"
            :visible.sync="showTimelineList"
            @close="showTimelineList = false"
            append-to-body
        >
            <div class="clearfix screen-wrap" v-loading="timelineListLoading">
                <el-card
                    class="box-card screen-list"
                    :body-style="{ padding: '0px' }"
                    v-for="(item, index) in timelineListData"
                    :key="index"
                >
                    <div class="screen-info">
                        <div class="title">
                            {{ item.containerName }}
                        </div>
                    </div>
                </el-card>
            </div>
        </el-dialog>

    </div>
</template>

<script>
import { screenList } from "@/api/screen";
import { timeIntervalList, timeIntervalPub, timeIntervalDelete, timeIntervalScreentTimelineList } from "@/api/timeline";
export default {
    data() {
        return {
            screenListLoading: false,
            resData: [], //已添加的屏幕列表
            showAddScreen: false, //添加屏幕 弹框
            screenData: [], //所有的屏幕列表
            totalCount: 0, //总条数
            dataLoading: false,
            params: {
                pageNo: 1,
                pageSize: 10,
            },
            addParams: {
                selectedId: [],
            },
            btnLoading: false,

            showTimelineList: false,         //是否显示 屏幕对应的定时时间轴列表
            timelineListLoading: true,
            timelineListData: []
        };
    },
    mounted() {
        this.init();
    },
    methods: {
        //已添加的屏幕列表
        init() {
            this.screenListLoading = true;
            timeIntervalList(this.$route.params.id).then((res) => {
                this.screenListLoading = false;
                if (res.code === this.$successCode) {
                    this.resData = res.obj;
                }
            });
        },

        //点击添加  显示所有的屏幕列表
        getScreenList(){
            this.dataLoading = true;
            screenList(this.params).then(res => {
                this.dataLoading = false;
                this.screenData = res.obj.list;
                this.totalCount = res.obj.totalRecords;
                this.resData.forEach((item, index) => {
                    for(let i = 0; i< this.screenData.length; i++){
                        if(item.id == this.screenData[i].id){
                            this.screenData[i].hide = true;
                        }
                    }
                })
            })
        },

        //页码
        handleCurrentChange(page) {
            this.params.pageNo = page;
            this.getScreenList();
        },

        //点击添加屏幕按钮  显示添加弹框
        addScreenBtn() {
            this.showAddScreen = true;
            this.addParams = {selectedId: []};
            this.getScreenList();
        },

        //选择屏幕
        selectedCurrentScreen(id) {
            let index = this.addParams.selectedId.indexOf(id);
            if (index > -1) {
                this.addParams.selectedId.splice(index, 1);
            } else {
                this.addParams.selectedId.push(id);
            }
        },

        //添加定时发布
        //isConfirm 0  第一次提交 发生重叠时提示
        //isConfirm 1 再次点击提交，不做验证 
        addTimeIntervalPub(isConfirm=0) {
            if (!this.addParams.time) {
                this.$message.warning("请选择时间~");
                return;
            } else if (!this.addParams.selectedId.length) {
                this.$message.warning("请选择屏幕~");
                return;
            }

            let data = [];
            this.addParams.selectedId.forEach((item) => {
                data.push({
                    containerId: Number(this.$route.params.id),
                    screenId: item,
                    playTime: this.addParams.time,
                    // 时间轴内 最后一个内容的结束时间
                    endTime: localStorage.timelineContentLastTime ? this.addParams.time.split(' ')[0] + ' ' + localStorage.timelineContentLastTime : this.addParams.time
                })
            })

            let params = {
                timings: data,
                isConfirm
            }

            this.btnLoading = true;
            timeIntervalPub(params).then((res) => {
                this.btnLoading = false;
                if (res.code === this.$successCode) {
                    this.$message.success("添加定时发布成功~");
                    this.showAddScreen = false;
                    this.init();
                }else if(res.code == 357){

                    this.$confirm(`${res.message}`, '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        this.addTimeIntervalPub(1);
                    })

                }
            });
        },

        //删除
        deleteScreen(index){
            this.$confirm(`此操将删除屏幕【${this.resData[index].screenName}】, 是否继续?`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                timeIntervalDelete(this.resData[index].id).then(res => {
                    if(res.code === this.$successCode){
                        this.$message.success('删除成功~');
                        this.resData.splice(index, 1);
                    }
                })
            })
        },

        //点击屏幕 显示该屏幕的定时 时间轴列表
        showCurrentScreenTimelineList(id){
            this.showTimelineList = true;
            this.timelineListLoading = true;
            timeIntervalScreentTimelineList(id).then(res => {
                this.timelineListLoading = false;
                if(res.code === this.$successCode){
                    this.timelineListData = res.obj;
                }
            })
        }
    },
};
</script>

<style lang="scss">
@import "../../../styles/variables.scss";

.time-interval-screen-wrap {
    height: 100%;

    .screen-list {
        width: 100%;
        height: 80px;
        margin: 10px 0;
        cursor: pointer;

        .screen-info {
            display: flex;
            line-height: 50px;

            .title {
                padding: 0 10px;
                flex: 1;
            }

            .delete{
                float: right;
                width: 80px;
                color: $--color-info;
                &:hover{
                    color: $--color-danger;
                    text-decoration: underline;
                }
                &.add-btn{
                    color: $--color-success;
                    &:hover{
                        color: #5ee192;
                    }
                }
            }
        }
        .time{
            line-height: 20px;
            margin-left: 10px;
            color: #999;
            .el-icon-time{
                margin-right: 5px;
            }
        }
    }

    .no-data {
        line-height: 40px;
        text-align: center;
    }
}

.time-interval-pub{
    .active {
        border: 1px solid #ff9800;
    }
}
</style>
