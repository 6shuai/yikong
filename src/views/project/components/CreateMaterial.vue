<template>
    <el-dialog
        class="create-material-wrap"
        width="1200px"
        title="物料投放"
        :visible.sync="showCreateMaterial"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :show-close="false"
        append-to-body
    >

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

        <el-empty 
            v-if="!screenData.publishedPlaceholders || !screenData.publishedPlaceholders.length"
            description="暂无锁位信息"
        ></el-empty>
        <el-row v-else>

            <el-col :span="9">
                <h3>物料</h3>
                <div class="select-content">
                    <span @click="handleSelectContent">选择物料</span>
                    <span @click="handleAddContent">新建物料</span>
                </div>
                <div class="content-preview" v-show="addParams.content">
                    <p>{{ addParams.displayName }}</p>
                    <el-image fit="cover" :src="addParams.image"></el-image>
                </div>

                <!-- 播放限制 -->
                <div 
                    class="play-limit-wrap"
                    v-if="selectedScreen && selectedScreen.length">

                    <div v-for="item in selectedScreen" :key="item.id">
                        <div 
                            class="mt20"
                            v-if="item.publishedLimitPlaceholders && item.publishedLimitPlaceholders.length">
                            <h3 class="mb10">{{ item.screenName }}</h3>
                            <el-table
                                stripe
                                size="small"
                                :data="item.publishedLimitPlaceholders"
                                row-key="id"
                                border>
                                <el-table-column 
                                    prop="limitType" 
                                    label="限制类型" 
                                    min-width="100"
                                >
                                    <template slot-scope="scope">
                                        <span>{{ scope.row.limitType == 1 ? '限制播放' : '禁止播放' }}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column 
                                    prop="limitBeginFormat" 
                                    label="开始时间" 
                                    min-width="100"
                                >
                                    <template slot-scope="scope">
                                        <span>{{ formDataLimit(scope.row.limitBeginFormat) }}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column 
                                    prop="limitEndFormat" 
                                    label="结束时间" 
                                    min-width="100"
                                >
                                    <template slot-scope="scope">
                                        <span>{{ formDataLimit(scope.row.limitEndFormat) }}</span>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </div>
                    </div>
                </div>

            </el-col>

            <el-col 
                class="screen-list"
                :span="15">
                <h3>投放屏幕</h3>
                <div class="total-price mb20">
                    <el-tag type="primary">总刊例价: {{ screenData.totalPrice }}</el-tag>
                </div>
                <div class="item list-head">
                    <span class="radio"></span>
                    <span class="screen">屏幕名称</span>
                    <span class="duration">物料时长</span>
                    <span class="play-count">播放次数</span>
                    <span class="start-time">上刊时间</span>
                    <span class="end-time">下刊时间</span>
                    <span class="count">数量</span>
                </div>
                <div 
                    class="item"
                    v-for="(item, index) in screenData.publishedPlaceholders"
                    :key="index"
                    @click.stop="item.selected = !item.selected;handleChangeScreen(item, index)"
                    :class="{ active: item.selected }"
                >
                    <span class="radio">
                        <el-checkbox 
                            :value="item.selected"
                            @change="item.selected = !item.selected;handleChangeScreen(item, index)"
                        ></el-checkbox>
                    </span>
                    <span class="screen">{{ item.screenName }}</span>
                    <span class="duration">{{ item.materialDuration }}</span>
                    <span class="play-count">{{ item.publishedTimes }}</span>
                    <span class="start-time">{{ formDataEvent(item.fromTimeFormat) }}</span>
                    <span class="end-time">{{ formDataEvent(item.toTimeFormat) }}</span>
                    <span class="count">{{ item.count }}</span>
                </div>


            </el-col>
            
        </el-row>
        <span slot="footer" class="dialog-footer">
            <el-button @click="showCreateMaterial = false">取 消</el-button>
            <el-button
                :disabled="(selectedScreen && selectedScreen.length && addParams.content) ? false : true"
                type="primary"
                :loading="createdLoading"
                @click="handleCreate"
                >确 定</el-button
            >
        </span>
    </el-dialog>
</template>

<script>
import { projectMaterialCreate, projectLockPositionList } from '@/api/project'
import { dateAddHMS, findTimeHasYtd } from '@/utils/index'
import MaterialSelectContent from './MaterialSelectContent'
import MaterialAddContent from './MaterialAddContent'

