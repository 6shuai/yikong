<template>
    <div class="content-add-form">
        <el-form 
            label-width="160px"
            ref="contentParams"
            :model="contentParams"
            :rules="placeRules"
        >
            <el-row :gutter="10" class="mt30" v-loading="loading">
                <el-col :xs="24" :sm="24" :md="20" :lg="12">
                    <el-form-item label="内容名称" prop="displayName">
                        <el-input v-model="contentParams.displayName" placeholder="内容名称"></el-input>
                    </el-form-item>
                    <el-form-item label="所属品牌" prop="brand">
                        <el-select v-model="contentParams.brand" filterable placeholder="请选择所属品牌" style="width:100%">
                            <el-option 
                                v-for="item in groupData" 
                                :key="item.id"
                                :label="item.displayName" 
                                :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <group-list 
                        v-if="!contentParams.id"
                        propValue="groupIds"
                        @groupSelected="$set(contentParams, 'groupIds', $event)"
                    ></group-list>

                    <el-form-item label="内容类型" prop="contentType">
                        <el-select v-model="contentParams.contentType" @change="selectedType" filterable placeholder="请选择内容类型" style="width:100%">
                            <el-option 
                                v-for="item in typeList" 
                                :key="item.id"
                                :label="item.displayName" 
                                :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="播放时长" prop="duration" v-if="contentParams.contentType">
                        <el-input type="number" v-model="contentParams.duration"  @change="handleDuration" :min="1" placeholder="播放时长">
                            <template slot="append">秒</template>    
                        </el-input>   
                    </el-form-item>



                    <el-form-item :label="`上传内容 (${contentTypeName(contentParams.contentType)})`" prop="contentPath" v-if="contentParams.contentType == 1 || contentParams.contentType == 2">
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
                                @uploadVideoCover="uploadVideoCover"
                            ></upload-video>
                        </div>
                        
                    </el-form-item>

                    <el-form-item :label="`上传内容 (图集)`" class="is-required" v-if="contentParams.contentType === 4">

                        <div class="atlas-top mb10">
                            <!-- 上传图片 -->
                            <atlas-upload-img @atlasUploadSuccess="atlasUploadSuccess(1, $event)"></atlas-upload-img>
                            <!-- 上传视频 -->
                            <atlas-upload-video
                                :videoPoster="contentParams.image"
                                @atlasUploadSuccess="atlasUploadSuccess(2, $event)"
                                @uploadVideoCover="uploadVideoCover"
                            ></atlas-upload-video>
                            <!-- 选择内容 -->
                            <el-button size="small" type="primary" @click="$refs.contentlist.showContentList=true">选择内容</el-button>
                        </div>
                        
                        <!-- 图集列表 -->
                        <ul class="el-upload-list el-upload-list--picture-card">
                            <li class="atlas-list" v-for="(item, index) in atlasData" :key="index">
                                <div class="el-upload-list__item is-success">
                                    <el-image v-if="item.image" fit="cover" class="el-upload-list__item-thumbnail" :src="item.image"></el-image>
                                    <el-image v-if="item.contentType==1" class="el-upload-list__item-thumbnail" fit="cover" :src="item.image ? item.image : item.contentPath"></el-image>
                                    <video v-if="item.contentType==2" :src="item.contentPath" class="video"></video>
                                    <span class="el-upload-list__item-actions">
                                        <span
                                            title="预览"
                                            class="el-upload-list__item-preview"
                                            @click="previewData=item;dialogVisible=true"
                                        >
                                            <i :class="item.contentType==2 ? 'el-icon-video-play' : 'el-icon-zoom-in'"></i>
                                        </span>  
                                        <span
                                            title="删除"
                                            class="el-upload-list__item-delete"
                                            @click="contentDelete(index, item.id)"
                                        >
                                            <i class="el-icon-delete"></i>
                                        </span>
                                    </span>
                                </div>
                                <div class="duration">
                                    <el-input-number size="small" v-model="item.duration" @change="handleContentDuration" placeholder="播放时长" controls-position="right" :min="1"></el-input-number>
                                    <span class="text">秒</span>
                                </div>
                            </li>
                        </ul>
                        
                    </el-form-item>


                    <el-form-item label="直播地址" prop="streamUri" v-if="contentParams.contentType == 5">
                        <el-input v-model="contentParams.streamUri" placeholder="直播地址"></el-input>
                    </el-form-item>
                    <el-form-item label="直播协议" prop="protocolId" v-if="contentParams.contentType == 5">
                        <el-select v-model="contentParams.protocolId" placeholder="请选择直播协议类型" style="width:100%">
                            <el-option 
                                v-for="item in liveAgreementData" 
                                :key="item.id"
                                :label="item.displayName" 
                                :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item label="展示图片" prop="image">
                        <upload-img 
                            :imgList="contentParams.image"
                            @uploadImgPath="$set(contentParams, 'image', $event), $set(contentParams, 'newUpload', 1)"
                        ></upload-img>
                    </el-form-item>


                    <div>
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
                        <el-form-item label="文件容量" prop="size" v-if="contentParams.contentType != 5">
                            <el-input type="number" disabled v-model="fileSize" placeholder="文件容量">
                                <template slot="append">MB</template>       
                            </el-input>   
                        </el-form-item>

                    </div>
                </el-col>
            </el-row>

            <el-form-item label="">
                <el-button 
                    type="primary" 
                    icon="el-icon-check" 
                    :loading="btnLoading" 
                    @click="placeSureBtn"
                >
                    提  交
                </el-button>
            </el-form-item>

        </el-form>

        <!-- 预览 -->
        <el-dialog width="1000px" :visible.sync="dialogVisible">
            <div class="preview-wrap">
                <video v-if="previewData.contentType==2" :src="previewData.contentPath" controls="controls">您的浏览器不支持视频播放</video>
                <img v-else :src="previewData.contentPath">
            </div>
        </el-dialog>
        
        <!-- 选择内容列表 -->
        <atlas-content-list 
            ref="contentlist"
            :typeList="typeList"
            @selectedContent="selectedContent"
        ></atlas-content-list>
    </div>
