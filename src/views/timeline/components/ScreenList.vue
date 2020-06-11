<template>
    <div class="screen-wrap clearfix">
        <el-scrollbar style="height:100%">
            <el-button 
                type="primary" 
                icon="el-icon-plus"
                size="mini"
                @click="addScreenBtn"
            >添加屏幕
            </el-button>
            <div class="clearfix screen-wrap">
                <el-card class="box-card screen-list" :body-style="{ padding: '0px' }" v-for="(item, index) in resData" :key="index">
                    <div class="screen-info">
                        <div class="title">{{item.displayName}}</div>
                        <div class="delete" @click="deleteScreen(index)"><i class="el-icon-delete"></i>删除</div>
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
            append-to-body>
            <div class="clearfix screen-wrap">
                <el-card class="box-card screen-list" :body-style="{ padding: '0px' }" v-for="(item, index) in screenData" :key="item.id">
                    <div class="screen-info">
                        <div class="title">{{item.displayName}}</div>
                        <div class="delete add-btn" v-if="!item.hide" @click="addScreen(index)"><i class="el-icon-plus"></i>添加</div>
                    </div>
                </el-card>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="updateTimelineScreen">确 定</el-button>
            </span>
        </el-dialog>

    </div>
</template>
<script>
import { timelineScreenList, timelinePutScreenList, timelineAddScreen, timelineDeleteScreen } from '@/api/timeline';
export default {
    data(){
        return {
            resData: [],                       //已添加的屏幕列表
            showAddScreen: false,              //添加屏幕 弹框
            haveAdd: false,                    //是否点击了添加屏幕  如果点击了， 关闭弹框时会重新调init()
            screenData: [],                    //所有的屏幕列表
        }
    },
    mounted() {
        this.init();
    },
    methods: {
        //已添加的屏幕列表
        init(){
            timelinePutScreenList(this.$route.params.id).then(res => {
                if(res.code === this.$successCode){
                    this.resData = res.obj;
                }
            })
        },

        //所有的屏幕列表
        getScreenList(){
            timelineScreenList().then(res => {
                this.screenData = res.obj;
                this.resData.forEach((item, index) => {
                    for(let i = 0; i< this.screenData.length; i++){
                        if(item.id == this.screenData[i].id){
                            this.screenData[i].hide = true;
                        }
                    }
                })
            })
        },

        //删除
        deleteScreen(index){
            this.$confirm(`此操将删除屏幕【${this.resData[index].displayName}】, 是否继续?`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                timelineDeleteScreen(this.resData[index].id).then(res => {
                    if(res.code === this.$successCode){
                        this.$message.success('删除成功~');
                        this.resData.splice(index, 1);
                    }
                })
            })
        },

        //点击添加屏幕按钮  显示添加弹框
        addScreenBtn(){
            this.showAddScreen = true;
            this.getScreenList();
        },

        //添加屏幕
        addScreen(index){
            let params = `?screenId=${this.screenData[index].id}&containerId=${this.$route.params.id}`;
            timelineAddScreen(params).then(res => {
                if(res.code === this.$successCode){
                    this.haveAdd = true;
                    this.$message.success('添加成功~');
                    let obj = this.screenData[index];
                    obj.hide = true;
                    this.$set(this.screenData, index, obj);
                }
            })
        },

        //关闭添加屏幕弹框
        updateTimelineScreen(){
            this.showAddScreen = false;
            if(this.haveAdd){
                this.init();
                this.haveAdd = false;
            }
        }
    },
}
</script>
<style lang="scss" scope>
    @import '../../../styles/variables.scss';
    .screen-wrap{
        height: 100%;
        .screen-list{
            width: 100%;
            height: 50px;
            line-height: 50px;
            margin: 10px 0;
            cursor: pointer;
            .screen-info{
                display: flex;
                .title{
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
        }
        .no-data{
            line-height: 40px;
            text-align: center;
        }
    }
</style>