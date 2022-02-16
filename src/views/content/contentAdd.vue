<template>
    <div class="content-add-wrap">
        <el-card class="template-card">
            <el-page-header @back="$router.go(-1)">
                <div slot="content">
                    {{$route.params.id ? '编辑内容' : '创建内容'}}
                </div>
            </el-page-header>

            <!-- 创建内容表单 -->
            <content-add-form :contentId="$route.params.id"></content-add-form>
            
        </el-card>
    </div>
</template>

<script>
import ContentAddForm from '@/views/content/components/ContentAddForm'

export default {
    components: {
        ContentAddForm
    }
}

</script>