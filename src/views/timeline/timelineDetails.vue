<template>
    <div class="timeline-details-wrap" v-loading="loading">
        <div class="header-wrap detail-header-wrap">
            <el-page-header @back="$router.go(-1)">
            </el-page-header>
            <div class="header-right">
                <span @click="handleImportTimelinBtn"><i class="el-icon-download" title="导入时间轴"></i>导入时间轴</span>
                <el-divider direction="vertical"></el-divider>
                <span @click="$router.push(`/timeline/edit/${$route.params.id}`)"><i class="el-icon-edit" title="编辑"></i>编辑</span>
                <el-divider direction="vertical"></el-divider>
                <span @click="handelDeleteTimelineBtn"><i class="el-icon-delete" title="删除"></i>删除</span>
            </div>
            <div class="title">
                <h2>{{resData.displayName}}</h2>
            </div>
        </div>
        <div 
            class="timeline-content clearfix" 
            :style="{bottom: (screenLayout.length * 70 + 62) <= 290 ? 290 : screenLayout.length * 70 + 62 + 'px'}"
            v-if="resData.id">
            <div class="left-tabs">
                <!-- 左侧tab栏 -->
                <left-tabs :timeData="resData"></left-tabs>
            </div>
            <div class="right-screen">
                <el-scrollbar style="height: 100%">
                    <div class="screen-content" :style="{width: screenW+'px', height: screenH+'px'}">
                        <div 
                            class="screen-item"
                            v-for="(item, index) in screenLayout" 
                            @click="previewData=item;dialogVisible=true;"
                            :key="index"
                            :style="{
                                width: item.width + 'px', 
                                height: item.height + 'px',
                                left: item.x + 'px',
                                top: item.y + 'px',
                                zIndex: item.layer
                            }"
                        >
                            <!-- v-if="item.contentTypeId==1" -->
                            <img v-if="item.image" :src="item.image">
                        </div>
                    </div>
                </el-scrollbar>
            </div>
        </div>

        <!-- 时间轴 -->
        <!-- screenLayout.length 为屏幕数量, 70 为每条高度, 62为工具栏和时间刻度高度 -->
        <div 
            class="axis-wrap" 
            :style="{height: (screenLayout.length * 70) + 62 + 'px'}"
            v-if="resData.id"
        >
            <!-- 底部时间轴 -->
            <bottom-axis 
                @updateScreen="updateScreen"
                :startTime="startTime"
                :endTime="endTime"
            ></bottom-axis>
        </div>


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

        <!-- 导入时间轴 列表 -->
        <import-timeline ref="importTimeline"></import-timeline>

    </div>
</template>
<script>
import LeftTabs from '@/views/timeline/components/DetailTabs';
import BottomAxis from '@/views/timeline/components/BottomAxis';
import ImportTimeline from '@/views/timeline/components/ImportTimeline';
import { timelineContainerDelete, timelineContainerDetail } from '@/api/timeline';
export default {
    data(){
        return {
            resData: {},
            screenLayout: [],         //屏幕集合
            screenW: 0,            //屏幕宽
            screenH: 0,            //屏幕高
            startTime: '',         //时间轴开始时间
            endTime: '',           //时间轴结束时间
            dialogVisible: false,
            previewData: {},         //点击资源  预览的数据
            loading: false,
        }
    },
    mounted() {
        this.init();
        eventBus.$on('setScreenLayoutData', (data) => {
            // 屏幕宽高   10是边框宽度
            if(!data.type){
                this.screenLayout = data.data;
                this.screenW = data.w+10;
                this.screenH = data.h+10;
            }
        })
    },
    methods: {
        init(){
            this.loading = true;
            timelineContainerDetail(this.$route.params.id).then(res => {
                this.loading = false;
                this.resData = res.obj;
                let sTime = res.obj.beginTimeFormat.split('1970-01-01 ')[1];
                let eTime = res.obj.endTimeFormat.split('1970-01-01 ')[1];
                this.startTime = sTime;
                this.endTime = eTime;
            })
        },
        
        //删除
        handelDeleteTimelineBtn(){
            this.$confirm(`此操将删除时间轴【${this.resData.displayName}】, 是否继续?`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    timelineContainerDelete(this.$route.params.id).then(res => {
                        if(res.code === this.$successCode){
                            this.$message.success('删除成功~');
                            this.$router.push('/timeline/index');
                        }
                    })
                }).catch(() => {     
                });
        },

        //点击导入时间轴， 打开选择要导入的时间轴列表
        handleImportTimelinBtn(){
            this.$refs.importTimeline.init();
        },

        
        //更新屏幕内容
        //data 是数组时，修改了屏幕布局， 替换全部，  是对象时点击了时间轴的资源  屏幕上显示对应的图片
        updateScreen(data, index){
            if(Array.isArray(data)){
                this.screenLayout = data;
            }else{
                data = data ? data : {};
                let obj = {
                    ...this.screenLayout[index],
                    image: data.image,
                    contentPath: data.contentPath,
                    contentTypeId: data.contentTypeId
                }
                this.$set(this.screenLayout, index, obj);
            }
        },
        
    },
    components: {
        LeftTabs,
        BottomAxis,
        ImportTimeline
    }
}
</script>

<style lang="scss" scope>
    @import './style/timelineDetails.scss';
</style>