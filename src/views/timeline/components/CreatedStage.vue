<template>
    <!-- 新建阶段 -->
    <el-dialog
        width="500px"
        :title="stageParams.id ? '编辑阶段' : '新建阶段'"
        :visible.sync="showCreatedStage"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :show-close="false"
        class="timeline-rule"
        v-loading="loading"
        append-to-body
    >
        <el-form label-width="80px">
            <el-form-item label="开始时间" class="is-required">
                <el-time-picker
                    v-model="stageParams.beginTime"
                    value-format="HH:mm:ss"
                    format="HH:mm:ss"
                    placeholder="起始时间"
                >
                </el-time-picker>
            </el-form-item>
            <el-form-item label="持续时长" class="is-required">
                <el-input
                    class="w220 mr30"
                    type="number"
                    v-model="stageParams.duration"
                    :min="1"
                    placeholder="持续时长"
                ></el-input>
            </el-form-item>
            <el-form-item label="是否循环">
                <el-switch
                    :active-value="1"
                    :inactive-value="0"
                    v-model="stageParams.loop"
                >
                </el-switch>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="showCreatedStage = false">取 消</el-button>
            <el-button
                type="primary"
                :loading="createdLoading"
                @click="createdStage"
                >确 定</el-button
            >
        </span>
    </el-dialog>
</template>

<script>
import { timeDisposeTool } from '@/mixins';
import { timelineStageCreated } from '@/api/timeline';
export default {
    mixins: [timeDisposeTool],
    data() {
        return {
            showCreatedStage: false,
            loading: false,
            createdLoading: false,
            stageParams: {},
        };
    },
    methods: {
        showDialog(phaseType, data){
            this.showCreatedStage = true;
            this.stageParams = {
                loop: 1,
                containerId: this.$route.params.id,
                phaseType,
                beginTime: data.beginTimeFormat
            }
            if(data && data.id){
                this.stageParams = {
                    ...this.stageParams,
                    ...data,
                    beginTime: data.beginTimeFormat
                }
            }
        },
        
        //创建阶段
        createdStage(){
            if(!this.stageParams.beginTime){
                this.$message.warning('还没选择开始时间~');
                return
            }else if(!this.stageParams.duration){
                this.$message.warning('还没填写持续时间~');
                return
            }
            this.createdLoading = true;
            this.stageParams.beginTime = "1970-01-01 " + this.stageParams.beginTime;
            timelineStageCreated(this.stageParams).then(res => {
                this.createdLoading = false;
                if(res.code === this.$successCode){
                    this.$message.success(this.stageParams.id ? '修改成功~' : '创建成功~');
                    this.showCreatedStage = false;
                    this.$emit('createdStageSuccess', this.stageParams.id ? 'editStage' : 'addStage');
                }
            })
        }
    },
};
</script>