<template>
    <div class="content-add-wrap">
        <el-card class="template-card">
            <el-page-header @back="$router.go(-1)">
                <div slot="content">
                    {{$route.params.id ? '编辑资源' : '创建资源'}}
                </div>
            </el-page-header>
            <el-row :gutter="10" class="mt30" v-loading="loading">
                <el-col :xs="24" :sm="24" :md="12">
                    <el-form 
                        label-width="160px"
                        ref="contentParams"
                        :model="contentParams"
                        :rules="placeRules"
                    >
                        <el-form-item label="资源名称" prop="displayName">
                            <el-input v-model="contentParams.displayName" placeholder="资源名称"></el-input>
                        </el-form-item>
                        <el-form-item label="所属品牌" prop="contentOwner">
                            <el-select v-model="contentParams.contentOwner" filterable placeholder="请选择所属品牌" style="width:100%">
                                <el-option 
                                    v-for="item in groupData" 
                                    :key="item.id"
                                    :label="item.displayName" 
                                    :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="展示图片" prop="image">
                            <upload-img 
                                :imgList="contentParams.image"
                                @uploadImgPath="$set(contentParams, 'image', $event)"
                            ></upload-img>
                        </el-form-item>
                        <el-form-item label="资源类型" prop="contentType">
                            <el-select v-model="contentParams.contentType" @change="selectedType" filterable placeholder="请选择资源类型" style="width:100%">
                                <el-option 
                                    v-for="item in typeList" 
                                    :key="item.id"
                                    :label="item.displayName" 
                                    :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item :label="`上传资源 (${contentTypeName(contentParams.contentType)})`" prop="contentPath">
                            <!-- 上传图片 -->
                            <div v-if="contentParams.contentType === 1">
                                <upload-img 
                                    :isArray="false"
                                    :haveImgInfo="true"
                                    :imgList="contentParams.contentPath"
                                    @uploadImgPath="uploadImgSuccess"
                                ></upload-img>
                            </div>
                            <!-- 上传视频 -->
                            <div v-if="contentParams.contentType === 2">
                                <upload-video 
                                    :url="contentParams.contentPath"
                                    @uploadVideo="uploadVideoSuccess"
                                ></upload-video>
                            </div>
                            
                        </el-form-item>
                        <el-form-item label="分辨率(像素)" class="is-required">
                            <el-row>
                                <el-col :span="11">
                                    <el-form-item prop='width'>
                                        <el-input type="number" :min="1" v-model="contentParams.width" placeholder="宽"></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="2" style="text-align: center">
                                    <span>x</span>
                                </el-col>
                                <el-col :span="11">
                                    <el-form-item prop='height'>
                                        <el-input type="number" :min="1" v-model="contentParams.height" placeholder="高"></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                        </el-form-item>
                        <el-form-item label="分辨率(宽高比)" prop="aspectRatio">
                            <el-select v-model="contentParams.aspectRatio" placeholder="请选择分辨率(宽高比)" style="width:100%">
                                <el-option 
                                    v-for="item in aspectRatioData" 
                                    :key="item.id"
                                    :label="item.width + ' : ' + item.height"
                                    :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="文件容量" prop="size">
                            <el-input type="number" v-model="contentParams.size" placeholder="文件容量">
                                <template slot="append">MB</template>       
                            </el-input>   
                        </el-form-item>
                        <el-form-item label="播放时长" prop="duration" v-if="contentParams.contentType == 2">
                            <el-input type="number" v-model="contentParams.duration" placeholder="播放时长">
                                <template slot="append">秒</template>    
                            </el-input>   
                        </el-form-item>
                        <el-form-item label="">
                            <el-button type="primary" icon="el-icon-check" :loading="btnLoading" @click="placeSureBtn">提  交</el-button>
                        </el-form-item>
                    </el-form>
                </el-col>
            </el-row>
        </el-card>
        
    </div>
