<template>
    <el-card class="template-card content-details games-details" v-loading="detailLoading">
        <div class="header-wrap detail-header-wrap mb30">
            <el-page-header @back="$router.go(-1)">
            </el-page-header>
            <div class="header-right">
                <span @click="editGame"><i class="el-icon-edit" title="编辑"></i>编辑</span>
                <el-divider direction="vertical"></el-divider>
                <span @click="collectContent" v-if="!resData.isFavorite"><i class="el-icon-star-off" title="收藏"></i>收藏</span>
                <span @click="collectContent" v-else><i class="el-icon-star-on" title="取消收藏"></i>取消收藏</span>
                <el-divider direction="vertical"></el-divider>
                <span @click="deleteGame"><i class="el-icon-delete" title="删除"></i>删除</span>
            </div>
            <div class="title">
                <h2>{{resData.displayName}}</h2>
            </div>
        </div>
        <el-row>
            <el-col :span="4">
                <div class="game-info">
                    <el-image 
                        v-if="resData.image"
                        class="game-icon"
                        fit="cover"
                        :src="resData.image" 
                    >
                    </el-image>
                    <h3 class="title">{{resData.displayName}}</h3>
                    <p class="desc">{{resData.description}}</p>

                    <el-menu
                        @select="handleSelect"
                        :default-active="currentActive"
                        :router="true"
                        class="el-menu-vertical-demo">
                        <el-menu-item :index="`/games/details/${$route.params.id}`">
                            <span slot="title">基本信息</span>
                        </el-menu-item>
                        <el-menu-item :index="`/games/details/${$route.params.id}/package`">
                            <span slot="title">包管理</span>
                        </el-menu-item>
                        <el-menu-item index="3" disabled>
                            <span slot="title">排行榜管理</span>
                        </el-menu-item>
                        <el-menu-item index="3" disabled>
                            <span slot="title">活动管理</span>
                        </el-menu-item>
                    </el-menu>

                </div>
            </el-col>

            <el-col :span="20" class="right-content">
                <div class="content" v-if="currentActive==`/games/details/${$route.params.id}`">
                    <h2 class="info-title mt20 mb20">基本信息</h2>
                    <el-form 
                        label-width="120px"
                    >
                        <el-form-item label="游戏名称:">
                            <span>{{resData.displayName}}</span>
                        </el-form-item>
                        <el-form-item label="描述:">
                            <span>{{resData.description}}</span>
                        </el-form-item>
                        <el-form-item label="图标:">
                            <el-image 
                                v-if="resData.image"
                                class="icon"
                                fit="cover"
                                :src="resData.image" 
                                :preview-src-list="previewIcon"
                            >
                            </el-image>
                        </el-form-item>
                        <el-form-item label="游戏截图:">
                            <el-image 
                                class="screenshot"
                                v-for="item in resData.applicationShowData"
                                :key="item.id"
                                fit="cover"
                                :src="item.url" 
                                :preview-src-list="previewList"
                            >
                            </el-image>
                        </el-form-item>
                    </el-form>

                    <h2 class="info-title mt20 mb20">开发信息</h2>
                    <el-form 
                        label-width="120px"
                    >
                        <el-form-item label="AppID:">
                            <span>{{resData.appId}}</span>
                        </el-form-item>
                        <el-form-item label="AppSecret:">
                            <div v-loading="upldateSecretLoading">
                                <span>{{resData.secret}}</span>
                                <el-link class="ml20" type="primary" @click="updateSecret">更新</el-link>
                            </div>
                        </el-form-item>
                    </el-form>

                </div>

                <router-view v-else></router-view>
            </el-col>

        </el-row>
        
    </el-card>
</template>
<script>
import { gameDelete, gameUpdateSecret, gameFavorite } from '@/api/game';
import { getScreenDetail } from '../mixins';
export default {
    mixins: [getScreenDetail],
    data(){
        return{
            currentActive: '1',
            detailLoading: false,           //详情数据加载中
            upldateSecretLoading: false,     //AppSecret 更新中
            resData: {}
        }
    },
    computed: {
        //游戏图标预览
        previewIcon(){
            return [this.resData.image];
        },

        //游戏截图预览
        previewList(){
            let arr = [];
            this.resData.applicationShowData.forEach(item => {
                arr.push(item.url);
            })
            return arr;
        }
        
    },
    mounted() {
        this.currentActive = `/games/details/${this.$route.params.id}`;
        this.init();
    },
    methods: {
        init(){
            new Promise((resolve) => {
                this.detailLoading = true;
                this.initDetail(resolve);
            }).then(res => {
                this.detailLoading = false;
            })
        },

        //编辑游戏
        editGame(){
            this.$router.push(`/games/edit/${this.$route.params.id}`)
        },

        //删除游戏
        deleteGame(){
            this.$confirm('此操作将删除该游戏 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
                center: true
            }).then(() => {
                gameDelete(this.resData.id).then(res => {
                    if(res.code === this.$successCode){
                        this.$message.success({
                            message: '删除成功~',
                            duration: 1000,
                            onClose: () => {
                                this.$router.push('/games/index');
                            }
                        });
                    }
                })
            })
        },

        //更新 secret
        updateSecret(){
            this.upldateSecretLoading = true;
            gameUpdateSecret(this.resData.id).then(res => {
                this.upldateSecretLoading = false;
                if(res.code === this.$successCode){
                    this.$message.success('更新成功~');
                    this.init();
                }
            })
        },

        //收藏
        collectContent(){
            let p = {
                isFavorite: this.resData.isFavorite ? 0 : 1,
                id: this.resData.id,
                userId: this.$store.state.user.loginData.id
            }
            let s = `?isFavorite=${p.isFavorite}&applicationId=${p.id}&userId=${p.userId}`;

            gameFavorite(s).then(res => {
                if(res.code === this.$successCode){
                    this.$message.success('操作成功~');
                    this.$set(this.resData, 'isFavorite', p.isFavorite);
                }
            })
        },

        //右侧菜单
        handleSelect(key){
            this.currentActive = key;
        }

    }
}
</script>
<style lang="scss" scope>
    @import '../../../styles/variables.scss';
    @import '../../content/style/content-details.scss';
    .games-details{
        .game-info{
            text-align: center;
            .game-icon{
                width: 60px;
                height: 60px;
            }
            .desc{
                font-size: 13px;
                color: #999;
                padding-top: 20px;
                line-height: 24px;
            }
        }
        .el-image{
            border-radius: 6px;
            margin: 0 10px 10px 0;
            &.icon{
                width: 80px;
                height: 80px;
            }
            &.screenshot{
                width: 150px;
                height: 100px;
            }
        }
        .right-content{
            border-left: 1px solid #e5e5e5;
            padding-left: 10px;
        }
    }
</style>