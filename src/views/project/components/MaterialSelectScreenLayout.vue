<!--
 * @Author: liushuai
 * @Date: 2022-03-01 15:14:25
 * @LastEditors: liushuai
 * @LastEditTime: 2022-03-02 17:29:39
 * @Description: file content
 * @FilePath: \pclient\src\views\project\components\MaterialSelectScreenLayout.vue
-->
<template>
    <div class="materal-select-screen-layout">
        <div class="select-screen-layout mb20" @click="handleShowDialog">
            <el-button type="primary" plain size="small">选择屏幕布局模板</el-button>
        </div>


        <screen-layout 
            v-if="selectedScreenTemplate" 
            :screen="selectedScreenTemplate" 
            :maxWidth="1000"
        >
            <template v-slot="dataDefalut">
            
                <img 
                    class="content-image"
                    v-if="screenLayoutImage[dataDefalut.index]"
                    :src="screenLayoutImage[dataDefalut.index].img" 
                >

                <div class="content-detail" v-if="screenLayoutImage[dataDefalut.index]">
                    <p>{{ screenLayoutImage[dataDefalut.index].displayName }}</p>
                </div>
        
                <div class="select-content">
                    <span @click="handleSelectContent(dataDefalut.index)">选择物料</span>
                    <span @click="handleAddContent(dataDefalut.index)">新建物料</span>
                </div>
            </template>
        </screen-layout>


        <!-- 选择内容 -->
        <material-select-content 
            ref="selectContent"
            @selectResult="selectResult"
        ></material-select-content>

        <!-- 新建内容 -->
        <material-add-content 
            ref="addContent"
            @selectResult="selectResult"
        ></material-add-content>


        <el-dialog
            width="1200px"
            title="选择屏幕布局模板"
            :visible.sync="showScreenLayoutList"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            append-to-body
        >  
            <screen-layout-template-list 
                ref="screenLayoutTemplateList"
                @layoutTemplateSelected="layoutTemplateSelected"
            ></screen-layout-template-list>

            <span slot="footer" class="dialog-footer">
                <el-button @click="showScreenLayoutList = false">取 消</el-button>
                <el-button
                    :disabled="screenTemplateInfo ? false : true"
                    type="primary"
                    @click="handleSaveSelect"
                    >确 定</el-button
                >
            </span>
        </el-dialog>
    </div>
</template>

<script>
import ScreenLayoutTemplateList from '@/views/screenLayout/components/ScreenLayoutTemplateList'
import MaterialSelectContent from './MaterialSelectContent'
import MaterialAddContent from './MaterialAddContent'
import ScreenLayout from '@/views/screenLayout/components/ScreenLayout'

export default {
    components: {
        ScreenLayoutTemplateList,
        MaterialSelectContent,
        MaterialAddContent,
        ScreenLayout
    },
    props: ['selectedScreenDuration'],
    data() {
        return {
            showScreenLayoutList: false,
            screenTemplateInfo: undefined,

            // 选中的屏幕模板详情
            selectedScreenTemplate: undefined,

            // 屏幕布局图片
            screenLayoutImage: [],

            // 选择的屏幕分区 index
            splitScreenIndex: null
        }
    },
    methods: {
        // 显示屏幕布局模板
        handleShowDialog(){
            this.showScreenLayoutList = true

            this.$nextTick(() => {
                this.$refs.screenLayoutTemplateList.getScreenTemplateList('project')
            })
        },
        
        // 打开选择内容 窗口
        handleSelectContent(index){
            this.splitScreenIndex = index
            this.$refs.selectContent.showSelectContentDialog()
        },

        // 打开新建内容 窗口
        handleAddContent(index){
            this.splitScreenIndex = index
            this.$refs.addContent.showCreateContent = true
        },

        // 显示选中的内容
        selectResult({ id, displayName, duration, image }){
            
            for(let i = 0; i < this.screenLayoutImage.length; i++){
                if(this.screenLayoutImage[i] && this.screenLayoutImage[i].duration != duration && i != this.splitScreenIndex){
                    this.$message.warning('投放的物料时长不一致, 请重新投放~')
                    return false
                }else if(this.selectedScreenDuration && this.selectedScreenDuration != duration){
                    this.$message.warning('投放的物料时长和投放屏幕物料时长不一致, 请重新投放~')
                    return false
                }
            }

            this.$set(this.screenLayoutImage, this.splitScreenIndex, {
                // 内容缩略图
                img: image,

                // 内容时长
                duration,

                // 内容名称
                displayName,

                // 逻辑区域id
                regionId: this.selectedScreenTemplate.logicRegionSubs[this.splitScreenIndex].id,
                
                // 内容id
                contentId: id
            })

            console.log('this.screenLayoutImage------------>', this.screenLayoutImage)
            
            this.$emit('setScreenLayoutData', {
                screenLayout: this.screenTemplateInfo.id,
                publishedMaterialRegions: this.screenLayoutImage
            }, duration)
        },


        // 选定模板
        layoutTemplateSelected(timelineRegions, data){
            this.screenTemplateInfo = data
        },

        // 保存选中的模板
        handleSaveSelect(){
            this.selectedScreenTemplate = this.screenTemplateInfo
            this.showScreenLayoutList = false
            this.$emit('setScreenLayoutData', {}, null)
            this.screenLayoutImage = new Array(this.selectedScreenTemplate.logicRegionSubs.length)
        }
    }
}
</script>