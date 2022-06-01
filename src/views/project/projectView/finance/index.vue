<template>
    <finance-duty 
        :dutyData="resData.accrualDetails"
        :projectId="Number(contractId)"
    ></finance-duty>
</template>

<script>
import financeDuty from '@/views/finance/projectView/financeDetail/components/FinanceDuty'
import { projectFinanceInfo } from '@/api/project'

export default {
    components: {
        financeDuty
    },
    props: {
        contract: Number
    },
    data() {
        return {
            contractId: null,
            resData: {},
        }
    },
    mounted() {
        this.getFinanceInfo()
    },
    methods: {
        // 获取财务信息
        getFinanceInfo(){
            this.contractId = this.contract || this.$store.state.project.projectContractDetail.id
            if(!this.contractId) return
            projectFinanceInfo({ contract: this.contractId }).then(res => {
                if(res.code === this.$successCode){
                    this.resData = res.obj
                }
            })
        }
    }
}
</script>