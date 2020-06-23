<template>
    <div class="screen-layout">
        <el-scrollbar style="height:100%">
            <div class="toolbar">
                <el-button type="primary" size="mini" @click="addScreenDialog=true">添加</el-button>
                <el-button type="primary" size="mini" :disabled="!isUpdate" @click="sureCurrentLayout">保存</el-button>
                <el-button type="info" size="mini" :disabled="currentScreenIndex==-1" @click="deleteScreen">删除</el-button>
                <span>x：<el-input size="mini" :value="currentRectangle.x * ratio" @input="inputChange($event, 'x')" :min="0" :max="timeData.width" type="number"></el-input></span>
                <span>y：<el-input size="mini" :value="currentRectangle.y * ratio" @input="inputChange($event, 'y')" :min="0" :max="timeData.height" type="number"></el-input></span>
                <span>宽：<el-input size="mini" :value="currentRectangle.width * ratio" @input="inputChange($event, 'width')" :min="20" :max="timeData.width" type="number"></el-input></span>
                <span>高：<el-input size="mini" :value="currentRectangle.height * ratio" @input="inputChange($event, 'height')" :min="20" :max="timeData.height" type="number"></el-input></span>
                <!-- <span>层叠顺序：<el-input size="mini" v-model="currentRectangle.layer" :min="1" :max="99999" type="number"></el-input></span> -->
                <span>名称：<el-input size="mini" v-model="currentRectangle.displayName"></el-input></span>
                <span>是否轮播：
                    <el-switch
                        :active-value="1"
                        :inactive-value="0"
                        v-model="currentRectangle.isRotation">
                    </el-switch>
                </span>
            </div>

            <!-- 拖拽标题调整层次 -->
            <div class="change-hierarchy">
                <p class="explain">拖拽标题调整层次</p>
                <el-card 
                    class="box-card screen-list" 
                    :body-style="{ padding: '10px 5px' }"  
                    v-for="(item, index) in copyData" 
                    v-dragging="{ item: item, list: copyData, group: 'item' }"
                    :key="index">
                    <div class="title overflow">{{item.displayName}}</div>
                </el-card>
            </div>

            <div ref="rectangleWrap" class="rectangle-wrap" :style="{width: rectangleW+'px', height: rectangleH+'px'}">
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
                    :style="{'z-index': item.layer}"
                    :title="item.displayName"
                    :parent="true"
                    :debug="false"
                    :min-width="20"
                    :min-height="20"
                    :snap="true"
                    :snapTolerance="10"
                    @activated="item.isRotation ? 1 : 0; currentRectangle=item;currentScreenIndex=index"
                    @refLineParams="getRefLineParams"
                    @dragging="onDrag(arguments, index)"
                    @dragstop="onDrag(arguments, index)"
                    @resizing="onResize(arguments, index)"
                    :class="currentScreenIndex==index ? 'new-rectangle' : ''"
                    class="rectangle">
                    <div class="content">
                        <span>{{item.displayName}}</span>
                    </div>
                </vue-draggable-resizable>
                
                <!--辅助线-->
                <span class="ref-line v-line"
                    v-for="(item, index) in vLine"
                    :key="'v'+index"
                    v-show="item.display"
                    :style="{ left: item.position, top: item.origin, height: item.lineLength}"
                />
                <span class="ref-line h-line"
                    v-for="(item, index) in hLine"
                    :key="'h'+index"
                    v-show="item.display"
                    :style="{ top: item.position, left: item.origin, width: item.lineLength}"
                />
                <!--辅助线END-->
            </div>
        </el-scrollbar>

        <!-- 添加屏幕布局 -->
        <el-dialog
            width="300px"
            title="添加屏幕模块"
            :visible.sync="addScreenDialog"
            @open="customerDialogOpen"
            append-to-body>
            <el-input v-model="screenName" ref="input" placeholder="屏幕模块名称"></el-input>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addScreenDialog = false">取 消</el-button>
                <el-button type="primary" @click="handleAddScreen">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import VueDraggableResizable from 'vue-draggable-resizable-gorkys';
