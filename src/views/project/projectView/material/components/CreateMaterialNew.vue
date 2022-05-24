<template>
    <div class="created-material-wrap">
        
        <div class="material-add">
            <div 
                class="drag-upload-wrap" 
                id="drop_area"
                :class="borderhover ? 'active' : ''"
                v-if="!uploadLoading && !materialData.image"
            >
                <i class="el-icon-upload"></i>
                <input type="file" accept="image/*, .mp4" @change="handleChangeFile">
                <div class="el-upload__text">拖拽到此处上传素材</div>
            </div>

            <div class="material" v-if="uploadLoading">
                
                <el-image :src="materialData.image" :class="{ 'material-type-video': materialContentType==2 }"></el-image>

                <div class="material-info">
                    <div class="info-top">
                        <div class="upload-state" :class="{ 'upload-end': progressWidth == 100 }">
                            <p class="upload-loading" v-if="progressWidth == 100"><i class="el-icon-circle-check"></i> 已上传</p>
                            <p class="upload-loading" v-else><i class="el-icon-time"></i> 上传中...</p>
                        </div>
                        <div class="right-content">
                            <p>素材时长：{{ materialData.duration }}s</p>
                            <p>素材分辨率：{{ materialData.width }} * {{ materialData.height }} &nbsp;({{ materialData.aspectRatio }})</p>
                        </div>
                    </div>
                    <div class="progress">
                        <div 
                            class="progress-bar"
                            :style="{ width: progressWidth + '%' }"
                            :class="{ 'progress-end': progressWidth==100 }"
                        ></div>
                    </div>
                </div>
            </div>
        </div>


        <material-match 
            ref="materialMatch"
            :materialData="materialData"
            :contentId="contentId"
            @materialPutSuccess="materialPutSuccess"
        ></material-match>
    </div>
</template>

<script>
import { videoShot } from '@/mixins/UploadVideoShot'
import { ajaxUrl, aspectRatioCompute } from '@/utils'
import MaterialMatch  from './MaterialMatch'

