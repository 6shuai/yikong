<!--
 * @Author: liushuai
 * @Date: 2021-11-15 16:05:04
 * @LastEditors: liushuai
 * @LastEditTime: 2021-11-16 14:04:00
 * @Description: file content
 * @FilePath: \pclient\src\views\activity\details\merchant.vue
-->
<template>
    <div class="activity-merchant-list">
        <card-list 
            emptyMsg="还没有商户"
            :paramsName="{image: 'image', name: 'merchantName' }"
            :resData="resData"
            detailPath="/merchant/detail/"
            #card="{data}"
        >
            <div class="link-btn-wrap">
                <p>
                    <el-button 
                        round 
                        type="primary" 
                        size="mini"
                        @click.stop="$refs.generateInviteLink.handleGenerateLink(data.merchant, $route.params.activityId)"
                    >
                        生成邀请链接
                    </el-button></p>
                <p class="mt10">
                    <el-button 
                        round 
                        type="info" 
                        size="mini"
                        @click.stop="$refs.linkList.showGenerateLinkList(data.merchant, $route.params.activityId)"
                    >
                        已生成的链接
                    </el-button>
                </p>
            </div>
        </card-list>

        <!-- 生成邀请链接 -->
        <generate-invite-link ref="generateInviteLink"></generate-invite-link>

        <!-- 已生成的链接列表 -->
        <link-list ref="linkList"></link-list>
    </div>
</template>

<script>
import CardList from '@/components/CardList';
import LinkList from '@/views/activity/components/LinkList';
import GenerateInviteLink from '@/views/activity/components/GenerateInviteLink';
import { activityDetailMerchantList } from '@/api/activity';

export default {
    components: {
        CardList,
        LinkList,
        GenerateInviteLink
    },
     data(){
        return {
            resData: []
        }
    },
    created(){
        this.init();
    },
    methods: {
        init(){
            activityDetailMerchantList(this.$route.params.activityId).then(res => {
                if(res.code === this.$successCode){
                    this.resData = res.obj;
                }
            })
        },

        handle(data){
            console.log(data)
        }
    }
}
</script>

<style lang="scss" scoped>
    .activity-merchant-list{
        .link-btn-wrap{
            position: absolute;   
            right: 10px;
            top: 10px;
            z-index: 99;
            transition: all .3s ease-in;
        }
    }
</style>