import 'vue-draggable-resizable-gorkys/dist/VueDraggableResizable.css';
import { timelineLayoutList, timelineAddlayout, timelineLayoutDelete } from '@/api/timeline';
export default {
    props: ['timeData'],
    data(){
        return{
            vLine: [],
            hLine: [],
            timelineBox: [],
            currentRectangle: {},         //选中的矩形 xy 宽高信息
            addScreenDialog: false,       //添加屏幕模块  填写名称 弹出框
            screenName: '',               //添加屏幕模块的名称
            currentScreenIndex: -1,       //已激活的屏幕模块 下标
            rectangleW: 480,              //编辑区域的宽
            rectangleH: 270,              //编辑区域的高
            deleteIdArr: [],              //要删除的屏幕区域id数组
            ratio: 0,                     //与原始宽高比例
            isUpdate: false,              //是否修改过屏幕布局  修改过可以点击保存按钮
            copyData: []
        }
    },
    computed: {
        screenSize(){
            return this.timeData;
        }
    },
    mounted() {
        this.init();
        // this.$refs.rectangleWrap.style.width = parseInt(1920 / 4) + 'px';
        // this.$refs.rectangleWrap.style.height = parseInt(1080 / 4) + 'px';
        //根据自身屏幕大小  缩小屏幕比例
        let w = this.timeData.width, h = this.timeData.height;
        //创建时间轴填写的宽度  除以 屏幕的宽度的三分之一
        this.ratio = parseInt(w / (document.body.clientWidth / 3));
        this.rectangleW = parseInt(w / this.ratio);
        this.rectangleH = parseInt(h / this.ratio);

        this.$dragging.$on('dragend', ({value}) => {
            this.copyData.forEach((item, index) => {
                item.layer = this.copyData.length - index
            })
            this.timelineBox = [];
            this.$nextTick(() => {
                this.timelineBox = this.copyData;
                this.currentScreenIndex = -1;
                this.currentRectangle = {};
                this.isUpdate = true;
            })
        })
    },
    methods: {
        //查询逻辑区域集合 屏幕布局集合
        init(){
            timelineLayoutList(this.$route.params.id).then(res => {
                if(res.code === this.$successCode){
                    this.timelineBox = this.ratioShow(res.obj);
                    // this.$store.dispatch('timeline/setScreenLayoutData', this.timelineBox);
                    let data = {
                        data: JSON.parse(JSON.stringify(this.timelineBox)),
                        w: this.rectangleW,
                        h: this.rectangleH,
                        ratio: this.ratio
                    }
                    eventBus.$emit('setScreenLayoutData', data);
                    this.copyData = JSON.parse(JSON.stringify(this.timelineBox));
                }
            })
        },

        //真实宽高 除以 比例 = 现在的宽高  
        ratioShow(data){
            data.sort((a, b) => {
                return b.layer - a.layer
            });
            data.forEach(item => {
                item.width = Math.floor(item.width / this.ratio);
                item.height = Math.floor(item.height / this.ratio);
                item.x = Math.floor(item.x / this.ratio);
                item.y = Math.floor(item.y / this.ratio);  
            })
            return data;
        },

        //添加屏幕模块
        handleAddScreen(){
            let obj = {
                width: this.rectangleH > this.rectangleW ? this.rectangleW : 100,
                height: this.rectangleH < this.rectangleW ? this.rectangleH : 100,
                x: 0,
                y: 0,
                layer: this.timelineBox.length + 1,
                containerId: this.$route.params.id,
                displayName: this.screenName
            };
            this.timelineBox.unshift(obj);
            this.copyData.unshift(obj);
            this.screenName = '';
            this.addScreenDialog = false;
            this.currentScreenIndex = this.timelineBox.length-1;
            this.currentRectangle = this.timelineBox[this.timelineBox.length-1];
            this.isUpdate = true;
        },

        // 辅助线回调事件
        getRefLineParams (params) {
            const { vLine, hLine } = params;
            this.vLine = vLine
            this.hLine = hLine
            if(vLine.origin){
                this.currentRectangle.x = vLine
            }
        },

        //改变位置时触发 data【0】x轴距离，  data【1】 y轴距离
        onDrag(data, index){
            this.timelineBox[index] = {
                ...this.timelineBox[index],
                x: data[0],
                y: data[1]
            }
            this.currentRectangle = this.timelineBox[index];
            this.isUpdate = true;
        },

        //调整组件大小时触发  data[x, y, width, height]
        onResize(data, index){
            let p = {
                ...this.timelineBox[index],
                x: data[0],
                y: data[1],
                width: data[2],
                height: data[3]
            }
            this.$set(this.timelineBox, index, p);
            this.currentRectangle = p;
            this.isUpdate = true;
        },

        //保存当前的布局
        sureCurrentLayout(){
            let [x1, x2, w] = [false, false, false];
            let totalW = 0;
            let copyData = JSON.parse(JSON.stringify(this.timelineBox));
            copyData.forEach((item, index) => {
                if(item.x == 0) x1 = true;
                if(item.x+item.width >= this.rectangleW) x2 = true;
                totalW += item.width;

                //保存时宽高x，y 要乘以比例， 真实的宽高
                item.width = this.ratio * item.width;
                item.height = this.ratio * item.height;
                item.x = this.ratio * item.x;
                item.y = this.ratio * item.y;  
            })
            if(totalW >= this.rectangleW) w = true;
            if(x1 && x2 && w){
                this.deleteSelectedId();
                timelineAddlayout(copyData).then(res => {
                    if(res.code === this.$successCode){
                        this.$message.success('保存成功~');
                        this.timelineBox = res.obj;
                        this.copyData = JSON.parse(JSON.stringify(res.obj));
                        let data = {
                            data: this.ratioShow(res.obj),
                            type: 'update'
                        }
                        eventBus.$emit('setScreenLayoutData', data);
                        //清空当前选中状态
                        this.currentScreenIndex = -1;
                        this.currentRectangle = {};
                        this.isUpdate = false;
                    }
                })
            }else{
                this.$message.warning('请添加或拖拽布局充满整个红框区域~');
            }
        },

        //删除屏幕
        deleteScreen(){
            if(this.currentScreenIndex < 0){
                this.$message.warning('请先选中要删除的屏幕(#`O′)');
            } else if(this.timelineBox.length <= 1){
                this.$message.warning('至少保留一个屏幕~');
            }else{
                this.$confirm(`此操将删除选中的屏幕【${this.timelineBox[this.currentScreenIndex].displayName}】, 是否继续?`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let id = this.timelineBox[this.currentScreenIndex].id;
                    if(id){
                        //把要删除的id push到数组，  点击保存时再去删除
                        this.deleteIdArr.push(id);
                    }
                    this.timelineBox.splice(this.currentScreenIndex, 1);
                    this.copyData.splice(this.currentScreenIndex, 1);
                    this.currentScreenIndex = 0;
                    this.currentRectangle = this.timelineBox[0];
                })
            }
        },

        //保存时 deleteIdArr 要删除的数组是否有值
        deleteSelectedId(){
            if(this.deleteIdArr.length){
                for(let i = 0; i < this.deleteIdArr.length; i++){
                    timelineLayoutDelete(this.deleteIdArr[i]).then(res =>{
                        if(res.code === this.$successCode){
                            this.deleteIdArr.splice(i, 1);
                        }
                    })
                }
            }
        },

        //显示添加窗口时  input获取焦点
        customerDialogOpen() {
            this.addScreenDialog = true
            this.$nextTick(function () {
                this.$refs.input.focus();
            });
        },

        //输入框双向绑定
        inputChange(value, label){
            this.currentRectangle[label] = value / this.ratio;
        },

    },
    components: {
        VueDraggableResizable
    }
}
</script>
<style lang="scss" scope>
    .screen-layout{
        height: 100%;
        padding-bottom: 10px;
        .rectangle {
            background-color: rgb(239, 154, 154);
            text-align: center;
            display: flex;
            justify-content: center;
            align-items: center;
            &.new-rectangle{
                background: #f35b5b;
            }
        }
        .change-hierarchy{
            width: 100px;
            display: inline-block;
            margin-right: 10px;
            .explain{
                font-size: 12px;
            }
            .el-card{
                margin-top: 10px;
                cursor: move;
            }
        }
        .rectangle-wrap{
            border: 1px solid red;
            display: inline-block;
            vertical-align: top;
            position: relative;
        }
        .el-scrollbar__view{
            height: 100%;
        }
        .toolbar{
            display: inline-block;
            font-size: 14px;
            &>span{
                display: inline-block;
                margin-bottom: 10px;
                margin-left: 10px;
                .el-input{
                    width: 80px;
                    display: inline-block;
                }
            }
        }
    }
</style>