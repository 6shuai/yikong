<template>
    <div class="atlas-upload-btn">
        <el-upload
            :action="action"
            :on-success="uploadSuccess"
            :on-error="uploadError"
            :before-upload="beforeUpload"
            :show-file-list="false">
            <el-button size="small" :loading="uploadLoading" type="primary">{{uploadLoading ? '上传中..' : '上传图片'}}</el-button>
        </el-upload>
    </div>
</template>

<script>
import { getUploadImgInfo } from '@/mixins/index';
export default {
    mixins: [getUploadImgInfo],
    data(){
        return {
            action: '/common/upload/',
            uploadLoading: false,
            uploadData: {                    //上传时附带的额外参数
                fileType: 'picture'
            }
        }
    },
    methods: {
        //上传成功
        uploadSuccess(res, file){
            this.uploadLoading = false;
            new Promise((resolve) => {
                this.imageInfo(file, res.obj.path, resolve);
            }).then(res => {
                this.$emit('atlasUploadSuccess', res);
            })
        },

        //上传之前
        beforeUpload(){
            this.uploadLoading = true;
        },

        //上传失败
        uploadError(res){
            this.uploadLoading = false;
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