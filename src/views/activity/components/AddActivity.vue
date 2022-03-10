<!--
 * @Author: liushuai
 * @Date: 2021-11-10 11:14:06
 * @LastEditors: liushuai
 * @LastEditTime: 2021-11-10 11:16:05
 * @Description: file content
 * @FilePath: \pclient\src\views\activity\components\AddActivity.vue
-->
<template>
    <div v-loading="loading">
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
                    type="datetime"
                    placeholder="开始时间"
                >
                </el-date-picker>
            </el-form-item>
            <el-form-item label="结束时间" prop="endTime">
                <el-date-picker
                    v-model="activityParams.endTime"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    format="yyyy-MM-dd HH:mm:ss"
                    type="datetime"
                    placeholder="结束时间"
                    default-time="23:59:59"
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
            <el-form-item label="选择商户" prop="merchants">
                <div class="select-merchant mb20" @click="$refs.merchant.showMerchantList(activityParams.merchants)">
                    {{merchantName || '选择商户'}}<i class="el-icon-arrow-right"></i>
                </div>
                <el-tag
                    v-for="(item, index) in activityParams.merchants"
                    :key="index"
                    class="mr10"
                    type="primary"
                    closable
                    @close="handleDeleteMerchant(item.id, index)"
                    >
                    {{ item.merchantName }}
                </el-tag>
            </el-form-item>
            <group-list
                v-if="!activityParams.id"
                propValue="groupIds"
                @groupSelected="
                    $set(activityParams, 'groupIds', $event)
                "
            ></group-list>

            <el-form-item label="">
                <el-button @click="handleCancel"
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

        <!-- 选择商户 -->
        <select-merchant 
            ref="merchant" 
            @merchantId="handleMerchant"
        ></select-merchant>
    </div>
</template>

<script>
import {
    activityPlaceModule,
    activityPayWayList,
    activityCreated,
    actvityDeleteMerchant,
} from "@/api/activity";
import { getActivityDetail } from "../mixins/index";
import GroupList from "@/components/GroupList/index";
import SelectMerchant from './ActivitySelectMerchant';

export default {
    mixins: [getActivityDetail],
    props: ['id', 'from'],
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
                merchants: [
                    {
                        required: true,
                        trigger: "blur",
                        type: "array",
                        message: "请选择商户~",
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
        if (this.id) {
            this.loading = true;
            this.initDetail(this.id).then((res) => {
                this.loading = false;
                this.activityParams = {
                    ...this.resData
                };
                this.merchantName = this.resData.merchantName
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
                            let { id, displayName } = res.obj;
                            this.from === 'game' ? this.$emit('createdSuccess', { id, displayName })  : this.$router.push("/activity");
                        }
                    });
                }
            });
        },

        //选择商户
        handleMerchant(data){
            this.$set(this.activityParams, 'merchants', data);
        },

        //删除商户
        handleDeleteMerchant(id, index){
            if(!id){
                this.activityParams.merchants.splice(index, 1);
                return
            }
            actvityDeleteMerchant(id).then(res => {
                if(res.code == this.$successCode){
                    this.$message.success('删除成功~');
                    this.activityParams.merchants.splice(index, 1);
                }
            })
        },

        //取消按钮
        handleCancel(){
            this.from == 'game' ? this.$emit('createdCancel') : this.$router.push('/activity');
        },
    },
    components: {
        GroupList,
        SelectMerchant,
    },
};
</script>

<style lang="scss">
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