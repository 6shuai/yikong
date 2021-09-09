<template>
    <el-card class="template-card place-detail" v-loading="loading">
        <div class="header-wrap detail-header-wrap mb30">
            <el-page-header @back="$router.go(-1)"> </el-page-header>
            <div class="header-right">
                <span
                    @click="
                        $refs.pagePermission.showPermission({
                            merchantId: $route.params.id,
                        })
                    "
                    v-if="resData.authorize"
                    ><i class="el-icon-lock" title="授权"></i>授权<el-divider
                        direction="vertical"
                    ></el-divider
                ></span>
                <span @click="editPlace"
                    v-if="resData.edit"
                    ><i class="el-icon-edit" title="编辑"></i>编辑<el-divider
                        direction="vertical"
                    ></el-divider
                ></span>
                <span 
                    v-if="resData.delete"
                    @click="deletePlace"
                    ><i class="el-icon-delete" title="删除"></i>删除</span
                >


            </div>
            <div class="title">
                <h2>{{ resData.displayName }}</h2>
            </div>
        </div>


        <h2 class="p-info-title mt20 mb20">商户信息</h2>
        <div class="merchant-info">
            <el-image v-if="resData.image" :src="resData.image" fit="cover"></el-image>
            <div class="merchant-address">
                <div class="merchant-place">{{ resData.proName }} - {{ resData.cityName }} - {{ resData.areaName }}</div>
                <div class="detail-address">{{ resData.address }}</div>
            </div>
        </div>

        <h2 class="p-info-title mt20 mb20">管理员信息</h2>
        <el-table
            stripe
            size="small"
            :data="this.resData.merchantAdmin"
            style="width: 100%"
            row-key="id"
            class="merchantAdmin"
            border>
            <el-table-column label="头像" min-width="50">
                <template slot-scope="scope">
                    <el-image
                        class="member-header-img"
                        :src="scope.row.avatar">
                    </el-image>
                </template>
            </el-table-column>
            <el-table-column prop="nickname" label="昵称" min-width="80"></el-table-column>
            <el-table-column prop="mobile" label="手机号" min-width="80"></el-table-column>
            <el-table-column label="身份" min-width="80">
                <template slot-scope="scope">
                    <el-tag 
                        type="parmary" 
                        v-for="item in scope.row.roles" 
                        size="small"
                        :key="item.id"
                    >{{ item.displayName }}
                </el-tag>
                </template>
            </el-table-column>
        </el-table>

        <!-- 授权 -->
        <permission
            ref="pagePermission"
            :premissionApi="premissionApi"
        ></permission>

    </el-card>
</template>
<script>
import { merchantDetail, merchantDelete, merchantAuthority, merchantAuthorityUpdate, merchantAuthorityDelete } from '@/api/merchant';
import ScreenList from "@/views/screen/components/ScreenList";
import Permission from "@/components/permission/index";

export default {
    data() {
        return {
            loading: false,
            resData: {},
            premissionApi: {
                list: merchantAuthority,
                update: merchantAuthorityUpdate,
                delete: merchantAuthorityDelete,
            },
        };
    },
    mounted() {
        this.getMerchantDetail();
    },
    methods: {
        // 商户详情
        getMerchantDetail(){
            merchantDetail(this.$route.params.id).then(res => {
                this.resData = res.obj;
            })
        },

        //编辑场所
        editPlace() {
            this.$router.push(`/merchant/edit/${this.$route.params.id}`);
        },

        //删除商户
        deletePlace() {
            this.$confirm("此操作将删除该商户 是否继续?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
                center: true,
            }).then(() => {
                merchantDelete(this.$route.params.id).then((res) => {
                    if (res.code === this.$successCode) {
                        this.$message.success({
                            message: "删除成功~",
                            duration: 1000,
                            onClose: () => {
                                this.$router.push("/merchant");
                            },
                        });
                    }
                });
            });
        },
        

    },
    components: {
        ScreenList,
        Permission
    },
};
</script>
<style lang="scss" scope>
    @import url('../place/style/place-detail.scss');

    .merchant-info{
        display: flex;

        .el-image{
            min-width: 400px;
            max-width: 600px;
        }

        .merchant-address{
            margin-left: 20px;
            font-size: 18px;
            font-weight: bold;
            line-height: 30px;
        }
    }

    .merchantAdmin{
        .member-header-img{
            width: 50px;
            height: 50px;
        }

        .el-tag{
            margin-right: 5px;
        }
    }
</style>