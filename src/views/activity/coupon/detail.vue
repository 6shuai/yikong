<template>
    <el-card class="template-card content-details coupon-detail">
        <page-header :title="resData.displayName">
            <div slot="headerRight">
                <span
                    v-if="resData.authorize"
                    @click="
                        $refs.pagePermission.showPermission({
                            couponDefinitionId: $route.params.id,
                        })
                    "
                    ><i class="el-icon-lock" title="授权"></i>授权<el-divider
                        direction="vertical"
                    ></el-divider
                ></span>
                <span
                    v-if="resData.edit"
                    @click="$router.push(`/activity/couponAdd/${$route.params.id}`)"
                >
                    <i class="el-icon-edit" title="编辑"></i>编辑
                </span>
            </div>
        </page-header>
        <div class="content" v-loading="loading">
            <el-form 
                label-width="100px" 
                class="screen-form" 
                :model="resData">
                <el-form-item label="优惠券图片：">
                    <img :src="resData.image">
                </el-form-item>
                <el-form-item label="优惠券名称：">
                    {{ resData.displayName }}
                </el-form-item>
                <el-form-item label="优惠券类型：">
                    {{ resData.couponTypeName }}
                </el-form-item>
                <el-form-item label="有效期：">
                    {{ resData.period && resData.expirationType==2 ? resData.period + '天' : resData.expiration}}
                </el-form-item>
                <el-form-item label="商户名称：">
                    {{ resData.merchantName }}
                </el-form-item>
                <el-form-item label="使用条件：">
                    {{ resData.condition }}
                </el-form-item>
                <el-form-item label="说明：">
                    <div v-html="resData.description"></div>
                </el-form-item>
            </el-form>
        </div>

        <!-- 授权 -->
        <permission
            ref="pagePermission"
            :premissionApi="premissionApi"
        ></permission>

    </el-card>
</template>

<script>
import Permission from "@/components/permission/index";
import PageHeader from '@/components/PageHeader';
import {
    activityCouponAuthority,
    activityCouponAuthorityUpdate,
    activityCouponAuthorityDelete,
} from "@/api/activity";
import { getCouponDetail } from "../mixins/index";

export default {
    mixins: [getCouponDetail],
    data() {
        return {
            premissionApi: {
                list: activityCouponAuthority,
                update: activityCouponAuthorityUpdate,
                delete: activityCouponAuthorityDelete
            }
        };
    },
    created() {
        if (this.$route.params.id) {
            this.initDetail(this.$route.params.id);
        }
    },
    components: {
        Permission,
        PageHeader
    },
};
</script>

<style lang="scss" scope>
.coupon-detail {
    img{
        width: 120px;
    }
}
</style>


