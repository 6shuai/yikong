<template>
    <el-card class="template-card screen-details">
        <div class="header-wrap mb30">
            <el-page-header @back="$router.go(-1)">
            </el-page-header>
            <div class="header-right">
                <span @click="editScreen"><i class="el-icon-edit" title="编辑"></i>编辑</span>
                <el-divider direction="vertical"></el-divider>
                <span @click="collectPlace"><i class="el-icon-star-off" title="收藏"></i>收藏</span>
                <el-divider direction="vertical"></el-divider>
                <span @click="deletePlace"><i class="el-icon-delete" title="删除"></i>删除</span>
            </div>
            <div class="title">
                <h2>合生汇</h2>
            </div>
        </div>
        <div class="content">
            <el-row :gutter="20">
                <el-col :xs="24" :sm="12" :md="16"  class="screen-info-left">
                    <div class="screen-img">
                        <img src="https://game.xfengjing.com/app/upload/market/photo/SNeDQguJTPQdWASQB0FuGF3xk5sjkooJZaAPxmAB.jpeg">
                        <el-tag class="status" type="success" effect="dark">在线</el-tag>
                    </div>
                </el-col>
                <el-col :xs="24" :sm="12" :md="8" class="screen-info-right">
                    <el-divider>实景图片<i class="el-icon-caret-bottom"></i></el-divider>
                    <div class="info-item photo">
                        <el-image 
                            v-for="item in 4"
                            :key="item"
                            fit="cover"
                            src="https://game.xfengjing.com/app/upload/market/photo/SNeDQguJTPQdWASQB0FuGF3xk5sjkooJZaAPxmAB.jpeg" 
                        >
                        </el-image>
                    </div>

                    <el-divider>屏幕规格<i class="el-icon-caret-bottom"></i></el-divider>
                    <div class="info-item">
                        <el-form label-width="80px">
                            <el-form-item label="点距规格">
                                <span>P3</span>
                            </el-form-item>
                            <el-form-item label="分辨率">
                                <span>2520 x 1080</span>
                            </el-form-item>
                            <el-form-item label="宽高比">
                                <span>21 : 9</span>
                            </el-form-item>
                            <el-form-item label="物理尺寸">
                                <span>3333mm x 2222mm</span>
                            </el-form-item>
                        </el-form>
                    </div>

                    <el-divider>详细信息<i class="el-icon-caret-bottom"></i></el-divider>
                    <div class="info-item">
                        <el-form label-width="80px">
                            <el-form-item label="所属场所">
                                <el-link type="primary" @click="$router.push('/place/details/8')"><i class="el-icon-link"></i>合生汇</el-link>
                            </el-form-item>
                            <el-form-item label="描述">
                                <span>描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述</span>
                            </el-form-item>
                        </el-form>
                    </div>

                    <el-divider>联系信息<i class="el-icon-caret-bottom"></i></el-divider>
                    <div class="info-item">
                        <el-form label-width="80px">
                            <el-form-item label="联系人">
                                <span>刘帅</span>
                            </el-form-item>
                            <el-form-item label="电话">
                                <span>18810498554</span>
                            </el-form-item>
                            <el-form-item label="微信">
                                <span>18810498554</span>
                            </el-form-item>
                        </el-form>
                    </div>

                </el-col>
            </el-row>
        </div>

        
    </el-card>
</template>
<script>
export default {
    data(){
        return {
            imgIndex: 0,             //幻灯片的索引
        }
    },
    methods: {
        //编辑场所
        editScreen(){
            this.$router.push('/screen/edit/12')
        },

        //删除场所
        deletePlace(){
            this.$confirm('此操作将删除该场所 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
                center: true
            }).then(() => {

            })
        },

        //收藏
        collectPlace(){
            
        }
    }
}
</script>
<style lang="scss" scope>
    @import '../../styles/variables.scss';
    @import './style/screen-details.scss';
</style>