<template>
    <div class="material-upload-wrap">
        <input type="file" :multiple="multiple" accept="image/*, .mp4" @change="handleChangeFile($event)"></input>
    </div>
</template>

<script>
import { ajaxUrl, uploadMaterial } from '@/utils'
import { videoShot } from '@/mixins/UploadVideoShot'
import axios from "axios" //引入axios
const instance = axios.create({
  timeout: 300000,
})

export default {
    props: {
        multiple: Boolean
    },
    mixins: [videoShot],
    data() {
        return {
            // 上传中
            uploadLoading: false,

            // 上传的内容
            uploadContents: [],

            // 上传数量
            uploadCount: null
        }
    },
    methods: {
        // 点击上传
        handleChangeFile(e, files){
            let file = files ? files : e.target.files
            this.uploadContents = []
            this.uploadCount = file.length

            for(let i = 0; i < file.length; i++){
                this.getFileInfo(file[i])
            }
        },


        // 获取图片视频 宽高 大小
        getFileInfo(file){
            this.uploadLoading = true
            let myImg = URL.createObjectURL(file)
            let size = file.size
            let _this = this;

            if(file.type.indexOf('video') > -1){
                // 视频
                let videoElement = document.createElement('video')
                videoElement.src = myImg
                videoElement.setAttribute('crossOrigin', 'anonymous')
                videoElement.currentTime = 1;
                // 当指定的音频/视频的元数据已加载时，会发生 loadedmetadata 事件。 元数据包括：时长、尺寸（仅视频）以及文本轨道。
                videoElement.addEventListener("loadedmetadata", async function (_event) {
                    let width = videoElement.videoWidth
                    let height = videoElement.videoHeight
                    let duration = videoElement.duration; // 视频时长

                    // 视频第一帧截图
                    let image = await _this.getBigectURL(videoElement, width, height, 'material')

                    if(!image.obj || !image.obj.path){
                        this.uploadLoading = false
                        this.$message.error('上传文件出错,请重新上传~')
                        return
                    }
                    
                    _this.uploadFile(file, 2, width, height, duration, size, image.obj.path)

                })
            }else{
                let img = new Image()
                img.src = myImg
                img.onload = function() {
                    let width = img.width
                    let height = img.height

                    // 图片默认时长15s
                    let duration = 15

                    _this.uploadFile(file, 1, width, height, duration, size)

                }
            }
        },

        // 上传文件
        uploadFile(file, type, width, height, duration, size, cover){
            let _this = this

            console.log( axios.defaults)
            this.source = axios.CancelToken.source()

            let fd = new FormData()
            fd.append('contentType', type)
            fd.append('width', width)
            fd.append('height', height)
            fd.append('duration', duration)
            fd.append('size', size)
            if(cover) fd.append('image', cover)
            fd.append('file', file)

            this.uploadFileInstance(ajaxUrl + uploadMaterial, fd, this.source.token, (progressEvent) => {
                let completeVal = (progressEvent.loaded / progressEvent.total) * 100  || 0
                console.log('上传进度--->', completeVal)
                this.$emit('uploadState', { type: 'progress', completeVal })
            }).then((res) => {
                this.uploadLoading = false
                if(res.data.code == 0){
                    let { displayName, id, contentPath } = res.data.obj
                    let obj = {
                        width,
                        height, 
                        duration, 
                        content: contentPath,
                        name: displayName,
                        id
                    }
                    this.uploadContents.push(obj)
                    
                    if(this.uploadContents.length == this.uploadCount){
                        this.$message.success('上传成功~')
                        if(this.multiple) this.$emit('putMaterial', this.uploadContents)
                        else this.$emit('uploadState', { type: 'success', obj })
                    }
                }else{
                    this.$message.error('上传失败~')
                }
            }).catch((thrown) => {
                this.uploadLoading = false
                if(axios.isCancel(thrown)){
                    console.log('用户取消上传~')
                }else{
                    this.$message.error('上传失败~')
                }
            })
        },

        uploadFileInstance(url, payload, cancelToken, cd) {
            return instance({
                url: url,
                method: "post",
                data: payload,
                onUploadProgress: function(progressEvent) {
                    if (progressEvent.lengthComputable) {
                        cd(progressEvent)
                    }
                },
                cancelToken: cancelToken
            })
        },

        // 取消上传
        cancelUpload() {
            this.source.cancel("Operation canceled by the user.")
        }
    }
}
</script>

<style lang="scss">
    .material-upload-wrap{
        input{
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            opacity: 0;
            cursor: pointer;
        }
    }
    
</style>