</template>
<script>
import { getContentTypeList, contentCreated } from '@/api/content';
import { getOrganizationList, objsDifferMethod } from '@/mixins';
import { getDotPitch, getAspectRatio } from '@/views/screen/mixins';
import { contentDetailData } from '@/views/content/mixins';
import UploadImg from '@/components/Upload/UploadImg';
import UploadVideo from '@/components/Upload/UploadVideo';
export default {
    mixins: [getOrganizationList, getDotPitch, getAspectRatio, contentDetailData, objsDifferMethod],
    data(){
        return {
            contentParams: {
                contentType: 1
            },
            btnLoading: false,               //确定按钮  loading
            placeRules: {
                displayName: [{ required: true, trigger: "blur", message: '请输入场所名称~' }],
                contentType: [{ required: true, trigger: "change", message: '请选择场所类型~' }],
                contentOwner: [{ required: true, trigger: "change", message: '请选择所属品牌~' }],
                image: [{ required: true, trigger: "change", message: '请上传一张展示图片~' }],
                width: [{ required: true, trigger: "blur", message: '请输入宽~' }],
                height: [{ required: true, trigger: "blur", message: '请输入高~' }],
                contentPath: [{ required: true, trigger: "change", message: '请上传资源~' }],
                aspectRatio: [{ required: true, trigger: "change", message: '请选择分辨率(宽高比)~' }],
                size: [{ required: true, trigger: "blur", message: '请输入文件容量~' }],
                duration: [{ required: true, trigger: "blur", message: '请输入播放时长~' }],
            },
            loading: false,
            typeList: [],                  //资源类型列表
            aspectRatio: [
                { width: 1024, height: 768, id: 5 },    //4:3
                { width: 768, height: 1024, id: 6 },    //3:4
                // { width: 1280, height: 1024, id: 1 },   //5:4
                { width: 1920, height: 1080, id: 1 },   //16:9
                { width: 1080, height: 1920, id: 3 },   //9:16
                { width: 1440, height: 900, id: 2 },    //16:10
                { width: 1680, height: 1050, id: 2 },   //16:10
                { width: 1920, height: 1200, id: 2 },   //16:10
                { width: 900, height: 1440, id: 4 },    //10:16
                { width: 1050, height: 1680, id: 4 },   //10:16
                { width: 1200, height: 1920, id: 4 }    //10:16
            ]
        }
    },
    mounted() {
        this.init();
        this.contentTypeList();
    },
    methods: {
        init(){
            if(this.$route.params.id){
                new Promise((resolve) => {
                    this.loading = true;
                    this.initDetail(resolve);
                }).then(res => {
                    this.loading = false;
                    let data = this.resData;
                    this.contentParams = {
                        displayName: data.displayName,
                        contentOwner: data.contentOwnerId,
                        image: data.image,
                        contentType: data.contentTypeId,
                        contentPath: data.contentPath,
                        width: data.width,
                        height: data.height,
                        aspectRatio: data.aspectRatioId,
                        originalSize: data.size,
                        size: (data.size / 1024 / 1024).toFixed(2),
                        duration: data.duration,
                        id: data.id
                    }
                })
            }
        },

        //添加 编辑 场所
        placeSureBtn(){
            this.$refs.contentParams.validate((valid) => {
                if (valid) {
                    if(this.contentParams.id && this.objsDiffer(this.oldParams, this.contentParams)){
                        this.$message.warning('你没有做任何更改~');
                        return
                    }
                    this.btnLoading = true;
                    let copycontent = JSON.parse(JSON.stringify(this.contentParams));
                    copycontent.size = copycontent.originalSize;
                    contentCreated(copycontent).then(res => {
                        this.placeRes(res);
                    })
                }else{
                    this.$message.warning('必填项未填写完整~');
                }
            })
        },

        placeRes(res){
            this.btnLoading = false;
            if(res.code == this.$successCode){
                this.$router.push('/content/index');
                this.$message.success('操作成功~');
            }
        },

        //上传图片成功
        uploadImgSuccess(data){
            this.contentParams = {
                ...this.contentParams,
                ...data
            }
            if(this.contentParams.width && this.contentParams.height){
                this.aspectRatioCompute(this.contentParams.width, this.contentParams.height);
            }
        },

        //上传视频成功
        uploadVideoSuccess(data){
            this.contentParams = {
                ...this.contentParams,
                ...data
            }
            if(this.contentParams.width && this.contentParams.height){
                this.aspectRatioCompute(this.contentParams.width, this.contentParams.height);
            }
        },

        //资源类型列表
        contentTypeList(){
            getContentTypeList().then(res => {
                this.typeList = res.obj;
            })
        },

        //宽高比计算
        aspectRatioCompute(width, height){
            this.aspectRatio.forEach(item => {
                if(item.width == width && item.height == height){
                    this.contentParams.aspectRatio = item.id;
                }
            })
        },

        //选择资源类型  清空资源路径
        selectedType(){
            this.$set(this.contentParams, 'contentPath', '');
        },

        //资源类型名称
        contentTypeName(type){
            let n;
            switch (type) {
                case 1:
                    n = "图片";
                    break;
                case 2:
                    n = "视频";
                    break;
                default:
                    n = "游戏";
                    break;
            }
            return n;
        }
    },
    components: {
        UploadImg,
        UploadVideo
    }
}
</script>
<style lang="scss" scope>
    .content-add-wrap{
        .el-input-group__append{
            width: 55px;
            text-align: center;
            padding: 0;
        }
    }
</style>