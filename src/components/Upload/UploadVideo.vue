<template>
    <div class="upload-video-wrap">
        <video :src="videoSrc" crossOrigin="anonymous" controls="controls" id="videofile"></video>
        <div id="output"></div>
        <el-upload 
            v-if="!videoUrl"
            v-loading="videoFlag"
            element-loading-text="视频上传中"
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
            v-loading="videoFlag"
            element-loading-text="视频上传中"
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
            <video v-if="videoUrl !='' && videoFlag == false" :src="videoUrl" class="video" controls="controls">您的浏览器不支持视频播放</video>
        </div>
    </div>
</template>
<script>
import { uploadUrl } from '@/utils';
export default {
    props: ['url'],
    data(){
        return{
            action: uploadUrl,
            uploadData: {                    //上传时附带的额外参数
                fileType: 'video'
            },
            videoUrl: '',
            videoFlag: false,
            fileInfo: {},                     //视频详情信息
            videoSrc: ''
        }
    },
    mounted() {
        this.videoUrl = this.url || '';
        this.getBigectURL()
    },
    methods: {
        beforeUploadVideo(file) {
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
        },

        //上传成功
        handleVideoSuccess(res, file) {    
            console.log('=========', file)       
                     
            this.videoFlag = false;
            if(res.code === this.$successCode){
                this.videoUrl = res.obj.path;
            }else{
                this.$message.error('视频上传失败，请重新上传！');
            }

            let videoElement = document.createElement('video')
            videoElement.src = res.obj.path
            videoElement.currentTime = 1;
            // 当指定的音频/视频的元数据已加载时，会发生 loadedmetadata 事件。 元数据包括：时长、尺寸（仅视频）以及文本轨道。
            let _this = this;
            videoElement.addEventListener("loadedmetadata", function (_event) {
                let width = videoElement.videoWidth
                let height = videoElement.videoHeight
                let duration = videoElement.duration; // 视频时长
                _this.getBigectURL(videoElement.src)      
                _this.fileInfo = {
                    duration: parseInt(duration),
                    // originalSize: file.size,
                    size: file.size,
                    width: width,
                    height: height,
                    contentPath: _this.videoUrl
                }
                _this.$emit('uploadVideo', _this.fileInfo);
            })
        },

        //截图视频第一帧图
        getBigectURL(url) {
            // var fileReader = new FileReader()
            // console.log('file------>', file)
            // fileReader.readAsDataURL(file)
            var that = this
            // fileReader.onload = function(e) {
                that.videoSrc = url;

                var video = document.getElementById("videofile")
                video.currentTime = 1 //必须设置视频当前时长，要不然会黑屏
                var output = document.getElementById("output");
                // 创建画布准备截图
                var canvas = document.createElement('canvas')
                // 创建图片标签
                var img = document.createElement("img");

                video.setAttribute('crossOrigin', 'anonymous')
                // 设置画布的宽高
                canvas.width = video.clientWidth
                canvas.height = video.clientHeight
                // 图片绘制
                video.onloadeddata = ((e) => {
                    canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height)
                    var dataURL = canvas.toDataURL('image/jpeg')
                    img.src = dataURL;
                    img.width = canvas.width;
                    img.height = canvas.height;
                    // 添加到output盒子里面
                    output.appendChild(img);
                    console.log(dataURL)
                })
            // }
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
            background: #000;
        }
    }
</style>