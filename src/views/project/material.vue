<template>
    <div class="material-wrap" id="app-main-wrap">
        <div class="add-and-search">
            <el-button
                icon="el-icon-plus"
                type="primary"
                size="small"
                @click="handleShowCreate"
            >
                物料投放
            </el-button>

            <div class="search-input">
                <el-input 
                    clearable
                    size="small"
                    v-model="params.contentName"
                    placeholder="物料名称"
                    @input="$debounce(handleSearch)"
                ></el-input>
            </div>

        </div>

        <el-pagination
            v-if="resData.length"
            background
            layout="total, prev, pager, next"
            :current-page="Number(params.pageNo)"
            :page-size="Number(params.pageSize)"
            @current-change="handleCurrentChange"
            :total="totalCount">
        </el-pagination>    

        
        <div class="place-content mt20">
            <div class="place-box" v-loading="tLoading">
                <div 
                    class="place-p" 
                    :style="{width: placeW}" 
                    v-for="(item, index) in resData" 
                    :key="item.id"
                    @click="$refs.materialScreen.showScreenListDialog(item.packageId)"
                >
                    <el-card 
                        class="place-list" 
                        shadow="always"
                    >      

                        <el-button
                            class="info-btn"
                            type="info"
                            size="small"
                            title="点击查看上刊明细"
                        >上刊明细</el-button>
                        <div class="place-img" 
                            :style="{height: imageH+'px'}">
                            <!-- <el-image fit="cover" :src="item.image" class="image" :style="{height: imageH+'px'}"></el-image>    -->

                            <!-- 审核状态 -->
                            <div class="screen-state" title="审核状态">
                                <el-tag
                                    class="status" 
                                    :class="{ing: item.state == '待审核'}"
                                    :type="item.state == '待审核' ? '' : item.state == '已通过'|| item.state =='部分通过' ? 'success' : 'warning'" 
                                    effect="dark"
                                >{{ item.state }}</el-tag>
                            </div>


                            <screen-layout 
                                :screen="item" 
                                :maxWidth="cardWidth"
                                :showBorder="false"
                            >
                                <template v-slot="dataDefalut">
                                
                                    <img 
                                        class="content-image"
                                        :src="dataDefalut.data.image" 
                                        :title="dataDefalut.data.displayName"
                                    >

                                    <div class="content-detail" :title="dataDefalut.data.displayName">
                                        <p>{{ dataDefalut.data.displayName }}</p>
                                    </div>

                                </template>
                            </screen-layout>

                        </div>
                    </el-card>
                </div>
            </div>
        </div>

        <el-empty v-if="!resData.length" description="暂无数据"></el-empty>

        <el-pagination
            v-if="resData.length"
            background
            layout="total, prev, pager, next"
            :current-page="Number(params.pageNo)"
            :page-size="Number(params.pageSize)"
            @current-change="handleCurrentChange"
            :total="totalCount">
        </el-pagination>         

        <!-- 新建物料 -->
        <create-material 
            ref="createMaterial"
            @createMaterialSuccess="getMaterial"
        ></create-material>
        
        <!-- 物料投放的屏幕列表 -->
        <material-screen 
            ref="materialScreen"
            @reloadData="getMaterial"
        ></material-screen>

    </div>
</template>

<script>
import { projectMaterialList } from '@/api/project'
import { dateAddHMS } from '@/utils/index'
import { screenSizeWatch } from '@/mixins'
import CreateMaterial from './components/CreateMaterial'
import MaterialScreen from './components/MaterialScreen'
import ScreenLayout from '@/views/screenLayout/components/ScreenLayout'

export default {
    components: { 
        CreateMaterial,
        MaterialScreen,
        ScreenLayout
    },
    mixins: [screenSizeWatch],
    data() {
        return {
            // 列表加载loading
            tLoading: false,
            
            // 列表数据
            resData: [],

            // 列表总条数
            totalCount: 0,

            // 搜索条件
            params: {
                pageNo: 1,
                pageSize: 20,
            }
        }
    },
    mounted() {
        this.getMaterial()
    },
    methods: {
        // 获取物料列表
        getMaterial(){
            this.params.project = this.$route.params.id
            this.tLoading = true
            projectMaterialList(this.params).then(res => {
                this.tLoading = false
                if(res.code === this.$successCode){
                    let { list, totalRecords } = res.obj
                    this.resData = list
                    this.totalCount = totalRecords

                    this.resData.forEach((item, index) => {
                        this.resData[index].effectiveTime = dateAddHMS(item.effectiveTime)
                        this.resData[index].dueTime = dateAddHMS(item.dueTime)
                    })
                }
            })
        },
        
        // 显示创建
        handleShowCreate(){
            this.$refs.createMaterial.showCreateMaterialDialog()
        },

        // 分页
        handleCurrentChange(page){
            this.params.pageNo = page
            this.getMaterial()
        },

        // 搜索
        handleSearch(){
            this.params.pageNo = 1
            this.getMaterial()
        }
    }
}
</script>
<style lang="scss">
    @import '../place/style/place-card.scss';

    .material-wrap{
        .content-name{
            padding: 10px;
        }

        .place-list{
            position: relative;

            .info-btn{
                position: absolute;
                right: 10px;
                top: 10px;
                z-index: 999;
            }

            .place-img{
                display: flex;
                align-items: center;
                justify-content: center;
            }
        }
    }

</style>