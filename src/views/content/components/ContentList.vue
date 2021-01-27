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
                <el-image fit="contain" :src="item.image" :style="{height: imageH+'px'}" class="image">
                    <div slot="placeholder" class="image-slot"></div>
                </el-image>
                
                <!-- 内容类型 -->
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
                    <span class="content-name" @click="$router.push(`/content/details/${item.id}`)" :title="item.displayName">({{item.id}}){{item.displayName}}</span>
                </div>

                <div class="specification">
                    <ul>
                        <li title="大小" v-if="item.size">
                            <font-awesome-icon :icon="['fas', 'download']" />
                            <span>{{(item.size / 1024 / 1024).toFixed(2)}}MB</span>
                        </li>
                        <li class="adress" title="分辨率" v-if="item.width && item.height">
                            <font-awesome-icon :icon="['far', 'window-maximize']" />
                            <span>{{item.width}} x {{item.height}}</span>&nbsp;
                            <span>{{item.aspectRatioWidth}} : {{item.aspectRatioHeight}}</span>
                        </li>
                    </ul>
                </div>
                <div class="bottom clearfix">
                    <ul class="duration">
                        <li title="时长">
                            <font-awesome-icon :icon="['far', 'clock']" />
                            <span>{{item.duration ? item.duration : '--'}}s</span>
                        </li>
                        <li title="播放次数">
                            <font-awesome-icon :icon="['fas', 'play']" />
                            <span> {{item.currentTimes}}</span>
                        </li>
                    </ul>
                    <div class="place-logo" v-if="item.contentOwnerName">
                        <span :title="item.contentOwnerName"><font-awesome-icon :icon="['far', 'building']"></font-awesome-icon>{{item.contentOwnerName}}</span>
                    </div>
                    
                </div>

            </div>                    
        </el-card>

        <!-- 预览内容 -->
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
    props: ['item', 'name', 'imageH', 'index'],
    data(){
        return{
            currentContent: {},            //查看选中的预览内容内容
            showPreview: false,            //显示预览内容
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
    @import '../../place/style/place-card.scss';
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
            .content-name{
                color: #409EFF;
            }
        }
        .place-title .content-name{
            transition: color .3s;
            cursor: pointer;
            white-space: nowrap;
            width: 100%;
            overflow: hidden;
            display: inline-block;
            margin: 0;
            font-size: 16px;
        }

        .specification{
            overflow: hidden;
            margin-top: 8px;
            height: 15px;
            li{
                float: left;
                margin-right: 15px;
                font-size: 12px;
                color: #666;
            }
        }

        .bottom {
            padding-top: 8px;
            .duration{
                display: inline-block;
                width: calc(100% - 110px);
                li{
                    float: left;
                    &:first-child{
                        margin-right: 15px;
                    }
                }
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