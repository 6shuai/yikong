<template>
    <div class="add-cutin-adver">
        <el-form
            label-width="160px"
            ref="addAdvForm"
            :model="params"
            :rules="addAdvRules"
        >
            <el-form-item label="名称" prop="displayName">
                <el-input
                    v-model="params.displayName"
                    placeholder="名称"
                ></el-input>
            </el-form-item>
            <group-list
                v-if="!params.id"
                propValue="groupIds"
                @groupSelected="$set(params, 'groupIds', $event)"
            ></group-list>

            <el-form-item label="广告轴">
                <el-button type="primary" size="mini" plain @click="showAddAdvTimeline=true;">添加广告轴</el-button>

                <adv-timeline-list 
                    :list="params.spotContainerRelation"
                    @deleteAdvTimeline="params.spotContainerRelation.splice($event, 1)"
                ></adv-timeline-list>

            </el-form-item>


            <el-form-item label="游戏阶段" prop="spotGameStageRelation">
                <el-button
                    @click="showAddRound = true"
                    type="primary"
                    plain
                    size="mini"
                >
                    添加
                </el-button>

                <game-stage-list 
                    :list="params.spotGameStageRelation"
                    :timelineList="params.spotContainerRelation"
                    @deleteStage="params.spotGameStageRelation.splice($event, 1)"
                ></game-stage-list>
                
            </el-form-item>

            <el-form-item label="">
                <el-button
                    @click="handleCancel"
                    >取 消</el-button
                >
                <el-button
                    type="primary"
                    icon="el-icon-check"
                    :loading="btnLoading"
                    @click="timelineSureBtn"
                    >提 交</el-button
                >
            </el-form-item>
        </el-form>


        <!-- 添加广告轴 -->
        <el-dialog
            width="500px"
            title="添加广告轴"
            class="add-round"
            :visible.sync="showAddAdvTimeline"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            append-to-body
        >
            <el-form label-width="100px">
                <el-form-item label="选择广告轴">
                    <el-select
                        multiple
                        v-model="spotContainerRelation"
                        placeholder="请选择广告轴"
                        style="width: 100%"
                    >
                        <el-option
                            v-for="item in timelineData"
                            :key="item.id"
                            :label="item.displayName"
                            :value="item.id"
                            :disabled="findDisabled(item.id)"
                        >
                        </el-option>

                        <el-pagination
                            small
                            hide-on-single-page
                            @current-change="handleCurrentChange"
                            :page-size="timelineListParams.pageSize"
                            :current-page="Number(timelineListParams.pageNo)"
                            layout="prev, pager,next,total"
                            :total="timelineTotal">
                        </el-pagination>
                    </el-select>
                </el-form-item>
            </el-form>

            <span slot="footer" class="dialog-footer">
                <el-button @click="showAddAdvTimeline = false">取 消</el-button>
                <el-button 
                    :disabled="spotContainerRelation.length==0"
                    type="primary" 
                    @click="handleAddTimeline"
                    >确 定</el-button
                >
            </span>
        </el-dialog>

        
        <!-- 添加游戏阶段 -->
        <el-dialog
            width="600px"
            title="添加游戏阶段"
            class="add-round"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            :visible.sync="showAddRound"
            append-to-body
        >
            <el-form 
                ref="addStage"
                :model="gameStageParams"
                :rules="addStageRule"
                label-width="180px">
                <el-form-item label="游戏阶段" prop="gameStage">
                    <el-input-number
                        :min="0"
                        v-model="gameStageParams.gameStage"
                        controls-position="right"
                    ></el-input-number>
                </el-form-item>
                <el-form-item label="阶段描述">
                    <el-input v-model="gameStageParams.description"></el-input>
                </el-form-item>
            </el-form>

            <span slot="footer" class="dialog-footer">
                <el-button @click="showAddRound = false">取 消</el-button>
                <el-button 
                    type="primary" 
                    @click="handleAddRound"
                    :disabled="JSON.stringify(gameStageParams) == '{}'"
                    >确 定</el-button
                >
            </span>
        </el-dialog>
    </div>
</template>

<script>
import {
    cutInAdverCreate,
    cutInAdverTimelineList,
    cutInAdverDetail,
    cutInAdverTimelineAdd, 
    cutInAdverGameStageAdd
} from "@/api/cutInAdver";
import GroupList from "@/components/GroupList/index";
import AdvTimelineList from './AdvTimelineList';
import GameStageList from './GameStageList';

// 添加广告轴[id, 名称] ->  添加游戏阶段[阶段, 阶段说明] -> 添加游戏阶段 屏幕列表和广告轴 [广告轴可以自己选择]

