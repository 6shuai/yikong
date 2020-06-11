<template>
    <el-scrollbar class="clearfix" style="height: 100%" onselectstart="return false">
        <!-- 工具栏 -->
        <div class="tool-warp clearfix">
            <div class="slider">
                <el-slider
                    v-model="interval"
                    @change="changeInterval"
                    :step="5"
                    :min="5"
                    :max="30"
                    show-stops>
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
                <div ref="timeline" class="timeline-wrap" :style="{width: (totalMinute - 1) * 100 + lastWidth +'px'}">
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

            <div class="screen-content-wrap" ref="screenWrap" :style="{width: (totalMinute - 1) * 100 + lastWidth+'px'}">

                <!-- 标尺 -->
                <div class="ruler ruler-left" ref="rulerLeft" :style="{height: (70*screenLayout.length+80)+'px'}">
                    <div class="time">
                        <span 
                            :class="$refs.rulerLeft && $refs.rulerLeft.style.left.split('px')[0] <= 40 ? '' : 'left'" 
                        >{{rulerStartTime}}</span>
                    </div>
                </div>
                <div class="ruler ruler-right" ref="rulerRight">
                    <div class="time">
                        <span 
                            :class="Number($refs.rulerRight && $refs.rulerRight.style.left.split('px')[0]) + 50 >= (totalMinute - 1) * 100 + lastWidth ? 'right' : ''" 
                        >{{rulerEndTime}}</span>
                    </div>
                </div>
                
                <div
                    class="screen-item-wrap"
                    v-for="(item, sIndex) in screenLayout"
                    :key="sIndex"
                >
                    <div 
                        class="screen-item" 
                        @dragover="dragover($event, sIndex)" 
                        @dragleave="dragleave($event)"
                        @drop="drop($event, sIndex)"
                        :class="screenIndex==sIndex ? 'drag-current' : ''"
                    >
                        <vue-draggable-resizable
                            v-for="(item, index) in rectangleData[sIndex]"
                            :key="index"
                            :title="`【${item.displayName}】`"
                            :w="item.w"
                            :h="60"
                            :x="item.x"
                            :min-width="10"
                            :parent="true"
                            :debug="false"
                            :isConflictCheck="true"
                            :handles="['mr','ml']"
                            @activated="activated(sIndex)"
                            @deactivated="deactivated"
                            @dragging="onDrag(arguments, sIndex, index)"
                            @dragstop="onDrag(arguments, sIndex, index)"
                            @resizing="onResize(arguments, sIndex, index)"
                            @resizestop="onResizestop(arguments, sIndex, index)"
                            :class="item.contentTypeId==1 ? 'image' : (item.contentTypeId == 2 ? 'video' : 'game')"
                            class="rectangle">
                            <div class="content" @click="selectedCurrentTimeline(item, sIndex)">
                                <div class="image-wrap">
                                    <img :src="item.image">
                                </div>
                                <div class="overflow name">
                                    {{item.displayName}}{{item.x}}
                                    <time>{{item.beginTime}} - {{item.endTime}}</time>
                                </div>
                                <div class="delete" @click="deleteCurrentTimeline(sIndex, index, item.id)">删除</div>
                                <!-- 在这个时间段播放了多少次 -->
                                <div class="play-count" v-if="item.contentTypeId == 2">x{{Math.ceil(timeDifference(item.beginTime, item.endTime) * 60 / item.contentDuration)}}</div>
                            </div>
                        </vue-draggable-resizable>
                    </div>
                </div>

            </div>

        </div>

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
            rectangleData: [
                // {
                //     w: 100,
                //     x: 0
                // },
                // {
                //     w: 100,
                //     x: 100
                // }
            ],
            copyRectangleData: [],             //rectangleData 拷贝，矩形激活时赋值， 拖拽重叠时好撤回操作
            rulerStartTime: '',                //标尺左侧显示的时间
            rulerEndTime: '',                  //标尺右侧显示的时间
            rulerStartX: null,                 //标尺左侧 x轴的距离 
            timelineLeftDistance: 100,         //时间轴距离左边屏幕的距离 px
            screenIndex: -1,                   //拖拽资源 在哪块屏幕上                 
            interval: 20,                      //时间线间隔  默认 20分钟
            screenLayout: [],                  //屏幕布局数据
            currentActivate: {},               //当前激活的矩形数据
            totalMinute: 0,                    //开始时间 到 结束时间 总共多少刻度
            lastWidth: 100,                    //最后一个时间刻度的宽度
            saveLoading: false,                //保存按钮loading
            pubLoading: false,                 //发布按钮loading
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
            this.screenLayout = data.data;
            if(data.type === 'update'){
                this.updateScreen(data.data);
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
        timeDifference(beginTime, endTime){ 
            var start1 = beginTime.split(":");
            var startAll = parseInt(start1[0]*60) + parseInt(start1[1]);

            this.startHour = parseInt(start1[0]);
            this.startMinute = parseInt(start1[1]);
            
            var end1 = endTime.split(":");
            var endAll = parseInt(end1[0]*60) + parseInt(end1[1]);
            
            return endAll - startAll;
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
            
        },

        //点击时间轴 矩形  激活时  显示标尺线
        activated(sIndex){
            this.copyRectangleData = JSON.parse(JSON.stringify(this.rectangleData[sIndex]));
            if(this.$refs.rulerLeft) this.$refs.rulerLeft.style.display = 'block';
            if(this.$refs.rulerRight) this.$refs.rulerRight.style.display = 'block';
        },

        //时间轴矩形停用时  隐藏标尺线
        deactivated(){
            if(this.$refs.rulerLeft) this.$refs.rulerLeft.style.display = 'none';
            if(this.$refs.rulerRight) this.$refs.rulerRight.style.display = 'none';
        },

        //改变位置时触发 data【0】x轴距离，  data【1】 y轴距离
        onDrag(data, sIndex, index){
            this.rectangleData[sIndex][index] = {
                ...this.rectangleData[sIndex][index],
                x: data[0],
                y: data[1]
            }
            let rulerRight = data[0] + this.rectangleData[sIndex][index].w;
            this.rulerPosition(data[0], rulerRight, sIndex, index);
            this.copyRectangleData = JSON.parse(JSON.stringify(this.rectangleData[sIndex]));
        },

        //调整组件大小时触发  data[x, y, width, height]
        onResize(data, sIndex, index){
            let p = {
                ...this.rectangleData[sIndex][index],
                x: data[0],
                y: data[1],
                w: data[2],
                h: data[3]
            }
            this.$set(this.rectangleData[sIndex], index, p);
            let rulerRight = data[0] + this.rectangleData[sIndex][index].w;
            this.rulerPosition(data[0], rulerRight, sIndex, index);
        },

        //调整大小结束时触发
        onResizestop(data, sIndex, index){
            let p = this.rectangleData[sIndex][index];
            let copyData = this.copyRectangleData;
            console.log('调整大小结束时触发')
            // 调整大小时不能覆盖其他的 内容矩形,  发生覆盖时 会把激活时的拷贝数据覆盖在rectangleData
            if(!this.searchOverlap(p.x, parseInt(p.x) + parseInt(p.w), sIndex, index+1)){
                this.$set(this.rectangleData, sIndex, copyData);
                this.$nextTick(() => {
                    this.copyRectangleData = JSON.parse(JSON.stringify(this.rectangleData[sIndex]));
                    this.rulerPosition(copyData[index].x, copyData[index].x+copyData[index].w, sIndex, index);
                })
            }else{
                this.copyRectangleData = JSON.parse(JSON.stringify(this.rectangleData[sIndex]));
            }
        },

        //标尺位置
        rulerPosition(left, right, sIndex, index){

            // 第几个刻度的位置上 index
            let lTimeIndex = left <=0 ? 0 : this.scalePositionIndex(left);

            // left 划过的位置 百分比
            let percentL = left - lTimeIndex * 100;

            //left 显示的时间  开始时间 小时 + 分钟
            let startTime = this.rulerShowTime(lTimeIndex, percentL <= 0 ? 0 : this.percentIndex(percentL) || 0);


            // console.log(this.timeArr[timeIndex].h, this.timeArr[timeIndex].m)
            this.$refs.rulerLeft.style.left = left + 'px';
            if(right) this.$refs.rulerRight.style.left = right + 'px';

            this.rulerStartX = left;
            this.rulerStartTime = startTime.h + ':' + startTime.m;

            //right 没有值时，是拖拽时只显示左侧开始时间   宽度默认100 ， left + 100 = right 结束的位置
            let rightX = '';
            if(!right){
                rightX = left + 100;
            }

            // 第几个刻度的位置上 index
            let rTimeIndex = this.scalePositionIndex(right || rightX);

            // right 划过的位置 百分比
            let percentR = (right || rightX) - rTimeIndex * 100;

            //right 显示的时间  开始时间 小时 + 分钟
            let rightTime = this.rulerShowTime(rTimeIndex, this.percentIndex(percentR));
            this.rulerEndTime = rightTime.h + ':' + rightTime.m;

            if(right){
                this.rectangleData[sIndex][index] = {
                    ...this.rectangleData[sIndex][index],
                    beginTime: this.rulerStartTime,
                    endTime: this.rulerEndTime,
                    duration: this.timeDifference(this.rulerStartTime, this.rulerEndTime)
                }
            }
        },

        //获取刻度位置下标
        scalePositionIndex(num){
            for(let j = 0; j < this.totalMinute; j++){
                if(num >= j * 100 && num <= j * 100 +100){
                    return j;
                }
            }
        },

        //获取当前刻度位置的 百分比 位置 
        // 例 百分比里有20分钟， 1-5 为1分钟  6-10 为2分钟
        percentIndex(num){
            var n = Number((100 / this.interval).toFixed(2));
            for(let i = 0; i < this.interval; i++){
                if(num >= i * n  && num <= Math.ceil(i * n + n)){
                    return i + 1;
                }
            }
        },

        //标尺上显示的时间  timeLineIndex时间刻度的下标，  index在这个刻度里的百分比位置
        rulerShowTime(timeLineIndex, index){
            let obj = this.timeArr[timeLineIndex];
            let m = '';
            let h = obj.h;
            if(obj.m + index >= 60){
                m = this.addPreZero(obj.m + index - 60);
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
            this.rulerPosition(parseInt(event.clientX) - this.timelineLeftDistance -10);
            
        },

        //鼠标离开目标元素时  screenIndex = -1
        dragleave(){
            this.screenIndex = -1;
        },

        //放置被拖数据时
        drop(data, sIndex){
            //放置资源时  防止重叠   
            //rulerStartX x轴距离   x+100 拖拽时矩形默认宽度 100px
            let l = parseInt(this.rulerStartX / 5);
            let beginTime = '';//this.timeArr[l].h + ':' + this.timeArr[l].m;
            let r = parseInt((this.rulerStartX + 100) / 5);
            let endTime = '';//this.timeArr[r].h + ':' + this.timeArr[r].m;

            if(this.searchOverlap(this.rulerStartX, this.rulerStartX+100, sIndex)){
                this.dragData.contentId = this.dragData.id;
                delete this.dragData.id;
                this.selectedCurrentTimeline(this.dragData, sIndex);
                if(this.rectangleData[sIndex] && this.rectangleData[sIndex].length){
                    this.rectangleData[sIndex].push({
                        ...this.dragData,
                        x: this.rulerStartX,
                        w: 100,
                        beginTime: this.rulerStartTime,
                        endTime: this.rulerEndTime,
                        logicRegion: this.screenLayout[sIndex].id, 
                        contentDuration: this.dragData.duration,
                        duration: this.timeDifference(this.rulerStartTime, this.rulerEndTime) * 60
                    })
                }else{
                    this.rectangleData[sIndex] = [{
                        ...this.dragData,
                        x: this.rulerStartX,
                        w: 100,
                        beginTime: this.rulerStartTime,
                        endTime: this.rulerEndTime,
                        logicRegion: this.screenLayout[sIndex].id, 
                        contentDuration: this.dragData.duration,
                        duration: this.timeDifference(this.rulerStartTime, this.rulerEndTime) * 60
                    }]
                }
            }
            this.deactivated();
            this.screenIndex = -1;
        },

        //查询是否有重叠
        //_index 是已添加到时间轴  拖拽宽度时不能重叠， 循环时过滤自己
        searchOverlap(x, xw, sIndex, _index){
            let handle = true;
            if(this.rectangleData[sIndex] && this.rectangleData[sIndex].length){
                this.rectangleData[sIndex].forEach((item, index) => {
                    if(_index && index == _index-1) return false;
                    // console.log((item.x <= x && (item.x + item.w) >= x) , (item.x <= xw && (item.x + item.w) >= xw))
                    //x 轴位置在这个矩形里，                                // 矩形右边的点在这个矩形里                  x 位置在矩形里或前面， x右位置在矩形里面或后面
                    if(handle && (item.x < x && (item.x + item.w) > x) || (item.x < xw && (item.x + item.w) > xw) || (item.x > x && xw > item.x +item.w)){
                        
                        // 拖放误差10像素内
                        if((item.x < x && (item.x + item.w) > x) && item.x + item.w - x < 10){
                            if(!_index){
                                this.rulerStartX = x + (item.x + item.w - x);
                            }else{
                                let s = this.rectangleData[sIndex][_index-1]; 
                                s.x = x + (item.x + item.w - x);
                                this.$set(this.rectangleData[sIndex], _index-1,  s);
                                //左右标尺位置
                                this.rulerPosition(s.x, s.x+s.w, sIndex, _index-1);
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
                        beginTime: '1970-01-01 ' + (item[i].beginTime.length > 5 ? item[i].beginTime : item[i].beginTime + ':00' ),
                        duration: this.timeDifference(item[i].beginTime, item[i].endTime) * 60
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
                            var i = item.beginTime.lastIndexOf(":");
                            let sTime = item.beginTime.substring(0, i);
                            let eTime = item.endTime.substring(0, i);

                            data.push({
                                ...item,
                                beginTime: sTime,
                                endTime: eTime,
                                displayName: item.contentName,
                                x: this.findXPosition(sTime),
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
            if(m == '00') m = 60;

            let s = this.timeArr;
            for(let i = 0; i < s.length; i++){
                if(
                    h >= s[i].h && 
                    (i+2 <= this.timeArr.length && h <= s[i+1].h) && 
                    m >= s[i].m 
                ){
                    return s[i].start + this.timeDifference(s[i].h+':'+s[i].m, time) * (100 / this.interval)
                }
            }

        },

        //删除时间轴  资源
        deleteCurrentTimeline(sIndex, index, id){
            if(id){
                this.$confirm(`此操将删除资源【${this.rectangleData[sIndex][index].displayName}】, 是否继续?`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    timelineDelete(id).then(res => {
                        if(res.code === this.$successCode){
                            this.$message.success('删除成功~');
                            this.rectangleData[sIndex].splice(index, 1);
                        }
                        this.deactivated();
                    })
                }).catch(() => {     
                });
            }else{
                this.rectangleData[sIndex].splice(index, 1);
                this.deactivated();
            }
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
        selectedCurrentTimeline(data, sIndex){
            let copyData = JSON.parse(JSON.stringify(data));
            delete copyData.x;
            delete copyData.displayName;
            this.$emit('updateScreen', copyData, sIndex);
            this.setCurrentActivate(data, sIndex);
        },

        //设置当前激活的矩形数据
        setCurrentActivate(data, sIndex){
            this.currentActivate = {
                ...data,
                sIndex
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
                    var index = obj.beginTime.lastIndexOf(":");
                    let sTime = obj.beginTime.substring(0, index);
                    let m = 0;      //开始到结束的 间隔 分钟
                    if(obj.duration && !obj.endTime){
                        m = obj.duration / 60;
                    }else{
                        m = this.timeDifference(obj.beginTime, obj.endTime);
                        sTime = obj.beginTime;
                    }

                    data[i].push({
                        ...this.rectangleData[i][j],
                        x: this.findXPosition(sTime),
                        w: m / this.interval * 100
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