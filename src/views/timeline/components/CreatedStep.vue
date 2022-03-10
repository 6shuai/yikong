<!--
 * @Author: liushuai
 * @Date: 2020-11-18 17:44:12
 * @LastEditors: liushuai
 * @LastEditTime: 2022-03-01 15:36:15
 * @Description: file content
 * @FilePath: \pclient\src\views\timeline\components\CreatedStep.vue
-->
<template>
    <!-- 新建步骤 -->
    <el-dialog
        width="1000px"
        title="新建步骤"
        :visible.sync="showCreatedStep"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        class="timeline-rule created-step-wrap"
        append-to-body
    >
        <el-form label-width="80px">
            <el-form-item label="选择屏幕布局模板" class="is-required">

                <screen-layout-template-list @layoutTemplateSelected="layoutTemplateSelected"></screen-layout-template-list>

            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="showCreatedStep = false">取 消</el-button>
            <el-button
                type="primary"
                :loading="createdLoading"
                @click="createdStep"
                >确 定</el-button
            >
        </span>
    </el-dialog>
</template>
<script>
import { timelineStageStepCreated } from '@/api/timeline';
import ScreenLayoutTemplateList from '@/views/screenLayout/components/ScreenLayoutTemplateList'

export default {
    components: {
        ScreenLayoutTemplateList
    },
    data(){
        return{
            showCreatedStep: false,
            stepParams: {},
            createdLoading: false,
        }
    },
    methods: {
        showDialog(id){
            this.stepParams.phaseId = id;
            this.showCreatedStep = true;
        },

        
        //选择模板
        layoutTemplateSelected(timelineRegions){
            this.stepParams = {
                ...this.stepParams,
                timelineRegions
            }
        },

        //创建步骤
        createdStep(){
            if(!this.stepParams.timelineRegions){
                this.$message.warning('还没选择屏幕布局~');
                return
            }
            this.createdLoading = true;
            timelineStageStepCreated(this.stepParams).then(res => {
                this.createdLoading = false;
                if(res.code === this.$successCode){
                    this.$message.success('创建步骤成功~');
                    this.showCreatedStep = false;
                    this.$emit('createdStepSuccess');
                }
            })
        }
    },
}
</script>
<style lang="scss">
    .created-step-wrap{
        .el-radio{
            margin-top: 15px;
            display: block;
        }
    }
</style>