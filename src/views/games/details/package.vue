<template>
    <div class="game-package-manage" v-loading="dataLoading">
        
        <div v-if="resData.length">
            <el-card 
                class="type-card"
                v-for="(item, index) in resData"
                :key="index"
            >
                <h3>{{item.versionType==0 ? '开发版本' : item.versionType==1 ? '测试版本' : '线上版本'}}
                    <i class="el-icon-video-play"></i>
                </h3>
                <el-row class="version-list">
                    <el-col :span="4" class="version">
                        <div class="version-wrap">
                            <p>版本号</p>
                            <p>{{item.overallVersion || '-'}}</p>
                        </div>
                    </el-col>
                    <el-col :span="16">
                        <el-form 
                            label-width="120px"
                        >
                            <el-form-item label="发布时间">
                                <span>{{formatTime(item.releaseTime)}}</span>
                            </el-form-item>
                            <el-form-item label="发布信息">
                                <span>{{item.description}}</span>
                            </el-form-item>
                            <el-form-item label="手机端版本">
                                <span>{{item.mobileVersion || '-'}}</span>
                            </el-form-item>
                            <el-form-item label="大屏端版本">
                                <span>{{item.screenVersion || '-'}}</span>
                            </el-form-item>
                        </el-form>
                    </el-col>
                    <el-col :span="4">
                        <p v-if="item.versionType==2">
                            <el-button size="small" type="primary" @click="$refs.selectPackageVersion.showProductionList()">回退</el-button>
                        </p>
                        <p v-if="item.versionType==1">
                            <el-button size="small" type="primary" @click="handleOnline(item.id)" :loading="onlineLoading">上线</el-button>
                        </p>
                        <div v-if="item.versionType==0">
                            <p><el-button size="small" @click="handleSubmitTest(item.id)" :loading="submitTestLoading" type="primary">提交测试</el-button></p>
                            <br />
                            <p><el-button size="small" type="primary" @click="showUploadDialog" plain>上传</el-button></p>
                        </div>
                    </el-col>
                </el-row>
            </el-card>

        </div>

        <el-card class="type-card" v-else>
            <h3>开发版本</h3>
            <el-row class="version-list">
                <el-col :span="20">
                    <div class="no-version">暂无开发版本,请上传游戏包。</div>
                </el-col>
                    
                <el-col :span="4">
                    <p><el-button size="small" type="primary" @click="showUploadDialog" plain>上传</el-button></p>
                </el-col>
            </el-row>
        </el-card>

        <!-- 上传游戏包 -->
        <el-dialog
            title="上传游戏包"
            :visible.sync="uploadDialog"
            :before-close="handleClose"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            width="600px">
            <el-form 
                label-width="160px"
                :rules="upladPackageRules"
                ref="upladPackage"
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
                    <el-input type="textarea" :rows="3" v-model="packageParams.description"></el-input>
                </el-form-item>
                <el-form-item label="上传" prop="url">
                    <el-upload
                        :action="action"
                        :show-file-list="false"
                        :before-upload="beforeUpload"
                        :on-success="uploadSuccess"
                        :on-error="uploadError">
                        <div slot="default">
                            <el-button type="primary" :loading="uploadLoading" icon="el-icon-upload2">{{uploadLoading ? '上传中' : '上传游戏包'}}</el-button>
                        </div>
                    </el-upload>
                    <span v-if="uploadPackageSuccess">上传成功~</span>
                </el-form-item>
                <el-form-item label="大屏端游戏包存放路径">
                    <el-input readonly v-model="packageParams.screenPackage"></el-input>
                </el-form-item>
                <el-form-item label="大屏端游戏包大小" v-if="packageParams.screenSize">
                    <div>{{packageParams.screenSize}}</div>
                </el-form-item>
                <el-form-item label="手机端的游戏访问地址">
                    <el-input readonly v-model="packageParams.mobilePackage"></el-input>
                </el-form-item>
                <el-form-item label="手机端游戏包大小" v-if="packageParams.mobileSize">
                    <div>{{packageParams.mobileSize}}</div>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="uploadDialog=false">取 消</el-button>
                <el-button type="primary" @click="handleSubmit" :loading="uploadDialogLoading">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 回退 选择游戏包版本 -->
        <select-package-version 
            ref="selectPackageVersion"
            @updateVersion="init"
        ></select-package-version>

    </div>
