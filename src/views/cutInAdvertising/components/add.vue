<template>
    <el-card class="adv-add-wrap">
        <el-page-header @back="$router.go(-1)">
            <div slot="content">
                {{ $route.params.id ? "编辑插播广告" : "创建插播广告" }}
            </div>
        </el-page-header>
        <el-row
            :gutter="10"
            class="mt30"
            v-loading="$route.params.id && loading"
        >
            <el-col :xs="24" :sm="24" :md="12">
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
                    <el-form-item label="时间轴" prop="timelineContainerId">
                        <el-select
                            @change="findTimelineStage"
                            v-model="params.timelineContainerId"
                            placeholder="请选择时间轴"
                            style="width: 100%"
                        >
                            <el-option
                                v-for="item in timelineData"
                                :key="item.id"
                                :label="item.displayName"
                                :value="item.id"
                            >
                            </el-option>

                            <el-pagination
                                small
                                hide-on-single-page
                                @current-change="handleCurrentChange"
                                :current-page="Number(timelineListParams.pageNo)"
                                layout="prev, pager,next,total"
                                :total="timelineTotal">
                            </el-pagination>

                        </el-select>
                    </el-form-item>

                    <group-list
                        v-if="!params.id"
                        propValue="groupIds"
                        @groupSelected="$set(params, 'groupIds', $event)"
                    ></group-list>

                    <el-form-item label="轮次" prop="spotStageMaps">
                        <el-button
                            @click="showAddRound = true"
                            type="primary"
                            plain
                            size="mini"
                        >
                            添加
                        </el-button>
                        <el-table
                            class="round-data"
                            :data="params.spotStageMaps"
                            stripe
                        >
                            <el-table-column
                                prop="gameStage"
                                label="轮次"
                                :min-width="60"
                            >
                                <template slot-scope="scope">
                                    <el-tag size="mini">
                                        {{ scope.row.gameStage }}
                                    </el-tag>
                                </template>
                            </el-table-column>
                            <el-table-column
                                prop="timelineStageName"
                                label="阶段"
                                :min-width="60"
                            >
                            </el-table-column>
                            <el-table-column label="操作" width="100">
                                <template slot-scope="scope">
                                    <el-link
                                        @click="editRound({...scope.row, index: scope.$index+1})"
                                        slot="reference"
                                        type="primary"
                                        >编辑</el-link
                                    >
                                    <el-popover
                                        style="margin-left: 10px"
                                        placement="top"
                                        :ref="scope.row.id"
                                        width="200"
                                    >
                                        <p>此操作将永久删除此数据, 是否继续?</p>
                                        <div
                                            style="text-align: right; margin: 0"
                                        >
                                            <el-button
                                                size="mini"
                                                type="text"
                                                @click="
                                                    $refs[
                                                        scope.row.id
                                                    ].doClose()
                                                "
                                                >取消</el-button
                                            >
                                            <el-button
                                                type="primary"
                                                size="mini"
                                                @click="
                                                    deleteRound(scope.row.id, scope.$index)
                                                "
                                                >确定</el-button
                                            >
                                        </div>
                                        <el-link slot="reference" type="danger"
                                            >删除</el-link
                                        >
                                    </el-popover>
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-form-item>

                    <el-form-item label="">
                        <el-button
                            type="primary"
                            icon="el-icon-check"
                            :loading="btnLoading"
                            @click="timelineSureBtn"
                            >提 交</el-button
                        >
                    </el-form-item>
                </el-form>
            </el-col>
        </el-row>

        <el-dialog
            width="500px"
            title="添加轮次插播"
            class="add-round"
            :visible.sync="showAddRound"
            append-to-body
        >
            <el-form label-width="100px" :model="roundParams">
                <el-form-item label="游戏轮次">
                    <el-input-number
                        :min="1"
                        v-model="roundParams.gameStage"
                        controls-position="right"
                    ></el-input-number>
                </el-form-item>
                <el-form-item label="时间轴阶段">
                    <el-select
                        v-model="roundParams.timelineStage"
                        placeholder="请选择阶段"
                    >
                        <el-option
                            v-for="item in stageData"
                            :key="item.id"
                            :label="item.displayName"
                            :value="item.id"
                        >
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>

            <span slot="footer" class="dialog-footer">
                <el-button @click="showAddRound = false">取 消</el-button>
                <el-button type="primary" @click="handleAddRound"
                    >确 定</el-button
                >
            </span>
        </el-dialog>
    </el-card>
