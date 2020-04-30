<template>
    <div class="place-detail">
        <el-drawer
            title="上海静安大悦城"
            :visible.sync="showDrawer"
            size="800px">
            <el-scrollbar style="height:100%">
                <el-form label-width="120px">
                    <el-form-item label="场所名：">
                        <span>上海静安大悦城</span>
                    </el-form-item>
                    <el-form-item label="所属组织：">
                        <span>上海静安大悦城</span>
                    </el-form-item>
                    <el-form-item label="场所类型：">
                        <span>商场</span>
                    </el-form-item>
                    <el-form-item label="场所描述：">
                        <span>场所描述场所描述场所描述场所描述场所描述场所描述场所描述</span>
                    </el-form-item>
                    <el-form-item label="Logo：">
                        <img class="logo" src="https://game.xfengjing.com/app/upload/market/photo/7YmAs4QpmOCRNvD84Imkw8MQq7Ctdt1sr3d5kS8S.png">
                    </el-form-item>
                    <el-form-item label="场所照片：">
                        <ul class="place-image">
                            <li v-for="item in 3" :key="item">
                                <el-image 
                                    src="https://game.xfengjing.com/app/upload/market/photo/SNeDQguJTPQdWASQB0FuGF3xk5sjkooJZaAPxmAB.jpeg" 
                                    :preview-src-list="srcList">
                                </el-image>
                            </li>
                        </ul>
                    </el-form-item>
                    <el-form-item label="联系人：">
                        <span>马冬梅</span>
                    </el-form-item>
                    <el-form-item label="联系电话：">
                        <span>18810498554</span>
                    </el-form-item>
                    <el-form-item label="联系邮箱：">
                        <span>245691516@qq.com</span>
                    </el-form-item>
                    <el-form-item label="地区：">
                        <span>北京市通州区</span>
                    </el-form-item>
                    <el-form-item label="详细地址：">
                        <span>北京市通州区北京市通州区</span>
                    </el-form-item>
                    <el-form-item label="位置：">
                        <the-map 
                            v-if="showDrawer"
                            :disableZoom="true"
                            lng="116.404"
                            lat="39.915"
                            :visible="true"
                        ></the-map>
                    </el-form-item>
                </el-form>
            </el-scrollbar>
        </el-drawer>
    </div>
</template>
<script>
import TheMap from '@/components/BaiduMap/index';
export default {
    data(){
        return {
            showDrawer: false,
            srcList: [
                'https://game.xfengjing.com/app/upload/market/photo/SNeDQguJTPQdWASQB0FuGF3xk5sjkooJZaAPxmAB.jpeg'
            ],                  //预览图片
        }
    },
    methods: {
        show(){
            this.showDrawer = true;
        },
    },
    components: {
        TheMap
    }
}
</script>
<style lang="scss" scope>
    :focus{
        outline:0;
    }
    .el-drawer__body{
        height: 100%;
        padding-bottom: 100px;
        .el-scrollbar__wrap{
            overflow-x: hidden;
        }
    }
    .place-detail{
        .logo{
            max-height: 100px;
        }
        .place-image{
            li{
                list-style: none;
                width: 280px;
                height: 170px;
                margin: 0 10px 10px 0;
                display: inline-block;
                .el-image{
                    height: 100%;
                }
            }
        }
    }
</style>