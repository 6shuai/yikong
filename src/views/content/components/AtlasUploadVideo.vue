<template>
    <div class="atlas-upload-btn">
        <el-upload
            :data='uploadData'
            :action="action"
            :on-success="uploadSuccess"
            :on-error="uploadError"
            :before-upload="beforeUploadVideo"
            accept="video/*"
            :show-file-list="false">
            <el-button size="small" :loading="uploadLoading" type="primary">{{uploadLoading ? '上传中..' : '上传视频'}}</el-button>
        </el-upload>
    </div>
</template>

<script>
import { getUploadImgInfo } from '@/mixins/index';
import { uploadUrl } from '@/utils';
import { videoShot } from '@/mixins/UploadVideoShot';
export default {
    mixins: [getUploadImgInfo, videoShot],
    props: ['videoPoster'],
    data(){
        return {
            action: uploadUrl,
            uploadLoading: false,
            fileInfo: {},
            uploadData: {                    //上传时附带的额外参数
                fileType: 'video'
            },
            videoCover: ''
        }
    },
    methods: {
        //上传成功
        uploadSuccess(res, file){
            this.uploadLoading = false;
            if(res.code !== this.$successCode){
                this.$message.error('视频上传失败，请重新上传！');
                return
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
                    duration: parseInt(duration),
                    size: file.size,
                    width: width,
                    height: height,
                    contentPath: res.obj.path
                }
                if(!_this.videoPoster) _this.getBigectURL(videoElement, width, height)     
                _this.$emit('atlasUploadSuccess', _this.fileInfo);
            })
        },

        //上传之前
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
            this.uploadLoading = true;
        },

        //上传失败
        uploadError(res){
            this.uploadLoading = false;
            this.$message.error('上传失败~');
        },
    }
}
</script>

<style lang="scss">
    .atlas-upload-btn{
        display: inline-block;
    }
</style>