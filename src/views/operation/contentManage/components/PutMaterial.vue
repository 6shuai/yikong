<template>
    <div 
        v-if="order.length && showPutMaterial"
        class="put-material-drag-wrap" 
        :class="'order-count-' + order.length"
        v-loading="uploadLoading"
    >
        <div 
            class="item" 
            :class="{ 'active': item.hover }"
            v-for="(item, index) in order" 
            :key="index"
            @dragenter="$set(order[index], 'hover', true)"
            @dragover="$set(order[index], 'hover', true)"
            @dragleave="$set(order[index], 'hover', false)"
            @drop="handleDrop($event, index); $set(order[index], 'hover', false)"
        >
            <input type="file" multiple="multiple" accept="image/*, .mp4" @change="handleChangeFile($event, index)">
            <i class="el-icon-upload"></i>
            <p>添加至 {{ item.roomType == 1 ? '商场' : '小风景' }} 时间池</p>
        </div>
    </div>
</template>

<script>
import { operationPutMaterial } from '@/api/contentManage'
import { videoShot } from '@/mixins/UploadVideoShot'
import { ajaxUrl, uploadMaterial } from '@/utils'

export default {
    mixins: [videoShot],
    props: {
        screenId: Number
    },
    data() {
        return {
            // 显示上传素材
            showPutMaterial: false,

            // 上传中
            uploadLoading: false,

            // 上传的内容
            uploadContents: [],

            // 选择的订单index
            selectedOrderIndex: 0,

            order: []
        }
    },
    methods: {
        showUploadMaterial(order){
            this.order = order
            this.showPutMaterial = true
        },

        handleDrop(e, index){
            this.handleChangeFile(null, index, e.dataTransfer.files)
        },

        // 点击上传
        handleChangeFile(e, index, files){
            this.selectedOrderIndex = index
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
            let fd = new FormData()
            fd.append('contentType', type)
            fd.append('width', width)
            fd.append('height', height)
            fd.append('duration', duration)
            fd.append('size', size)
            if(cover) fd.append('image', cover)
            fd.append('file', file)
            fetch(ajaxUrl + uploadMaterial, {
                method: 'post',
                body: fd
            }).then(data => {
                return data.json()
            }).then(res => {
                let { displayName, id, contentPath } = res.obj
                let obj = {
                    width,
                    height, 
                    duration, 
                    content: contentPath,
                    name: displayName,
                    id
                }
                this.contentId = res.obj.id
                this.uploadContents.push(obj)
                if(this.uploadContents.length === this.uploadCount) {
                    this.uploadLoading = false
                    this.$message.success('上传成功~')
                    this.putMaterial()
                }
                
            }).catch(err => {
                this.uploadLoading = false
                this.$message.error('上传失败~')
            })
        },

        // 投放素材
        putMaterial(){
            let { projectId, placeholder } = this.order[this.selectedOrderIndex]
            let data = {
                project: projectId,
                placeholder,
                contents: this.uploadContents
            }
            operationPutMaterial(data).then(res => {
                if(res.code === this.$successCode){
                    this.$message.success('操作成功~')
                    this.showPutMaterial = false
                    this.$emit('putSuccess')
                }
            })
        }
    }
}
</script>

<style lang="scss" scoped>

    .put-material-drag-wrap{
        position: absolute;
        top: 0;
        left: 0;
        z-index: 99;
        width: 100%;
        height: 100%;
        display: flex;
        flex-wrap: wrap;

        .item{
            background: rgba($color: #000000, $alpha: 0.4);
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            color: #fff;
            border: 1px solid #e5e5e5;
            cursor: pointer;
            position: relative;

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
                font-size: 25px;
                padding: 20px 0;
            }

            &.active{
                border: 2px solid var(--color-primary);
                color: var(--color-primary);
            }

            &:hover{
                border: 2px solid var(--color-primary);
                color: var(--color-primary);
            }
        }
        
        &.order-count-1{
            .item{
                width: 100%;
                height: 100%;
            }
        }

        &.order-count-2{
            .item{
                width: 50%;
                height: 100%;
            }
        }

        &.order-count-3{
            .item{
                width: 50%;
                height: 50%;

                &:last-child{
                    width: 100%;
                }
            }
        }

        &.order-count-4{
            .item{
                width: 50%;
                height: 50%;
            }
        }
    }
</style>