export default {
    props: ['id', 'from'],
    data() {
        return {
            params: {
                spotContainerRelation: [],
                spotGameStageRelation: [],
            },
            btnLoading: false,
            addAdvRules: {
                displayName: [
                    { required: true, trigger: "blur", message: "请输入名称~" },
                ],
                groupIds: [
                    {
                        required: true,
                        trigger: "blur",
                        message: "请选择权限群组~",
                    },
                ],
            },
            loading: false, //编辑时获取详情  loading
            timelineListParams: {
                pageNo: 1,
                pageSize: 200,
            },
            timelineTotal: 0,  //时间轴容器总数
            timelineData: [], //时间轴容器列表
            addTimelineArr: {},
            gameStageParams: {},
            showAddRound: false,
            showAddAdvTimeline: false,
            spotContainerRelation: [],       //选择广告轴
            addStageRule: {
                gameStage: [ { required: true, trigger: "blur", message: "请输入游戏阶段~" } ],
            }
        };
    },
    mounted() {
        this.getTimelineList();
        if (this.id) {
            this.getDetail();
        }
    },
    methods: {
        //编辑 获取详情
        getDetail() {
            this.loading = true;
            cutInAdverDetail({ id: this.id }).then((res) => {
                this.loading = false;
                this.params = res.obj;
            });
        },

        //保存
        timelineSureBtn() {
            this.$refs.addAdvForm.validate((valid) => {
                if (valid) {
                    cutInAdverCreate(this.params).then((res) => {
                        if (res.code === this.$successCode) {
                            this.$message.success("操作成功~");
                            if(this.from){
                                let { id, displayName } = res.obj;
                                this.$emit('createdSuccess', {
                                    id,
                                    displayName
                                });
                            }else{
                                this.$router.push("/cutInAdver");
                            }
                        }
                    });
                }
            });
        },

        //取消按钮
        handleCancel(){
            this.from == 'game' ? this.$emit('createdCancel') : this.$router.push('/cutInAdver');
        },

        //时间轴容器列表
        getTimelineList() {
            cutInAdverTimelineList(this.timelineListParams).then((res) => {
                if (res.code === this.$successCode) {
                    let { list, totalRecords } = res.obj;
                    this.timelineData = list;
                    this.timelineTotal = totalRecords;
                }
            });
        },

        //时间轴容器列表  分页
        handleCurrentChange(page){
            this.timelineListParams.pageNo = page;
            this.getTimelineList();
        },

        //添加广告时间轴
        handleAddTimeline(){
            if(this.params.id){
                let data = [];
                this.spotContainerRelation.forEach(item => {
                    data.push({
                        spotId: this.params.id,
                        containerId: item
                    })
                })
                cutInAdverTimelineAdd(data).then(res => {
                    if(res.code === this.$successCode){
                        this.addTimelineArr = {};
                        res.obj.forEach(item => {
                            this.addTimelineArr[item.containerId] = item.id;
                        })
                        // containerId: 65
                        // id: 19
                        // spotId: 6
                        this.addTimelineResult();
                        this.$message.success('添加广告轴成功~');
                    }
                })
            }else{
                this.addTimelineResult();
            }   
        },

        //添加广告轴 结果
        addTimelineResult(){
            this.timelineData.forEach((item)=>{
                if(this.spotContainerRelation.includes(item.id)){
                    this.params.spotContainerRelation.push({
                        containerId: item.id,
                        containerName: item.displayName,
                        id: this.addTimelineArr[item.id]
                    })
                };
            });
            this.spotContainerRelation = [];
            this.showAddAdvTimeline = false;
        },

        findDisabled(id){
            let result = false;
            this.params.spotContainerRelation.forEach(item => {
                if(item.containerId == id){
                    result = true;
                }
            })
            return result;
        },


        //添加阶段
        handleAddRound() {
            this.$refs.addStage.validate((valid) => {
                if(valid){
                    if(this.params.id){
                        this.gameStageParams.spotId = this.params.id;
                        cutInAdverGameStageAdd(this.gameStageParams).then(res => {
                            if(res.code === this.$successCode){
                                this.$message.success('添加游戏阶段成功~');
                                this.gameStageParams = res.obj;
                                this.addStageResult();
                            }
                        })
                    }else{
                        this.addStageResult();
                    }
                }
                
            })
            
        },

        //添加阶段结果
        addStageResult(){
            this.params.spotGameStageRelation.push(this.gameStageParams);
            this.showAddRound = false;
            this.gameStageParams = {};
        }   
        
    },
    components: {
        GroupList,
        AdvTimelineList,
        GameStageList
    },
};
</script>

<style lang="scss">
.add-cutin-adver{
    .round-data {
        border: 1px solid #7e8a97;
        border-radius: 4px;
    }
}
</style>