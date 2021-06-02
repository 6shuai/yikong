<template>
    <div class="atlas-upload-btn">
        <el-upload
            multiple
            :action="action"
            :data="uploadData"
            :on-success="uploadSuccess"
            :on-error="uploadError"
            :before-upload="beforeUpload"
            :on-progress="progress"
            :on-change="handleChange"
            accept="image/*"
            :auto-upload="true"
            :file-list="fileList"
            :show-file-list="false">
            <el-button size="small" :loading="uploadLoading" type="primary">{{uploadLoading ? '上传中..' : '上传图片'}}</el-button>
        </el-upload>
    </div>
</template>

<script>
import { getUploadImgInfo } from '@/mixins/index';
import { uploadUrl } from '@/utils';
export default {
    mixins: [getUploadImgInfo],
    data(){
        return {
            action: uploadUrl,
            uploadLoading: false,
            uploadData: {                    //上传时附带的额外参数
                fileType: 'picture'
            },
            fileList: [],                   //上传列表
            uploadOverCount: 0
        }
    },
    methods: {
        //上传成功
        uploadSuccess(res, file){
            this.uploadOverCount += 1;
            console.log(this.uploadOverCount, this.fileList.length)
            if(this.uploadOverCount == this.fileList.length){
                this.uploadLoading = false;
            }
            new Promise((resolve) => {
                this.imageInfo(file, res.obj.path, resolve);
            }).then(res => {
                this.$emit('atlasUploadSuccess', res);
            })
            
        },

        handleChange(file, fileList) {
            this.fileList = fileList;
        },

        //上传之前
        beforeUpload(){
            this.uploadLoading = true;
        },

        //上传中
        progress(){
            this.uploadLoading = true;
        },

        //上传失败
        uploadError(res){
            this.uploadOverCount += 1;
            if(this.uploadOverCount == this.fileList.length){
                this.uploadLoading = false;
            }
            this.$message.error('上传失败~');
        },
    },
}
</script>
<style lang="scss">
    .atlas-upload-btn{
        display: inline-block;
    }
</style>