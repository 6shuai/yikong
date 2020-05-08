<template>
    <div class="upload-image-wrap">
        <!-- 单图 -->
        <div v-if="!isArray">   
            <el-upload
                class="avatar-uploader"
                action=""
                :show-file-list="false"
                :on-success="uploadSuccess"
                :on-error="uploadError">
                <img v-if="imgList" :src="imgList" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
        </div>
        <!-- 多图 -->
        <div v-else>   
            <el-upload
                action="https://jsonplaceholder.typicode.com/posts/"
                list-type="picture-card"
                :show-file-list="true"
                :multiple="false"
                :file-list="fileList"
                :on-success="uploadSuccess"
                :on-error="uploadError"
                :on-preview="handlePictureCardPreview"
                :on-remove="handleRemove">
                <i class="el-icon-plus"></i>
            </el-upload>
        </div>
        <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl">
        </el-dialog>
    </div>
</template>
<script>
export default {
    // 是否多图，  图片列表
    props: ['isArray', 'imgList'],
    data(){
        return {
            dialogVisible: false,            //大图 modal
            dialogImageUrl: '',              //大图url
        }
    },
    computed: {
        fileList(){
            let s = JSON.parse(JSON.stringify(this.imgList));
            s.forEach(item => {
                item.url = item.uri;
                delete item.uri;
            })
            return s;
        }
    },
    methods: {
        //上传成功
        uploadSuccess(res){

        },

        //上传失败
        uploadError(res){
            this.$message.error('上传失败~');
        },
        
        //删除
        handleRemove(file, fileList) {
            console.log(file, fileList);
        },

        //放大图片
        handlePictureCardPreview(file) {
            this.dialogImageUrl = file.url;
            this.dialogVisible = true;
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
            width: 100px;
            height: 100px;
            line-height: 100px;
            text-align: center;
        }
        .avatar, .el-upload-list--picture-card .el-upload-list__item {
            width: 100px;
            height: 100px;
        }
        .el-upload--picture-card{
            width: 100px;
            height: 100px;
            line-height: 100px;
        }
    }
</style>