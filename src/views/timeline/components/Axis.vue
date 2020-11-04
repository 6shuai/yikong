<template>
    <el-scrollbar class="clearfix" style="height: 100%" onselectstart="return false">
        <!-- 工具栏 -->
        <div class="tool-warp clearfix">
            <div class="title time">{{startTime}} - {{endTime}}</div>
            <el-button 
                class="tool-btn" 
                icon="el-icon-upload2" 
                type="info" 
                size="small"
                :loading="pubLoading"
                @click="PubTerminal"
            >发布到终端
            </el-button>
            <el-button 
                v-if="!showDelete && !showCheckbox"
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
                v-if="!showCheckbox && !showDelete"
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

        <!-- 屏幕名称 -->
        <div class="axis-left">
            <div class="title" v-for="(item, index) in screenLayout" :key="index">
                {{item.displayName}}
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

                <div class="screen-content-wrap" ref="screenWrap">
                    <el-scrollbar
                        :native="false"
                        class="screen-item-wrap"
                        style="width: 100%"
                        v-for="(item, Pindex) in screenLayout"
                        :key="Pindex"
                    >   
                        <draggable 
                            v-if="rectangleData[Pindex]"
                            class="screen-item draggable widget-form-list"
                            ghostClass="ghost"
                            :options="sortOption" 
                            @sort="onSort" 
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
                            >
                                <!-- 复制功能 点击选择  显示多选框 -->
                                <copy-content v-if="showCheckbox" :data="item" @setCopyData="setCopyData"></copy-content>

                                <el-popover
                                    popper-class="screen-tool-popover"
                                    placement="top-start"
                                    trigger="hover">
                                    <div class="content-tool">
                                        <div class="time-frame">{{item.beginTime}}-{{item.endTime}}</div>
                                        <div @click="editTimeBtn(Pindex, index)">编辑时段</div>
                                        <div @click="gameSetting(item, Pindex, index)" v-if="item.logicRegion && item.contentTypeId == contentTypeId.game">游戏设置</div>
                                        <div class="delete" @click="deleteCurrentTimeline(Pindex, index, item.id)">删除</div>
                                    </div>

                                    <div class="content" slot="reference" @click="selectedCurrentTimeline(item, Pindex)">
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
                                        <div class="play-count" v-if="item.contentTypeId == contentTypeId.video || item.contentTypeId == contentTypeId.atlas">
                                            x{{Math.ceil(timeDifference(item.beginTime, item.endTime) / item.contentDuration)}}
                                        </div>
                                    </div>
                                </el-popover>
                            </div>
                        </draggable>


                    </el-scrollbar>
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
                <el-form-item label="开始时间" class="is-required">
                    <el-time-picker
                        v-model="editTime[0].beginTime"
                        format="HH:mm:ss"
                        value-format="HH:mm:ss"
                        :picker-options="{
                            selectableRange: editTime[0].contentTypeId == contentTypeId.game ? '' : `${editTime[0].startTime} - 23:59:59`
                        }"
                        placeholder="选择开始时间">
                    </el-time-picker>
                </el-form-item>
                <el-form-item label="时长" class="is-required">
                    <el-input 
                        style="width: 220px"
                        v-model="editTime[0].duration" 
                        type="number">
                        <template slot="append">秒</template>
                    </el-input>
                </el-form-item>
                <el-form-item label="是否轮播" class="is-required">
                    <el-switch
                        v-model="editTime[0].isRotation"
                        :active-value="1"
                        :inactive-value="0"
                    >
                    </el-switch>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="closeEditTime">取 消</el-button>
                <el-button type="primary" :loading="editTimeLoading" @click="updateContentTime">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 游戏设置 -->
        <game-setting 
            @gameSettingSuccess="gameSettingSuccess"
            ref="gameSetting"
        ></game-setting>

    </el-scrollbar>
</template>

<script>
import Draggable from "vuedraggable";
import { mapState } from "vuex";
import {
    timelineCreated,
    timelineList,
    timelineDelete,
    pubToScreen,
} from "@/api/timeline";
import GameSetting from "./GameSetting";
import CopyContent from "./CopyContent";

