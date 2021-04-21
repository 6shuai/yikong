<template>
    <el-dialog
        width="1000px"
        custom-class="timeline-content-edit"
        :title="contentData.contentName"
        :visible.sync="showContentEdit"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :show-close="false"
        class="timeline-create-stage"
        v-loading="loading"
        append-to-body
    >
        <!-- <el-form label-width="80px">
            <el-form-item 
                v-if="stageParams.phaseType == 2"
                label="播放时长" 
                class="is-required">
                <el-input
                    class="w220 mr10"
                    type="number"
                    v-model="stageParams.duration"
                    :min="1"
                    placeholder="播放时长"
                ></el-input>
                秒
            </el-form-item>
        </el-form> -->

        <div
            class="screen-item"
        >
            <img
                v-if="contentData.contentTypeId!=4"
                :src="contentData.contentPath"
            />
            <div v-if="contentData.contentTypeId==4" class="thumb-wrap">
                <div class="arrow left" @click.stop="prevNextChange('pre', contentData.subContentsData.length)">
                    <i class="el-icon-arrow-left"></i>
                </div>
                <div class="arrow right" @click.stop="prevNextChange('next', contentData.subContentsData.length)">
                    <i class="el-icon-arrow-right"></i>
                </div>
                <img :src="contentData.subContentsData[subIndex].contentPath" />
                    
            </div>
        </div>

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
export default {
    data(){
        return{
            showContentEdit: false,
            contentData: {},
            subIndex: 0
        }
    },
    methods: {
        showContentEditDialog(data){
            this.contentData = data;
            this.showContentEdit = true;
        }
    },
}
</script>

<style lang="scss" scope>
    .timeline-content-edit{
        .screen-item{
            width: 100%;
            max-height: 600px;
            position: relative;
            img{
                width: 100%;
                height: 100%;
            }
    
            .thumb-wrap{
                width: 100%;
                height: 100%;
                position: relative;
                
                .arrow{
                    position: absolute;
                    top: 50%;
                    height: 100px;
                    margin-top: -50px;
                    width: 30px;
                    line-height: 100px;
                    text-align: center;
                    font-size: 20px;
                    background-color: rgba(0,0,0,0.5);
                    z-index: 18;
                    color: #fff;
                    cursor: pointer;
                    &:hover{
                        background-color: rgba(0,0,0,0.8);
                    }
                    &.left{
                        left: 0;
                    }
                    &.right{
                        right: 0;
                    }
                }
    
            }
    
            .content-title{
                position: absolute;
                bottom: 0;
                left: 0;
                height: 25px;
                width: 100%;
                line-height: 25px;
                background: rgba(0, 0, 0, .7);
                color: #fff;
                text-align: center;
            }
        }
    }
</style>