export default {
    components: {
        MaterialMatch
    },
    mixins: [videoShot],
    data(){
        return {
            // 上传文件信息
            fileInfo: {},

            // 上传内容接口
            uploadMaterialUrl: 'user/project/upload',
            borderhover: false,

            // 上传素材的类型
            materialContentType: 1,

            // 文件是否上传中
            uploadLoading: false,

            // 素材信息
            materialData: {},

            // 内容id
            contentId: null,

            // 上传进度
            progressWidth: 0,
            progressTimer: undefined
        }
    },
    mounted() {
        this.fileInfo = {}

        let _this = this
        this.$nextTick(() => {
            var dropbox = document.getElementById('drop_area');
            dropbox.addEventListener("drop",this.enentDrop,false)
            dropbox.addEventListener("dragleave",function (e) {
                e.stopPropagation();
                e.preventDefault();
                _this.borderhover = false;
            })
            dropbox.addEventListener("dragenter",function (e) {
                e.stopPropagation();
                e.preventDefault();
                _this.borderhover = true;
            })
            dropbox.addEventListener("dragover",function (e) {
                e.stopPropagation();
                e.preventDefault();
                _this.borderhover = true
            })
        })
    },
    methods: {
        // 拖拽上传文件
        enentDrop: function(e){
            this.borderhover = false
            e.stopPropagation()
            e.preventDefault()
            let file = e.dataTransfer.files
            this.getFileInfo(file)
        },

        // 点击上传文件
        handleChangeFile(e){
            this.fileInfo = {}
            let file = e.target.files
            this.getFileInfo(file)
        },

        // 获取图片视频 宽高 大小
        getFileInfo(file){
            this.uploadLoading = true
            this.progress()
            let myImg = URL.createObjectURL(file[0])
            let size = file[0].size
            let _this = this;

            if(file[0].type.indexOf('video') > -1){
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

                    _this.fileInfo = {
                        width,
                        height,
                        duration,
                        size, 
                        contentType: 2
                    }

                    // 视频第一帧截图
                    let image = await _this.getBigectURL(videoElement, width, height, 'material')

                    if(!image.obj || !image.obj.path){
                        this.uploadLoading = false
                        this.$message.error('上传文件出错,请重新上传~')
                        return
                    }
                    
                    _this.uploadFile(file[0], 2, width, height, duration, size, image.obj.path)

                })
            }else{
                let img = new Image()
                img.src = myImg
                img.onload = function() {
                    let width = img.width
                    let height = img.height

                    // 图片默认时长15s
                    let duration = 15

                    _this.uploadFile(file[0], 1, width, height, duration, size)

                }
            }
        },

        // 上传文件
        uploadFile(file, type, width, height, duration, size, cover){
            this.materialContentType = type

            let fd = new FormData()
            fd.append('contentType', type)
            fd.append('width', width)
            fd.append('height', height)
            fd.append('duration', duration)
            fd.append('size', size)
            if(cover) fd.append('image', cover)
            fd.append('file', file)
            fetch(ajaxUrl + this.uploadMaterialUrl, {
                method: 'post',
                body: fd
            }).then(data => {
                return data.json()
            }).then(res => {
                this.materialData = {
                    width,
                    height, 
                    duration, 
                    image: cover ? cover : res.obj.contentPath,
                    contentType: cover ? 2 : 1,
                    aspectRatio: aspectRatioCompute(width, height)
                }
                this.$message.success('上传成功~')
                this.contentId = res.obj.id
                
                this.$nextTick(() => {
                    this.$refs.materialMatch.durationWhetherMatch()
                    this.progressWidth = 100
                })
            }).catch(err => {
                this.uploadLoading = false
                this.$message.error('上传失败~')
                clearInterval(this.progressTimer)
            })
        },
        
        // 上传进度
        progress(){
            this.progressWidth = 1
            var speed = 2
            this.progressTimer = setInterval(
                () => {
                    if(this.progressWidth >= 100){
                        this.progressWidth = 100
                        clearInterval(this.progressTimer)
                    }else{
                        if(this.progressWidth >= 99) {
                            speed = 0.001
                        }else if (this.progressWidth >= 95) {
                            speed = 0.01
                        } 
                        this.progressWidth += Math.random() * speed
                    }
                }
            , 300)
        },

        // 素材投放成功
        materialPutSuccess(){
            this.$emit('createMaterialSuccess')
        }
    }
}
</script>

<style lang="scss">
    $uploading: #1EA8F3;
    $uploadEnd: #00A857;

    .created-material-wrap{
        padding: 40px 20px 0;
        background: #F3F4F6;
        border-radius: 12px;

        .drag-upload-wrap{
            margin: 0 40px;
            background: #FEFEFE;
            border: 1px dashed #808080;
            border-radius: 4px;
            text-align: center;
            padding: 20px 0;
            position: relative;
    
            &.active{
                border-color: var(--color-primary);
                color: var(--color-primary);
            }
    
            &:hover{
                border-color: var(--color-primary);
                color: var(--color-primary);
            }
    
            input{
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                opacity: 0;
                cursor: pointer;
            }
    
            .el-icon-upload{
                font-size: 60px;
                margin-bottom: 10px;
            }
        }
    
        .material-add .material{
            display: flex;
            padding: 10px 20px;

                .el-image{
                    max-width: 120px;
                    border-left: 10px solid #5996FF;
                    background: #999;
                    border-top-left-radius: 6px;
                    border-bottom-left-radius: 6px;

                    &.material-type-video{
                        border-color: #FF597D;
                    }
                }

            .material-info{
                flex: 1;
                padding-left: 20px;

                .info-top{
                    display: flex;
                    justify-content: space-between;
                    align-items: center;

                    .upload-state{
                        color: $uploading;

                        &.upload-end{
                            color: $uploadEnd;
                        }

                        .el-icon{
                            font-size: 30px;
                            margin-right: 20px;
                        }
                    }

                    .right-content{
                        line-height: 30px;
                    }
                }

                .progress{
                    margin-top: 5px;
                    width: 100%;
                    height: 20px;
                    border: 1px dashed #FEFEFE;
                    text-align: left;
                    
                    .progress-bar{
                        width: 50%;
                        height: 20px;
                        background: $uploading;
                    }

                    .progress-end{
                        width: 100%;
                        background: $uploadEnd;
                    }
                }

            }

        }
    }
</style>