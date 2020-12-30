<template>
    <el-dialog
        class="add-condition-dialog"
        :title="conditionParams.id ? '编辑发奖条件' : '添加发奖条件'"
        :visible.sync="showConditionDialog"
        width="600px"
        :append-to-body="true"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
    >
        <el-form
            label-width="80px"
            ref="addConditionForm"
            :model="conditionParams"
            :rules="conditionRules"
        >
            <el-form-item label="条件类型" prop="ruleType">
                <el-select
                    class="w220"
                    v-model="conditionParams.ruleType"
                    filterable
                    placeholder="请选择条件类型"
                >
                    <el-option
                        v-for="item in typeData"
                        :key="item.id"
                        :label="item.displayName"
                        :value="item.id"
                    >
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="目标游戏" prop="assemblyId">
                <el-select
                    class="w220"
                    v-model="conditionParams.assemblyId"
                    filterable
                    placeholder="请选择目标游戏"
                    @change="handleChangeGame"
                >
                    <el-option
                        v-for="item in gameData"
                        :key="item.assemblyId"
                        :label="item.displayName"
                        :value="item.assemblyId"
                    >
                    </el-option>
                </el-select>
            </el-form-item>

            <!-- 条件类型为1时，必传 -->
            <el-form-item 
                v-if="conditionParams.ruleType == 1"
                label="排行榜" 
                prop="rankingListId">
                <el-select
                    class="w220"
                    v-model="conditionParams.rankingListId"
                    filterable
                    placeholder="请选择排行榜"
                >
                    <el-option
                        v-for="item in rankListData"
                        :key="item.id"
                        :label="item.displayName"
                        :value="item.id"
                    >
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="条件" class="is-required">
                <el-row>
                    <el-col :span="12">
                        <el-form-item prop="compareType">
                            <el-select
                                class="w220"
                                v-model="conditionParams.compareType"
                                filterable
                                placeholder="请选择条件"
                            >
                                <el-option
                                    v-for="item in conditionData"
                                    :key="item.id"
                                    :label="item.displayName"
                                    :value="item.id"
                                >
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item prop="checkValue">
                            <el-input-number
                                :min="1"
                                v-model="conditionParams.checkValue"
                                controls-position="right"
                                placeholder="条件数值"
                            ></el-input-number>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form-item>
        </el-form>

        <span slot="footer" class="dialog-footer">
            <el-button @click="showConditionDialog = false">取 消</el-button>
            <el-button
                type="primary"
                :loading="btnLoading"
                @click="handleAddPCondition"
                >确 定</el-button
            >
        </span>
    </el-dialog>
</template>

<script>
import { activityConditionGameList, activityConditionRankTemp, activityConditionCreated } from '@/api/activity';

export default {
    data() {
        return {
            showConditionDialog: false,
            conditionParams: {},
            btnLoading: false,
            currencyData: [],
            gameData: [],          //游戏列表
            rankListData: [],      //排行榜列表
            typeData: [
                { id: 1, displayName: '排行榜名次' },
                { id: 2, displayName: '游戏次数' },
                { id: 3, displayName: '游戏时长' },
            ],
            conditionData: [
                { id: 0, displayName: '等于' },
                { id: 1, displayName: '大于' },
                { id: 2, displayName: '小于' },
            ],
            conditionRules: {
                ruleType: [
                    { 
                        required: true, 
                        trigger: "blur", 
                        message: "请选择条件类型~" 
                    },
                ],
                assemblyId: [
                    {
                        required: true,
                        trigger: "blur",
                        message: "请选择目标游戏~",
                    },
                ],
                rankingListId: [
                    {
                        required: true,
                        trigger: "blur",
                        message: "请选择排行榜~",
                    },
                ],
                compareType: [
                    {
                        required: true,
                        trigger: "blur",
                        message: "请选择条件~",
                    },
                ],
                checkValue: [
                    {
                        required: true,
                        trigger: "blur",
                        message: "请输入条件数值~",
                    },
                ],
            },
        };
    },
    created() {
        if(!this.gameData.length){
            this.getGameList();
        }
    },
    methods: {
        showDialog(data){
            this.conditionParams = data || {};
            this.showConditionDialog = true;
        },

        //游戏列表
        getGameList(){
            activityConditionGameList().then(res => {
                if(res.code === this.$successCode){
                    this.gameData = res.obj;
                }
            })
        },

        //选择游戏
        handleChangeGame(event){
            this.gameData.forEach(item => {
                if(event == item.id){
                    this.getRankList(item.appId);
                }
            })
        },

        //排行榜列表
        getRankList(id){
            let data = {
                appId: id
            }
            activityConditionRankTemp(data).then(res => {
                if(res.code === this.$successCode){
                    this.rankListData = res.obj;
                }
            })
        },

        //添加条件
        handleAddPCondition(){
            this.$refs.addConditionForm.validate((valid) => {
                if(valid){
                    this.btnLoading = true;
                    activityConditionCreated(this.conditionParams).then(res => {
                        this.btnLoading = false;
                        if(res.code === this.$successCode){
                            this.$message.success('操作成功~');
                            this.showConditionDialog = false;
                            this.$emit('addConditionSuccess', res.obj);
                        }
                    })
                }
            })
        }
    }
};
</script>