</template>
<script>
import { uploadGamePackage } from '@/utils';
import { timeDisposeTool } from '@/mixins';
import { packageCreated, packageList, packageSubmitTest, packageOnline } from '@/api/game';
import SelectPackageVersion from '../components/SelectPackageVersion';
export default {
    mixins: [timeDisposeTool],
    data(){
        return{
            dataLoading: false,
            resData: [],                           //包列表
            params: {},
            uploadDialog: false,
            uploadLoading: false,                   //上传中
            packageParams: {},       
            action: uploadGamePackage,
            uploadDialogLoading: false,             //确定btn loading 
            upladPackageRules: {
                overallVersion: [{required: true, message: '请输入总版本号~', trigger: 'blur'}],
                mobileVersion: [{required: true, message: '请输入手机端版本号~', trigger: 'blur'}],
                screenVersion: [{required: true, message: '请输入大屏端版本号~', trigger: 'blur'}],
                description: [{required: true, message: '请输入发布信息~', trigger: 'blur'}],
                // url: [{required: true, message: '请上传游戏包~', trigger: 'blur'}]
            },
            submitTestLoading: false,              //提交测试btn loading
            onlineLoading: false,                  //上线btn  loading
            uploadPackageSuccess: false,           //是否上传成功
        }
    },
    mounted () {
        this.init();
    },
    methods: {
        init(){
            this.dataLoading = true;
            this.params.applicationId = this.$route.params.id;
            packageList(this.params).then(res =>{
                this.dataLoading = false;
                if(res.code === this.$successCode){
                    this.resData = res.obj;
                    this.resData.sort((a, b) => {
                        return b.versionType - a.versionType
                    })
                }
            })
        },

        //显示上传游戏包 窗口
        showUploadDialog(){
            this.packageParams = {};
            this.uploadDialog = true;
        },

        //上传之前
        beforeUpload(){
            this.uploadLoading = true;
        },

        //上传出错
        uploadError(){
            this.$message.error('上传失败~');
            this.uploadLoading = false;
        },

        //上传成功
        uploadSuccess(res){
            this.uploadLoading = false;
            if(res.code == this.$successCode){
                this.$message.success('上传成功~');
                this.uploadPackageSuccess = true;
                res.obj.forEach(item =>{
                    if(item.type === 'screen'){
                        this.packageParams.screenPackage = item.path;
                        this.packageParams.screenSize = item.size;
                    }else if(item.type === 'mobile'){
                        this.packageParams.mobilePackage = item.path;
                        this.packageParams.mobileSize = item.size;
                    }
                })
            }else{
                this.$message.success(res.message);
            }
        },

        //提交
        handleSubmit(){
            this.$refs.upladPackage.validate((valid) => {
                if (valid) {
                    this.uploadDialogLoading = true;
                    this.packageParams.applicationId = this.$route.params.id;
                    packageCreated(this.packageParams).then(res => {
                        this.uploadDialogLoading = false;
                        if(res.code === this.$successCode){
                            this.$message.success('提交成功~');
                            this.uploadDialog = false;
                            this.init();
                        }
                    })
                }
            })
        },
        
        //关闭 上传游戏包
        handleClose(){
            this.uploadDialog = false;
        },

        //提交测试
        handleSubmitTest(id){
            this.submitTestLoading = true;
            packageSubmitTest(id).then(res => {
                this.submitTestLoading = false;
                if(res.code === this.$successCode){
                    this.$message.success('提交测试成功~');
                    this.init();
                }
            })
        },

        //上线
        handleOnline(id){
            this.onlineLoading = true;
            packageOnline(id).then(res => {
                this.onlineLoading = false;
                if(res.code === this.$successCode){
                    this.$message.success('上线成功~');
                    this.init();
                }
            })
        }
    },
    components: {
        SelectPackageVersion
    }
}
</script>

<style lang="scss">
    @import '../../../styles/variables.scss';
    .game-package-manage{
        .type-card{
            margin-bottom: 20px;
            &:last-child{
                margin: 0;
            }
        }
        h3{
            padding-bottom: 10px;
            i{
                cursor: pointer;
                &:hover{
                    color: $--color-primary;
                }
            }
        }

        .version-list{
            .el-form-item{
                margin-bottom: 0px;
            }
            .version{
                text-align: right;
                padding-top: 6px;
                line-height: 26px;
                .version-wrap{
                    text-align: left;
                    display: inline-block;
                }
            }
            .no-version{
                padding: 20px;
                font-size: 14px;
                color: #999;
            }

        }
    }
</style>