<template>
    <div class="screen-layout">
        <el-scrollbar style="height:100%">
            <div class="toolbar">
                <el-button type="primary" size="mini" @click="addScreenDialog=true">添加</el-button>
                <el-button type="primary" size="mini" @click="sureCurrentLayout">保存</el-button>
                <el-button type="info" size="mini" :disabled="currentScreenIndex==-1" @click="deleteScreen">删除</el-button>
                <span>x：<el-input size="mini" v-model="currentRectangle.x" :min="0" :max="rectangleW" type="number"></el-input></span>
                <span>y：<el-input size="mini" v-model="currentRectangle.y" :min="0" :max="rectangleH" type="number"></el-input></span>
                <span>宽：<el-input size="mini" v-model="currentRectangle.width" :min="20" :max="rectangleW" type="number"></el-input></span>
                <span>高：<el-input size="mini" v-model="currentRectangle.height" :min="20" :max="rectangleH" type="number"></el-input></span>
                <span>层叠顺序：<el-input size="mini" v-model="currentRectangle.layer" :min="1" :max="99999" type="number"></el-input></span>
                <span>名称：<el-input size="mini" v-model="currentRectangle.displayName"></el-input></span>
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
                    v-for="(item, index) in rectangleData"
                    :key="index"
                    :w="item.width"
                    :h="item.height"
                    :x="item.x"
                    :y="item.y"
                    :z-index="item.layer"
                    :parent="true"
                    :debug="false"
                    :min-width="20"
                    :min-height="20"
                    :snap="true"
                    :snapTolerance="10"
                    @activated="currentRectangle=item; currentScreenIndex=index"
                    @refLineParams="getRefLineParams"
                    @dragging="onDrag(arguments, index)"
                    @dragstop="onDrag(arguments, index)"
                    @resizing="onResize(arguments, index)"
                    :class="currentScreenIndex==index ? 'new-rectangle' : ''"
                    class="rectangle">
                    <span>{{item.displayName}}</span>
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
            append-to-body>
            <el-input v-model="screenName" placeholder="屏幕模块名称"></el-input>
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
            rectangleData: [],
            currentRectangle: {},         //选中的矩形 xy 宽高信息
            addScreenDialog: false,       //添加屏幕模块  填写名称 弹出框
            screenName: '',               //添加屏幕模块的名称
            currentScreenIndex: -1,       //已激活的屏幕模块 下标
            rectangleW: 480,              //编辑区域的宽
            rectangleH: 270,              //编辑区域的高
            deleteIdArr: [],              //要删除的屏幕区域id数组
            ratio: 0,                     //与原始宽高比例
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
    },
    methods: {
        //查询逻辑区域集合 屏幕布局集合
        init(){
            timelineLayoutList(this.$route.params.id).then(res => {
                if(res.code === this.$successCode){
                    this.rectangleData = this.ratioShow(res.obj);
                    // this.$store.dispatch('timeline/setScreenLayoutData', this.rectangleData);
                    let data = {
                        data: JSON.parse(JSON.stringify(this.rectangleData)),
                        w: this.rectangleW,
                        h: this.rectangleH,
                        ratio: this.ratio
                    }
                    eventBus.$emit('setScreenLayoutData', data);
                    // if(!res.obj.length){
                    //     this.rectangleData.push({
                    //         height: this.rectangleH,
                    //         width: this.rectangleW,
                    //         x: 0,
                    //         y: 0,
                    //         displayName: '主屏',
                    //         containerId: this.$route.params.id,
                    //         layer: 1
                    //     })
                    // }
                }
            })
        },

        //真实宽高 除以 比例 = 现在的宽高  
        ratioShow(data){
            data.forEach(item => {
                item.width = item.width / this.ratio;
                item.height = item.height / this.ratio;
                item.x = item.x / this.ratio;
                item.y = item.y / this.ratio;  
            })
            return data;
        },

        //添加屏幕模块
        handleAddScreen(){
            this.rectangleData.push({
                width: this.rectangleH < this.rectangleW ? this.rectangleW : 100,
                height: this.rectangleH > this.rectangleW ? this.rectangleH : 100,
                x: 0,
                y: 0,
                layer: this.rectangleData.length + 1,
                containerId: this.$route.params.id,
                displayName: this.screenName
            })
            this.screenName = '';
            this.addScreenDialog = false;
            this.currentScreenIndex = this.rectangleData.length-1;
            this.currentRectangle = this.rectangleData[this.rectangleData.length-1];
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
            this.rectangleData[index] = {
                ...this.rectangleData[index],
                x: data[0],
                y: data[1]
            }
            this.currentRectangle = this.rectangleData[index];
        },

        //调整组件大小时触发  data[x, y, width, height]
        onResize(data, index){
            let p = {
                ...this.rectangleData[index],
                x: data[0],
                y: data[1],
                width: data[2],
                height: data[3]
            }
            this.$set(this.rectangleData, index, p);
            this.currentRectangle = p;
        },

        //保存当前的布局
        sureCurrentLayout(){
            let [x1, x2, w] = [false, false, false];
            let totalW = 0;
            let copyData = JSON.parse(JSON.stringify(this.rectangleData));
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
                        let data = {
                            data: this.ratioShow(res.obj),
                            type: 'update'
                        }
                        eventBus.$emit('setScreenLayoutData', data);
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
            } else if(this.rectangleData.length <= 1){
                this.$message.warning('至少保留一个屏幕~');
            }else{
                this.$confirm(`此操将删除选中的屏幕【${this.rectangleData[this.currentScreenIndex].displayName}】, 是否继续?`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let id = this.rectangleData[this.currentScreenIndex].id;
                    if(id){
                        //把要删除的id push到数组，  点击保存时再去删除
                        this.deleteIdArr.push(id);
                    }
                    this.rectangleData.splice(this.currentScreenIndex, 1);
                    this.currentScreenIndex = 0;
                    this.currentRectangle = this.rectangleData[0];
                })
            }
        },

        //保存时 deleteIdArr 要删除的数组是否有值
        deleteSelectedId(){
            if(this.deleteIdArr.length){
                for(let i = 0; i < this.deleteIdArr.length; i++){
                    timelineLayoutDelete(this.deleteIdArr[i]).then(res =>{
                        if(res.code === this.$successCode){
                            
                        }
                    })
                }
            }
        }

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
        .rectangle-wrap{
            border: 1px solid red;
            position: relative;
            margin: 0 auto;
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
                    width: 70px;
                    display: inline-block;
                }
            }
        }
    }
</style>