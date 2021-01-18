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
                    <el-form-item label="时间轴" prop="timelineId">
                        <el-select
                            v-model="params.timelineId"
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
                        </el-select>
                    </el-form-item>

                    <group-list
                        v-if="!params.id"
                        propValue="groupIds"
                        @groupSelected="$set(params, 'groupIds', $event)"
                    ></group-list>

                    <el-form-item label="轮次" prop="roundData">
                        <el-button
                            @click="showAddRound = true"
                            type="primary"
                            plain
                            size="mini"
                        >
                            添加
                        </el-button>

                        <el-table class="round-data" :data="tableData" stripe>
                            <el-table-column
                                prop="round"
                                label="轮次"
                                :min-width="60"
                            >
                            </el-table-column>
                            <el-table-column
                                prop="stage"
                                label="阶段"
                                :min-width="60"
                            >
                            </el-table-column>
                            <el-table-column
                                prop="stage"
                                label="操作"
                                width="100"
                            >
                                <template slot-scope="scope">
                                    <el-link 
                                        @click="editRound(scope.row)"
                                        slot="reference" type="primary"
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
                                                    deleteRound(scope.row.id)
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
            <el-form label-width="60px" :model="roundParams">
                <el-form-item label="轮次">
                    <el-input-number
                        :min="1"
                        v-model="roundParams.round"
                        controls-position="right"
                    ></el-input-number>
                </el-form-item>
                <el-form-item label="阶段">
                    <el-select v-model="params.round" placeholder="请选择阶段">
                        <el-option
                            v-for="item in timelineData"
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
                <el-button type="primary" @click="showAddRound = false"
                    >确 定</el-button
                >
            </span>
        </el-dialog>
    </el-card>
</template>
<script>
import {
    timelineContainerCreated,
    timelineContainerDetail,
} from "@/api/timeline";
import GroupList from "@/components/GroupList/index";

export default {
    data() {
        return {
            params: {},
            btnLoading: false,
            addAdvRules: {
                displayName: [
                    { required: true, trigger: "blur", message: "请输入名称~" },
                ],
                timelineId: [
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
                roundData: [
                    {
                        required: true,
                        trigger: "blur",
                        type: 'array',
                        message: "请选择权限群组~",
                    },
                ]
            },
            loading: false, //编辑时获取详情  loading
            tableData: [
                {
                    round: 1,
                    stage: "阶段1",
                },
                {
                    round: 2,
                    stage: "阶段1",
                },
            ],
            timelineData: [],
            roundParams: {},
            showAddRound: false,
        };
    },
    mounted() {
        this.hasPagePerm("Timeline").then((res) => {
            if (res) {
                if (this.$route.params.id) {
                    this.getDetail();
                }
            }
        });
    },
    methods: {
        //编辑 获取详情
        getDetail() {},

        //保存
        timelineSureBtn() {
            this.$refs.addAdvForm.validate((valid) => {
                if (valid) {
                }
            });
        },

        //编辑轮次
        editRound(row){
            this.roundParams = row;
            this.showAddRound = true;
        },

        //删除轮次
        deleteRound() {},
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