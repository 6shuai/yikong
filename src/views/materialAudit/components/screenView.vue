<template>
    <div class="app-main-wrap material-audit-screen-list" id="app-main-wrap">

        <div class="place-content mt20">
            <div class="place-box" v-loading="listLoading">
                <div 
                    class="place-p" 
                    :style="{width: placeW}" 
                    v-for="(item, index) in resData" 
                    :key="item.id"
                    @click="$router.push(`/materialAudit/list?screenId=${item.id}`)"
                >
                    <el-card 
                        class="place-list" 
                        shadow="always"

                    >      
                        <div class="place-img" 
                            :style="{height: imageH+'px'}">
                            <el-image 
                                fit="cover" 
                                :src="item.screenshotUri" 
                                class="image" 
                                :style="{height: imageH+'px'}"
                            ></el-image>
                        </div>

                        <div style="padding: 14px;">
                            <div class="place-title">
                                <span class="name full">
                                    {{item.displayName}}
                                </span>
                            </div>
                        </div>      

                    </el-card>
                </div>
            </div>


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

        <el-empty v-if="!resData.length && !listLoading"></el-empty>
        
    </div>
</template>

<script>
import { screenSizeWatch } from '@/mixins'
import { materialAuditScreenList } from '@/api/project'

export default {
    mixins: [screenSizeWatch],
    data(){
        return {
            listLoading: false,
            resData: [],
            totalCount: 0,
            params: {
                pageNo: 1,
                pageSize: 40
            }
        }
    },
    mounted() {
        this.getProjectList()
    },
    methods: {
        getProjectList(){
            this.listLoading = true
            materialAuditScreenList(this.params).then(res => {
                this.listLoading = false
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
            this.getProjectList()
        }
    }
}
</script>

<style lang="scss">
    @import '../../place/style/place-card.scss';

    .material-audit-screen-list{

    }
</style>