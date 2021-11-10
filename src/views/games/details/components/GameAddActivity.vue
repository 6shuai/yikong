<template>
    <el-dialog
        width="800px"
        title="添加活动"
        class="game-add-wrap"
        :visible.sync="showAddActivity"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        append-to-body
    >

        <add-activity
            from="game"
            @createdCancel="showAddActivity=false"
            @createdSuccess="createdSuccess"
        ></add-activity>

    </el-dialog>
</template>

<script>
import AddActivity from '@/views/activity/components/AddActivity'
export default {
    components: {
        AddActivity
    },
    data(){
        return{
            showAddActivity: false
        }
    },
    methods: {
        showDialog(){
            this.showAddActivity = true;
        },
        
        //添加成功
        createdSuccess(data){
            this.showAddActivity = false;
            this.$emit('handleCreatedActivityCall', data);
        }
    },
}
</script>