<template>
    <div class="content-wrap clearfix">
        <el-scrollbar style="height:100%" v-loading="loading">
            <div class="search-wrap mb10 ml10">
                <el-radio-group size="small" @change="filtration" v-model="params.radio">
                    <el-radio-button :label="1">图片</el-radio-button>
                    <el-radio-button :label="2">视频</el-radio-button>
                    <el-radio-button :label="4">图集</el-radio-button>
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
                    @click="handlePreview(item)"
                    @dragstart="drag($event, item, index)"
                    @dragend="dragend"
                    @dragenter="dragEnter($event, item)"
                    draggable="true"
                    :title="item.displayName"
                >
                    <div class="cover"></div>
                    <div 
                        v-if="item.subContentsData && item.contentTypeId == 4"
                        class="atlas"
                        :class="`atlas-${item.subContentsData.length > 4 ? '4' : item.subContentsData.length}`"
                    >
                        <el-image 
                            fit="cover" 
                            class="img" 
                            v-for="(img, index) in filterVideo(item.subContentsData)"
                            v-if="img.contentType==1 && index <=3"
                            :key="index"
                            :src="img.contentPath"
                        ></el-image>
                    </div>
                    <el-image 
                        v-else
                        fit="cover" 
                        class="img" 
                        :src="item.image"
                    ></el-image>
                    <div class="desc">
                        <p class="title overflow" :title="item.displayName">{{item.displayName}}</p>
                        <p class="duration" v-if="item.duration"><font-awesome-icon :icon="['far', 'clock']" />{{item.duration}}秒</p>
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

                <!-- 图集 -->
                <content-preview v-if="previewData.contentTypeId == 4" ref="contentPreview"></content-preview>
            </div>

        </el-dialog>

    </div>
</template>
<script>
import { timelineContentList, timelineAtlasContentList } from '@/api/timeline';
import ContentPreview from '@/views/content/components/ContentPreview';
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
            if(this.params.radio === 4){
                this.atlasContentList();
                return
            }
            this.contentData = this.resData.filter(item => {
                return item.contentTypeId == this.params.radio && (this.params.keyword ? item.displayName.indexOf(this.params.keyword) > -1 : true)
            })
        },

        //获取所有图集资源
        atlasContentList(){
            timelineAtlasContentList().then(res => {
                if(res.code === this.$successCode){
                    this.contentData = res.obj;
                }
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
        },

        //预览
        handlePreview(data){
            this.previewData = data;
            let msg = this.previewData.contentTypeId == 4 ? this.previewData.subContentsData : this.previewData;
            this.dialogVisible = true;
            this.$nextTick(() => {
                this.$refs.contentPreview.contentPreviewData(msg);
            })
        },

        //过滤视频
        filterVideo(data){
            return data.filter(item => {
                return item.contentType==1
            })
        }
    },
    components: {
        ContentPreview
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
            height: 100px;
            margin: 0 0 10px 10px;
            float: left;
            cursor: pointer;
            border: 1px solid #eee;
            border-radius: 3px;
            box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);
            background: #fff;
            position: relative;
            .cover{
                position: absolute;
                width: 100%;
                height: 100%;
                z-index: 10;
            }
            img{
                width: 100px;
                height: 60px;
                z-index: 99;
            }

            .atlas{
                width: 100px;
                height: 60px;
                background: #000;
                &-2 .img{
                    display: inline-block;
                    width: 50px;
                    height: 60px;
                }
                &-3, &-4{
                    display: flex;
                    flex-wrap: wrap;
                    .img{
                        width: 50px;
                        height: 30px;
                        img{
                            width: 50px;
                            height: 30px;
                        }
                    }
                }
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