<template>
    <div class="content-wrap clearfix">
        <el-scrollbar style="height:100%" v-loading="loading">
            <div class="search-wrap mb10 ml10">
                <el-radio-group size="small" @change="filtration" v-model="params.radio">
                    <el-radio-button :label="1">图片</el-radio-button>
                    <el-radio-button :label="2">视频</el-radio-button>
                </el-radio-group>
                <el-input 
                    clearable
                    size="small" 
                    placeholder="资源名称"
                    v-model="params.keyword"
                    @input="filtration"
                ></el-input>
            </div>
            <div v-if="contentData.length">
                <div
                    class="box-card content-list" 
                    ref="contentList"
                    v-for="(item, index) in contentData" 
                    :key="item.id"
                    @click="previewData=item;dialogVisible=true;"
                    @dragstart="drag($event, item, index)"
                    @dragend="dragend"
                    @dragenter="dragEnter($event, item)"
                    draggable="true"
                >
                    <el-image 
                        v-if="item.image" 
                        fit="cover" 
                        class="img" 
                        :src="item.image"
                    ></el-image>
                    <image v-else class="img" :src="item.image"></image>
                    <div class="desc">
                        <p class="duration" v-if="item.contentTypeId==2"><font-awesome-icon :icon="['far', 'clock']" />{{item.duration}}秒</p>
                        <p class="title overflow" :title="item.displayName">{{item.displayName}}</p>
                    </div>
                </div>
            </div>
            <div v-else class="no-data">暂无数据~</div>
        </el-scrollbar>

        <!-- 预览 -->
        <el-dialog
            :title="previewData.displayName"
            :visible.sync="dialogVisible"
            width="60%">
            <div v-if="dialogVisible">
                <!-- 图片 -->
                <div class="preview" v-if="previewData.contentTypeId == 1">
                    <el-image fit="cover" :src="previewData.contentPath"></el-image>
                </div>

                <!-- 视频 -->
                <div class="preview" v-if="previewData.contentTypeId == 2">
                    <video :src="previewData.contentPath" controls="controls"></video>
                </div>
            </div>

        </el-dialog>

    </div>
</template>
<script>
import { timelineContentList } from '@/api/timeline';
export default {
    data(){
        return {
            resData: [],
            contentData: [],
            dialogVisible: false,    //显示预览弹框
            previewData: {},         //点击资源  预览的数据
            params: {
                radio: 1,            //资源类型
            },
            loading: false
        }
    },
    mounted() {
        this.init();
    },
    methods: {
        init(){
            this.loading = true;
            timelineContentList().then(res => {
                this.loading = false;
                if(res.code === this.$successCode){
                    this.resData = res.obj;
                    this.filtration();
                }
            })
        },

        //筛选
        filtration(){
            this.contentData = this.resData.filter(item => {
                return item.contentTypeId == this.params.radio && (this.params.keyword ? item.displayName.indexOf(this.params.keyword) > -1 : true)
            })
        },

        // 拖拽开始
        drag(res, item, index){
            let data = {
                ...item,
                offsetX: res.layerX
            }
            this.$store.dispatch('timeline/setDragData', data);
        },    

        //拖拽结束
        dragend(){
            eventBus.$emit('contentDragend');
        },

        //当拖拽元素进入目标元素时
        dragEnter(event, data){
            // console.log(event, data)
        }
    }
}
</script>
<style lang="scss" scope>
    .content-wrap{
        margin-left: -10px;
        height: 100%;
        .search-wrap{
            .el-input{
                width: 300px;
            }
        }
        .content-list{
            width: 100px;
            margin: 0 0 10px 10px;
            float: left;
            cursor: pointer;
            border: 1px solid #eee;
            border-radius: 3px;
            box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);
            background: #fff;
            img{
                width: 100px;
                height: 60px;
                z-index: 99;
            }
            .desc{
                width: 100px;
                background: #fff;
                .duration{
                    font-size: 12px;
                    color: #999;
                    padding: 0 3px;
                    svg{
                        margin-right: 3px;
                    }
                }
                .title{
                    line-height: 20px;
                    font-size: 12px;
                    padding: 0 3px;
                }
            }
        }
        .no-data{
            text-align: center;
            line-height: 100px;
        }
    }
</style>