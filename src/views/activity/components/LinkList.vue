<template>
    <el-dialog
        width="800px"
        title="邀请链接"
        class="link-list-dialog"
        :visible.sync="showDialog"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        append-to-body
    >

        <div class="link-list" v-loading="loading">
            <div 
                class="item" 
                v-for="item in resData" 
                :key="item"
            >   
                <div 
                    class="link tag-read" 
                    :data-clipboard-text="`https://static.xfengjing.com/writeoff_invitation/index.html?mid=${mid}&pid=${$route.params.id}&pm=${3}&t=${item}`"
                    @click="copy"
                    title="点击复制链接"
                >
                    {{ `https://static.xfengjing.com/writeoff_invitation/index.html?mid=${mid}&pid=${$route.params.id}&pm=${3}&t=${item}` }}        
                </div>
                <div class="link-qrcode">
                    <el-popover
                        placement="right"
                        width="374"
                        trigger="click">
                        <vue-qr :text="`https://static.xfengjing.com/writeoff_invitation/index.html?mid=${mid}&pid=${$route.params.id}&pm=${3}&t=${item}`" :margin="0" colorDark="#000" colorLight="#fff" :size="350"></vue-qr>
                        <svg-icon
                            slot="reference"
                            icon-class="qrcode"
                        ></svg-icon>
                    </el-popover>
                </div>
            </div>
        </div>
    </el-dialog>
</template>

<script>
import { activityGenerateLinkList } from "@/api/activity";
import Clipboard from 'clipboard'
import vueQr from 'vue-qr'
export default {
    props: ['mid'],
    data(){
        return{
            showDialog: false,
            resData: [],
            loading: false
        }
    },
    methods: {
        showGenerateLinkList(){
            this.showDialog = true;
            if(!this.resData.length){
                this.init();
            }
        },

        init(){
            this.loading = true;
            activityGenerateLinkList({ id: this.$route.params.id }).then(res => {
                this.loading = false;
                if(res.code == this.$successCode){
                    this.resData = res.obj;
                }
            })
        },
         //复制链接
        copy () {
            var clipboard = new Clipboard('.tag-read')
            clipboard.on('success', e => {
                this.$message.success('复制成功')
                e.clearSelection()
                clipboard.destroy()
            })
            clipboard.on('error', e =>{
                // 不支持复制
                this.$message.error('该浏览器不支持复制')
            })
        }
    },
    components: {
        vueQr
    },
}
</script>

<style lang="scss">
    .link-list-dialog{
        .link-list{
            
            .item{
                padding: 20px;
                line-height: 30px;
                border-bottom: 1px solid #f0f0f0;
                cursor: pointer;
                display: flex;

                .link{
                    &:hover{
                        background: #F5F7FA;
                        color: #8484FF;
                    }
                }


                .link-qrcode{
                    flex: 1;
                    text-align: right;

                    svg.svg-icon{
                        width: 30px;
                        height: 30px;
                    }
                }
            }
        }
    }
</style>