export default {
    components: {
        MaterialSelectContent,
        MaterialAddContent
    },
    data(){
        return {
            showCreateMaterial: false,
            createdLoading: false,
            addParams: {},

            // 屏幕列表
            screenData: [],

            // 选中的屏幕信息
            selectedScreen: [],

            // 选中的屏幕index
            selectedIndex: [],

            // 点击了第几个内容的   选择或新建内容
            clickContentIndex: null,
        }
    },
    methods: {
        // 显示新建物料窗口
        showCreateMaterialDialog(){
            this.showCreateMaterial = true
            this.selectedScreen = []
            this.selectedIndex = []
            this.addParams = {}
            this.getScreenData()
        },

        // 获取已锁位的屏幕列表
        getScreenData(){
            projectLockPositionList({ project: this.$route.params.id }).then(res => {
                if(res.code === this.$successCode){
                    this.screenData = res.obj
                }
            })
        },

        // 选择屏幕
        handleChangeScreen(data, index){
            if(this.selectedIndex.includes(index)){
                this.selectedScreen.splice(this.selectedIndex.indexOf(index), 1)
                this.selectedIndex.splice(this.selectedIndex.indexOf(index), 1)
            }else{
                this.selectedScreen.push(data)
                this.selectedIndex.push(index)
            }
            
        },


        // 新建物料
        handleCreate(){
            
            if(!this.selectedScreen.length){
                this.$message.warning('还没选择屏幕呢~')
                return
            }else if(!this.addParams.content){
                this.$message.warning('还有内容没选择~')
                return
            }

            let data = []
            for(let i = 0; i < this.selectedScreen.length; i++){
                let { screen, fromTimeFormat, toTimeFormat, publishedTimes, id } = this.selectedScreen[i]
                data.push({
                    screen,
                    publishedTimes,
                    effectiveTime: fromTimeFormat,
                    dueTime: toTimeFormat,
                    project: Number(this.$route.params.id),
                    placeholderId: id,
                    content: this.addParams.content
                })
            }

            this.createdLoading = true
            projectMaterialCreate(data).then(res => {
                this.createdLoading = false
                if(res.code === this.$successCode){
                    this.$message.success('提交成功~')
                    this.showCreateMaterial = false
                    this.$emit('createMaterialSuccess')
                }
            }) 
        },


        // 打开选择内容 窗口
        handleSelectContent(){
            this.$refs.selectContent.showSelectContentDialog()
        },

        // 显示选中的内容
        selectResult({ id, displayName, image }){
            this.addParams = {
                ...this.addParams,
                content: id,
                displayName,
                image
            }
        },

        // 打开新建内容 窗口
        handleAddContent(){
            this.$refs.addContent.showCreateContent = true
        },

        formDataEvent(val){
            return dateAddHMS(val)
        },

        formDataLimit(val){
            return findTimeHasYtd(val)
        }
    }
}
</script>

<style lang="scss">
    .create-material-wrap{
        h3{
            text-align: center;
            padding-bottom: 10px;
        }

        .el-select{
            width: 220px;
        }

        .screen-list{
            border-left: 1px solid #e5e5e5;
            padding-left: 10px;

            .item{
                display: flex;
                height: 40px;
                line-height: 40px;

                &.list-head{
                    background: #d0d0d0;
                }   

                &:not(:first-child){
                    cursor: pointer;

                    &:hover{
                        background: #f1f1f1;
                    }
                }

                &.active{
                    span{
                        color: var(--color-primary);
                    }
                }


                span{
                    text-align: center;

                    &.screen{
                        width: 200px;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                        text-align: left;
                    }

                    &.duration, &.play-count, &.count{
                        width: 80px;
                    }

                    &.start-time, &.end-time{
                        width: 100px;
                    }

                    &.radio{
                        width: 40px;

                        .el-radio__label{
                            display: none;
                        }
                    }
                }
            }
        }

        .play-limit-wrap{
            padding: 10px;

            .title{
                padding-left: 32px;
            }
        }

        .select-content{
            width: 200px;
            display: flex;
            border: 1px dashed var(--color-primary);
            border-radius: 4px;
            margin: 10px auto;

            span{
                width: 100px;
                text-align: center;
                line-height: 30px;
                color: var(--color-primary);
                cursor: pointer;

                &:first-child{
                    border-right: 1px dashed var(--color-primary);
                }

                &:hover{
                    background: var(--color-primary);
                    color: #fff;
                }
            }
        }

        .content-preview{
            margin-right: 10px;
            text-align: center;

            p{
                font-size: 16px;
                line-height: 20px;
                padding: 10px 0;
            }
            
            .el-image{
                width: 100%;
                border-radius: 4px;
            }
        }
    }
</style>