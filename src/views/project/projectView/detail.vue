<template>
    <div class="contract-wrap">
        <el-card v-loading="dataLoading"> 

            <div class="project-introduce">
                <el-page-header 
                    @back="$route.query.target ? $router.go(-1) : $router.push('/project/view')"
                    title="返回"
                > </el-page-header>
                <div class="title">{{ resData.displayName }}</div>
                <!-- <div class="desc">{{ resData.clientName }}</div> -->
            </div>
            <el-tabs 
                v-model="tabActiveName" 
                @tab-click="handleTab"
                class="mb20"
            >
                <el-tab-pane 
                    label="基本信息" 
                    :name="`/project/${$route.params.id}`"
                ></el-tab-pane>
                <el-tab-pane 
                    label="寻位锁位" 
                    :name="`/project/${$route.params.id}/locating`"
                ></el-tab-pane>
                <el-tab-pane 
                    label="合同" 
                    :name="`/project/${$route.params.id}/contract`"
                ></el-tab-pane>
                <el-tab-pane 
                    label="素材管理" 
                    :name="`/project/${$route.params.id}/material`"
                ></el-tab-pane>
                <el-tab-pane 
                    label="监播数据"
                    :name="`/project/${$route.params.id}/playStatistics`"
                ></el-tab-pane>
                <el-tab-pane 
                    label="财务" 
                    :name="`/project/${$route.params.id}/finance`"
                    :disabled="projectContractDetail && !projectContractDetail.id"
                ></el-tab-pane>
                <el-tab-pane 
                    label="发票中心" 
                    :name="`/project/${$route.params.id}/invoiceCenter`"
                ></el-tab-pane>
            </el-tabs>   
            
            <router-view v-if="!dataLoading"></router-view>
        </el-card>

    </div>
</template>

<script>
import { projectDetail } from '@/api/project'

export default {
    data(){
        return {
            tabActiveName: this.$route.path,

            // 项目详情数据
            resData: [],

            // 获取项目详情 loading
            dataLoading: true
        }
    },
    computed: {
        projectContractDetail(){
            return this.$store.state.project.projectContractDetail
        }
    },
    mounted() {
        this.getDetail()
    },
    methods: {
        // 查询项目详情
        getDetail(){
            this.dataLoading = true
            projectDetail({ id: this.$route.params.id }).then(res => {
                this.dataLoading = false
                if(res.code === this.$successCode){
                    this.resData = res.obj
                    this.$store.state.project.projectDetail = res.obj
                    this.$store.state.project.projectContractDetail = res.obj.publishedContract ? res.obj.publishedContract : {}
                }
            })
        },

        handleTab(tab, event){
            this.$router.push(tab.name)
        }
    },
    watch:{
        $route(to, from) {
            this.tabActiveName = to.path
        }
    }
}

</script>

<style lang="scss" scoped>
    .contract-wrap{
        .project-introduce{
            text-align: center;
            position: relative;

            .el-page-header {
                position: absolute;
            }

            .title{
                padding-bottom: 20px;
                font-size: 18px;
            }

            .desc{
                font-size: 12px;
                color: #999;
            }
        }
    }
</style>