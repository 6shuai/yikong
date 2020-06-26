<template>
    <el-scrollbar class="clearfix" style="height: 100%" onselectstart="return false">
        <!-- 工具栏 -->
        <div class="tool-warp clearfix">
            <div class="slider">
                <el-slider
                    v-model="interval"
                    @change="changeInterval"
                    :step="5"
                    :min="1"
                    :max="30">
                </el-slider>
            </div>
            <el-button 
                class="save-btn" 
                icon="el-icon-upload2" 
                type="info" 
                size="small"
                :loading="pubLoading"
                @click="PubTerminal"
            >发布到终端
            </el-button>
            <el-button 
                class="save-btn" 
                icon="el-icon-folder-checked" 
                type="info" 
                size="small"
                :loading="saveLoading"
                :disabled="!timelineIsUpdate"
                @click="saveTimeline"
            >保存
            </el-button>
        </div>

        <div class="axis-left">
            <div class="title time">{{startTime}} - {{endTime}}</div>
            <div class="title" v-for="(item, index) in screenLayout" :key="index">{{item.displayName}}</div>
        </div>

        <div class="axis-right"  :style="{height: 70 * screenLayout.length + 30 +'px'}">
            <div ref="personWrap" class="right-content">
                <div ref="timeline" class="timeline-wrap" :style="{width: timelineWidth +'px'}">
                    <div class="time-wrap">
                        <div class="time-item" 
                            v-for="(item, index) in timeArr" 
                            :style="{width: index+1==timeArr.length ? lastWidth + 'px' : ''}"
                            :key="index">
                            {{item.h + ':'+ item.m}}
                        </div>
                    </div>
                </div>
            </div>

            <div class="screen-content-wrap" ref="screenWrap" :style="{width: timelineWidth +'px'}">

                <!-- 标尺 -->
                <div class="ruler ruler-left" ref="rulerLeft" :style="{height: (70*screenLayout.length+80)+'px'}">
                    <div class="triangleDiv"></div>
                    <div class="time">
                        <span 
                            :class="$refs.rulerLeft && $refs.rulerLeft.style.left.split('px')[0] <= 60 ? '' : 'left'" 
                        >{{rulerStartTime}}</span>
                    </div>
                </div>
                <div class="ruler ruler-right" ref="rulerRight">
                    <div class="triangleDiv"></div>
                    <div class="time">
                        <span 
                            :class="Number($refs.rulerRight && $refs.rulerRight.style.left.split('px')[0]) + 50 >= timelineWidth ? 'right' : ''" 
                        >{{rulerEndTime}}</span>
                    </div>
                </div>
                
                <div
                    class="screen-item-wrap"
                    v-for="(item, Pindex) in screenLayout"
                    :key="Pindex"
                >
                    <div 
                        class="screen-item" 
                        @dragover="dragover($event, Pindex)" 
                        @dragleave="dragleave($event)"
                        @drop="drop($event, Pindex)"
                        :class="screenIndex==Pindex ? 'drag-current' : ''"
                    >
                        <vue-draggable-resizable
                            v-for="(item, index) in rectangleData[Pindex]"
                            :key="index"
                            :ref="`${Pindex}content${index}`"
                            :title="`【${item.displayName}】`"
                            :w="item.w"
                            :h="60"
                            :x="item.x"
                            :min-width="2"
                            :parent="true"
                            :debug="false"
                            :handles="['mr','ml']"
                            @activated="activated(item, Pindex, index)"
                            @deactivated="deactivated"
                            @dragging="onDrag(arguments, Pindex, index)"
                            @dragstop="onDragStop(arguments, Pindex, index)"
                            @resizing="onResize(arguments, Pindex, index)"
                            @resizestop="onResizestop(arguments, Pindex, index)"
                            :class="item.contentTypeId==1 ? 'image' : (item.contentTypeId == 2 ? 'video' : 'game')"
                            class="rectangle">
                            <el-popover
                                popper-class="screen-tool-popover"
                                placement="right"
                                trigger="hover">
                                <div class="content-tool">
                                    <div class="time-frame">{{item.beginTime}}-{{item.endTime}}</div>
                                    <div @click="editTimeBtn(Pindex, index)">编辑时段</div>
                                    <div class="delete" @click="deleteCurrentTimeline(Pindex, index, item.id)">删除</div>
                                </div>

                                <div class="content" slot="reference" @click="selectedCurrentTimeline(item, Pindex)">
                                    <div class="image-wrap" v-if="item.contentTypeId != 4">
                                        <img :src="item.image">
                                    </div>
                                    <!-- 图集 -->
                                    <div class="image-wrap atlas" v-if="item.contentTypeId == 4">
                                        <img 
                                            v-for="img in item.subContentsData" 
                                            v-if="img.contentType==1" 
                                            :key="img.contentPath" 
                                            :src="img.contentPath"
                                        >
                                    </div>
                                    <div class="overflow name">
                                        {{item.displayName}}
                                        <time>{{item.beginTime}} - {{item.endTime}}</time>
                                    </div>

                                    <!-- 在这个时间段播放了多少次 -->
                                    <div class="play-count" v-if="item.contentTypeId == 2 || item.contentTypeId == 4">
                                        x{{Math.ceil(timeDifference(item.beginTime, item.endTime, 'second') / item.contentDuration)}}
                                    </div>
                                </div>
                            </el-popover>
                        </vue-draggable-resizable>
                    </div>
                </div>

            </div>
        </div>

        <!-- 时间轴内容 编辑时段 -->
        <el-dialog
            width="500px"
            title="编辑时段"
            :visible.sync="showEditTime"
            append-to-body>
            <el-form 
                label-width="80px"
            >
                <el-form-item label="开始时间" class="is-required">
                    <el-time-picker
                        v-model="editTime.beginTime"
                        format="HH:mm:ss"
                        value-format="HH:mm:ss"
                        placeholder="选择开始时间">
                    </el-time-picker>
                </el-form-item>
                <el-form-item label="时长" class="is-required">
                    <el-input 
                        style="width: 220px"
                        v-model="editTime.duration" 
                        type="number">
                        <template slot="append">秒</template>
                    </el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="showEditTime = false">取 消</el-button>
                <el-button type="primary" @click="updateContentTime">确 定</el-button>
            </span>
        </el-dialog>

    </el-scrollbar>
