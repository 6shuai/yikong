<template>
    <el-dialog
        width="1000px"
        custom-class="timeline-content-edit"
        :title="contentData.contentName"
        :visible.sync="showContentEdit"
        class="timeline-create-stage"
        append-to-body
    >   
        <!-- <div class="content-edit-form">
            <el-form label-width="80px">
                <el-form-item 
                    label="播放时长" 
                    class="is-required">
                    <el-input
                        class="w220 mr10"
                        type="number"
                        v-model="contentData.duration"
                        :min="1"
                        placeholder="播放时长"
                    ></el-input>
                    秒
                </el-form-item>
                <el-form-item 
                    label="删除" 
                    class="is-required">
                    <el-button type="primary">删除</el-button>
                </el-form-item>
            </el-form>
        </div> -->

        <div
            class="screen-item"
        >
            <img
                v-if="contentData.contentTypeId == 3"
                :src="contentData.image"
            />
            <img
                v-else-if="contentData.contentTypeId!=4"
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

        <div class="content-edit-form">
            <el-form :inline="true" label-width="70px">
                <el-form-item 
                    label="播放时长">
                    <el-input
                        class="w220 mr10"
                        type="number"
                        v-model="contentData.duration"
                        :min="1"
                        placeholder="播放时长"
                    ></el-input>
                    秒
                    <el-button 
                        icon="el-icon-check" 
                        type="primary"
                        @click="handleChangeDuration"
                    >提交</el-button>
                    <el-button 
                        icon="el-icon-delete" 
                        type="danger"
                        @click="handleDelete"
                    >删除</el-button>
                    <el-button @click="showContentEdit = false">取 消</el-button>
                </el-form-item>
            </el-form>
        </div>


    </el-dialog>
</template>

<script>
export default {
    data(){
        return{
            showContentEdit: false,
            contentData: {},
            subIndex: 0,
            btnLoading: false,

        }
    },
    methods: {
        showContentEditDialog(data, Pindex, index){
            this.contentData = {
                ...data,
                Pindex, 
                index
            };
            this.showContentEdit = true;
        },

        //编辑时长
        handleChangeDuration(){
            this.$emit('updateContentTime', this.contentData);
        },

        //删除内容
        handleDelete(){
            let { Pindex, index, id } = this.contentData;
            this.$emit('deleteCurrentTimeline', Pindex, index, id);
        }
    },
}
</script>

<style lang="scss">
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

        .content-edit-form{
            padding: 20px 0;
        }
    }
</style>