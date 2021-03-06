<template>
    <div class="game-package-manage">
        <div class="mb20">
            <el-radio-group 
                @change="selectedVersion"
                size="small" 
                v-model="versionType">
                <el-radio-button :label="2">线上版本</el-radio-button>
                <el-radio-button :label="1">测试版本</el-radio-button>
                <el-radio-button :label="0">开发版本</el-radio-button>
            </el-radio-group>
            <el-button
                class="upload-package"
                v-if="hasPerm($store.state.permission.gamesPrem, 'UploadPackage')"
                icon="el-icon-upload2"
                size="small"
                type="primary"
                @click.stop="showUploadDialog"
                >上传游戏包
            </el-button >
        </div>
        
        <package-list :versionType="versionType" ref="packageList"></package-list>
        

        <!-- 上传游戏包 -->
        <el-dialog
            title="上传游戏包"
            :visible.sync="uploadDialog"
            :before-close="handleClose"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            width="600px"
        >
            <el-form
                label-width="160px"
                :rules="upladPackageRules"
                ref="upladPackageForm"
                :model="packageParams"
            >
                <el-form-item label="总版本号" prop="overallVersion">
                    <el-input v-model="packageParams.overallVersion"></el-input>
                </el-form-item>
                <el-form-item label="大屏端版本" prop="screenVersion">
                    <el-input v-model="packageParams.screenVersion"></el-input>
                </el-form-item>
                <el-form-item label="手机端版本" prop="mobileVersion">
                    <el-input v-model="packageParams.mobileVersion"></el-input>
                </el-form-item>
                <el-form-item label="发布信息">
                    <el-input
                        type="textarea"
                        :rows="3"
                        v-model="packageParams.description"
                    ></el-input>
                </el-form-item>
                <el-form-item label="选择游戏包" class="is-require">
                    <el-upload
                        ref="upload"
                        :action="action"
                        :before-upload="beforeUpload"
                        :on-success="uploadSuccess"
                        :on-error="uploadError"
                        :auto-upload="false"
                        :on-change="handleChange"
                        :file-list="fileList"
                    >
                        <el-button
                            v-if="!uploadLoading && !packageParams.screenPackage"
                            slot="trigger"
                            type="primary"
                            icon="el-icon-upload2"
                            >选择游戏包</el-button
                        >
                    </el-upload>
                    <span v-if="uploadPackageSuccess">上传成功~</span>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="uploadDialog = false">取 消</el-button>
                <el-button
                    type="primary"
                    @click="handleSubmit"
                    :loading="uploadDialogLoading"
                    >{{
                        uploadDialogLoading ? "提交中" : "提 交"
                    }}</el-button
                >
            </span>
        </el-dialog>

    </div>
</template>

<script>
import { uploadGamePackage } from "@/utils";
import { packageCreated } from "@/api/game";
import PackageList from '../components/GamePackageList';

export default {
    data(){
        return{
            versionType: 2,
            resData: [], //包列表
            uploadDialog: false,
            uploadLoading: false, //上传中
            packageParams: {},
            action: uploadGamePackage,
            uploadDialogLoading: false, //确定btn loading
            upladPackageRules: {
                overallVersion: [
                    {
                        required: true,
                        message: "请输入总版本号~",
                        trigger: "blur",
                    },
                ],
                mobileVersion: [
                    {
                        required: true,
                        message: "请输入手机端版本号~",
                        trigger: "blur",
                    },
                ],
                screenVersion: [
                    {
                        required: true,
                        message: "请输入大屏端版本号~",
                        trigger: "blur",
                    },
                ],
                description: [
                    {
                        required: true,
                        message: "请输入发布信息~",
                        trigger: "blur",
                    },
                ],
                screenPackage:  [
                    {
                        required: true,
                        message: "请上传游戏包~",
                        trigger: "blur",
                    },
                ],
            },
            uploadPackageSuccess: false, //是否上传成功
            fileList: [],
        }
    },
    computed: {
        gameDetail() {
            return this.$store.state.game.details;
        },
    },
    mounted() {
        this.$refs.packageList.packageListLoad();
    },
    methods: {
        //显示上传游戏包 窗口
        showUploadDialog() {
            this.packageParams = {};
            this.fileList = [];
            this.uploadDialog = true;
            this.uploadPackageSuccess = false;
            this.$nextTick(() => {
                this.$refs["upladPackageForm"].clearValidate();
            });
        },

        handleChange(file, fileList) {
            this.fileList = fileList.slice(-1);
        },

        //上传之前
        beforeUpload() {
            this.uploadLoading = true;
        },

        //上传出错
        uploadError() {
            this.$message.error("上传失败~");
            this.uploadLoading = false;
            this.uploadDialogLoading = false;
            this.$refs.upload.uploadFiles = [];
        },

        //上传成功
        uploadSuccess(res) {
            this.uploadLoading = false;
            if (res.code == this.$successCode) {
                this.uploadPackageSuccess = true;
                res.obj.forEach((item) => {
                    if (item.type === "screen") {
                        this.packageParams.screenPackage = item.path;
                        this.packageParams.screenSize = item.size;
                        this.packageParams.ciphertext = item.ciphertext;
                    } else if (item.type === "mobile") {
                        this.packageParams.mobilePackage = item.path;
                        this.packageParams.mobileSize = item.size;
                    }
                });
                this.uploadSuccessSubmit();
            } else {
                this.uploadError();
            }
        },

        //关闭 上传游戏包
        handleClose() {
            this.uploadDialog = false;
        },

        //点击提交按钮
        handleSubmit() {
            this.$refs.upladPackageForm.validate((valid) => {
                if (valid) {
                    if(!this.$refs.upload.uploadFiles.length){
                        this.$message.warning('请选择游戏包~');
                        return
                    }
                    this.uploadDialogLoading = true;
                    this.packageParams.applicationId = this.$route.params.id;
                    this.$refs.upload.submit();
                }
            });
            
        },

        //上传成功后 提交
        uploadSuccessSubmit(){
            packageCreated(this.packageParams).then((res) => {
                this.uploadDialogLoading = false;
                if (res.code === this.$successCode) {
                    this.$message.success("提交成功~");
                    this.versionType = 0;
                    this.$nextTick(() => {
                        this.selectedVersion();
                        this.uploadDialog = false;
                    })
                }
            });
},



        //选择包版本
        selectedVersion(){
            this.$refs.packageList.packageListLoad();
        }

    },
    components: {
        PackageList
    }
}
</script>

<style lang="scss">
@import "../../../styles/variables.scss";
.game-package-manage {
    .upload-package{
        float: right;
    }

    .package-list-wrap{
        border: 1px solid #e5e5e5;
        margin-bottom: 20px;
        padding: 10px;
        background: #fff7f7;
    }
    .type-card {
        margin-bottom: 10px;
        &:last-child {
            margin: 0;
        }
    }
    h3 {
        padding-bottom: 10px;
        line-height: 32px;
        &:hover{
            color: #364f6b;
            text-decoration: underline;
        }

    }

    .version-list {
        .el-form-item {
            margin-bottom: 0px;
        }
        .version {
            text-align: right;
            padding-top: 6px;
            line-height: 26px;
            .version-wrap {
                text-align: left;
                display: inline-block;
            }
        }
        .no-version {
            padding: 20px;
            font-size: 14px;
            color: #999;
        }
    }
}
</style>