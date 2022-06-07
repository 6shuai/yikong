<template>
    <div class="set-default-material-wrap">
        <div class="mask" @click="$emit('hide')"></div>
        <div class="layout">
            <div
                class="region"
                v-for="(regions, regionsIndex) in screenLayout.regions"
                :key="regionsIndex"
                :class="{ 'active': screenLayout.mainRegion != regions.id}"
                :style="{
                    width: regions.region.width + '%',
                    height: regions.region.height + '%', 
                    left: regions.region.x + '%',
                    top:  regions.region.y + '%', 
                }"
            >

                <div 
                    v-if="screenLayout.mainRegion != regions.id"
                    class="drag-upload-wrap" 
                    id="drop_area"
                    :loading="uploadLoading"
                >
                    <i class="el-icon-upload2"></i>
                    <input type="file" accept="image/*, .mp4" @change="handleChangeFile($event, regions.id)">
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { setScreenLayoutContent } from '@/api/contentManage'
import { ajaxUrl } from '@/utils'

export default {
    props: {
        screenLayout: Object,
        screenId: Number
    },
    data(){
        return {
            // 上传文件 接口地址
            uploadMaterialUrl: 'project/upload',

            // 上传区域id
            regionId: null,

            // 上传中
            uploadLoading: false,

            uploadData: {}
        }
    },
    methods: {
        // 点击上传文件
        handleChangeFile(e, id){
            this.regionId = id
            let file = e.target.files
            this.getFileInfo(file)
        },

        // 获取图片视频 宽高 大小
        getFileInfo(file){
            this.uploadLoading = true
            let myImg = URL.createObjectURL(file[0])
            let size = file[0].size
            let _this = this

            let img = new Image()
            img.src = myImg
            img.onload = function() {
                let width = img.width
                let height = img.height

                // 图片默认时长15s
                let duration = 15

                _this.uploadFile(file[0], 1, width, height, duration, size)

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
            fetch(ajaxUrl + this.uploadMaterialUrl, {
                method: 'post',
                body: fd
            }).then(data => {
                return data.json()
            }).then(res => {
                this.setDefaultContent(res.obj.id)
            }).catch(err => {
                this.uploadLoading = false
                this.$message.error('上传失败~')
            })
        },

        // 设置默认内容
        setDefaultContent(contentId){
            let data = {
                screen: this.screenId,
                region: this.regionId,
                content: contentId
            }
            setScreenLayoutContent(data).then(res => {
                this.uploadLoading = false
                if(res.code === this.$successCode){
                    this.$message.success('操作成功~')
                    this.$emit('setSuccess')
                }
            })
        }
    }
}
</script>

<style lang="scss" scoped>
    .set-default-material-wrap{
        position: fixed;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        z-index: 9999;
        display: flex;
        justify-content: center;
        align-items: center;

        .mask{
            position: fixed;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            opacity: .5;
            background: #000;
        }

        .layout{
            width: 400px;
            height: 240px;
            background: #fff;
            border-radius: 6px;
            overflow: hidden;
            margin: 20px;
            position: relative;
            cursor: pointer;

            &.vertical{
                width: 240px;
                height: 400px;
            }

            .region{
                position: absolute;
                border: 1px solid #fff;
                cursor: pointer;

                &.active{
                    background: #d0d0d0;
                    cursor: pointer;

                    .drag-upload-wrap{
                        width: 100%;
                        height: 100%;
                        position: relative;
                        text-align: center;
                
                        input{
                            position: absolute;
                            top: 0;
                            left: 0;
                            width: 100%;
                            height: 100%;
                            opacity: 0;
                            cursor: pointer;
                        }
                
                        .el-icon-upload2{
                            font-size: 30px;
                            line-height: 240px;
                        }
                    }
                }
            }
        }
    }
</style>