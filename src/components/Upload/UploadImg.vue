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
            <!-- <el-upload
                action="https://jsonplaceholder.typicode.com/posts/"
                list-type="picture-card"
                :show-file-list="true"
                :multiple="false"
                :file-list="fileList"
                :on-success="uploadSuccess"
                :on-error="uploadError"
                :on-preview="handlePictureCardPreview"
                :on-remove="handleRemove"
                :before-remove="beforeRemove">
                <i class="el-icon-plus"></i>
            </el-upload> -->

            <el-upload
                action=""
                :data='uploadData'
                :file-list="fileList"
                :on-success="uploadSuccess"
                :on-error="uploadError"
                list-type="picture-card">
                    <i slot="default" class="el-icon-plus"></i>
                    <div slot="file" slot-scope="{file}" class="file-list">
                        <el-image class="el-upload-list__item-thumbnail" fit="cover" :src="file.url"></el-image>
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
                                @click="setCover(file)"
                            >
                                <i class="el-icon-upload2"></i>
                            </span>
                            <span
                                title="删除"
                                class="el-upload-list__item-delete"
                                @click="handleRemove(file)"
                            >
                                <i class="el-icon-delete"></i>
                            </span>
                        </span>
                    </div>
                </el-upload>

        </div>
        <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl">
        </el-dialog>
    </div>
</template>
<script>
export default {
    // 是否多图，  图片列表  ,   是否显示设置默认图
    props: ['isArray', 'imgList', 'showCover'],
    data(){
        return {
            dialogVisible: false,            //大图 modal
            dialogImageUrl: '',              //大图url
            fileList: undefined,
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
        uploadSuccess(res){
            console.log(res)
        },

        //上传失败
        uploadError(res){
            this.$message.error('上传失败~');
        },

        //设置为封面默认图片
        setCover(file){
            this.$emit('showDefault', file.id);
        },
        
        //删除之前
        handleRemove(file) {
            this.$confirm('此操作将删除当前图片, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
            }).then(() => {
                new Promise((resolve, reject) => {
                    this.$emit('deleteImg', file.id, resolve);
                }).then(res => {
                    this.handleRemoveSuccess(file);
                })
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });
        },

        //删除成功
        handleRemoveSuccess(file){
            let index = null;
            fileList.forEach((item, i) => {
                if(item.id === file.id){
                    index = i;
                }
            })
            this.fileList.splice(index, 1);
            this.$message.success('删除成功~');
        },

        //放大图片
        handlePictureCardPreview(file) {
            this.dialogImageUrl = file.url;
            this.dialogVisible = true;
        },

        changeImgUri(){
            if(this.imgList && this.imgList instanceof Array){
                let s = JSON.parse(JSON.stringify(this.imgList));
                s.forEach(item => {
                    item.url = item.uri;
                    delete item.uri;
                })
                this.fileList = s;
            }else{
                this.fileList = this.imgList;
            }
        }
    },
    watch: {
        imgList(o, n){
            this.changeImgUri();
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
            width: 120px;
            height: 120px;
        }
        .el-upload--picture-card{
            width: 120px;
            height: 120px;
            line-height: 120px;
        }
        .file-list{
            width: 100%;
            height: 100%;
        }
    }
</style>