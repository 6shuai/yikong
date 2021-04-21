<template>
    <el-scrollbar class="clearfix" style="height: 100%" onselectstart="return false" v-loading="timelineLoading">
        <!-- 工具栏 -->
        <div class="stage-wrap">
        
            <div class="tool-warp clearfix">
                <div class="title time">
                    <el-radio-group size="mini" v-model="phaseType" @change="changeStageType()">
                        <el-radio-button :label="1">轮播</el-radio-button>
                        <el-radio-button :label="2">插播</el-radio-button>
                    </el-radio-group>
                    <el-link 
                        v-if="hasPerm($store.state.permission.timelinePrem, 'AddStage')"
                        type="success" 
                        @click="showCreatedStage()"
                    >新建阶段
                    </el-link>
                </div>
                <el-button 
                    v-if="timelineData.publish"
                    class="tool-btn" 
                    icon="el-icon-upload2" 
                    type="info" 
                    size="small"
                    :loading="pubLoading"
                    @click="PubTerminal"
                >发布到终端
                </el-button>
                <el-button 
                    v-if="!showDelete && !showCheckbox && timelineData.deleteTimelineRegion"
                    class="tool-btn" 
                    icon="el-icon-delete" 
                    type="warning" 
                    size="small"
                    :loading="deleteLoading"
                    @click="showDelete=!showDelete;isDeleteAll=false;deleteIds=[];deleteBtnIsDisabled=true"
                >删除时间轴
                </el-button>
                <el-button 
                    v-if="showDelete || showCheckbox"
                    class="tool-btn" 
                    type="warning" 
                    size="small"
                    :loading="deleteLoading"
                    @click="showDelete=false;showCheckbox=false"
                >取消
                </el-button>
                <el-button 
                    v-if="showDelete"
                    :disabled="deleteBtnIsDisabled"
                    class="tool-btn" 
                    icon="el-icon-delete" 
                    type="warning" 
                    size="small"
                    :loading="deleteLoading"
                    @click="deleteTimeline"
                >确定删除
                </el-button>
                <div class="tool-btn checkbox-delete-all" v-if="showDelete">
                    <el-checkbox label="全选" v-model="isDeleteAll" @change="changeDeleteAll"></el-checkbox>
                </div>

                <el-button 
                    v-if="!showCheckbox && !showDelete && timelineData.copyTimeline"
                    class="tool-btn" 
                    type="warning" 
                    size="small"
                    :loading="deleteLoading"
                    @click="showCheckbox=!showCheckbox; copyData={}; copyBtnIsDisabled=true"
                >选择
                </el-button>

                <el-button 
                    v-if="showCheckbox"
                    class="tool-btn" 
                    type="warning" 
                    size="small"
                    :disabled="copyBtnIsDisabled"
                    :loading="deleteLoading"
                    @click="handleSaveCopyData"
                >复制
                </el-button>
            </div>

            <!-- 阶段说明 -->
            <div class="stage-info clearfix">
                <div v-if="stageData.length">
                    <div class="title">阶段{{stageIndex+1}}</div>
                    <div class="stage-pagination">
                        <!-- 阶段分页 -->
                        <el-pagination
                            background
                            small
                            layout="prev, pager, next"
                            :current-page="stageIndex+1"
                            :page-size="1"
                            :pager-count="5"
                            @current-change="changeStagePage"
                            :total="stageData.length">
                        </el-pagination>
                    </div>

                    <div class="stage-handle">
                        <!-- <el-link 
                            v-if="hasPerm($store.state.permission.timelinePrem, 'AddStep')"
                            type="success" 
                            @click="showCreatedStep"
                        >新建步骤
                        </el-link> -->
                        <el-link 
                            v-if="timelineData.editTimelinePhase"
                            type="primary" 
                            @click="showCreatedStage(stageData[stageIndex])"
                        >编辑
                        </el-link>
                        <el-link 
                            v-if="timelineData.deleteTimelinePhase"
                            type="danger" 
                            @click="deleteStage"
                        >删除
                        </el-link>
                    </div>
                    <!-- 前一个阶段是循环时, 下一个阶段必填开始时间 -->
                    <ul class="info-list" v-if="phaseType==1 && (stageData[stageIndex - 1] ? stageData[stageIndex - 1].isRotation : true)">
                        <li>开始时间：{{stageData[stageIndex].beginTimeFormat}}</li>
                    </ul>
                    <ul class="info-list" v-if="phaseType==2">
                        <li>开始时间：{{stageData[stageIndex].beginTimeFormat}}</li>
                        <li>结束时间：{{updateStartTime(stageData[stageIndex].beginTimeFormat, stageData[stageIndex].duration)}}</li>
                    </ul>
                </div>
            </div>
        </div>

        <div class="screen-timeline-content">
            <!-- 屏幕名称 -->
            <div class="axis-left">
                <div class="title" v-for="(item, index) in screenLayout" :key="index">
                    {{item.displayName}}
                    <div 
                        v-if="timelineData.editTimelineRegion"
                        class="rotation-set"
                        @click="$refs.setIsRotation.showDialog(item, index)"
                    >设置</div>
                </div>
            </div>

            <!-- 删除时间轴 -->
            <div class="delete-checkbox" v-if="screenLayout.length && showDelete">
                <el-checkbox-group v-model="deleteIds" @change="changeDelte">
                    <el-checkbox 
                        v-for="(item, index) in screenLayout" 
                        :key="index"
                        :label="item.id" border>
                        {{item.displayName}}
                    </el-checkbox>
                </el-checkbox-group>
            </div>

            <!-- 屏幕时间轴数据 -->
            <div class="axis-right">
                <div class="right-content">

                    <div 
                        class="screen-content-wrap" 
                        v-if="rectangleData.length"
                        ref="screenWrap">
                        <el-scrollbar
                            :native="false"
                            class="screen-item-wrap"
                            style="width: 100%"
                            v-for="(item, Pindex) in screenLayout"
                            :key="Pindex"
                        >   
                            <draggable 
                                class="screen-item draggable widget-form-list"
                                ghostClass="ghost"
                                :options="sortOption" 
                                @add="onAdd($event, Pindex)" 
                                :list="rectangleData[Pindex]"
                                :style="{width: (rectangleData[Pindex] ? rectangleData[Pindex].length+2 : 0) * 110 + 'px'}"
                            >
                                
                                <div
                                    v-for="(item, index) in rectangleData[Pindex]"
                                    :key="index"
                                    :title="`【${item.displayName}】`"
                                    class="rectangle"
                                    :class="item.contentTypeId==contentTypeId.image ? 'image' : (item.contentTypeId == contentTypeId.video ? 'video' : 'game')"
                                    @click="handlePreview(Pindex, index, item)"
                                >
                                    <!-- 复制功能 点击选择  显示多选框 -->
                                    <copy-content v-if="showCheckbox" :data="item" @setCopyData="setCopyData"></copy-content>

                                    <el-popover
                                        popper-class="screen-tool-popover"
                                        placement="top-start"
                                        trigger="hover">
                                        <div class="content-tool">
                                            <div 
                                                v-if="timelineData.editTimelineContent"
                                                @click="editTimeBtn(Pindex, index)"
                                            >编辑时长
                                            </div>
                                            <div 
                                                v-if="timelineData.deleteTimelineContent"
                                                class="delete" 
                                                @click="deleteCurrentTimeline(Pindex, index, item.id)"
                                            >删除
                                            </div>
                                        </div>

                                        <div class="content" slot="reference">
                                            <!-- 发布时间轴时 未配置游戏提示 -->
                                            <div class="no-setting-game" v-if="noSettingGame.includes(item.id)">未配置游戏</div>

                                            <!-- 封面图片 -->
                                            <div class="image-wrap" v-if="item.contentTypeId != contentTypeId.atlas">
                                                <el-image v-if="item.image" :src="item.image" fit="cover"></el-image>
                                            </div>


                                            <!-- 图集 -->
                                            <div 
                                                class="image-wrap atlas" 
                                                :class="`atlas-${item.subContentsData.length > 4 ? '4' : item.subContentsData.length}`"
                                                v-if="item.contentTypeId == contentTypeId.atlas">
                                                <el-image 
                                                    v-for="img in item.subContentsData" 
                                                    v-if="img.contentType==1" 
                                                    :key="img.contentPath" 
                                                    :src="img.contentPath" 
                                                    fit="cover">
                                                </el-image>
                                            </div>

                                            <!-- 时长 -->
                                            <div class="duration" v-if="item.duration"><font-awesome-icon :icon="['far', 'clock']" />{{item.duration}}秒</div>

                                            <!--title-->
                                            <div class="name">
                                                <div class="display-name">{{item.displayName}}</div>
                                            </div>

                                            <!-- 在这个时间段播放了多少次 -->
                                            <div class="play-count">
                                                x{{ playCount(item) }}
                                            </div>
                                        </div>
                                    </el-popover>
                                </div>
                            </draggable>

                        </el-scrollbar>
                    </div>

                </div>

            </div>
        </div>


        <!-- 时间轴内容 编辑时段 -->
        <el-dialog
            width="500px"
            v-if="editTime.length"
            :title="editTime[0].displayName"
            :visible.sync="showEditTime"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            :show-close="false"
            append-to-body>
            <el-form 
                label-width="80px"
            >
                <el-form-item label="时长" class="is-required">
                    <el-input 
                        style="width: 220px"
                        v-model="editTime[0].duration" 
                        type="number">
                        <template slot="append">秒</template>
                    </el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="closeEditTime">取 消</el-button>
                <el-button type="primary" :loading="editTimeLoading" @click="updateContentTime">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 创建或修改 阶段 -->
        <created-stage 
            ref="createdStage"
            :startTime="startTime"
            @createdStageSuccess="createdStageSuccess"
        ></created-stage>

        <!-- 逻辑区域设置 -->
        <set-is-rotation 
            ref="setIsRotation"
            @updateRotationSuccess="updateRotationSuccess"
        ></set-is-rotation>

    </el-scrollbar>
