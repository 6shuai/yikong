<template>
    <el-card class="template-card screen-details">
        <div class="header-wrap detail-header-wrap mb30">
            <el-page-header @back="$router.go(-1)">
            </el-page-header>
            <div class="header-right">
                <span @click="editScreen"><i class="el-icon-edit" title="编辑"></i>编辑</span>
                <el-divider direction="vertical"></el-divider>
                <span @click="collectScreen" v-if="!resData.isFavorite"><i class="el-icon-star-off" title="收藏"></i>收藏</span>
                <span @click="collectScreen" v-else><i class="el-icon-star-on" title="取消收藏"></i>取消收藏</span>
                <el-divider direction="vertical"></el-divider>
                <span @click="deletePlace"><i class="el-icon-delete" title="删除"></i>删除</span>
            </div>
            <div class="title">
                <h2>{{resData.displayName}}</h2>
            </div>
        </div>
        <div class="content">
            <el-row :gutter="20">
                <el-col :xs="24" :sm="12" :md="16"  class="screen-info-left">
                    <div class="screen-img">
                        <img src="https://game.xfengjing.com/app/upload/market/photo/SNeDQguJTPQdWASQB0FuGF3xk5sjkooJZaAPxmAB.jpeg">
                        <el-tag v-if="!resData.state" class="status ing" type="info" effect="dark">建设中</el-tag>
                        <el-tag v-if="resData.state == 1" class="status" type="success" effect="dark">在线</el-tag>
                        <el-tag v-if="resData.state == 2" class="status" type="warning" effect="dark">离线</el-tag>
                    </div>
                    <div class="tool-wrap">
                        <el-button type="primary" icon="el-icon-refresh" size="small" @click="updateImg">更新截图</el-button>
                        <el-input-number size="small" v-model="volume" controls-position="right" :min="0" :max="100"></el-input-number>
                        <el-button type="primary" icon="el-icon-finished" size="small" @click="setVolume">提交</el-button>
                        <el-button type="primary" :disabled="!volume" icon="el-icon-close-notification" size="small" @click="setMute">静音</el-button>
                    </div>
                </el-col>
                <el-col :xs="24" :sm="12" :md="8" class="screen-info-right">
                    <el-divider>实景图片<i class="el-icon-caret-bottom"></i></el-divider>
                    <div class="info-item photo">
                        <el-image 
                            v-for="item in resData.screenShowData"
                            :key="item.id"
                            fit="cover"
                            :src="item.uri" 
                            :preview-src-list="previewList"
                        >
                        </el-image>
                    </div>

                    <el-divider>屏幕规格<i class="el-icon-caret-bottom"></i></el-divider>
                    <div class="info-item">
                        <el-form label-width="80px">
                            <el-form-item label="点距规格">
                                <span>{{resData.dotPitchName}}</span>
                            </el-form-item>
                            <el-form-item label="分辨率">
                                <span>{{resData.resolutionWidth}} x {{resData.resolutionHeight}}</span>
                            </el-form-item>
                            <el-form-item label="宽高比">
                                <span>{{resData.aspectRatioWidth}} : {{resData.aspectRatioHeight}}</span>
                            </el-form-item>
                            <el-form-item label="物理尺寸">
                                <span>{{resData.physicalWidth}}mm x {{resData.physicalHeight}}mm</span>
                            </el-form-item>
                        </el-form>
                    </div>

                    <el-divider>详细信息<i class="el-icon-caret-bottom"></i></el-divider>
                    <div class="info-item">
                        <el-form label-width="80px">
                            <el-form-item label="所属场所">
                                <el-link type="primary" @click="$router.push(`/place/details/${resData.placeId}`)"><i class="el-icon-link"></i>{{resData.placeName}}</el-link>
                            </el-form-item>
                            <el-form-item label="描述">
                                <span>{{resData.description}}</span>
                            </el-form-item>
                        </el-form>
                    </div>

                    <el-divider>联系信息<i class="el-icon-caret-bottom"></i></el-divider>
                    <div class="info-item">
                        <ul class="service" v-if="resData.screenContactData && resData.screenContactData.length">
                            <li v-for="item in resData.screenContactData" :key="item.userId">
                                <el-image 
                                    src="" 
                                    fit="cover">
                                    <div slot="error" class="image-slot">
                                        <svg-icon icon-class="defalut-header-img"></svg-icon>
                                    </div>
                                </el-image>
                                <div class="desc">
                                    <p class="nickname">
                                        {{item.accountName}}
                                        <span class="role">{{item.description}}</span>
                                    </p>
                                    
                                    <p class="place-lx">
                                        <label title="电话">
                                            <span class="label"><font-awesome-icon :icon="['fas', 'mobile-alt']" /></span>
                                            <span>{{item.mobile || '--'}}</span>
                                        </label>
                                        <el-divider direction="vertical"></el-divider>
                                        <label title="微信">
                                            <span class="label"><font-awesome-icon :icon="['fab', 'weixin']" /></span>
                                            <span>{{item.wechat || '--'}}</span>
                                        </label>
                                    </p>
                                </div>
                            </li>
                        </ul>
                        <div v-else>暂无信息~</div>
                    </div>

                </el-col>
            </el-row>
        </div>

        
    </el-card>
