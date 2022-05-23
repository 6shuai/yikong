<!--
 * @Author: liushuai
 * @Date: 2022-03-01 15:14:25
 * @LastEditors: liushuai
 * @LastEditTime: 2022-03-02 17:29:39
 * @Description: file content
 * @FilePath: \pclient\src\views\project\components\MaterialSelectScreenLayout.vue
-->
<template>
    <div class="materal-select-screen-layout">
        <div class="select-screen-layout mt20 mb20" @click="handleShowDialog">
            <el-button type="primary" plain size="small">选择屏幕布局模板</el-button>
        </div>

        <!-- <div 
            class="drag-upload-wrap" 
            id="drop_area"
            :class="borderhover ? 'active' : ''"
            v-loading="uploadLoading"
            element-loading-text="上传中"
        >
            <i class="el-icon-upload"></i>
            <input type="file" accept="image/*, .mp4" @change="handleChangeFile">
            <div class="el-upload__text">拖到此处，或<em>点击上传</em></div>
        </div> -->


        <screen-layout 
            v-if="selectedScreenTemplate" 
            :screen="selectedScreenTemplate" 
            :maxWidth="1000"
        >
            <template v-slot="dataDefalut">
            
                <img 
                    class="content-image"
                    v-if="screenLayoutImage[dataDefalut.index]"
                    :src="screenLayoutImage[dataDefalut.index].img" 
                >

                <div class="content-detail" v-if="screenLayoutImage[dataDefalut.index]">
                    <p>{{ screenLayoutImage[dataDefalut.index].displayName }}</p>
                </div>
        
                <div class="select-content">
                    <span @click="handleSelectContent(dataDefalut.index)">选择素材</span>
                    <span @click="handleAddContent(dataDefalut.index)">新建素材</span>
                </div>
            </template>
        </screen-layout>


        <!-- 选择内容 -->
        <material-select-content 
            ref="selectContent"
            @selectResult="selectResult"
        ></material-select-content>

        <!-- 新建内容 -->
        <material-add-content 
            ref="addContent"
            @selectResult="selectResult"
        ></material-add-content>


        <el-dialog
            width="1200px"
            title="选择屏幕布局模板"
            :visible.sync="showScreenLayoutList"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            append-to-body
        >  
            <screen-layout-template-list 
                ref="screenLayoutTemplateList"
                @layoutTemplateSelected="layoutTemplateSelected"
            ></screen-layout-template-list>

            <span slot="footer" class="dialog-footer">
                <el-button @click="showScreenLayoutList = false">取 消</el-button>
                <el-button
                    :disabled="screenTemplateInfo ? false : true"
                    type="primary"
                    @click="handleSaveSelect"
                    >确 定</el-button
                >
            </span>
        </el-dialog>
    </div>
</template>

<script>
import ScreenLayoutTemplateList from '@/views/screenLayout/components/ScreenLayoutTemplateList'
import MaterialSelectContent from './MaterialSelectContent'
import MaterialAddContent from './MaterialAddContent'
import ScreenLayout from '@/views/screenLayout/components/ScreenLayout'
import { videoShot } from '@/mixins/UploadVideoShot'
import { ajaxUrl } from '@/utils'

export default {
    components: {
        ScreenLayoutTemplateList,
        MaterialSelectContent,
        MaterialAddContent,
        ScreenLayout
    },
    props: ['selectedScreenDuration'],
    mixins: [videoShot],
    data() {
        return {
            showScreenLayoutList: false,
            screenTemplateInfo: undefined,

            // 选中的屏幕模板详情
            selectedScreenTemplate: undefined,

            // 屏幕布局图片
            screenLayoutImage: [],

            // 选择的屏幕分区 index
            splitScreenIndex: null,

            // 时长最长的内容
            maxContentDuration: null,

            // 上传文件信息
            fileInfo: {},

            // 上传素材接口
            uploadMaterialUrl: 'user/project/upload',
            borderhover: false,

            // 文件是否上传中
            uploadLoading: false
        }
    },
    mounted() {
        // let _this = this;
        // var dropbox = document.getElementById('drop_area');
        // dropbox.addEventListener("drop",this.enentDrop,false)
        // dropbox.addEventListener("dragleave",function (e) {
        //     e.stopPropagation();
        //     e.preventDefault();
        //     _this.borderhover =  false;
        // })
        // dropbox.addEventListener("dragenter",function (e) {
        //     e.stopPropagation();
        //     e.preventDefault();
        //     _this.borderhover =  true;
        // })
        // dropbox.addEventListener("dragover",function (e) {
        //     e.stopPropagation();
        //     e.preventDefault();
        //     _this.borderhover =  true
        // })
    },
    methods: {
        // 显示屏幕布局模板
        handleShowDialog(){
            this.showScreenLayoutList = true

            this.$nextTick(() => {
                this.$refs.screenLayoutTemplateList.getScreenTemplateList('project')
            })
        },
        
        // 打开选择内容 窗口
        handleSelectContent(index){
            this.splitScreenIndex = index
            this.$refs.selectContent.showSelectContentDialog()
        },

        // 打开新建内容 窗口
        handleAddContent(index){
            this.splitScreenIndex = index
            this.$refs.addContent.showCreateContent = true
        },

        // 显示选中的内容
        selectResult({ id, displayName, duration, image }){
            
            for(let i = 0; i < this.screenLayoutImage.length; i++){
                // 
                if(this.screenLayoutImage[i] && Math.abs(Math.ceil(this.screenLayoutImage[i].duration) - Math.ceil(duration)) > 1 && i != this.splitScreenIndex){
                    this.$message.warning('投放的素材时长不一致, 请重新投放~')
                    return false
                }

                try {
                    this.maxContentDuration = (!this.screenLayoutImage[i] || duration > this.screenLayoutImage[i].duration) ? duration : this.screenLayoutImage[i].duration
                } catch (error) {
                    
                }
            }

            this.$set(this.screenLayoutImage, this.splitScreenIndex, {
                // 内容缩略图
                img: image,

                // 内容时长
                duration,

                // 内容名称
                displayName,

                // 逻辑区域id
                regionId: this.selectedScreenTemplate.logicRegionSubs[this.splitScreenIndex].id,
                
                // 内容id
                contentId: id
            })

            
            console.log('------->', this.maxContentDuration)
            this.$emit('setScreenLayoutData', {
                screenLayout: this.screenTemplateInfo.id,
                publishedMaterialRegions: this.screenLayoutImage
            }, this.maxContentDuration)
        },


        // 选定模板
        layoutTemplateSelected(timelineRegions, data){
            this.screenTemplateInfo = data
        },

        // 保存选中的模板
        handleSaveSelect(){
            this.selectedScreenTemplate = this.screenTemplateInfo
            this.showScreenLayoutList = false
            this.$emit('setScreenLayoutData', {}, null)
            this.screenLayoutImage = new Array(this.selectedScreenTemplate.logicRegionSubs.length)
        },

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
            console.log(this.file)
        },

        // 获取图片视频 宽高 大小
        getFileInfo(file){
            this.uploadLoading = true
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
                this.uploadLoading = false
                this.$message.success('上传成功~')
            }).catch(err => {
                this.uploadLoading = false
                this.$message.error('上传失败~')
            })
        }
    }
}
</script>

<style lang="scss" scoped>
    .materal-select-screen-layout{
        .drag-upload-wrap{
            width: 100%;
            border: 1px dashed #878787;
            border-radius: 4px;
            text-align: center;
            padding: 100px 0;
            position: relative;

            &.active{
                border-color: var(--color-primary);
            }

            &:hover{
                border-color: var(--color-primary);
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
    }
</style>