</template>

<script>
import Draggable, { directive } from "vuedraggable";
import { mapState } from "vuex";
import { timelineFunc } from '../mixins';
import { timeDisposeTool } from '@/mixins';
import {
    timelineCreated,
    timelineList,
    timelineDelete,
    pubToScreen,
    timelineStageData,
    timelineStageDelete
} from "@/api/timeline";
import CopyContent from "./CopyContent";
import CreatedStage from './CreatedStage';
import SetIsRotation from './SetIsRotation';

export default {
    props: ["startTime", "timelineData"],
    mixins: [timelineFunc, timeDisposeTool],
    data() {
        return {
            screenData: [],
            timelineIds: [], //时间轴所有内容的id 集合
            rectangleData: [],
            screenLayout: [], //屏幕布局数据
            currentActivate: {}, //当前激活的矩形数据
            saveLoading: false, //保存按钮loading
            pubLoading: false, //发布按钮loading
            deleteLoading: false, //清空时间轴按钮loading
            showEditTime: false, //显示内容编辑时段
            editTime: [], //编辑内容时段 参数
            editTimeLoading: false,   //编辑时间段 提交loading
            noSettingGame: [], //时间轴内的游戏 没有配置。时间轴id数组
            contentTypeId: {
                image: 1,
                video: 2,
                game: 3,
                atlas: 4,
            },
            sortOption: {
                fallbackOnBody: false,
                filter: ".rectangle",
                sort: false,
                group: {
                    name: "componentLibrary",
                    put: true,
                },
                swapThreshold: "0.8",
                animation: 300,
            },
            showDelete: false, //点击删除时间轴 显示选择框
            isDeleteAll: false, //删除  全选
            deleteBtnIsDisabled: true, //删除按钮是否禁用
            screenIds: [], //屏幕列表id
            deleteIds: [],

            showCheckbox: false, //是否显示 多选框   点击选择按钮显示
            copyBtnIsDisabled: false, //复制按钮 是否禁用
            copyData: {},
            timelineLoading: false,  //时间轴数据 loading
            phaseType: 1, //阶段类型 1 轮播   2插播
            rotationStage: [],    //轮播内容
            cutInStage: [],       //插播内容
            stageIndex: 0,        //当前阶段   
            stageData: {},
        };
    },
    computed: {
        ...mapState({
            dragData: (state) => state.timeline.dragData,
        })
    },
    mounted() {
        this.getStageData();
    },
    methods: {
        //放置被拖数据时
        onAdd(data, Pindex) {
            //拖拽到当前位置的下标
            let index = data.newIndex;

            let obj = this.rectangleData[Pindex];
            let currentData = obj[index];

            // 剪贴板内容
            if (currentData.type === "copy") {
                this.$delete(this.rectangleData[Pindex], index);
                this.$nextTick(() => {
                    currentData.list.forEach((item, i) => {
                        this.rectangleData[Pindex].splice(index + i, 0, item);
                        this.onAddSetDataStarTime(
                            item,
                            Pindex,
                            index + i,
                            obj
                        ).then((res) => {
                                this.searchOverlap(Pindex).then((res) => {});
                            if (i === currentData.list.length - 1) {
                                this.saveTimeline(Pindex);
                                
                            }
                        });
                    });
                })
            } else {
                this.onAddSetDataStarTime(currentData, Pindex, index, obj).then(
                    (res) => {
                        this.editTimeBtn(Pindex, index, "new");
                    }
                );
            }
        },

        //设置拖放数据的开始时间
        onAddSetDataStarTime(data, Pindex, index, obj) {
            return new Promise((resolve) => {
                let time =
                    index == 0 ? this.stageData[this.stageIndex].beginTimeFormat ? this.stageData[this.stageIndex].beginTimeFormat : this.startTime : obj[index - 1].beginTime;
                let duration = index == 0 ? 0 : obj[index - 1].duration;
                data.beginTime = this.findEndTime(time, duration);
                data.endTime = this.findEndTime(data.beginTime, data.duration);
                data = {
                    ...data,
                    contentId: data.id || data.contentId,
                    contentDuration: data.duration,
                    isRotation: 1
                };
                delete data.id;
                this.$set(obj, index, data);
                resolve(obj);
            });
        },

        //查询是否有重叠
        searchOverlap(Pindex) {
            return new Promise((resolve) => {
                let stageStarTime = this.stageData[this.stageIndex].beginTimeFormat;
                this.timelineForeachFind(resolve, Pindex, stageStarTime);
                
            });
        },

        //保存时间轴
        saveTimeline(Pindex, contentIndex) {
            let data = [];
            //contentIndex  保存单个资源
            if (contentIndex) {
                let obj = this.rectangleData[Pindex][contentIndex];
                data = [
                    {
                        id: obj.id ? obj.id : null,
                        regionId: this.screenLayout[Pindex].id,
                        contentId: obj.contentId,
                        beginTime: "1970-01-01 " + obj.beginTime,
                        duration: obj.duration,
                        isRotation: obj.isRotation
                    },
                ];
            } else {
                this.rectangleData[Pindex].forEach((item, index) => {
                    data.push({
                        id: item.id ? item.id : null,
                        regionId: this.screenLayout[Pindex].id,
                        contentId: item.contentId,
                        beginTime: "1970-01-01 " + item.beginTime,
                        duration: item.duration,
                        isRotation: item.isRotation
                    });
                });
            }

            this.saveLoading = true;
            timelineCreated(data).then((res) => {
                this.saveLoading = false;
                if (res.code == this.$successCode) {
                    this.$message.success("保存成功~");

                    if (contentIndex) return;
                    let obj = this.rectangleData[Pindex];
                    obj.forEach((item, i) => {
                        let msg = res.obj[i];
                        item = {
                            ...item,
                            id: msg.id,
                            regionId: msg.regionId,
                            duration: msg.duration,
                            contentId: msg.contentId,
                        };
                        this.$set(obj, i, item);
                        this.$set(
                            this.timelineIds[item.regionId].ids,
                            item.id,
                            item.id
                        );
                    });

                    this.$set(this.rectangleData, Pindex, obj);
                }
            });
        },

        //根据逻辑区域ID查询时间轴集合
        initTimelineList() {
            this.timelineIds = {};
            if(!this.screenLayout.length) this.timelineLoading = false;

            for (let i = 0; i < this.screenLayout.length; i++) {
                var screenParams = this.screenLayout[i];
                this.timelineIds[screenParams.id] = {
                    index: i,
                    ids: {},
                };
                timelineList(screenParams.id).then((res) => {
                    let data = [];
                    if (res.obj && res.obj.length) {
                        res.obj.forEach((item, i) => {
                            data.push({
                                ...item,
                                displayName: item.contentName,
                            });
                            this.timelineIds[item.regionId].ids[item.id] =
                                item.id;
                        });
                    }
                    this.$nextTick(() => {
                        this.$set(this.rectangleData, i, data);
                        if(i == this.screenLayout.length-1){
                            this.timelineLoading = false;
                        } 

                    });
                });
            }
        },

        //删除时间轴  资源
        deleteCurrentTimeline(Pindex, index, id) {
            this.$confirm(
                `此操作将删除资源【${this.rectangleData[Pindex][index].displayName}】, 是否继续?`,
                "提示",
                {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning",
                }
            )
                .then(() => {
                    if (id) {
                        this.deleteTimelineContent(id, Pindex, index);
                    } else {
                        this.rectangleData[Pindex].splice(index, 1);
                        let obj = this.rectangleData;
                        this.rectangleData = [];
                        this.rectangleData = obj;
                    }
                })
                .catch(() => {});
        },

        //删除时间轴 资源 接口
        deleteTimelineContent(data, Pindex, index, type) {
            timelineDelete(data).then((res) => {
                this.deleteLoading = false;
                if (res.code === this.$successCode) {
                    this.$message.success("删除成功~");
                    if (type == "checkbox") {
                        console.log(this.timelineIds, this.deleteIds)
                        this.deleteIds.forEach((item, index) => {
                            let key = this.timelineIds[item];
                            this.$set(
                                this.rectangleData,
                                key.index,
                                []
                            );
                            this.timelineIds[item].ids = {};
                        })

                        this.showDelete = false;
                    } else {
                        let currentData = JSON.parse(
                            JSON.stringify(this.rectangleData[Pindex][index])
                        );
                        this.rectangleData[Pindex].splice(index, 1);
                        this.$delete(
                            this.timelineIds[currentData.regionId].ids,
                            currentData.id
                        );
                        
                        if (this.rectangleData[Pindex].length > index) {
                            this.searchOverlap(Pindex).then((res) => {
                                this.saveTimeline(Pindex);
                            });
                        }
                    }

                }
            });
        },

        //点击编辑时段  显示弹窗
        editTimeBtn(Pindex, index, type) {
            this.editTime = [
                {
                    startTime: this.rectangleData[Pindex][index].beginTime,
                    Pindex,
                    index,
                    ...this.rectangleData[Pindex][index],
                    type,
                },
            ];
            this.showEditTime = true;
        },

        //编辑内容时段
        updateContentTime() {
            let data = this.editTime[0];
            let obj = JSON.parse(
                JSON.stringify(this.rectangleData[data.Pindex][data.index])
            );
            obj.duration = data.duration;
            obj.beginTime = data.beginTime;
            obj.endTime = this.findEndTime(data.beginTime, data.duration);
            obj.isRotation = data.isRotation;
            
            if (!obj.beginTime) {
                this.$message.warning("请选择开始时间~");
                return;
            } else if (!obj.duration) {
                this.$message.warning("请填写时长~");
                return;
            }
            obj.endTime = this.findEndTime(obj.beginTime, obj.duration);

            this.$set(this.rectangleData[data.Pindex], data.index, obj);
            this.editTimeLoading = true;

            this.searchOverlap(data.Pindex, data.index).then((res) => {
                this.showEditTime = false;
                this.editTimeLoading = false;
                this.$set(this.rectangleData, data.Pindex, res);
                delete this.editTime[0].type;

                this.saveTimeline(data.Pindex);
            });
        },

        //关闭编辑时段
        closeEditTime() {
            let { Pindex, index } = this.editTime[0];
            if (this.editTime[0].type == "new") {
                this.rectangleData[Pindex].splice(index, 1);
            }
            this.showEditTime = false;
        },

        //发布到终端
        PubTerminal() {
            let data = `?containerId=${this.$route.params.id}`;
            this.pubLoading = true;
            pubToScreen(data).then((res) => {
                this.pubLoading = false;
                if (res.code === this.$successCode) {
                    this.$message.success(res.message);
                } else if (res.obj) {
                    this.noSettingGame = res.obj;
                }
                eventBus.$emit("timelinePubSuccess");
            });
        },

        //删除时间轴 - 全选按钮
        changeDeleteAll() {
            if (this.isDeleteAll) {
                this.deleteIds = this.screenIds;
                this.deleteBtnIsDisabled = false;
            } else {
                this.deleteIds = [];
                this.deleteBtnIsDisabled = true;
            }
        },

        //删除时间轴 - 选择多选框
        changeDelte() {
            if (this.deleteIds.length != this.screenIds.length) {
                this.isDeleteAll = false;
            } else {
                this.isDeleteAll = true;
            }

            if (this.deleteIds.length) {
                this.deleteBtnIsDisabled = false;
            } else {
                this.deleteBtnIsDisabled = true;
            }
        },

        //删除时间轴 - 点击确定按钮
        deleteTimeline() {
            let ids = [];
            this.deleteIds.forEach((item, index) => {
                for (let key in this.timelineIds[item].ids) {
                    ids.push(this.timelineIds[item].ids[key]);
                }
            });

            if (!ids.length) {
                this.$message.warning("当前没有可删除的时间轴~");
                return;
            }
            this.$confirm(
                `此操作将删除已选时间轴的全部资源, 是否继续?`,
                "提示",
                {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning",
                }
            )
                .then(() => {
                    this.deleteLoading = true;
                    this.deleteTimelineContent(
                        ids.join(","),
                        null,
                        null,
                        "checkbox"
                    );
                })
                .catch(() => {});
        },

        //小于10 前面补个0
        addPreZero(number) {
            return number < 10 ? "0" + number : number;
        },

        //选择时间轴内容 复制
        setCopyData(msg) {
            if (msg.checked) {
                this.copyData[msg.id] = msg.data;
            } else {
                this.$delete(this.copyData, msg.id);
            }

            let arr = Object.keys(JSON.parse(JSON.stringify(this.copyData)));
            if (arr.length) {
                this.copyBtnIsDisabled = false;
            } else {
                this.copyBtnIsDisabled = true;
            }
        },

        //保存复制的内容
        handleSaveCopyData() {
            let data = [];
            let totalDuration = 0;
            let displayName = "";
            for (let key in this.copyData) {
                this.$delete(this.copyData[key], "id");
                data.push(this.copyData[key]);
                totalDuration += this.copyData[key].duration;
                displayName += this.copyData[key].displayName;
            }
            data.sort((p, n) => {
                return (
                    this.timeDifference(p.beginTime) -
                    this.timeDifference(n.beginTime)
                );
            });
            let obj = {
                displayName: displayName,
                duration: totalDuration,
                type: "copy",
                list: data,
            };


            let timelineCopyDataList = [obj];

            localStorage.timelineCopyDataList = JSON.stringify(
                timelineCopyDataList
            );

            this.$message.success("复制成功, 请在剪贴板查看~");
            this.showCheckbox = false;
        },


        //创建 或 编辑阶段
        showCreatedStage(data){
            let len = this.stageData.length;
            let obj = {};
            if(this.phaseType == 2){
                obj = {
                    beginTimeFormat: len > 0 ? this.updateStartTime(this.stageData[len-1].beginTimeFormat, this.stageData[len-1].duration) : this.startTime
                };
            }
            if(data){
                let { id, containerId, beginTimeFormat, duration, loop, timelineRegions, isRotation } = data;
                obj = {
                    id, 
                    containerId,
                    beginTimeFormat,
                    duration,
                    loop,
                    timelineRegions,
                    isRotation
                }
            }
            let lastStage = this.stageData[this.stageData.length-1] || undefined;

            this.$refs.createdStage.showDialog(
                this.phaseType, 
                obj, 
                data ? this.stageData[this.stageIndex-1] : lastStage,
                lastStage ? this.updateStartTime(lastStage.beginTimeFormat, lastStage.duration || 30) : this.startTime
            ); 
        },

        //创建阶段成功
        createdStageSuccess(type, data){
            if(type === 'editStage'){
                let msg = {
                    ...this.stageData[this.stageIndex],
                    ...data
                }
                this.$set(this.stageData, this.stageIndex, msg);

                // // 编辑阶段 
                // this.screenLayout.forEach((item, index) => {
                //     this.searchOverlap(index).then((res) => {
                //         this.saveTimeline(index);
                //     });
                // })
            }else{
                this.getStageData(type);
            }
        },

        //删除阶段
        deleteStage(){
            let stageIndex = this.stageIndex;
            let id = this.stageData[stageIndex].id;
            this.$confirm(
                `此操作将删除【阶段${stageIndex+1}】, 是否继续?`,
                "提示",
                {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning",
                }
            )
            .then(() => {
                timelineStageDelete(id).then(res => {
                    if(res.code === this.$successCode){
                        let beginTime = this.stageData[stageIndex].beginTimeFormat;
                        this.$message.success('删除成功~');
                        this.stageData.splice(stageIndex, 1);
                        this.stageIndex = stageIndex ? stageIndex - 1 : 0;
                        this.updateScreenShow();

                        this.$nextTick(() => {
                            if(!this.stageData[stageIndex]) return;
                            //删除阶段之后 下一个阶段开始时间修改成上一个的开始时间
                            this.stageData[stageIndex] = {
                                ...this.stageData[stageIndex],
                                beginTimeFormat: beginTime,
                                beginTime
                            };
                            this.$refs.createdStage.changeNextStageTime(this.stageData[stageIndex]);
                        })

                    }
                })
            })
            .catch(() => {});
        },

        //阶段 数据
        getStageData(type){
            this.timelineLoading = true;
            timelineStageData(this.$route.params.id).then(res => {
                if(res.code === this.$successCode){
                    let { rotation, cutIn } = res.obj;
                    this.rotationStage = rotation;
                    this.cutInStage = cutIn;

                    this.changeStageType(type);

                }
            })
        },

        //当前阶段
        changeStageType(type){
            let data = this.phaseType==1 ? this.rotationStage : this.cutInStage;
            this.stageData = data;
            if(!type){
                this.stageIndex = 0;
            }if(type === 'addStage'){
                this.stageIndex = this.stageData.length - 1;
            }
            this.updateScreenShow();
        },

        //阶段 分页
        changeStagePage(page){
            this.stageIndex = page-1;
            this.updateScreenShow();
        },


        //更新预览 显示
        updateScreenShow(){
            this.timelineLoading = true;
            let stepData = undefined;
            try{
                stepData = this.stageData[this.stageIndex].timelineRegions ? this.stageData[this.stageIndex] : undefined;
            }catch(err){

            }
            let content = stepData ? stepData.timelineRegions : [];


            this.$emit('updateScreen', content);
            this.updateScreenCoverShow();
            this.rectangleData = [];
            this.screenLayout = JSON.parse(JSON.stringify(content));
            this.screenIds = [];
            this.screenLayout.forEach((item, index) => {
                this.screenIds.push(item.id);
            });
            this.initTimelineList();
        },

        //左上位置  预览显示的逻辑区域封面图
        updateScreenCoverShow(){
            this.$emit('previewCover', {
                data: this.rectangleData
            });
        },

        //点击时间轴内容预览
        handlePreview(Pindex, index, item){
            this.$emit('previewCover', {
                Pindex, 
                index,
                item: JSON.parse(JSON.stringify(item))
            });
        },

        //逻辑区域 修改成功
        updateRotationSuccess(index, isRotation){
            let data = this.stageData[this.stageIndex].timelineRegions[index];
            this.$set(data, 'isRotation', isRotation);
            this.$set(this.screenLayout[index], 'isRotation', isRotation);
        },

        //播放次数
        playCount(item){
            let num = Math.floor(this.timeDifference(item.beginTime, item.endTime) / (item.contentDuration));
            return num ? num : 1;
        }
    },
    components: {
        Draggable,
        CopyContent,
        CreatedStage,
        SetIsRotation,
    },
    watch: {
        rectangleData(val){
            this.updateScreenCoverShow();
        }
    },
    destroyed() {
        eventBus.$off("timelinePubSuccess");
    },
};
</script>