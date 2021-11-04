<template>
    <el-card class="game-add-wrap">
        <el-page-header @back="$router.go(-1)">
            <div slot="content">
                {{ $route.params.id ? "编辑优惠券" : "添加优惠券" }}
            </div>
        </el-page-header>
        <el-row :gutter="10" class="mt30" v-loading="loading">
            <el-col :xs="24" :sm="24" :md="12">
                <el-form
                    label-width="110px"
                    ref="addcouponForm"
                    :model="couponParams"
                    :rules="couponRules"
                >
                    <el-form-item label="优惠券名称" prop="displayName">
                        <el-input
                            v-model="couponParams.displayName"
                            placeholder="优惠券名称"
                        ></el-input>
                    </el-form-item>
                    <el-form-item label="优惠券图片" prop="image">
                        <upload-img
                            :imgList="couponParams.image"
                            @uploadImgPath="$set(couponParams, 'image', $event)"
                        ></upload-img>
                    </el-form-item>
                    <el-form-item label="优惠券类型" prop="couponType">
                        <el-select
                            v-model="couponParams.couponType"
                            filterable
                            placeholder="请选择优惠券类型"
                        >
                            <el-option
                                v-for="item in couponTypeData"
                                :key="item.id"
                                :label="item.displayName"
                                :value="item.id"
                            >
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="商户" prop="merchant">
                        <el-input-number
                            style="display: none;"
                            v-model="couponParams.merchant"
                            placeholder="优惠券名称"
                        ></el-input-number>
                        <div class="select-merchant" @click="$refs.merchant.showMerchantList()">
                            {{merchantName || '选择商户'}}<i class="el-icon-arrow-right"></i>
                        </div>
                    </el-form-item>
                    <el-form-item label="有效期类型" prop="expirationType">
                        <el-select
                            v-model="couponParams.expirationType"
                            filterable
                            clearable
                            placeholder="请选择有效期类型"
                        >
                            <el-option
                                v-for="item in [{ id: 1, name: '固定截止日期' }, { id: 2, name: '固定过期时长' }]"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id"
                            >
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item 
                        label="截止日期" 
                        v-if="couponParams.expirationType==1"
                    >
                        <el-date-picker
                            v-model="couponParams.expiration"
                            value-format="yyyy-MM-dd"
                            format="yyyy-MM-dd"
                            placeholder="截止日期"
                        >
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item 
                        label="固定过期时长" 
                        v-if="couponParams.expirationType==2"
                    >
                        <el-input-number
                            :min="1"
                            v-model="couponParams.period"
                            controls-position="right"
                            placeholder="固定过期时长"
                        ></el-input-number>
                        <span class="ml10">天</span>
                    </el-form-item>
                    <el-form-item label="使用条件">
                        <el-input
                            v-model="couponParams.condition"
                            placeholder="使用条件"
                        ></el-input>
                    </el-form-item>
                    <el-form-item label="说明">
                        <el-input
                            :rows="5"
                            type="textarea"
                            v-model="couponParams.description"
                            placeholder="说明"
                        ></el-input>
                    </el-form-item>
                    <group-list
                        v-if="!couponParams.id"
                        propValue="groupIds"
                        @groupSelected="$set(couponParams, 'groupIds', $event)"
                    ></group-list>

                    <el-form-item label="">
                        <el-button @click="$router.push(`/activity`)"
                            >取 消</el-button
                        >
                        <el-button
                            type="primary"
                            icon="el-icon-check"
                            :loading="btnLoading"
                            @click="handleSavecoupon"
                            >提 交</el-button
                        >
                    </el-form-item>
                </el-form>
            </el-col>
        </el-row>

        <!-- 选择商户 -->
        <select-merchant 
            ref="merchant" 
            @merchantId="couponParams.merchant=$event.id;merchantName=$event.displayName"
        ></select-merchant>

    </el-card>
</template>
<script>
import {
    activityCouponTypeList,
    activityCouponCreated
} from "@/api/activity";
import { getCouponDetail } from '../mixins/index'
import UploadImg from "@/components/Upload/UploadImg";
import GroupList from "@/components/GroupList/index";
import SelectMerchant from '../components/SelectMerchant';

export default {
    mixins: [getCouponDetail],
    data() {
        return {
            couponParams: {},
            loading: false,
            btnLoading: false,
            ruleData: [],
            couponTypeData: [],
            merchantName: '',
            couponRules: {
                displayName: [
                    {
                        required: true,
                        trigger: "blur",
                        message: "请输入优惠券名称~",
                    },
                ],
                image: [
                    {
                        required: true,
                        trigger: "blur",
                        message: "请上传优惠券图片~",
                    },
                ],
                couponType: [
                    {
                        required: true,
                        trigger: "change",
                        type: 'number',
                        message: "请选择优惠券类型~",
                    },
                ],
                merchant: [
                    {
                        required: true,
                        trigger: "blur",
                        type: "number",
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
                expirationType: [
                    {
                        required: true,
                        trigger: "change",
                        type: "number",
                        message: "请选择有效期类型~",
                    },
                ]
            },
        };
    },
    mounted() {
        this.getCouponTypeList();
        if(this.$route.params.id){
            this.initDetail().then((res) => {
                this.couponParams = this.resData;
                this.merchantName = this.resData.merchantName;
            });
        }
    },
    methods: {
        //优惠券类型列表
        getCouponTypeList(){
            activityCouponTypeList().then(res => {
                if(res.code == this.$successCode){
                    this.couponTypeData = res.obj;
                }
            })
        },

        //保存提交
        handleSavecoupon(){
            this.$refs.addcouponForm.validate((valid) => {
                if(valid){
                    this.btnLoading = true;
                    activityCouponCreated(this.couponParams).then(res => {
                        this.btnLoading = false;
                        if(res.code == this.$successCode){
                            this.$message.success('操作成功~');
                            this.$router.go(-1);
                        }else{
                            this.$messsage.error(res.message);
                        }
                    })
                }
            })
        }
    },

    components: {
        UploadImg,
        SelectMerchant,
        GroupList
    }
}
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

