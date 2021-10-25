<template>
    <el-dialog
        class="get-limit-dialog"
        title="领取限制"
        :visible.sync="showPondLimitDialog"
        width="1000px"
        :append-to-body="true"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
    >   
        <add-get-limit :ponId="ponId"></add-get-limit>
        <span slot="footer" class="dialog-footer">
            <el-button @click="showPondLimitDialog = false">关 闭</el-button>
        </span>
    </el-dialog>
</template>

<script>
import AddGetLimit from './AddGetLimit.vue';
export default {
    data(){
        return{
            ponId: null,
            showPondLimitDialog: false
        }
    },
    methods: {
        showGetLimit(ponId){
            this.ponId = ponId;
            this.showPondLimitDialog = true;
        },
    },
    components: {
        AddGetLimit
    }
}
</script>