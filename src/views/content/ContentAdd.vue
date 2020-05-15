<template>
    <div class="content-add-wrap">
        <el-card class="template-card">
            <el-page-header @back="$router.go(-1)">
                <div slot="content">
                    {{$route.params.id ? '编辑资源' : '创建资源'}}
                </div>
            </el-page-header>
            <el-row :gutter="10" class="mt30">
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
                        <el-form-item label="所属品牌" prop="owner">
                            <el-select v-model="contentParams.owner" filterable @change="groupUserList(contentParams.owner)" placeholder="请选择所属品牌" style="width:100%">
                                <el-option 
                                    v-for="item in groupData" 
                                    :key="item.id"
                                    :label="item.displayName" 
                                    :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="展示图片" prop="placeShowData">
                            <upload-img 
                                :imgList="contentParams.placeShowData"
                                :showCover="true"
                                @deleteImg="ShowDelete"
                            ></upload-img>
                        </el-form-item>
                        <el-form-item label="资源类型" prop="placeType">
                            <el-select v-model="contentParams.placeType" filterable placeholder="请选择资源类型" style="width:100%">
                                <el-option 
                                    v-for="item in 4" 
                                    :key="item"
                                    :label="item" 
                                    :value="item">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="上传资源" prop="placeShowData">
                            <upload-img 
                                imgList=""
                                :showCover="true"
                                @deleteImg="ShowDelete"
                            ></upload-img>
                        </el-form-item>
                        <el-form-item label="分辨率(像素)" class="is-required">
                            <el-row>
                                <el-col :span="11">
                                    <el-form-item prop='resolutionWidth'>
                                        <el-input type="number" v-model="contentParams.resolutionWidth" placeholder="宽"></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="2" style="text-align: center">
                                    <span>x</span>
                                </el-col>
                                <el-col :span="11">
                                    <el-form-item prop='resolutionHeight'>
                                        <el-input type="number" v-model="contentParams.resolutionHeight" placeholder="高"></el-input>
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
                        <el-form-item label="文件容量" class="is-required">
                            <el-input type="number" v-model="contentParams.resolutionWidth" placeholder="文件容量">
                                <template slot="append">MB</template>       
                            </el-input>   
                        </el-form-item>
                        <el-form-item label="播放时长" class="is-required">
                            <el-input type="number" v-model="contentParams.resolutionWidth" placeholder="播放时长">
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
import { getOrganizationList } from '@/mixins';
import { getDotPitch, getAspectRatio } from '@/views/screen/mixins';
import UploadImg from '@/components/Upload/UploadImg';
export default {
    mixins: [getOrganizationList, getDotPitch, getAspectRatio],
    data(){
        return {
            contentParams: {
                placeShowData: 'https://game.xfengjing.com/app/upload/market/photo/SNeDQguJTPQdWASQB0FuGF3xk5sjkooJZaAPxmAB.jpeg'
            },
            btnLoading: false,               //确定按钮  loading
            placeRules: {
                displayName: [{ required: true, trigger: "blur", message: '请输入场所名称~' }],
                placeType: [{ required: true, trigger: "change", message: '请选择场所类型~' }],
                owner: [{ required: true, trigger: "change", message: '请选择所属品牌~' }],
                placeShowData: [{ required: true, trigger: "change", message: '请上传一张展示图片~' }],
                aspectRatio: [{ required: true, trigger: "change", message: '请选择分辨率(宽高比)~' }],
            }
        }
    },
    mounted() {
        this.init();
    },
    methods: {
        init(){

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
                    placeCreated(this.contentParams).then(res => {
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
                this.$router.push('/place/index');
                this.$message.success('操作成功~');
            }
        },

        //删除场所图片
        ShowDelete(id, resolve){
            placeShowDelete(id).then(res => {
                if(res.code === this.$successCode){
                    resolve('success');
                }
            })
        },
    },
    components: {
        UploadImg
    }
}
</script>
<style lang="scss" scope>
    .ontent-add-wrap{
        .el-input-group__append{
            width: 55px;
            text-align: center;
            padding: 0;
        }
    }
</style>