export default {
    props: ["startTime", "endTime"],
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
        };
    },
    computed: {
        ...mapState({
            dragData: (state) => state.timeline.dragData,
        }),
    },
    mounted() {
        eventBus.$on("setScreenLayoutData", (data) => {
            let copyData = JSON.parse(JSON.stringify(data.data));
            this.screenLayout = copyData;
            this.screenLayout.forEach((item, index) => {
                this.screenIds.push(item.id);
            });
            if (data.type === "update") {
                this.updateScreen(copyData);
            } else {
                this.initTimelineList();
            }
        });
    },
    methods: {
        //计算时间差（相差分钟）
        // var beginTime="08:31:00";
        // var endTime="21:50:00";
        timeDifference(beginTime, endTime) {
            if (!beginTime) return;
            var start1 = beginTime.split(":");
            var startAll = parseInt(start1[0] * 60) + parseInt(start1[1]);
            if (!endTime) {
                return startAll * 60 + parseInt(start1[2]);
            }

            var end1 = endTime.split(":");
            var endAll = parseInt(end1[0] * 60) + parseInt(end1[1]);
            let minute = endAll - startAll;

            return minute * 60 - (parseInt(start1[2]) - parseInt(end1[2]));
        },

        //小于10 前面补个0
        addPreZero(number) {
            number = number < 0 ? (number = 0) : number;
            return number < 10 ? "0" + number : number;
        },

        onSort(data) {
            // console.log(data)
        },

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
                    index == 0 ? this.startTime : obj[index - 1].beginTime;
                let duration = index == 0 ? 0 : obj[index - 1].duration;
                console.log(time, duration)
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

        //拖拽新添加的资源 开始时间默认为前面的资源的结束时间
        findEndTime(time, duration) {
            let t = time.split(":");
            //小时
            let h = Number(t[0]);
            //分钟
            let m = Number(t[1]);
            //秒
            let s = Number(t[2]) || 0;

            //秒转换成分钟  余出来的秒数
            let remainderS = duration % 60;

            //秒数转为 分钟
            let d = (duration - remainderS) / 60;
            
            if(d > 60){
                h = h + (d - d%60) / 60;
                d = d % 60;
            }

            if (s + remainderS >= 60) {
                s = s + remainderS - 60;
                m = m + 1;
            } else {
                s = s + remainderS;
            }
            if (m + d >= 60) {
                m = m + d - 60;
                h = h + 1;
            } else {
                m = m + d;
            }
            return (
                this.addPreZero(h) +
                ":" +
                this.addPreZero(m) +
                ":" +
                this.addPreZero(s)
            );
        },

        //查询是否有重叠
        searchOverlap(Pindex) {
            return new Promise((resolve) => {
                this.timelineForeachFind(resolve, Pindex);
                // this.$set(this.rectangleData, Pindex, obj);
                
            });
        },

        
        timelineForeachFind(resolve, Pindex){
            let obj = this.rectangleData[Pindex];
            let isOverlap = false;
            let objLength = obj.length;
            
            if(obj.length <= 1) {
                resolve(obj);
                return;
            }

            for (let key in obj) {
                let item = obj[key];
                let index = Number(key);

                //当前资源的开始时间
                let currentStartTime = item.beginTime;

                //当前资源的结束时间
                let currentEndTime = item.endTime;

                //下一个资源
                let nextData = obj[index + 1];

                //下一个资源的开始时间
                let nextStarTime =
                    index === obj.length - 1 ? " " : nextData.beginTime;

                //上一个资源
                let prevData = obj[index - 1];

                //上一个资源的开始时间
                let prevStartTime =
                    index == 0 ? this.startTime : prevData.beginTime;

                //上一个资源的结束时间
                let prevEndTime =
                    index == 0
                        ? this.startTime
                        : this.findEndTime(
                                prevData.beginTime,
                                prevData.duration
                            );

                //相差时间 秒
                let diffNum = 0;

                //当前资源 开始时间 和 上一个资源时间重叠
                if (
                    this.timeDifference(prevEndTime, currentStartTime) < 0
                ) {
                    diffNum = this.timeDifference(
                        currentStartTime,
                        prevEndTime
                    );
                    // console.log("重叠---------,", diffNum, currentStartTime, prevEndTime);
                }

                //当前资源 开始时间 未紧跟上一个结束时间
                // if (
                //     this.timeDifference(prevEndTime, currentStartTime) > 0
                // ) {
                //     diffNum = this.timeDifference(
                //         currentStartTime,
                //         prevEndTime
                //     );
                // }

                //游戏资源
                if (item.contentTypeId == this.contentTypeId.game) {
                    //游戏资源的开始时间 和 上一个资源重叠
                    if (diffNum > 0) {
                        //把上一个资源的 结束时间改成 到当前游戏的开始时间
                        obj[index - 1] = {
                            ...prevData,
                            endTime: currentStartTime,
                            contentDuration: prevData.duration - diffNum,
                            duration: prevData.duration - diffNum,
                        };

                        //把上一个资源剩余的 时间 放到游戏的后面
                        let obj1 = obj;
                        let j = index + 1;
                        for (let i = 0; i < obj1.length; i++) {
                            if (
                                i > index &&
                                obj1[i].contentId == this.contentTypeId.game
                            ) {
                                j += 1;
                            } else {
                                break;
                            }
                        }

                        obj.splice(j, 0, {
                            ...prevData,
                            beginTime: currentEndTime,
                            endTime: this.findEndTime(
                                currentEndTime,
                                diffNum
                            ),
                            id: prevData.duration - diffNum <= 0 ? prevData.id : null,
                            duration: obj[index-1].duration <= 0 ? obj[index-1].duration + diffNum : diffNum,
                            contentDuration: obj[index-1].duration <= 0 ? obj[index-1].duration + diffNum : diffNum,
                        });

                        if (prevData.duration - diffNum <= 0)
                            obj.splice(index - 1, 1);

                        try{
                            if(this.timeDifference(currentStartTime, obj[index-2].endTime) > 0){
                                isOverlap = true;
                            }
                        }catch(e){

                        }
                    }

                    if (diffNum < 0 && index != obj.length - 1) {
                        //把下一个资源挪到 游戏资源的前面
                        let obj1 = obj;
                        let j = index;
                        for (let i = 0; i < obj1.length; i++) {
                            if (
                                obj1[index + i] &&
                                obj1[index + i].contentTypeId ==
                                    this.contentTypeId.game
                            ) {
                                j += 1;
                            } else {
                                break;
                            }
                        }

                        if (!obj[j]) return;

                        let count = this.timeDifference(
                            prevEndTime,
                            currentStartTime
                        );

                        //时间段  小于 这个资源的秒数   修改这个资源的结束时间  和 秒数
                        if (count <= obj[j].duration) {
                            obj[j] = {
                                ...obj[j],
                                endTime: this.findEndTime(
                                    obj[j].beginTime,
                                    obj[j].duration - count
                                ),
                                duration: obj[j].duration - count,
                                contentDuration: obj[j].duration - count,
                            };
                        }

                        //单独创建一个资源  插入到游戏资源前面
                        console.log(obj[j], obj[j].duration)
                        obj.splice(index, 0, {
                            ...obj[j],
                            beginTime: this.findEndTime(
                                currentStartTime,
                                -count
                            ),
                            endTime: currentStartTime,
                            id: obj[j].duration ? null : obj[j].id,
                            duration: count,
                            contentDuration: count,
                        });
                        console.log(obj[j+1], obj[j+1].duration)
                        if(!obj[j+1].duration){
                            this.$delete(obj, j+1);
                        }
                    }
                } else {
                    obj[index] = {
                        ...item,
                        beginTime: this.updateStartTime(
                            currentStartTime,
                            diffNum
                        ),
                        endTime: this.updateStartTime(
                            currentEndTime,
                            diffNum
                        ),
                    };
                }
            }

            obj.sort((a, b) => {
                return (
                    this.timeDifference(a.beginTime) -
                    this.timeDifference(b.beginTime)
                );
            });
            if(isOverlap || objLength < obj.length){
                this.timelineForeachFind(resolve, Pindex);
                return
            }
            resolve(obj);
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
                        logicRegion: this.screenLayout[Pindex].id,
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
                        logicRegion: this.screenLayout[Pindex].id,
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
                            logicRegion: msg.logicRegion,
                            duration: msg.duration,
                            contentId: msg.contentId,
                        };
                        this.$set(obj, i, item);
                        this.$set(
                            this.timelineIds[item.logicRegion].ids,
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
            let lastContentTime = [];

            for (let i = 0; i < this.screenLayout.length; i++) {
                var screenParams = this.screenLayout[i];
                this.timelineIds[screenParams.id] = {
                    index: i,
                    ids: {},
                };
                timelineList(screenParams.id).then((res) => {
                    this.$emit("updateScreen", res.obj[0], i);
                    let data = [];
                    if (res.obj && res.obj.length) {
                        res.obj.forEach((item, i) => {
                            data.push({
                                ...item,
                                beginTime: item.beginTime,
                                endTime: item.endTime,
                                displayName: item.contentName,
                            });
                            this.timelineIds[item.logicRegion].ids[item.id] =
                                item.id;
                        });
                    }
                    this.$nextTick(() => {
                        data.sort((a, b) => {
                            return (
                                this.timeDifference(a.beginTime) -
                                this.timeDifference(b.beginTime)
                            );
                        });
                        if (data.length)
                            lastContentTime.push(data[data.length - 1]);

                        if (i == this.screenLayout.length - 1) {
                            this.findLastContentEndTime(lastContentTime);
                        }
                        this.$set(this.rectangleData, i, data);
                    });
                });
            }
        },

        //删除时间轴  资源
        deleteCurrentTimeline(Pindex, index, id) {
            this.$confirm(
                `此操将删除资源【${this.rectangleData[Pindex][index].displayName}】, 是否继续?`,
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
                        this.$nextTick(() => {
                            this.selectedCurrentTimeline(
                                this.rectangleData[Pindex][0]
                                    ? this.rectangleData[Pindex][0]
                                    : {},
                                Pindex
                            );
                        });
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
                            this.timelineIds[currentData.logicRegion].ids,
                            currentData.id
                        );
                        console.log(this.rectangleData[Pindex].length, index);
                        if (this.rectangleData[Pindex].length > index) {
                            this.searchOverlap(Pindex).then((res) => {
                                this.saveTimeline(Pindex);
                            });
                        }
                    }
                }
            });
        },

        //更新屏幕布局 模块
        updateScreen(data) {
            let arr = [];

            let newRectangleData = [];
            for (var i = 0; i < data.length; i++) {
                newRectangleData.push([]);
                arr.push(data[i]);
                for (var j = 0; j < this.rectangleData.length; j++) {
                    if (
                        this.rectangleData[j][0] &&
                        this.rectangleData[j][0].logicRegion == data[i].id
                    ) {
                        newRectangleData[i] = this.rectangleData[j];
                        arr[i] = {
                            ...this.rectangleData[j][0],
                            ...data[i],
                        };
                    }
                }
            }

            this.rectangleData = newRectangleData;
            this.$emit("updateScreen", arr);
        },

        //选中时间轴里的 资源
        selectedCurrentTimeline(data, Pindex) {
            let copyData = JSON.parse(JSON.stringify(data));
            delete copyData.x;
            delete copyData.displayName;
            this.$emit("updateScreen", copyData, Pindex);
            this.setCurrentActivate(data, Pindex);
        },

        //设置当前激活的矩形数据
        setCurrentActivate(data, Pindex) {
            this.currentActivate = {
                ...data,
                Pindex,
            };
        },

        //点击编辑时段  显示弹窗
        editTimeBtn(Pindex, index, type) {
            console.log(this.rectangleData[Pindex][index])
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

            // console.log(obj)
            // return
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
            });
        },

        //显示游戏设置
        gameSetting(data, Pindex, index) {
            let obj = {
                configList: data.configList,
                timelineId: data.id,
                applicationId: data.applicationId,
            };

            this.editTime = {
                Pindex,
                index,
                ...this.rectangleData[Pindex][index],
            };

            this.$refs.gameSetting.showGameSetting(obj);
        },

        //游戏配置成功
        gameSettingSuccess(id) {
            let index = this.noSettingGame.indexOf(id);
            this.noSettingGame.splice(index, 1);
            this.saveTimeline(this.editTime.Pindex, this.editTime.index);
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

        //
        updateStartTime(time, duration) {
            let t = time.split(":");
            //小时
            let h = Number(t[0]);
            //分钟
            let m = Number(t[1]);
            //秒
            let s = Number(t[2]);

            //秒转换成分钟  余出来的秒数
            let remainderS = duration % 60;


            //秒数转为 分钟
            let d = (duration - remainderS) / 60;

            

            if(d > 60){
                h = h + (d - d%60) / 60;
                d = d % 60;
            }else if(d < -60){
                h = h - (Math.abs(d) - d%60) / 60;
                d = d % 60;
            }
            
            if (s + remainderS >= 60) {
                s = s + remainderS - 60;
                m = m + 1;
            } else if (s + remainderS < 0) {
                s = 60 - Math.abs(s + remainderS);
                m = m - 1;
            } else {
                s = s + remainderS;
            }
            if (m + d >= 60) {
                m = m + d - 60;
                h = h + 1;
            } else if (m + d < 0) {
                m = 60 - Math.abs(m + d);
                h = h - 1;
            } else {
                m = m + d;
            }
            return (
                this.addPreZero(h) +
                ":" +
                this.addPreZero(m) +
                ":" +
                this.addPreZero(s)
            );
        },

        //小于10 前面补个0
        addPreZero(number) {
            return number < 10 ? "0" + number : number;
        },

        //查找 时间轴内 最后一个内容的 结束时间
        findLastContentEndTime(data) {
            let lastTime = "";
            if (data.length) {
                data.sort((a, b) => {
                    return (
                        this.timeDifference(a.endTime) -
                        this.timeDifference(b.endTime)
                    );
                });
                lastTime = data[data.length - 1].endTime;
            }

            localStorage.timelineContentLastTime = lastTime;
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

            let timelineCopyDataList = localStorage.timelineCopyDataList
                ? JSON.parse(localStorage.timelineCopyDataList)
                : [];

            timelineCopyDataList.push(obj);

            localStorage.timelineCopyDataList = JSON.stringify(
                timelineCopyDataList
            );

            this.$message.success("复制成功, 请在剪贴板查看~");
            this.showCheckbox = false;
        },
    },
    components: {
        Draggable,
        GameSetting,
        CopyContent,
    },
    beforeDestroy() {
        eventBus.$off("setScreenLayoutData");
    },
};
</script>
