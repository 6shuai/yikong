<template>
    <div class="upload-video-wrap">
        <el-upload 
            v-if="!videoUrl"
            v-loading="videoFlag"
            element-loading-text="视频上传中"
            element-loading-spinner="el-icon-loading"
            class="avatar-uploader el-upload--text" 
            :action="action" 
            :show-file-list="false" 
            :on-success="handleVideoSuccess" 
            :before-upload="beforeUploadVideo" 
            :on-progress="uploadVideoProcess"
        >
            <i v-if="videoFlag == false" class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
        <div 
            v-if="videoUrl !=''"
            v-loading="videoFlag"
            element-loading-text="视频上传中"
            element-loading-spinner="el-icon-loading"
            style="height: 456px"
        >
            <el-upload 
                :action="action" 
                :show-file-list="false" 
                :on-success="handleVideoSuccess" 
                :before-upload="beforeUploadVideo" 
                :on-progress="uploadVideoProcess"
            >
                <el-button type="primary" size="small">重新上传视频</el-button>
            </el-upload>
            <video v-if="videoUrl !='' && videoFlag == false" :src="videoUrl" class="video" controls="controls">您的浏览器不支持视频播放</video>
        </div>
    </div>
</template>
<script>
export default {
    props: ['url'],
    data(){
        return{
            action: '/common/upload/',
            uploadData: {                    //上传时附带的额外参数
                fileType: 'video'
            },
            videoUrl: '',
            videoFlag: false,
            fileInfo: {}                     //视频详情信息
        }
    },
    mounted() {
        this.videoUrl = this.url || '';
    },
    methods: {
        beforeUploadVideo(file) {
            const isLt10M = file.size / 1024 / 1024  < 10;
            if (['video/mp4', 'video/ogg', 'video/flv','video/avi','video/wmv','video/rmvb'].indexOf(file.type) == -1) {
                this.$message.error('请上传正确的视频格式~');
                return false;
            }
            if (!isLt10M) {
                this.$message.error('上传视频大小不能超过10MB哦~');
                return false;
            }
        },

        uploadVideoProcess(event, file, fileList){
            this.videoFlag = true;
        },

        //上传成功
        handleVideoSuccess(res, file) {                          
            this.videoFlag = false;
            if(res.code === this.$successCode){
                this.videoUrl = res.obj.path;
            }else{
                this.$message.error('视频上传失败，请重新上传！');
            }

            let videoElement = document.createElement('video')
             videoElement.src = res.obj.path
            // 当指定的音频/视频的元数据已加载时，会发生 loadedmetadata 事件。 元数据包括：时长、尺寸（仅视频）以及文本轨道。
            let _this = this;
            videoElement.addEventListener("loadedmetadata", function (_event) {
                let width = videoElement.videoWidth
                let height = videoElement.videoHeight
                let duration = videoElement.duration; // 视频时长
                _this.fileInfo = {
                    duration: parseInt(duration),
                    originalSize: file.size,
                    size: (file.size / 1024 / 1024).toFixed(2),
                    width: width,
                    height: height,
                    contentPath: _this.videoUrl
                }
                _this.$emit('uploadVideo', _this.fileInfo);
            })
        },
    },
    watch: {
        url(o, n){
            this.videoUrl = this.url;
        }
    },
}
</script>
<style lang="scss" scope>
    .upload-video-wrap{
        .avatar-uploader {
            display: inline-block;
        }
        .avatar-uploader .el-upload {
            width: 300px;
            height: 150px;
            border: 1px dashed #d9d9d9;
            border-radius: 6px;
            cursor: pointer;
            position: relative;
            overflow: hidden;
        }
        .avatar-uploader .el-upload:hover {
            border-color: #409EFF;
        }
        .avatar-uploader-icon {
            font-size: 28px;
            color: #8c939d;
            width: 300px;
            height: 150px;
            line-height: 150px;
            text-align: center;
        }
        .video{
            width: 500px;
            height: 300px;
            border: 1px solid #e5e5e5;
        }
    }
</style>