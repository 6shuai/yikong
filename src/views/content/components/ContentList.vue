<template>
    <div class="content-list">
        <el-card 
            class="place-list" 
            shadow="always"
        >
            <div 
                class="place-img"
                :style="{height: imageH+'px'}" 
                @click.stop="$router.push(`/content/details/${item.id}`)">
                <el-image fit="contain" :src="item.image" :style="{height: imageH+'px'}" class="image"></el-image>
                
                <!-- 资源类型 -->
                <div class="resource-type" title="点击预览" @click.stop="handlePreview(item)">
                    <div class="type-btn">
                        <font-awesome-icon v-if="item.contentTypeId==1 || item.contentTypeId==4" :icon="['far', 'image']" />
                        <font-awesome-icon v-if="item.contentTypeId==2" :icon="['fas', 'film']" />
                        <font-awesome-icon v-if="item.contentTypeId==3" :icon="['fas', 'gamepad']" />
                        <span class="type">{{item.contentTypeName}}</span>
                    </div>
                    <div class="preview-btn">
                        <i class="el-icon-video-play"></i>
                        <span class="type">预览</span>
                    </div>
                </div>

                <!-- 收藏 -->
                <el-button 
                    v-if="item.isFavorite"
                    class="icon-button collect" 
                    size="small" 
                    type="info" 
                    slot="reference" 
                    icon="el-icon-star-off" 
                    title="已收藏"
                >
                </el-button>
            
            </div>
            <div style="padding: 14px;">
                <div class="place-title">
                    <span class="name content-name" @click="$router.push(`/content/details/${item.id}`)" :title="item.displayName">{{item.displayName}}</span>
                    <span class="brand overflow" :title="item.contentOwnerName"><font-awesome-icon :icon="['far', 'building']"></font-awesome-icon>{{item.contentOwnerName}}</span>
                </div>
                <div class="bottom">
                    <ul class="bottom-size overflow clearfix">
                        <li title="分辨率" v-if="item.width && item.height">
                            <font-awesome-icon :icon="['far', 'window-maximize']" />
                            <span>{{item.width}} x {{item.height}}</span>&nbsp;
                            <span>{{item.aspectRatioWidth}} : {{item.aspectRatioHeight}}</span>
                        </li>
                        <li title="大小" v-if="item.size">
                            <font-awesome-icon :icon="['fas', 'download']" />
                            <span>{{(item.size / 1024 / 1024).toFixed(2)}}MB</span>
                        </li>
                        <li title="时长" v-if="item.duration">
                            <font-awesome-icon :icon="['far', 'clock']" />
                            <span>{{item.duration}}s</span>
                        </li>
                    </ul>
                </div>
            </div>                    
        </el-card>

        <!-- 预览资源 -->
        <el-dialog
            width="1000px"
            :title="currentContent.displayName"
            :visible.sync="showPreview"
            append-to-body>
            <content-preview ref="contentPreview" v-if="showPreview"></content-preview>
        </el-dialog>

    </div>
</template>

<script>
import ContentPreview from '@/views/content/components/ContentPreview';
export default {
    props: ['item', 'name', 'imageH', 'index', 'groupIndex'],
    data(){
        return{
            currentContent: {},            //查看选中的预览资源内容
            showPreview: false,            //显示预览资源
        }
    },
    methods: {
        //预览
        handlePreview(data){
            this.currentContent = data;
            let msg = this.currentContent.contentTypeId == 4 ? this.currentContent.subContentsData : this.currentContent;
            this.showPreview = true;
            this.$nextTick(() => {
                this.$refs.contentPreview.contentPreviewData(msg);
            })
        }
    },
    components: {
        ContentPreview
    }
}
</script>
<style lang="scss" scope>
    @import '../../place/list/style/place-card.scss';
    .content-list{
        .preview-btn{
            display: none;
        }
        .place-list:hover{
            .type-btn{
                display: none;
            }
            .preview-btn{
                display: block;
            }
        }
        .brand{
            display: inline-block;
            width: 86px;
            line-height: 20px;
            text-align: right;
            vertical-align: bottom;
            font-size: 12px;
            color: #888;
            svg{
                margin-right: 5px;
            }
        }
        .bottom-size{
            margin-left: -10px;
            li{
                float: left;
                margin-left: 10px;
            }
        }
        .resource-type{
            position: absolute;
            top: 0;
            left: 0;
            padding: 0 10px;
            height: 32px;
            border-bottom-right-radius: 6px;
            background: #39a1e6;
            font-size: 20px;
            line-height: 32px;
            text-align: center;
            color: #fff;
            .type{
                font-size: 14px;
                vertical-align: top;
            }
        }
    }
</style>