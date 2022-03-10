<template>
    <div class="upload-video-wrap">
        <el-upload 
            v-if="!videoUrl"
            element-loading-spinner="el-icon-loading"
            class="avatar-uploader el-upload--text" 
            accept="video/*"
            :data='uploadData'
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
            element-loading-spinner="el-icon-loading"
            style="height: 456px"
        >
            <el-upload 
                accept="video/*"
                :data='uploadData'
                :action="action" 
                :show-file-list="false"
                :on-success="handleVideoSuccess" 
                :before-upload="beforeUploadVideo" 
                :on-progress="uploadVideoProcess"
            >
                <el-button type="primary" size="small">重新上传视频</el-button>
            </el-upload>
            <video 
                v-if="videoUrl !='' && videoFlag == false" 
                :src="videoUrl" 
                class="video" 
                id="videofile"
                controls="controls">
                您的浏览器不支持视频播放
            </video>
        </div>

        <div class="video-progress" v-if="videoFlag">
            <el-progress 
                type="circle" 
                :percentage="videoUploadPercent"
            ></el-progress>
        </div>
    </div>
</template>
<script>
import { uploadUrl } from '@/utils';
import { videoShot } from '@/mixins/UploadVideoShot';
export default {
    mixins: [videoShot],
    props: ['url'],
    data(){
        return{
            videoUploadPercent: 0,           //上传进度
            action: uploadUrl,
            uploadData: {                    //上传时附带的额外参数
                fileType: 'video'
            },
            videoUrl: '',
            videoFlag: false,
            fileInfo: {},                     //视频详情信息
            videoSrc: '',
        }
    },
    mounted() {
        this.videoUrl = this.url || '';
    },
    methods: {
        beforeUploadVideo(file) {
            this.videoUploadPercent = 0;
            const isLt300M = file.size / 1024 / 1024  < 300;
            if (['video/mp4', 'video/ogg', 'video/flv','video/avi','video/wmv','video/rmvb'].indexOf(file.type) == -1) {
                this.$message.error('请上传正确的视频格式~');
                return false;
            }
            if (!isLt300M) {
                this.$message.error('上传视频大小不能超过300MB哦~');
                return false;
            }
        },

        uploadVideoProcess(event, file, fileList){
            this.videoFlag = true;
            this.videoUploadPercent = Math.floor(file.percentage);
        },

        //上传成功
        handleVideoSuccess(res, file) {    
            this.videoFlag = false;
            let ciphertext = '';

            if(res.code === this.$successCode){
                this.videoUrl = res.obj.path;
                ciphertext = res.obj.ciphertext;
            }else{
                this.$message.error('视频上传失败，请重新上传！');
            }

            let videoElement = document.createElement('video')
            videoElement.src = res.obj.path
            videoElement.setAttribute('crossOrigin', 'anonymous')
            videoElement.currentTime = 1;
            // 当指定的音频/视频的元数据已加载时，会发生 loadedmetadata 事件。 元数据包括：时长、尺寸（仅视频）以及文本轨道。
            let _this = this;
            videoElement.addEventListener("loadedmetadata", function (_event) {
                let width = videoElement.videoWidth
                let height = videoElement.videoHeight
                let duration = videoElement.duration; // 视频时长
                _this.fileInfo = {
                    duration: String(duration),
                    // originalSize: file.size,
                    size: file.size,
                    width: width,
                    height: height,
                    ciphertext: ciphertext,
                    contentPath: _this.videoUrl
                }
                _this.getBigectURL(videoElement, width, height)      
                _this.$emit('uploadVideo', _this.fileInfo);
            })
        }
    },
    watch: {
        url(o, n){
            this.videoUrl = this.url;
        }
    },
}
</script>
<style lang="scss">
    .upload-video-wrap{
        position: relative;

        .video-progress{
            width: 100%;
            height: 100%;
            position: absolute;
            top: 0;
            left: 0;
            background: #fff;
            text-align: center;

            .el-progress{
                display: inline-block;
            }
        }

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
            background: #000;
        }
    }
</style>