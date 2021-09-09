<template>
    <el-card class="game-add-wrap">
        <el-page-header @back="$router.go(-1)">
            <div slot="content">
                {{ $route.params.id ? "编辑活动" : "创建活动" }}
            </div>
        </el-page-header>
        <el-row :gutter="10" class="mt30" v-loading="loading">
            <el-col :xs="24" :sm="24" :md="12">
                <el-form
                    label-width="160px"
                    ref="activityRef"
                    :model="activityParams"
                    :rules="activityRules"
                >
                    <el-form-item label="活动名称" prop="displayName">
                        <el-input
                            v-model="activityParams.displayName"
                            placeholder="活动名称"
                        ></el-input>
                    </el-form-item>
                    <el-form-item label="活动描述">
                        <el-input
                            type="textarea"
                            :rows="3"
                            v-model="activityParams.description"
                            placeholder="活动描述"
                        ></el-input>
                    </el-form-item>
                    <el-form-item label="开始时间" prop="beginTime">
                        <el-date-picker
                            v-model="activityParams.beginTime"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            format="yyyy-MM-dd HH:mm:ss"
                            placeholder="开始时间"
                        >
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="结束时间" prop="endTime">
                        <el-date-picker
                            v-model="activityParams.endTime"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            format="yyyy-MM-dd HH:mm:ss"
                            placeholder="结束时间"
                        >
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="商场模块" prop="moduleId">
                        <el-select
                            v-model="activityParams.moduleId"
                            filterable
                            placeholder="请选择商场模块"
                            @change="handleChangeModule"
                        >
                            <el-option
                                v-for="item in moduleData"
                                :key="item.id"
                                :label="item.displayName"
                                :value="item.id"
                            >
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="选择商户" prop="moduleId">
                        <div class="select-merchant" @click="$refs.merchant.showMerchantList()">
                            {{merchantName || '选择商户'}}<i class="el-icon-arrow-right"></i>
                        </div>
                    </el-form-item>
                    <el-form-item label="需要支付" prop="needCost">
                        <el-switch
                            :active-value="1"
                            :inactive-value="0"
                            v-model="activityParams.needCost"
                        ></el-switch>
                    </el-form-item>

                    <div v-if="activityParams.needCost">
                        <el-form-item label="支付方式" prop="costId">
                            <el-select
                                v-model="activityParams.costId"
                                filterable
                                placeholder="请选择支付的方式"
                            >
                                <el-option
                                    v-for="item in payTypeData"
                                    :key="item.id"
                                    :label="item.displayName"
                                    :value="item.id"
                                >
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="支付类型" prop="costType">
                            <el-select
                                v-model="activityParams.costType"
                                filterable
                                placeholder="请选择支付类型"
                            >
                                <el-option
                                    v-for="item in moduleTypeData"
                                    :key="item.id"
                                    :label="item.displayName"
                                    :value="item.id"
                                >
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="价格" prop="costValue">
                            <el-input-number
                                v-model="activityParams.costValue"
                                placeholder="价格"
                                :min="0"
                                controls-position="right"
                            ></el-input-number>
                        </el-form-item>
                    </div>
                    <group-list
                        v-if="!activityParams.id"
                        propValue="groupIds"
                        @groupSelected="
                            $set(activityParams, 'groupIds', $event)
                        "
                    ></group-list>

                    <el-form-item label="">
                        <el-button @click="$router.push(`/activity`)"
                            >取 消</el-button
                        >
                        <el-button
                            type="primary"
                            icon="el-icon-check"
                            :loading="btnLoading"
                            @click="handleAddActivity"
                            >提 交</el-button
                        >
                    </el-form-item>
                </el-form>
            </el-col>
        </el-row>

        <!-- 选择商户 -->
        <select-merchant 
            ref="merchant" 
            @merchantId="activityParams.merchantId=$event.id;merchantName=$event.displayName"
        ></select-merchant>

    </el-card>
</template>
<script>
import {
    activityPlaceModule,
    activityPayWayList,
    activityCreated,
} from "@/api/activity";
import { getActivityDetail } from "./mixins/index";
import GroupList from "@/components/GroupList/index";
import SelectMerchant from './components/SelectMerchant';

export default {
    mixins: [getActivityDetail],
    data() {
        return {
            loading: false,
            btnLoading: false,
            activityParams: {},
            moduleData: [], //商场模块
            payTypeData: [], //支付方式
            moduleTypeData: [
                { id: 1, displayName: "一次性" },
                { id: 2, displayName: "按游戏次数" },
            ],
            activityRules: {
                displayName: [
                    {
                        required: true,
                        trigger: "blur",
                        message: "请输入活动名称~",
                    },
                ],
                beginTime: [
                    {
                        required: true,
                        trigger: "blur",
                        message: "请选择开始时间~",
                    },
                ],
                endTime: [
                    {
                        required: true,
                        trigger: "blur",
                        message: "请选择结束时间~",
                    },
                ],
                moduleId: [
                    {
                        required: true,
                        trigger: "change",
                        type: "number",
                        message: "请选择商场模块~",
                    },
                ],
                merchantId: [
                    {
                        required: true,
                        trigger: "blur",
                        message: "请选择商户~",
                    },
                ],
                needCost: [
                    {
                        required: true,
                        trigger: "blur",
                        message: "请选择是否需要支付~",
                    },
                ],
                costId: [
                    {
                        required: true,
                        trigger: "change",
                        type: "number",
                        message: "请选择支付方式~",
                    },
                ],
                costType: [
                    {
                        required: true,
                        trigger: "change",
                        type: "number",
                        message: "请选择支付类型~",
                    },
                ],
                costValue: [
                    {
                        required: true,
                        trigger: "blur",
                        message: "请输入价格~",
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
            merchantName: ''
        };
    },
    created() {
        this.getPlaceModule();
        if (this.$route.params.id) {
            this.loading = true;
            this.initDetail().then((res) => {
                this.loading = false;
                this.activityParams = {
                    ...this.resData,
                    needCost: this.resData.needCost ? 1 : 0,
                };
                this.getPayType();
            });
        }
    },
    methods: {
        //商场模块
        getPlaceModule() {
            activityPlaceModule().then((res) => {
                if (res.code === this.$successCode) {
                    this.moduleData = res.obj;
                }
            });
        },

        //奖品数据  支付类型
        getPayType() {
            let data = { moduleId: this.activityParams.moduleId };
            activityPayWayList(data).then((res) => {
                if (res.code === this.$successCode) {
                    this.payTypeData = res.obj;
                }
            });
        },

        //选择商场模块  根据模块id 获取门票(支付方式)列表
        handleChangeModule() {
            this.getPayType();
        },

        //创建活动
        handleAddActivity() {
            this.$refs.activityRef.validate((valid) => {
                if (valid) {
                    this.btnLoading = true;
                    activityCreated(this.activityParams).then((res) => {
                        this.btnLoading = false;
                        if (res.code === this.$successCode) {
                            this.$message.success(
                                this.activityParams.id
                                    ? "编辑成功~"
                                    : "添加成功~"
                            );
                            this.$router.push("/activity");
                        }
                    });
                }
            });
        },
    },
    components: {
        GroupList,
        SelectMerchant,
    },
};
</script>

<style lang="scss" scope>
    .game-add-wrap{
        .select-merchant{
            width: 200px;
            height: 40px;
            line-height: 40px;
            border-radius: 6px;
            border: 1px solid #DCDFE6;
            padding-left: 15px;
            position: relative;
            cursor: pointer;
    
    
            .el-icon-arrow-right{
                position: absolute;
                top: 13px;
                right: 10px;
            }
        }
    }
</style>