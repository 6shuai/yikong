<template>
    <el-card class="game-add-wrap" v-loading="detailLoading">
        <el-page-header @back="$router.go(-1)">
            <div slot="content">
                {{$route.params.id ? '编辑游戏' : '创建游戏'}}
            </div>
        </el-page-header>
        <el-row :gutter="10" class="mt30" v-loading="$route.params.id && loading">
            <el-col :xs="24" :sm="24" :md="12">
                <el-form 
                    label-width="160px"
                    ref="gameRef"
                    :model="gameParams"
                    :rules="gameRules"
                >
                    <el-form-item label="游戏名称" prop="displayName">
                        <el-input v-model="gameParams.displayName" placeholder="游戏名称"></el-input>
                    </el-form-item>
                    <el-form-item label="描述">
                        <el-input type="textarea" :rows="3" v-model="gameParams.description" placeholder="时间轴描述"></el-input>
                    </el-form-item>
                    <el-form-item label="游戏图标" prop="image">
                        <upload-img 
                            :imgList="gameParams.image"
                            @uploadImgPath="$set(gameParams, 'image', $event)"
                        ></upload-img>
                    </el-form-item>
                    <el-form-item label="游戏截图" prop="applicationShowData">
                        <upload-img 
                            ref="uploadImg"
                            :isArray="true" 
                            :imgList="gameParams.applicationShowData"
                            @deleteImg="screenshotDelete"
                            @uploadImgPath="uploadScreenshotSuccess"
                        ></upload-img>
                    </el-form-item>
                    <el-form-item label="后台地址">
                        <el-input v-model="gameParams.backend" placeholder="游戏后台地址"></el-input>
                    </el-form-item>
                    <el-form-item label="游戏配置">
                        <el-input v-model="gameParams.configList" placeholder="游戏配置url"></el-input>
                    </el-form-item>
                    <el-form-item label="">
                        <el-button type="primary" icon="el-icon-check" :loading="btnLoading" @click="gameSureBtn">提  交</el-button>
                    </el-form-item>
                </el-form>
            </el-col>
        </el-row>
    </el-card>
</template>
<script>
import { gameCreated, gameScreenshotDelete } from '@/api/game';
import { getScreenDetail } from './mixins';
import UploadImg from '@/components/Upload/UploadImg';
export default {
    mixins: [getScreenDetail],
    data(){
        return {
            gameParams: {
                applicationShowData: []
            },
            btnLoading: false,     
            detailLoading: false,
            gameRules: {
                displayName: [{ required: true, trigger: "blur", message: '请输入游戏名称~' }],
                image: [{ required: true, trigger: "blur", message: '请上传游戏图标~' }],
                applicationShowData: [{ required: true, type: "array", trigger: "blur", message: '请上传游戏截图~' }],
            },
            loading: false,          //编辑时获取详情  loading
            copyTimelineParams: {}
        }
    },
    mounted() {
        if(this.$route.params.id){
            this.getDetail();
        }
    },
    methods: {
        //编辑 获取详情
        getDetail(){
            new Promise((resolve) => {
                this.detailLoading = true;
                this.initDetail(resolve);
            }).then(res => {
                this.detailLoading = false;
                this.gameParams = this.resData;
                //修改时 id 为资源id
                this.gameParams.id = this.gameParams.contentId;
            })
        },

        //保存
        gameSureBtn(){
            this.$refs.gameRef.validate((valid) => {
                if (valid) {
                    this.btnLoading = true;
                    gameCreated(this.gameParams).then(res => {
                        this.btnLoading = false;
                        if(res.code === this.$successCode){
                            this.$message.success('保存成功~');
                            this.$router.push('/games/index');
                        }
                    })
                }
            })
        },

        //上传游戏截图
        uploadScreenshotSuccess(path){
            this.gameParams.applicationShowData.push(
                {
                    url: path
                }
            )
        },

        //删除游戏截图
        screenshotDelete(file, resolve){
            if(this.gameParams.applicationShowData.length <= 1){
                this.$message.warning('至少上传一张游戏截图~')
                return
            }
            if(file.id){
                gameScreenshotDelete(file.id).then(res => {
                    if(res.code === this.$successCode){
                        this.gameParams.applicationShowData.splice(file.index, 1);
                        resolve('success');
                    }
                })
            }else{
                this.gameParams.applicationShowData.splice(file.index, 1);
            }
        }

    },
    components: {
        UploadImg
    }
}
</script>
<style lang="scss" scope>

</style>