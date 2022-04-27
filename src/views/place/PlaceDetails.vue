<template>
    <el-card class="template-card place-detail" v-loading="loading">
        <page-header :title="resData.displayName">
            <div slot="headerRight">
                <span
                    @click="
                        $refs.pagePermission.showPermission({
                            placeId: $route.params.id,
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
                <span @click="collectPlace" v-if="!resData.isFavorite"
                    ><i class="el-icon-star-off" title="收藏"></i>收藏
                    <el-divider direction="vertical"></el-divider
                ></span>
                <span @click="collectPlace" v-else
                    ><i class="el-icon-star-on" title="取消收藏"></i
                    >取消收藏<el-divider direction="vertical"></el-divider
                ></span>
                <span 
                    v-if="resData.delete"
                    @click="deletePlace"
                    ><i class="el-icon-delete" title="删除"></i>删除</span
                >

            </div>
        </page-header>
        
        <el-tabs 
            v-model="tabActiveName" 
            class="mb20"
        >
            <el-tab-pane 
                label="基本信息" 
                name="basic"
            ></el-tab-pane>
            <el-tab-pane 
                label="商户" 
                name="merchant"
            ></el-tab-pane>
        </el-tabs>

        <!-- 基本信息 -->
        <place-basic v-if="tabActiveName == 'basic'" :placeDetail="resData"></place-basic>

        <!-- 商户 -->
        <place-merchant-list v-if="tabActiveName == 'merchant'" :merchantData="resData.merchantData"></place-merchant-list>


        <!-- 授权 -->
        <permission
            ref="pagePermission"
            :premissionApi="premissionApi"
        ></permission>
    </el-card>
</template>
<script>
import { placeDelete, placeAuthority, placeAuthorityUpdate, placeAuthorityDelete } from "@/api/place"
import { placeIsFavorite, placeDetailData } from "@/views/place/mixins"
import Permission from "@/components/permission/index"
import PageHeader from '@/components/PageHeader'
import PlaceBasic from '@/views/place/components/PlaceBasic'
import PlaceMerchantList from '@/views/place/components/PlaceMerchantList'

export default {
    components: {
        Permission,
        PageHeader,
        PlaceBasic,
        PlaceMerchantList
    },
    mixins: [placeIsFavorite, placeDetailData],
    data() {
        return {
            loading: false,
            resData: {},
            premissionApi: {
                list: placeAuthority,
                update: placeAuthorityUpdate,
                delete: placeAuthorityDelete,
            },

            // 当前tab
            tabActiveName: 'basic' 
        }
    },
    mounted() {
        this.hasPagePerm("Place").then((res) => {
            if (res) {
                this.initDetail();
            }
        });
    },
    methods: {
        //编辑场所
        editPlace() {
            this.$router.push(`/place/edit/${this.$route.params.id}`);
        },

        //删除场所
        deletePlace() {
            this.$confirm("此操作将删除该场所 是否继续?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
                center: true,
            }).then(() => {
                placeDelete(this.$route.params.id).then((res) => {
                    if (res.code === this.$successCode) {
                        this.$message.success({
                            message: "删除成功~",
                            duration: 1000,
                            onClose: () => {
                                this.$router.push("/place/index");
                            },
                        });
                    }
                });
            });
        },

        //收藏
        collectPlace() {
            let p = {
                isFavorite: this.resData.isFavorite ? 0 : 1,
                placeId: this.resData.id,
                userId: this.$store.state.user.loginData.id,
            };
            let s = `?isFavorite=${p.isFavorite}&placeId=${p.placeId}&userId=${p.userId}`;
            new Promise((resolve) => {
                this.handleFavorite(s, resolve);
            }).then((res) => {
                this.$set(this.resData, "isFavorite", p.isFavorite);
            });
        }
       
    }
}
</script>
<style lang="scss">
@import "../../styles/variables.scss";
@import "./style/place-card.scss";
@import "./style/place-detail.scss";
</style>