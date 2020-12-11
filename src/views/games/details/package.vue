<template>
    <div class="game-package-manage">
        <div class="mb20">
            <el-button
                v-if="hasPerm($store.state.permission.gamesPrem, 'UploadPackage')"
                icon="el-icon-upload2"
                size="small"
                type="primary"
                @click.stop="showUploadDialog"
                >上传游戏包
            </el-button >
        </div>

        <package-list :versionType="2" ref="productionVersion"></package-list>
    
        <package-list :versionType="1" ref="testVersion"></package-list>
    
        <package-list :versionType="0" ref="developmentVersion"></package-list>
        

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
                <el-form-item label="上传" prop="url">
                    <el-upload
                        :action="action"
                        :show-file-list="false"
                        :before-upload="beforeUpload"
                        :on-success="uploadSuccess"
                        :on-error="uploadError"
                    >
                        <div slot="default">
                            <el-button
                                type="primary"
                                :loading="uploadLoading"
                                icon="el-icon-upload2"
                                >{{
                                    uploadLoading ? "上传中" : "上传游戏包"
                                }}</el-button
                            >
                        </div>
                    </el-upload>
                    <span v-if="uploadPackageSuccess">上传成功~</span>
                </el-form-item>
                <el-form-item label="大屏端游戏包存放路径">
                    <el-input
                        readonly
                        v-model="packageParams.screenPackage"
                    ></el-input>
                </el-form-item>
                <el-form-item
                    label="大屏端游戏包大小"
                    v-if="packageParams.screenSize"
                >
                    <div>{{ packageParams.screenSize }}</div>
                </el-form-item>
                <el-form-item label="手机端的游戏访问地址">
                    <el-input
                        readonly
                        v-model="packageParams.mobilePackage"
                    ></el-input>
                </el-form-item>
                <el-form-item
                    label="手机端游戏包大小"
                    v-if="packageParams.mobileSize"
                >
                    <div>{{ packageParams.mobileSize }}</div>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="uploadDialog = false">取 消</el-button>
                <el-button
                    type="primary"
                    @click="handleSubmit"
                    :loading="uploadDialogLoading"
                    >确 定</el-button
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
            },
            uploadPackageSuccess: false, //是否上传成功
        }
    },
    computed: {
        gameDetail() {
            return this.$store.state.game.details;
        },
    },
    methods: {
        //显示上传游戏包 窗口
        showUploadDialog() {
            this.packageParams = {};
            this.uploadDialog = true;
            this.$nextTick(() => {
                this.$refs["upladPackageForm"].clearValidate();
            });
        },

        //上传之前
        beforeUpload() {
            this.uploadLoading = true;
        },

        //上传出错
        uploadError() {
            this.$message.error("上传失败~");
            this.uploadLoading = false;
        },

        //上传成功
        uploadSuccess(res) {
            this.uploadLoading = false;
            if (res.code == this.$successCode) {
                this.$message.success("上传成功~");
                this.uploadPackageSuccess = true;
                res.obj.forEach((item) => {
                    if (item.type === "screen") {
                        this.packageParams.screenPackage = item.path;
                        this.packageParams.screenSize = item.size;
                    } else if (item.type === "mobile") {
                        this.packageParams.mobilePackage = item.path;
                        this.packageParams.mobileSize = item.size;
                    }
                });
            } else {
                this.$message.success(res.message);
            }
        },

        //关闭 上传游戏包
        handleClose() {
            this.uploadDialog = false;
        },

        //提交
        handleSubmit() {
            this.$refs.upladPackageForm.validate((valid) => {
                if (valid) {
                    this.uploadDialogLoading = true;
                    this.packageParams.applicationId = this.$route.params.id;
                    packageCreated(this.packageParams).then((res) => {
                        this.uploadDialogLoading = false;
                        if (res.code === this.$successCode) {
                            this.$message.success("提交成功~");
                            this.uploadDialog = false;
                            
                        }
                    });
                }
            });
        },

        //更新游戏包列表
        updateGameList(type){
            switch(type){
                case 0:
                    this.$refs.developmentVersion.updateData();
                    break;
                case 1:
                    this.$refs.testVersion.updateData();
                    break;
                case 2:
                    this.$refs.productionVersion.updateData();
                    break;
            }
        }

    },
    components: {
        PackageList
    }
}
</script>

<style lang="scss" scope>
@import "../../../styles/variables.scss";
.game-package-manage {
    .package-list-wrap{
        border: 1px solid #e5e5e5;
        margin-bottom: 20px;
        padding: 10px;
        background: #fff7f7;

        .package-scrollbar{
            height: 700px;
            .el-scrollbar__wrap{
                overflow-x: hidden;
            }
        }
    }
    .type-card {
        cursor: pointer;
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