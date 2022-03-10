<template>
    <div 
        class="contract-wrap app-main-wrap audit-project-view" 
        id="app-main-wrap"
    >
        <el-card> 
            <page-header 
                title="待审核物料列表"
                backTitle="项目视图"
                :backPath="`/materialAudit?tab=${$route.query.projectId ? 'project' : 'screen'}`"
            ></page-header>

            <div class="place-content mt20">
                <div class="place-box" v-loading="tLoading">
                    <div 
                        class="place-p" 
                        :style="{width: placeW}" 
                        v-for="(item, index) in resData" 
                        :key="item.id"
                    >
                        <el-card 
                            class="place-list" 
                            shadow="always"
                        >      
                            <div class="info-btn" v-if="$route.query.projectId">
                                <el-button
                                    type="primary"
                                    size="small"
                                    @click="handleAudit(item.packageId, 1)"
                                >全部通过</el-button>
                                <el-button
                                    type="danger"
                                    size="small"
                                    @click="handleAudit(item.packageId, 0)"
                                >全部拒绝</el-button>
                                <el-button
                                    type="info"
                                    size="small"
                                    @click="handleShowDetail(item.packageId)"
                                >详情</el-button>
                            </div>
                            <div class="info-btn" v-else>
                                <el-button
                                    type="primary"
                                    size="small"
                                    @click="handleAudit(item.packageId, 1)"
                                >通过</el-button>
                                <el-button
                                    type="danger"
                                    size="small"
                                    @click="handleAudit(item.packageId, 0)"
                                >拒绝</el-button>
                            </div>
                            <div class="place-img" 
                                :style="{height: imageH+'px'}">

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

                            <div class="project-name overflow" v-if="$route.query.screenId">
                                {{ item.projectName }}
                            </div>

                        </el-card>
                    </div>

                </div>

                <el-empty v-if="!resData.length && !tLoading"></el-empty>

                <el-pagination
                    background
                    :hide-on-single-page="true"
                    layout="total, prev, pager, next"
                    :current-page="Number(params.pageNo)"
                    :page-size="Number(params.pageSize)"
                    @current-change="handleCurrentChange"
                    :total="totalCount">
                </el-pagination>    

            </div>

        </el-card>

        <!-- 物料投放的屏幕列表 -->
        <material-screen 
            ref="materialScreen"
            @allAuditResult="getNotAuditList"
        ></material-screen>

    </div>
</template>

<script>
import { materialAuditPackageList, materialAuditAll } from '@/api/project'
import { screenSizeWatch } from '@/mixins'
import ScreenLayout from '@/views/screenLayout/components/ScreenLayout'
import PageHeader from '@/components/PageHeader/index'
import MaterialScreen from '@/views/materialAudit/components/materialScreenDetail'

export default {
    mixins: [screenSizeWatch],
    components: {
        ScreenLayout,
        PageHeader,
        MaterialScreen
    },
    data() {
        return {
            tLoading: false,
            resData: {},

            // 物料总条数
            totalCount: 0,

            params: {
                pageNo: 1,
                pageSize: 20
            }
        }
    },
    mounted() {

        if(this.$route.query.projectId){
            this.params.projectId = this.$route.query.projectId
        }else if(this.$route.query.screenId){
            this.params.screenId = this.$route.query.screenId
        }
        this.getNotAuditList()
    },
    methods: {
        // 获取未审核物料列表
        getNotAuditList(){
            this.tLoading = true
            materialAuditPackageList(this.params).then(res => {
                this.tLoading = false
                if(res.code === this.$successCode){
                    let { list, totalRecords } = res.obj
                    this.resData = list
                    this.totalCount = totalRecords
                }
            })
        },

        // 分页
        handleCurrentChange(page){
            this.params.pageNo = page
            this.getNotAuditList()
        },


        // 全部通过 1   全部拒绝 0
        handleAudit(packageId, status){
            // packageId 物料包id    
            // status 审核状态 1 通过  0 拒绝   
            // screenId 屏幕id

            let data = ''
            let text = '全部通过'
            if(this.$route.query.screenId){
                text = status ? '通过' : '拒绝'
                data = `?packageId=${packageId}&screenId=${this.$route.query.screenId}&isApproved=${status}`
            }else {
                text = status ? '全部通过' : '全部拒绝'
                data = `?packageId=${packageId}&isApproved=${status}`
            }
            

            this.$confirm(`确定要${text}吗?`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
            }).then(() => {
                materialAuditAll(data).then(res => {
                    if(res.code === this.$successCode){
                        this.$message.success('操作成功~')
                        if(this.resData.length == 1) this.params.pageNo = 1
                        this.getNotAuditList()
                    }
                })
            }).catch(() => {
            })
        },

        // 查看详情  物料投放的屏幕列表
        handleShowDetail(id){
            this.$refs.materialScreen.showScreenListDialog(id)
        }
    }
}
</script>

<style lang="scss">
    @import '../../place/style/place-card.scss';

    .audit-project-view{
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

            .project-name{
                padding: 10px;
            }
        }
    }
</style>