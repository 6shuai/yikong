<template>
    <el-dialog
        width="800px"
        title="屏幕列表"
        class="add-round"
        :visible.sync="showScreenList"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        append-to-body
    >
        <el-table
            v-loading="screenListLoading"
            class="round-data game-stage-list"
            :data="resData"
            stripe
        >
            <el-table-column
                prop="screenName"
                label="屏幕"
                :min-width="60"
            >
            </el-table-column>
            <el-table-column
                prop="containerName"
                label="广告轴"
                :min-width="60"
            >
            </el-table-column>
            <el-table-column label="操作" width="120" v-if="timelineList && timelineList.length > 1">
                <template slot-scope="scope">
                    <el-button 
                        type="primary" 
                        size="mini" 
                        @click="handleShowChangeTimeline(scope.row, scope.$index)"
                    >更改广告轴</el-button>
                </template>
            </el-table-column>
        </el-table>

        <span slot="footer" class="dialog-footer">
            <el-button @click="showScreenList = false">关 闭</el-button>
        </span>

        <el-dialog
            width="500px"
            title="更改广告轴"
            class="add-round"
            :visible.sync="showChangeTimeline"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            append-to-body
        >
            <el-form label-width="100px">
                <el-form-item label="选择广告轴">
                    <el-select
                        v-model="changeScreenTimeline.spotContainerId"
                        placeholder="请选择广告轴"
                        style="width: 100%"
                    >
                        <el-option
                            v-for="item in timelineList"
                            :key="item.id"
                            :label="item.containerName"
                            :value="item.id"
                        >
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>

            <span slot="footer" class="dialog-footer">
                <el-button @click="showChangeTimeline = false">取 消</el-button>
                <el-button 
                    :loading="btnLoading"
                    @click="changeTimeline"
                >提 交</el-button>
            </span>
        </el-dialog>

    </el-dialog>

</template>

<script>
import { cutInAdverScreenList, updateScreenAdvTimeline } from '@/api/cutInAdver';

export default {
    props: ['timelineList'],
    data(){
        return{
            screenListLoading: false,
            showScreenList: false,
            resData: [],
            showChangeTimeline: false,     //修改当前屏幕游戏 对应的 插播时间轴
            changeScreenTimeline: {},
            btnLoading: false,
        }
    },
    methods: {
        getScreenList(id){
            this.changeScreenTimeline = {};
            this.showScreenList = true;
            this.screenListLoading = true;
            cutInAdverScreenList(id).then(res => {
                this.screenListLoading = false;
                if(res.code === this.$successCode){
                    this.resData = res.obj;
                }
            })
        },

        handleShowChangeTimeline(row, index){
            this.changeScreenTimeline = {
                id: row.id,
                screenId: row.screenId,
                index
            }; 
            this.showChangeTimeline = true
        },

        //修改时间轴
        changeTimeline(){
            this.btnLoading = true;
            updateScreenAdvTimeline(this.changeScreenTimeline).then(res => {
                this.btnLoading = false;
                if(res.code === this.$successCode){
                    let { index } = this.changeScreenTimeline;
                    let { containerName } = res.obj;
                    this.resData[index].containerName = containerName;
                    this.$message.success('修改成功~');
                    this.showChangeTimeline = false;
                }
            })
        }
    },
}
</script>