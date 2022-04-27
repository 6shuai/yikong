<template>
    <el-dialog
        width="1200px"
        title="新建内容"
        :visible.sync="showCreateContent"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        append-to-body
    >  
        <content-add-form 
            source="material"
            @contentAddSuccess="contentAddSuccess"
        ></content-add-form>
    </el-dialog>
</template>

<script>
import ContentAddForm from '@/views/content/components/ContentAddForm'

export default {
    components: {
        ContentAddForm
    },
    data() {
        return {
            showCreateContent: false
        }
    },
    methods: {
        // 内容创建成功
        contentAddSuccess(data){
            this.$emit('selectResult', data)
            this.showCreateContent = false
        }
    },
}
</script>