</template>
<script>
import {
    cutInAdverCreate,
    cutInAdverTimelineList,
    cutInAdverTimelineStage,
    cutInAdverDetail,
    cutInAdverRoundDelete
} from "@/api/cutInAdver";
import GroupList from "@/components/GroupList/index";

export default {
    data() {
        return {
            params: {
                spotStageMaps: [],
            },
            btnLoading: false,
            addAdvRules: {
                displayName: [
                    { required: true, trigger: "blur", message: "请输入名称~" },
                ],
                timelineContainerId: [
                    {
                        required: true,
                        trigger: "change",
                        message: "请选择时间轴~",
                    },
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
                pageSize: 40,
            },
            timelineTotal: 0,  //时间轴容器总数
            timelineData: [], //时间轴容器列表
            roundParams: {},
            showAddRound: false,
            stageData: [], //根据时间轴容器查询的阶段
        };
    },
    mounted() {
        this.getTimelineList();
        if (this.$route.params.id) {
            this.getDetail();
        }
    },
    methods: {
        //编辑 获取详情
        getDetail() {
            this.loading = true;
            cutInAdverDetail({ id: this.$route.params.id }).then((res) => {
                this.loading = false;
                this.params = res.obj;
                this.findTimelineStage();
            });
        },

        //保存
        timelineSureBtn() {
            this.$refs.addAdvForm.validate((valid) => {
                if (valid) {
                    cutInAdverCreate(this.params).then((res) => {
                        if (res.code === this.$successCode) {
                            this.$message.success("操作成功~");
                            this.$router.push("/cutInAdver");
                        }
                    });
                }
            });
        },

        //编辑轮次
        editRound(row) {
            this.roundParams = row;
            this.showAddRound = true;
            
        },

        //删除轮次
        deleteRound(id, index) {
            if(!id){
                this.params.spotStageMaps.splice(index, 1);
                return
            }
            cutInAdverRoundDelete(id).then(res => {
                if(res.code === this.$successCode){
                    this.$message.success('删除成功~');
                    this.params.spotStageMaps.splice(index, 1);
                }
            })
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

        //根据时间轴容器查询 阶段
        findTimelineStage() {
            cutInAdverTimelineStage({
                containerId: this.params.timelineContainerId,
            }).then((res) => {
                if (res.code === this.$successCode) {
                    let obj = res.obj;
                    this.stageData = [];
                    for (let key in obj) {
                        this.stageData.push({
                            id: obj[key],
                            displayName: key,
                        });
                    }
                }
            });
        },

        //添加轮次
        handleAddRound() {
            this.stageData.forEach((item) => {
                if (item.id == this.roundParams.timelineStage) {
                    this.roundParams.timelineStageName = item.displayName;
                }
            });

            if(this.roundParams.index){
                this.$set(this.params.spotStageMaps, this.roundParams.index-1, this.roundParams);
            }else{
                this.params.spotStageMaps.push(this.roundParams);
            }
            this.showAddRound = false;
            this.roundParams = {};
        },
        
    },
    components: {
        GroupList,
    },
};
</script>
<style lang="scss" scope>
.adv-add-wrap {
    .el-input {
        width: 100%;
    }

    .round-data {
        border: 1px solid #7e8a97;
        border-radius: 4px;
    }
}
</style>