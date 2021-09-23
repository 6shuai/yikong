<template>
    <el-drawer
        class="add-coupon-drawer"
        :show-close="true"
        :title="couponParams.id ? '编辑优惠券' : '添加优惠券'"
        size="700px"
        :visible.sync="drawer"
    >
        <div class="add-coupon-wrap">
            <el-scrollbar>
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
                        <el-select
                            v-model="couponParams.merchant"
                            filterable
                            placeholder="请选择商户"
                        >
                            <el-option
                                v-for="item in ruleData"
                                :key="item.id"
                                :label="item.displayName"
                                :value="item.id"
                            >
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="使用条件">
                        <el-input
                            v-model="couponParams.condition"
                            placeholder="使用条件"
                        ></el-input>
                    </el-form-item>
                    <el-form-item label="说明">
                        <el-input
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
                    
                </el-form>
            </el-scrollbar>

            <div class="footer-btn">
                <el-button @click="drawer = false">取 消</el-button>
                <el-button
                    type="primary"
                    :loading="btnLoading"
                    @click="handleSavecoupon"
                    >提交</el-button
                >
            </div>
        </div>

    </el-drawer>
</template>

<script>
import {
    activityCouponTypeList,
    activityCouponCreated
} from "@/api/activity";
import UploadImg from "@/components/Upload/UploadImg";
import GroupList from "@/components/GroupList/index";
import { resRoleCreated } from "@/api/resRole";

export default {
    data() {
        return {
            drawer: false,
            couponParams: {},
            btnLoading: false,
            ruleData: [],
            couponTypeData: [],
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
                        trigger: "blur",
                        message: "请选择优惠券类型~",
                    },
                ],
                merchant: [
                    {
                        required: true,
                        trigger: "blur",
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
        };
    },
    mounted() {
        this.getCouponTypeList()
    },
    methods: {
        showAddcoupon(data) {
            data = data ? JSON.parse(JSON.stringify(data)) : {};
            this.couponParams = {
                ...data,
                duplicate: this.couponParams.duplicate ? 1 : 0
            }
            this.drawer = true;

            if (this.couponParams.id) {

            }

            this.$nextTick(() => {
                this.$refs["addcouponForm"].clearValidate();
            });
        },

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
                    // activityCouponCreated(this.couponParams).then(res => {
                    //     if(res.code == this.$successCode){
                    //         this.$message.success('操作成功~');
                    //         this.drawer = false;
                    //     }else{
                    //         this.$messsage.error(res.message);
                    //     }
                    // })
                }
            })
        }
    },

    components: {
        UploadImg,
        GroupList
    }
}
</script>
<style lang="scss" scope>
.add-coupon-drawer {
    .el-drawer__body {
        height: calc(100% - 80px);
    }
    .add-coupon-wrap {
        padding: 0 10px 50px 10px;
        height: 100%;
        .el-scrollbar {
            height: 100%;
            .el-scrollbar__wrap {
                overflow-x: hidden;
            }
        }

        .footer-btn {
            position: fixed;
            bottom: 10px;
            right: 10px;
            .el-button {
                padding: 10px 50px;
            }
        }
    }
}
</style>