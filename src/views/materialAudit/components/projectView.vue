<template>
    <!-- 项目列表 -->
    <div class="material-audit-projcet-view">
        <project-list
            :listLoading="listLoading"
            :resData="resData"
            :totalCount="totalCount"
            :hideEdit="true"
            @getList="getList"
            @jumpPage="handleGoMaterialAudit"
        ></project-list>
    </div>
</template>

<script>
import { screenSizeWatch } from '@/mixins'
import { materialAuditProjectList } from '@/api/project'
import ProjectList from '@/views/project/components/ProjectList'

export default {
    components: {
        ProjectList
    },
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
        this.getList()
    },
    methods: {
        getList(data){
            if(data) {
                this.params = {
                    ...data,
                    ...this.params
                }
            }
            this.listLoading = true
            materialAuditProjectList(this.params).then(res => {
                this.listLoading = false
                if(res.code === this.$successCode){
                    let { list, totalRecords } = res.obj
                    this.resData = list
                    this.totalCount = totalRecords
                }
            })
        },

        // 跳转到 项目 物料投放审核列表
        handleGoMaterialAudit({id}){
            this.$router.push(`/materialAudit/list?projectId=${id}`)
        }
    }
}
</script>