</template>

<script>
import VueDraggableResizable from 'vue-draggable-resizable-gorkys';
import 'vue-draggable-resizable-gorkys/dist/VueDraggableResizable.css';
import BScroll from 'better-scroll';
import { mapState } from 'vuex';
import { timelineCreated, timelineList, timelineDelete, pubToScreen } from '@/api/timeline';
export default {
    props: ['startTime', 'endTime'],
    data(){
        return{
            startHour: 8,                       //时间轴开始时间  小时
            startMinute: 31,                    //时间轴开始时间  分钟
            screenData: [],
            timeArr: [],
            rectangleData: [],                 
            copyRectangleData: [],             //rectangleData 拷贝，矩形激活时赋值， 拖拽重叠时好撤回操作
            rulerStartTime: '',                //标尺左侧显示的时间
            rulerEndTime: '',                  //标尺右侧显示的时间
            rulerStartX: null,                 //标尺左侧 x轴的距离 
            timelineLeftDistance: 100,         //时间轴距离左边屏幕的距离 px
            screenIndex: -1,                   //拖拽资源 在哪块屏幕上                 
            interval: 5,                      //时间线间隔  默认 20分钟
            timelineWidth: 0,                  //时间轴的宽度
            screenLayout: [],                  //屏幕布局数据
            currentActivate: {},               //当前激活的矩形数据
            totalMinute: 0,                    //开始时间 到 结束时间 总共多少刻度
            lastWidth: 100,                    //最后一个时间刻度的宽度
            saveLoading: false,                //保存按钮loading
            pubLoading: false,                 //发布按钮loading
            timelineIsUpdate: false,           //是否更新过时间轴  修改过就可以点击保存  
            showEditTime: false,               //显示内容编辑时段
            editTime: {},                      //编辑内容时段 参数
        }
    },
    computed: {
        ...mapState({
            dragData: state => state.timeline.dragData
        })
    },
    mounted() {
        this.personScroll();
        eventBus.$on('contentDragend', () => {　
            this.deactivated();
        })
        eventBus.$on('setScreenLayoutData', (data) => {
            let copyData = JSON.parse(JSON.stringify(data.data));
            this.screenLayout = copyData;
            if(data.type === 'update'){
                this.updateScreen(copyData);
            }else{
                this.initTimelineList();
            }
        })

        // 加载时间线  10  
        this.computedTime(this.interval, this.timeDifference(this.startTime, this.endTime));
    },
    methods: {
        //计算时间差（相差分钟）
        // var beginTime="08:31:00";
        // var endTime="21:50:00";
        timeDifference(beginTime, endTime, type){ 
            var start1 = beginTime.split(":");
            var startAll = parseInt(start1[0]*60) + parseInt(start1[1]);

            this.startHour = parseInt(start1[0]);
            this.startMinute = parseInt(start1[1]);
            
            var end1 = endTime.split(":");
            var endAll = parseInt(end1[0]*60) + parseInt(end1[1]);
            
            let minute = endAll - startAll;
            if(!type){
                return minute;
            }else{
                return minute * 60 - (parseInt(start1[2]) -  parseInt(end1[2]))
            }
        },


        //时间线 所有的时间点
        computedTime(num, len){
            this.totalMinute = Math.ceil(len / num);
            this.timeArr = [];
            for(let i = 0; i < this.totalMinute ; i++){
                // this.startHour + ':' + this.startMinute
                this.timeArr.push({
                    carve: this.startMinute % num === 0 ? true : false,
                    h: this.startHour < 10 ? '0' + this.startHour : this.startHour,
                    m: this.startMinute < 10 ? '0' + this.startMinute : this.startMinute,
                    start: i*100,
                    end: (i+1)*100
                });

                if(this.totalMinute == i+1){
                    // 最后一个时间点与  真正的时间点相差 是否少于 this.interval  时间线间隔  100 10 20
                    // 如果小于时间线间隔  最后的 class time-item  宽度要按照 m / this.interval * 100
                    let differM = this.timeDifference(this.timeArr[i].h + ':' + this.timeArr[i].m, this.endTime);
                    this.lastWidth = differM / this.interval * 100;
                    
                }
                
                if(this.startMinute + num >= 60){
                    this.startMinute = this.startMinute + num - 60;
                    this.startHour = this.startHour + 1;
                }else{
                    this.startMinute += num;
                }
            }

            //时间轴的宽度
            this.$nextTick(() => {
                this.timelineWidth = (this.totalMinute - 1) * 100 + this.lastWidth;
            })
            
        },

        //点击时间轴 矩形  激活时  显示标尺线
        activated(data, Pindex, index){
            this.copyRectangleData = JSON.parse(JSON.stringify(this.rectangleData[Pindex]));
            if(this.$refs.rulerLeft) this.$refs.rulerLeft.style.display = 'block';
            if(this.$refs.rulerRight) this.$refs.rulerRight.style.display = 'block';
            this.rulerPosition(data.x, data.x + data.w, Pindex, index, data.beginTime, data.endTime);
        },

        //时间轴矩形停用时  隐藏标尺线
        deactivated(){
            if(this.$refs.rulerLeft) this.$refs.rulerLeft.style.display = 'none';
            if(this.$refs.rulerRight) this.$refs.rulerRight.style.display = 'none';
        },

        //改变位置时触发 data【0】x轴距离，  data【1】 y轴距离
        onDrag(data, Pindex, index){
            let obj = this.rectangleData[Pindex][index];
            this.rectangleData[Pindex][index] = {
                ...obj,
                x: data[0],
                y: data[1]
            }
            let rulerRight = data[0] + obj.w;
            this.rulerPosition(data[0], rulerRight, Pindex, index);
            // this.copyRectangleData = JSON.parse(JSON.stringify(this.rectangleData[Pindex]));
            this.timelineIsUpdate = true;
        },

        //改变位置结束时  触发
        onDragStop(data, Pindex, index){
            this.onResizestop(data, Pindex, index);
        },

        //调整组件大小时触发  data[x, y, width, height]
        onResize(data, Pindex, index){
            let obj = this.rectangleData[Pindex][index];
            let p = {
                ...obj,
                x: data[0],
                y: data[1],
                w: data[2],
                h: data[3]
            }
            this.$set(this.rectangleData[Pindex], index, p);
            let rulerRight = data[0] + obj.w;
            this.rulerPosition(data[0], rulerRight, Pindex, index);
        },

        //调整大小结束时触发
        onResizestop(data, Pindex, index){
            let p = this.rectangleData[Pindex][index];
            let copyData = this.copyRectangleData;
            this.timelineIsUpdate = true;
            // 调整大小时不能覆盖其他的 内容矩形,  发生覆盖时 会把激活时的拷贝数据覆盖在rectangleData
            if(!this.searchOverlap(p.x, parseInt(p.x) + parseInt(p.w), Pindex, index+1)){
                this.$set(this.rectangleData, Pindex, copyData);
                this.$nextTick(() => {
                    this.copyRectangleData = JSON.parse(JSON.stringify(this.rectangleData[Pindex]));
                    this.rulerPosition(copyData[index].x, copyData[index].x+copyData[index].w, Pindex, index, copyData.beginTime, copyData.endTime);
                })
            }else{
                this.copyRectangleData = JSON.parse(JSON.stringify(this.rectangleData[Pindex]));
            }
        },

        //标尺位置
        rulerPosition(left, right, Pindex, index, beginTime, endTime){

            //标尺左右的位置
            this.$refs.rulerLeft.style.left = left + 'px';
            if(right) this.$refs.rulerRight.style.left = right + 'px';

            //有开始时间和结束时间  就不用按位置去计算
            if(beginTime && endTime){
                this.rulerStartTime = beginTime;
                this.rulerEndTime = endTime;
            }else{
                // 第几个刻度的位置上 index
                let lTimeIndex = left <=0 ? 0 : this.scalePositionIndex(left);
    
                // left 划过的位置 百分比
                let percentL = left - lTimeIndex * 100;
    
                //秒
                let startS = this.addPreZero(parseInt(left / (100 / this.interval / 60) % 60));
                //left 显示的时间  开始时间 小时 + 分钟
                let startTime = this.rulerShowTime(lTimeIndex, percentL <= 0 ? 0 : this.percentIndex(percentL) || 0, startS);
    
                this.rulerStartX = left;
                this.rulerStartTime = startTime.h + ':' + startTime.m + ':' + startS;
    
                //right 没有值时，是拖拽时  只显示左侧开始时间   宽度默认资源的时长 ， 没有时长 默认60秒
                let rightX = '';
                if(!right){
                    rightX = left + ((this.dragData.duration ? this.dragData.duration : 60) / 60) / this.interval * 100;
                }
    
                // 第几个刻度的位置上 index
                let rTimeIndex = this.scalePositionIndex(right || rightX);
    
                // right 划过的位置 百分比
                let percentR = (right || rightX) - rTimeIndex * 100;
    
                //right 显示的时间  开始时间 小时 + 分钟
                let rightTime = this.rulerShowTime(rTimeIndex, this.percentIndex(percentR));
                //秒
                let endS = this.addPreZero(parseInt((right ? right : rightX) / (100 / this.interval / 60) % 60));
                this.rulerEndTime = rightTime.h + ':' + rightTime.m + ':' + endS;
            }


            if(right){
                this.rectangleData[Pindex][index] = {
                    ...this.rectangleData[Pindex][index],
                    beginTime: this.rulerStartTime,
                    endTime: this.rulerEndTime,
                    duration: this.timeDifference(this.rulerStartTime, this.rulerEndTime, 'second')
                }
            }
        },

        //获取刻度位置下标
        scalePositionIndex(num){
            for(let j = 0; j < this.totalMinute; j++){
                if(num >= j * 100 && num < j * 100 +100){
                    return j;
                }
            }
        },

        //获取当前刻度位置的 百分比 位置 
        // 例 百分比里有20分钟， 1-5 为1分钟  6-10 为2分钟
        percentIndex(num){
            var n = Number((100 / this.interval).toFixed(2));
            for(let i = 0; i < this.interval; i++){
                if(num >= i * n - 1  && num <= Math.ceil(i * n - 1 + n)){
                    return i;
                }
            }
        },

        //标尺上显示的时间  timeLineIndex时间刻度的下标，  index在这个刻度里的百分比位置
        rulerShowTime(timeLineIndex, index){
            if(timeLineIndex == undefined) {
                return{
                    h: this.endTime.split(':')[0],
                    m: this.endTime.split(':')[1],
                }
            }
            let obj = this.timeArr[timeLineIndex];
            let m = '';
            let h = obj.h;
            if(Number(obj.m) + index >= 60){
                m = this.addPreZero(Number(obj.m) + index - 60);
                h = this.addPreZero(Number(obj.h) + 1);
            }else{
                m = this.addPreZero(Number(obj.m) + index)
            }
            return {
                h,
                m
            };
        },

        //小于10 前面补个0
        addPreZero(number){
            number = number < 0 ? number=0 : number;
            return number < 10 ? '0' + number : number;
        },

        //better scroll 横向滑动
        personScroll() {
            let _this = this;
            this.$nextTick(() => {
                if (!this.axisScroll) {
                    this.axisScroll = new BScroll(this.$refs.personWrap, {
                        startX: 0,
                        click: true,
                        scrollX: true,
                        scrollY: false,
                        eventPassthrough: "vertical",
                        bounce: false,
                        probeType: 3
                    });
                    //时间线滑动时  下方屏幕信息跟随滑动
                    this.axisScroll.on('scroll', (pos) => {
                        if(_this.$refs.screenWrap) _this.$refs.screenWrap.style.cssText = _this.$refs.timeline.style.cssText;
                        try {
                            let s = _this.$refs.screenWrap.style.transform;
                            this.timelineLeftDistance = Number(s.split('translate(')[1].split('px,')[0]) + 100;
                        } catch (error) {
                            this.timelineLeftDistance = 100;
                        }
                    })

                    //时间线滑动停止
                    this.axisScroll.on('scrollEnd', (pos) => {
                        if(_this.$refs.screenWrap) _this.$refs.screenWrap.style.cssText = _this.$refs.timeline.style.cssText;
                        try {
                            let s = _this.$refs.screenWrap.style.transform;
                            this.timelineLeftDistance = Number(s.split('translate(')[1].split('px,')[0]) + 100;
                        } catch (error) {
                            this.timelineLeftDistance = 100;
                        }
                    })

                } else {
                    this.axisScroll.refresh();
                }
            });
        },

        //在目标元素内进行拖动时触发的函数
        dragover(event, value){
            event.preventDefault();
            //拖拽在当前屏幕 下标 
            this.screenIndex = value;
            //显示开始时间标尺
            this.$refs.rulerLeft.style.display = 'block';  
            this.rulerPosition(parseInt(event.clientX) - this.timelineLeftDistance -10 < 0 ? 0: parseInt(event.clientX) - this.timelineLeftDistance -10);
            
        },

        //鼠标离开目标元素时  screenIndex = -1
        dragleave(){
            this.screenIndex = -1;
        },

        //放置被拖数据时
        drop(data, Pindex){
            //放置资源时  防止重叠   
            //rulerStartX x轴距离   x+100 拖拽时矩形默认宽度 100px
            if(this.searchOverlap(this.rulerStartX, this.rulerStartX+100, Pindex)){
                this.dragData.contentId = this.dragData.id;
                this.dragData.duration = this.dragData.duration ? this.dragData.duration : 60;
                delete this.dragData.id;
                this.selectedCurrentTimeline(this.dragData, Pindex);
                this.timelineIsUpdate = true;
                let obj = {
                    ...this.dragData,
                    x: this.rulerStartX,
                    // this.timelineWidth 总宽度， 最后一个的宽度小于100 时 => 总宽度 - x轴位置
                    w: (this.dragData.duration / 60) / this.interval * 100,
                    beginTime: this.rulerStartTime,
                    endTime: this.rulerEndTime,
                    logicRegion: this.screenLayout[Pindex].id, 
                    contentDuration: this.dragData.duration,
                    duration: this.dragData.duration //this.timeDifference(this.rulerStartTime, this.rulerEndTime, 'second')
                }
                if(this.rectangleData[Pindex] && this.rectangleData[Pindex].length){
                    this.rectangleData[Pindex].push(obj);
                }else{
                    this.rectangleData[Pindex] = [obj];
                }
                this.$nextTick(() => {
                    this.rulerPosition(obj.x, obj.x + obj.w, Pindex, this.rectangleData[Pindex].length-1);
                })
            }
            this.deactivated();
            this.screenIndex = -1;
        },

        //查询是否有重叠
        //_index 是已添加到时间轴  拖拽宽度时不能重叠， 循环时过滤自己
        searchOverlap(x, xw, Pindex, _index){
            let handle = true;
            if(this.rectangleData[Pindex] && this.rectangleData[Pindex].length){
                this.rectangleData[Pindex].forEach((item, index) => {
                    if(_index && index == _index-1) return false;
                    // console.log((item.x <= x && (item.x + item.w) >= x) , (item.x <= xw && (item.x + item.w) >= xw))
                    //x 轴位置在这个矩形里，                                // 矩形右边的点在这个矩形里                  x 位置在矩形里或前面， x右位置在矩形里面或后面

                    if(handle && ((item.x < x && (item.x + item.w) > x) || (item.x < xw && (item.x + item.w) > xw) || (item.x > x && xw > item.x +item.w))){
                        // 拖放误差20像素内
                        if((item.x < x && (item.x + item.w) > x) && item.x + item.w - x < 20){
                            if(!_index){
                                this.rulerStartX = x + (item.x + item.w - x);
                            }else{
                                let s = this.rectangleData[Pindex][_index-1]; 
                                
                                //x先加一  再减一， 要不然数据不变化 ==
                                s.x = x + (item.x + item.w - x) + 1;
                                this.$set(this.rectangleData[Pindex], _index-1, s);
                                this.$nextTick(() =>{
                                    s.x = x + (item.x + item.w - x);
                                    this.$set(this.rectangleData[Pindex], _index-1, s);
                                    //左右标尺位置
                                    this.rulerPosition(s.x, s.x+s.w, Pindex, _index-1);
                                })
                            }
                            return
                        }
                        handle = false;
                        this.$message.warning('资源不能重叠(..•˘_˘•..)');
                    }
                    
                })
            }
            return handle;
        },

        //保存时间轴
        saveTimeline(){
            let data = [];
            this.rectangleData.forEach((item, index) => {
                for(let i = 0; i < item.length; i++){
                    data.push({
                        id: item[i].id ? item[i].id : null,
                        logicRegion: this.screenLayout[index].id,
                        contentId: item[i].contentId,
                        beginTime: '1970-01-01 ' + item[i].beginTime,
                        duration: item[i].duration
                    })
                }
            })

            if(!data.length){
                this.$message.warning('时间轴上还没有内容( ∙̆ .̯ ∙̆ )');
                return
            }
            this.saveLoading = true;
            timelineCreated(data).then(res => {
                this.saveLoading = false;
                if(res.code == this.$successCode){
                    this.$message.success('保存成功~');
                    this.$nextTick(() => {
                        this.rectangleData = [];
                        this.initTimelineList();
                        this.timelineIsUpdate = false;
                    })
                }
            })
        },

        //根据逻辑区域ID查询时间轴集合
        initTimelineList(){
            for(let i = 0; i < this.screenLayout.length; i++){
                var item = this.screenLayout[i];
                timelineList(item.id).then(res => {
                    this.$emit('updateScreen', res.obj[0], i);
                    let data = [];
                    if(res.obj && res.obj.length){
                        res.obj.forEach((item, i) => {

                            data.push({
                                ...item,
                                beginTime: item.beginTime,
                                endTime: item.endTime,
                                displayName: item.contentName,
                                x: this.findXPosition(item.beginTime),
                                w: (item.duration / 60) / this.interval * 100
                            })
                        })
                    }
                    this.$set(this.rectangleData, i, data);
                })
            }
        },


        //根据开始时间 查找资源 x 轴所在的位置
        findXPosition(time){
            let h = time.split(':')[0];
            let m = time.split(':')[1];
            let start1 = time.split(":");
            if(m == '00') m = 60;

            let s = this.timeArr;
            for(let i = 0; i < s.length; i++){
                if(
                    h >= s[i].h && 
                    (i+2 <= this.timeArr.length && h <= s[i+1].h) && 
                    m >= s[i].m 
                ){
                    return s[i].start + this.timeDifference(s[i].h+':'+s[i].m, time) * (100 / this.interval) + (100 / 60 / this.interval) * parseInt(start1[2])
                }
            }
        },

        //删除时间轴  资源
        deleteCurrentTimeline(Pindex, index, id){
            
            this.$confirm(`此操将删除资源【${this.rectangleData[Pindex][index].displayName}】, 是否继续?`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                if(id){
                    timelineDelete(id).then(res => {
                        if(res.code === this.$successCode){
                            this.$message.success('删除成功~');
                            this.rectangleData[Pindex].splice(index, 1);
                            this.$nextTick(() => {
                                this.selectedCurrentTimeline(this.rectangleData[Pindex][0] ? this.rectangleData[Pindex][0] : {}, Pindex);
                            })
                        }
                        this.deactivated();
                    })
                }else{
                    this.rectangleData[Pindex].splice(index, 1);
                    let obj = this.rectangleData;
                    this.rectangleData = [];
                    this.rectangleData = obj;
                    this.deactivated();
                    this.$nextTick(() => {
                        this.selectedCurrentTimeline(this.rectangleData[Pindex][0] ? this.rectangleData[Pindex][0] : {}, Pindex);
                    })
                }
            }).catch(() => {     
            });
        },

        //更新屏幕布局 模块
        updateScreen(data){
            let arr = [];

            let newRectangleData = [];
            for(var i = 0; i < data.length; i++){
                newRectangleData.push([]);
                arr.push(data[i]);
                for(var j = 0; j < this.rectangleData.length; j++){
                    if(this.rectangleData[j][0] && this.rectangleData[j][0].logicRegion == data[i].id){
                        newRectangleData[i] = this.rectangleData[j];
                        arr[i] = {
                            ...this.rectangleData[j][0],
                            ...data[i]
                        }
                    }
                }
            }

            this.rectangleData = newRectangleData;
            this.$emit('updateScreen', arr);
        },

        //选中时间轴里的 资源
        selectedCurrentTimeline(data, Pindex){
            let copyData = JSON.parse(JSON.stringify(data));
            delete copyData.x;
            delete copyData.displayName;
            this.$emit('updateScreen', copyData, Pindex);
            this.setCurrentActivate(data, Pindex);
        },

        //设置当前激活的矩形数据
        setCurrentActivate(data, Pindex){
            this.currentActivate = {
                ...data,
                Pindex
            }
        },


        //修改时间线 间隔
        changeInterval(val){
            this.computedTime(this.interval, this.timeDifference(this.startTime, this.endTime));
            let data = [];
            for(var i = 0; i < this.rectangleData.length; i++){
                data.push([]);
                for(var j = 0; j < this.rectangleData[i].length; j++){
                    var obj = this.rectangleData[i][j];
                    let sTime = obj.beginTime;
                    let m = 0;      //开始到结束的 间隔 分钟
                    if(obj.duration && !obj.endTime){
                        m = obj.duration;
                    }else{
                        m = this.timeDifference(obj.beginTime, obj.endTime, 'second');
                    }

                    data[i].push({
                        ...this.rectangleData[i][j],
                        x: this.findXPosition(obj.beginTime),
                        w: (m / 60) / this.interval * 100
                    })
                }
            }
            this.rectangleData = [];
            this.$nextTick(() => {
                this.rectangleData = data;
            })
            
        },

        //发布到终端
        PubTerminal(){
            let data = `?containerId=${this.$route.params.id}`;
            this.pubLoading = true;
            pubToScreen(data).then(res => {
                this.pubLoading = false;
                if(res.code === this.$successCode){
                    this.$message.success(res.message);
                }
            })
        },

        //点击编辑时段  显示弹窗
        editTimeBtn(Pindex, index){
            this.editTime = {
                Pindex,
                index,
                ...this.rectangleData[Pindex][index]
            }
            this.showEditTime = true;
        },

        //编辑内容时段
        updateContentTime(){
            let data = this.editTime;
            let obj = JSON.parse(JSON.stringify(this.rectangleData[data.Pindex][data.index]));
            obj.beginTime = data.beginTime;
            obj.x = this.findXPosition(data.beginTime);
            obj.w = (data.duration / 60) / this.interval * 100;
            obj.duration = data.duration;
            this.rulerPosition(obj.x, obj.x + obj.w, data.Pindex, data.index);
            this.$nextTick(() => {
                if(this.searchOverlap(obj.x, obj.x + obj.w, data.Pindex, data.index+1)){
                    obj.endTime = this.rulerEndTime;
                    this.$set(this.rectangleData[data.Pindex], data.index, obj);
                    this.showEditTime = false;
                    this.timelineIsUpdate = true;
                }
            })
        }
        
    },
    components: {
        VueDraggableResizable
    },
    beforeDestroy () {
        eventBus.$off('setScreenLayoutData');
    },
}

</script>
<style lang="scss" scope>
.widget-form-list {
    .ghost {
        display: none;
    }
}
</style>