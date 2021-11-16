<!--
 * @Author: liushuai
 * @Date: 2021-11-16 11:39:26
 * @LastEditors: liushuai
 * @LastEditTime: 2021-11-16 14:01:52
 * @Description: 生成邀请链接
 * @FilePath: \pclient\src\views\activity\components\GenerateInviteLink.vue
-->
<template>
    <el-dialog
        width="800px"
        title="生成邀请链接"
        class="link-list-dialog"
        :visible.sync="showDialog"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        append-to-body
    >
        <div class="generate-link">
            <div class="invite-link-qr" v-if="generateLinkUrl">
                <vue-qr :text="generateLinkUrl" :margin="0" colorDark="#000" colorLight="#fff" :size="200"></vue-qr>
            </div>
            <div 
                class="link tag-read" 
                :data-clipboard-text="generateLinkUrl"
                @click="copy"
                title="点击复制链接"
                v-if="generateLinkUrl"
            >
                {{ generateLinkUrl }}<i class="el-icon-copy-document"></i>
            </div>
        </div>
    </el-dialog>
</template>

<script>
import Clipboard from 'clipboard';
import vueQr from 'vue-qr';
import { activityGenerateLink } from '@/api/activity';

export default {
    components: {
        vueQr
    },
    data(){
        return {
            generateLinkUrl: '',    //生成的邀请链接  https://static.xfengjing.com/writeoff_invitation/index.html?mid=123&pid=234&pm=2&t=xxxxwere
            showDialog: false
        }
    },
    methods: {
        //生成邀请链接
        handleGenerateLink(merchantId, activityId){
            // https://static.xfengjing.com/writeoff_invitation/index.html?mid=123&pid=234&pm=2&t=xxxxwere
            //mid 商户id   pid 活动id  pm=2 固定   t 接口code
            this.showDialog = true;
            let data = {
                id: activityId,
                merchantId: merchantId
            }
            activityGenerateLink(data).then(res => {
                if(res.code === this.$successCode){
                    let mid = merchantId,
                        pid = activityId,
                        pm = 3,
                        token = res.obj;
                    this.generateLinkUrl = `https://static.xfengjing.com/writeoff_invitation/index.html?mid=${mid}&pid=${pid}&pm=${pm}&t=${token}`
                }
            })
        },

        //复制链接
        copy () {
            var clipboard = new Clipboard('.tag-read')
            clipboard.on('success', e => {
                this.$message.success('复制成功', e)
                e.clearSelection()
                clipboard.destroy()
            })
            clipboard.on('error', e =>{
                // 不支持复制
                this.$message.error('该浏览器不支持复制')
            })
        }
    },
}
</script>

<style lang="scss" scoped>
    .generate-link{
        padding: 0 20px;
        text-align: center;

        .invite-link{
            .el-link{
                margin-left: 40px;
            }
        }

        .link{
            display: block;
            line-height: 40px;
            cursor: pointer;
            display: inline-block;
            
            &:hover{
                color: #8484FF;
            }
        }

        .invite-link-qr{
            padding: 20px 0;
        }
    }
</style>