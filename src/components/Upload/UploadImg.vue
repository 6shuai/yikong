<template>
    <div class="upload-image-wrap">
        <!-- 单图 -->
        <div v-if="!isArray">   
            <el-upload
                v-loading="uploadLoading"
                :data='uploadData'
                element-loading-text="图片上传中"
                element-loading-spinner="el-icon-loading"
                class="avatar-uploader"
                accept="image/*"
                :action="action"
                :show-file-list="false"
                :on-success="uploadSuccess"
                :before-upload="beforeUpload"
                :on-progress="progress"
                :on-error="uploadError">
                <img v-if="fileList" :src="fileList" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
        </div>
        <!-- 多图 -->
        <div v-else>   
            <ul class="el-upload-list el-upload-list--picture-card">
                <li 
                    class="el-upload-list__item is-success"
                    v-for="(file, index) in fileList"
                    :key="index"
                >
                    <div class="file-list">
                        <el-image class="el-upload-list__item-thumbnail" fit="cover" :src="file.url"></el-image>
                        <div class="top" title="封面图" v-if="file.isDefault"></div>
                        <i class="el-icon-upload2 top-icon" title="封面图" v-if="file.isDefault" ></i>
                        <span class="el-upload-list__item-actions">
                            <span
                                title="预览大图"
                                class="el-upload-list__item-preview"
                                @click="handlePictureCardPreview(file)"
                            >
                                <i class="el-icon-zoom-in"></i>
                            </span>
                            <span
                                v-if="showCover"
                                title="设为列表封面图"
                                class="el-upload-list__item-delete"
                                @click="setCover(file, index)"
                            >
                                <i class="el-icon-upload2"></i>
                            </span>
                            <span
                                title="删除"
                                class="el-upload-list__item-delete"
                                @click="handleRemove(file, index)"
                            >
                                <i class="el-icon-delete"></i>
                            </span>
                        </span>
                    </div>

                </li>
                <li 
                    class="upload-btn" 
                    v-loading="uploadLoading" 
                    element-loading-text="图片上传中"
                    element-loading-spinner="el-icon-loading"
                >
                    <el-upload
                        multiple
                        accept="image/*"
                        :action="action"
                        :data='uploadData'
                        :show-file-list="false"
                        :before-upload="beforeUpload"
                        :on-success="uploadSuccess"
                        :on-error="uploadError"
                        list-type="picture-card">
                        <div slot="default">
                            <i class="el-icon-plus avatar-uploader-icon"></i>
                        </div>
                    </el-upload>
                </li>
            </ul>

        </div>
        <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl">
        </el-dialog>
    </div>
</template>
<script>
import { getUploadImgInfo } from '@/mixins/index';
import { uploadUrl } from '@/utils';
export default {
    // 是否多图，  图片列表  ,   是否显示设置默认图 ,  是否需要图片信息 宽高 大小
    props: ['isArray', 'imgList', 'showCover', 'haveImgInfo'],
    mixins: [getUploadImgInfo],
    data(){
        return {
            dialogVisible: false,            //大图 modal
            dialogImageUrl: '',              //大图url
            fileList: undefined,
            action: uploadUrl,
            uploadLoading: false,
            uploadData: {                    //上传时附带的额外参数
                fileType: 'picture'
            }
        }
    },
    created() {
        this.changeImgUri();
    },
    methods: {
        //上传成功
        uploadSuccess(res, file){
            this.uploadLoading = false;
            //需要返回图片的信息
            if(this.haveImgInfo){
                new Promise((resolve) => {
                    this.imageInfo(file, res.obj, resolve);
                }).then(res => {
                    this.$emit('uploadImgPath', res);
                })
            }else{
                this.$emit('uploadImgPath', res.obj.path);
            }

            if(this.isArray){
                this.fileList.push({
                    url: res.obj.path
                })
            }else{
                this.fileList = res.obj.path;
            }
        },

        //上传失败
        uploadError(res){
            this.uploadLoading = false;
            this.$message.error('上传失败~');
        },

        //设置为封面默认图片
        setCover(file, index){
            this.$emit('showDefault', file.id, index);
        },
        
        //删除之前
        handleRemove(file, index) {
            //图片有id 删除走接口
            let data = {
                index: index,
                ...file
            }
            if(file.id || file.isDefault){
                this.$confirm('此操作将删除当前图片, 是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                }).then(() => {
                    new Promise((resolve, reject) => {
                        this.$emit('deleteImg', data, resolve);
                    }).then(res => {
                        this.handleRemoveSuccess(file, index);
                    })
                }).catch(() => {
                    // this.$message({
                    //     type: 'info',
                    //     message: '已取消删除'
                    // });
                });
            }else{
                this.$emit('deleteImg', data);
                this.handleRemoveSuccess(file, index);
            }
        },

        //删除成功
        handleRemoveSuccess(file, index){
            this.fileList.splice(index, 1);
            if(file.id) this.$message.success('删除成功~');
        },

        //放大图片
        handlePictureCardPreview(file) {
            this.dialogImageUrl = file.url;
            this.dialogVisible = true;
        },

        //上传之前
        beforeUpload(){
            this.uploadLoading = true;
        },

        changeImgUri(data){
            if(data) this.imgList = data;
            if(this.imgList && this.imgList instanceof Array){
                let s = JSON.parse(JSON.stringify(this.imgList));
                s.forEach(item => {
                    item.url = item.uri || item.url || item.print;
                    delete item.uri;
                    delete item.print
                })
                this.fileList = s;
            }else{
                this.fileList = this.imgList;
            }
        },

        progress(e){
            console.log(e)
        }
    },
    watch: {
        imgList(o, n){
            this.changeImgUri()
        }
    },
}
</script>
<style lang="scss">
    .upload-image-wrap{
        .header-img{
            width: 100%;
            height: 100%;
            border: 6px;
        }
        .avatar-uploader .el-upload {
            width: 120px;
            height: 120px;
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
            width: 120px;
            height: 120px;
            line-height: 120px;
            text-align: center;
        }
        .avatar, .el-upload-list--picture-card .el-upload-list__item {
            width: 118px;
            height: 118px;
        }
        .el-upload--picture-card{
            width: 120px;
            height: 120px;
            line-height: 120px;
        }
        .file-list{
            width: 100%;
            height: 100%;
            .top{
                position: absolute;
                top: -42px;
                right: -4px;
                z-index: 20;
                transform: rotate(45deg);
            }
            .top-icon{
                position: absolute;
                top: 0;
                right: 0;
                z-index: 30;
                color: #fff;
            }
            .top:before{
                position: absolute;
                content: '';
                border-top: 25px transparent dashed;
                border-left: 25px transparent dashed;
                border-right: 25px transparent dashed;
                border-bottom: 25px #fff solid;
            }
            .top:before{
                border-bottom: 25px var(--color-info) solid;
            }
        }
        .upload-btn{
            display: inline-block;
            vertical-align: top;
        }
    }
</style>