</template>
<script>
import { screenDelete, screenSetVolume, screenSetMute, screenshotUpdate } from '@/api/screen';
import { getScreenDetail, screenIsFavorite } from '@/views/screen/mixins';
export default {
    mixins: [getScreenDetail, screenIsFavorite],
    computed: {
        previewList(){
            let arr = [];
            this.resData.screenShowData.forEach(item => {
                arr.push(item.uri);
            })
            return arr;
        }
    },
    data(){
        return {
            volume: 50,                 //音量
        }
    },
    mounted() {
        this.initDetail();
    },
    methods: {
        //编辑场所
        editScreen(){
            this.$router.push(`/screen/edit/${this.$route.params.id}`)
        },

        //删除场所
        deletePlace(){
            this.$confirm('此操作将删除该屏幕 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
                center: true
            }).then(() => {
                screenDelete(this.$route.params.id).then(res => {
                    if(res.code === this.$successCode){
                        this.$message.success({
                            message: '删除成功~',
                            duration: 1000,
                            onClose: () => {
                                this.$router.push('/screen/index');
                            }
                        });
                    }
                })
            })
        },

        //收藏
        collectScreen(){
            let p = {
                isFavorite: this.resData.isFavorite ? 0 : 1,
                screenId: this.resData.id,
                userId: this.$store.state.user.loginData.id
            }
            let s = `?isFavorite=${p.isFavorite}&screenId=${p.screenId}&userId=${p.userId}`;
            new Promise((resolve) => {
                this.handleFavorite(s, resolve);
            }).then(res => {
                this.$set(this.resData, 'isFavorite', p.isFavorite);
            })
        },

        //设置音量 提交
        setVolume(){
            let data = `?screenId=${this.resData.id}&value=${this.volume}`;
            screenSetVolume(data).then(res => {
                if(res.code == this.$successCode){
                    this.$message.success('音量操作成功~');
                }
            })
        },

        //设置静音
        setMute(){
            let data = `?screenId=${this.resData.id}`;
            screenSetMute(data).then(res => {
                if(res.code === this.$successCode){
                    this.$message.success('设置静音操作成功~');
                }
            })
        },

        //更新屏幕截图
        updateImg(){
            let data = `?screenId=${this.resData.id}`;
            screenshotUpdate(data).then(res => {
                if(res.code === this.$successCode){
                    this.$message.success('更新屏幕截图操作成功~');
                }
            })
        }
    }
}
</script>
<style lang="scss" scope>
    @import '../../styles/variables.scss';
    @import './style/screen-details.scss';
</style>