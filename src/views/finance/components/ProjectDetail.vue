<template>
    <el-dialog
        width="1000px"
        :title="`【${ projectName }】权责明细`"
        :visible.sync="showDialog"
        :close-on-click-modal="false"
        append-to-body
    >
        
        <finance-duty 
            :dutyData="dutyData"
            :projectId="projectId"
        ></finance-duty>

    </el-dialog>
</template>

<script>
import FinanceDuty from "@/views/project/components/FinanceDuty"
import { financeProjectDetail } from '@/api/finance'

export default {
    components: {
        FinanceDuty
    },
    data() {
        return {
            projectName: '',
            showDialog: false,

            // 项目权责明细 数据
            dutyData: [],

            // 项目id
            projectId: null
        }
    },
    methods: {
        // 显示项目权责明细
        showProjectPriceDetail(projectId, projectName){
            if(!projectId) return 
            this.projectId = Number(projectId)
            this.showDialog = true
            this.projectName = projectName
            this.getProjectPriceDetail()
        },

        // 加载项目权责明细
        getProjectPriceDetail(){
            financeProjectDetail({ projectId: this.projectId }).then(res => {
                if(res.code === this.$successCode){
                    this.dutyData = res.obj.accrualDetails || []
                }
            })
        }
    },
}
</script>