</template>

<script>
import { getContentTypeList, contentCreated, atlasDeleteContent, contentLiveAgreement } from '@/api/content';
import { getOrganizationList, objsDifferMethod } from '@/mixins';
import { getDotPitch, getAspectRatio } from '@/views/screen/mixins';
import { contentDetailData } from '@/views/content/mixins';
import UploadImg from '@/components/Upload/UploadImg';
import UploadVideo from '@/components/Upload/UploadVideo';
import AtlasUploadImg from '@/views/content/components/AtlasUploadImg';
import AtlasUploadVideo from '@/views/content/components/AtlasUploadVideo';
import AtlasContentList from '@/views/content/components/AtlasContentList';
import GroupList from '@/components/GroupList/index';

export default {
    mixins: [getOrganizationList, getDotPitch, getAspectRatio, contentDetailData, objsDifferMethod],
    props: ['contentId', 'source'],
    computed: {
        fileSize(){
            return (this.contentParams.size / 1024 / 1024).toFixed(2)
        }
    },
    data(){
        return {
            contentParams: {
                contentType: 1,
                duration: 15
            },
            btnLoading: false,               //确定按钮  loading
            placeRules: {
                displayName: [{ required: true, trigger: "blur", message: '请输入内容名称~' }],
                contentType: [{ required: true, trigger: "change", message: '请选择场内容类型~' }],
                brand: [{ required: true, trigger: "change", message: '请选择所属品牌~' }],
                image: [{ required: true, trigger: "change", message: '请上传一张展示图片~' }],
                width: [{ required: true, trigger: "blur", message: '请输入宽~' }],
                height: [{ required: true, trigger: "blur", message: '请输入高~' }],
                contentPath: [{ required: true, trigger: "change", message: '请上传内容~' }],
                aspectRatio: [{ required: true, trigger: "change", message: '请选择分辨率(宽高比)~' }],
                size: [{ required: true, trigger: "blur", message: '请输入文件容量~' }],
                duration: [{ required: true, trigger: "blur", message: '请输入播放时长~' }],
                groupIds: [{ required: true, trigger: "blur", message: '请选择权限群组~' }],
                streamUri: [{ required: true, trigger: "blur", message: '请输入直播地址~' }],
                protocolId: [{ required: true, trigger: "blur", message: '请选择直播协议类型~' }],
            },
            loading: false,
            typeList: [],                  //内容类型列表
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
            ],
            atlasData: [],                              //图集内容
            dialogVisible: false,
            previewData: {},                            //预览的内容
            liveAgreementData: [],                      //直播协议列表
        }
    },
    mounted() {
        this.hasPagePerm('Content').then(res => {
            if(res){
                this.init();
                this.contentTypeList();
            }
        })
    },
    methods: {
        init(){
            if(this.contentId){
                new Promise((resolve) => {
                    this.loading = true;
                    this.initDetail(resolve);
                }).then(res => {
                    this.loading = false;
                    let data = this.resData;
                    this.contentParams = {
                        displayName: data.displayName,
                        brand: data.brandId,
                        image: data.image,
                        contentType: data.contentTypeId,
                        contentPath: data.contentPath,
                        width: data.width,
                        height: data.height,
                        aspectRatio: data.aspectRatioId,
                        size: data.size,
                        duration: data.duration,
                        id: data.id,
                        streamUri: data.streamUri,
                        protocolId: data.protocolId 
                    }

                    if(this.contentParams.contentType === 4){
                        this.atlasData = data.oldContents;
                    }

                    if(this.contentParams.contentType === 5){
                        this.getLiveAgreement();
                    }
                })
            }
        },

        //添加 编辑 场所
        placeSureBtn(){
            this.$refs.contentParams.validate((valid) => {
                if (valid) {
                    if(this.contentParams.contentType == 4){
                        this.handleAtlas();
                        if(!this.contentParams.newContents.length && !this.contentParams.oldContents.length){
                            this.$message.warning('图集内容不能为空~');
                            return
                        }
                    }
                    this.btnLoading = true;
                    contentCreated(this.contentParams).then(res => {
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
                this.$message.success('操作成功~');
                if(this.source === 'material'){
                    let { displayName, image } = this.contentParams
                    this.$emit('contentAddSuccess', {
                        displayName,
                        image, 
                        id: res.obj
                    })
                    return 
                }
                this.$router.push('/content/index');
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
            this.contentParams.image = data.contentPath;
            this.$set(this.contentParams, 'newUpload', 1);
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

        //上传视频第一帧作为封面图
        uploadVideoCover(data){
            this.$set(this.contentParams, 'newUpload', 1);
            this.$set(this.contentParams, 'image', data)
        },

        //内容类型列表
        contentTypeList(){
            getContentTypeList().then(res => {
                this.typeList = res.obj;
            })
        },

        //宽高比计算
        aspectRatioCompute(width, height){
            //width / height  
            //  < 1.5  : 4:3
            //  1.5 - 2.3 : 16:9
            // > 2.3       : 21:9

            // id=1(16:9)  id=2(16:10)  id=3(9:16)  id=4(10:16)  id=5(4:3)  id=6(3:4)  id=7(21:9)
            if(width > height){
                let ratio = width / height;
                if(ratio < 1.5){
                    this.contentParams.aspectRatio = 5;
                }else if(ratio >= 1.5 && ratio < 2.3){
                    this.contentParams.aspectRatio = 1;
                }else{
                    this.contentParams.aspectRatio = 7;
                }
            }else{
                let ratio = height / width;
                if(ratio < 1.5){
                    this.contentParams.aspectRatio = 6;
                }else if(ratio >= 1.5 && ratio < 2.3){
                    this.contentParams.aspectRatio = 3;
                }else{
                    this.contentParams.aspectRatio = 7;
                }
            }
            
        },

        //选择内容类型  清空内容路径
        selectedType(){
            this.$delete(this.contentParams, 'contentPath');
            if(this.contentParams.contentType == 4){
                this.$set(this.contentParams, 'duration', null);
            }else if (this.contentParams.contentType == 5) {
                this.getLiveAgreement();
            }else{
                this.$set(this.contentParams, 'duration', 15);
            }
        },

        //内容类型名称
        contentTypeName(type){
            let n;
            switch (type) {
                case 1:
                    n = "图片";
                    break;
                case 2:
                    n = "视频";
                    break;
                case 3:
                    n = "游戏";
                    break;
                default:
                    n = "图集";
                    break;
            }
            return n;
        },

        //图集上传成功
        atlasUploadSuccess(type, data){
            if(!this.atlasData.length){
                let { duration, width, height, size } = data;
                this.contentParams = {
                    ...this.contentParams,
                    duration,
                    width,
                    height,
                    size: 0
                }
                if(this.contentParams.width && this.contentParams.height){
                    this.aspectRatioCompute(this.contentParams.width, this.contentParams.height);
                }
            }
            this.atlasData.push({
                ...data,
                duration: 15,
                contentType: type
            })

        
            this.contentParams.size += data.size;
            this.handleContentDuration();
        },

        //已选中的内容
        selectedContent(data){
            data.forEach(item => {
                this.atlasData.push(item);
            })
            this.handleDuration();
        },

        //删除引用内容
        contentDelete(index, id){
            this.contentParams.duration = this.contentParams.duration - this.atlasData[index].duration;
            if(id){
                atlasDeleteContent(id).then(res => {
                    if(res.code === this.$successCode){
                        this.contentParams.size -= this.atlasData[index].size;
                        this.atlasData.splice(index, 1);
                        if(!this.atlasData.length) this.contentParams.image = ''
                    }
                })
            }else{
                this.contentParams.size -= this.atlasData[index].size;
                this.atlasData.splice(index, 1);
                if(!this.atlasData.length) this.contentParams.image = ''
            }
        },

        //图集类型  保存时操作
        handleAtlas(){
            let newContents = [];
            let oldContents = [];
            this.atlasData.forEach(item => {
                if(item.contentId){
                    oldContents.push(item);
                }else{
                    newContents.push(item);
                }
            })
            this.contentParams.newContents = newContents;
            this.contentParams.oldContents = oldContents;
        },

        //修改总播放时长时
        handleDuration(){
            if(!this.contentParams.duration) {
                this.handleContentDuration();
                return
            };
            //所有视频加起来的时长
            let videoDuration = 0;
            //视频的数量
            let videoNum = 0;
            this.atlasData.forEach((item, index) => {
                if(item.contentType == 2){
                    videoDuration = videoDuration + parseInt(item.duration);
                    videoNum = videoNum + 1;
                }
            })
            let duration = this.contentParams.duration - videoDuration;
            let remainder = duration % (this.atlasData.length - videoNum);
            let num = parseInt(duration/ (this.atlasData.length - videoNum));
            //num 变成负数时  总时长增加
            if(duration < 0) this.contentParams.duration = this.contentParams.duration + Math.abs(duration);
            this.atlasData.forEach((item, index) => {
                if(item.contentType == 2) return;
                if(remainder && index == this.atlasData.length-1){
                    item.duration = num + remainder;
                }else{
                    item.duration = num;
                }
                this.$set(this.atlasData, index, item)
                if(!item.duration){
                    item.duration = 15;
                    this.$set(this.atlasData, index, item);
                    this.handleContentDuration();
                }
            })
        },

        //修改某个内容的时长时  总播放时长跟随 变化，重新计算
        handleContentDuration(){
            let total = 0;
            let s = true;
            this.atlasData.forEach(item => {
                total += item.duration;
                if(item.contentType == 1 && s && !this.contentParams.image){
                    this.contentParams.image = item.contentPath;
                    this.$set(this.contentParams, 'newUpload', 1);
                    s = false;
                }
            })
            this.contentParams.duration = total;
        },

        //获取直播协议 列表
        getLiveAgreement(){
            contentLiveAgreement().then(res => {
                this.liveAgreementData = res.obj;
            })
        }

    },
    components: {
        UploadImg,
        UploadVideo,
        AtlasUploadImg,
        AtlasUploadVideo,
        AtlasContentList,
        GroupList
    }
}
</script>
<style lang="scss">
    .content-add-wrap{
        .el-input-group__append{
            width: 55px;
            text-align: center;
            padding: 0;
        }

        .atlas-list{
            margin: 0 15px 15px 0;
            display: inline-block;

            .duration{
                margin-top: -10px;
                color: #999;
                text-align: center;

                .el-input-number--small{
                    width: 120px;
                }
                
                .text{
                    margin-left: 5px;
                }
            }
        }

        .el-upload-list{
            min-height: 148px;
            display: inline-block;
            position: relative;
        }

        .el-upload-list--picture-card .el-upload-list__item{
            margin: 0;
            display: inline-block;
            .video{
                width: 100%;
                height: 100%;
                background: #000;
            }
        }

        .preview-wrap{
            text-align: center;
            video, img{
                width: 100%;
                max-width: 100%;
            }
        }

    }
</style>