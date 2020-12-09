<template>
    <!-- 设置逻辑区域是否循环 -->
    <el-dialog
        width="500px"
        :title="title"
        :visible.sync="showRectangleSet"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        class="timeline-rule created-step-wrap"
        append-to-body
    >
        <el-form label-width="80px">
            <el-form-item label="是否轮播">
                <el-switch
                    v-model="params.isRotation"
                    :active-value="1"
                    :inactive-value="0"
                >
                </el-switch>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="showRectangleSet = false">取 消</el-button>
            <el-button
                type="primary"
                :loading="loading"
                @click="handleSave"
                >确 定</el-button
            >
        </span>
    </el-dialog>
</template>
<script>
import { timelineRegionUpdate } from '@/api/timeline';
export default {
    data(){
        return{
            title: '',
            showRectangleSet: false,
            loading: false,
            rotationIndex: 0,
            params: {
                isRotation: 0
            }
        }
    },
    methods: {
        showDialog(data, index){
            this.title = data.displayName + '设置';
            let { isRotation, id } = data;
            this.params = {
                isRotation,
                id
            };
            this.rotationIndex = index;
            this.showRectangleSet = true;
        },

        handleSave(){
            this.loading = true;
            timelineRegionUpdate(this.params).then(res => {
                this.loading = false;
                if(res.code === this.$successCode){
                    this.$message.success('操作成功~');
                    this.$emit('updateRotationSuccess', this.rotationIndex, this.params.isRotation);
                    this.showRectangleSet = false;
                }
            })
        }
    },
}
</script>