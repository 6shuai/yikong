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
                <!-- <img :src="item.defaultShow" class="image"> -->
                <img :style="{height: imageH+'px'}" src="https://game.xfengjing.com/app/upload/market/photo/SNeDQguJTPQdWASQB0FuGF3xk5sjkooJZaAPxmAB.jpeg" class="image">
                
                <!-- 资源类型 -->
                <div class="resource-type" title="图片">
                    <font-awesome-icon :icon="['far', 'image']" />
                    <!-- <font-awesome-icon :icon="['fas', 'film']" /> -->
                    <!-- <font-awesome-icon :icon="['fas', 'gamepad']" /> -->
                </div>

                <!-- 收藏 -->
                <el-button 
                    class="icon-button collect" 
                    size="small" 
                    :type="item.isFavorite ? 'warning' : 'info'" 
                    slot="reference" 
                    :icon="item.isFavorite ? 'el-icon-star-on' : 'el-icon-star-off'" 
                    :title="item.isFavorite ? '取消收藏' : '收藏'"
                    @click.stop="handleCollect(item, index)"
                >
                </el-button>
            
            </div>
            <div style="padding: 14px;">
                <div class="place-title">
                    <span class="name" @click="$router.push(`/content/details/${item.id}`)">{{item.displayName}}哈哈哈</span>
                    <span class="brand overflow"><font-awesome-icon :icon="['far', 'building']"></font-awesome-icon>{{item.organizationName}}万达</span>
                </div>
                <div class="bottom">
                    <ul class="bottom-size overflow clearfix">
                        <li title="分辨率">
                            <font-awesome-icon :icon="['far', 'window-maximize']" />
                            <span>1920x1080</span>&nbsp;
                            <span>16:9</span>
                        </li>
                        <li title="大小">
                            <font-awesome-icon :icon="['fas', 'download']" />
                            <span>1.6MB</span>
                        </li>
                        <li title="时长">
                            <font-awesome-icon :icon="['far', 'clock']" />
                            <span>15.0s</span>
                        </li>
                    </ul>
                </div>
            </div>                    
        </el-card>
    </div>
</template>

<script>
export default {
    props: ['item', 'name', 'imageH'],
}
</script>
<style lang="scss" scope>
    @import '../../place/list/style/place-card.scss';
    .content-list{
        .brand{
            display: inline-block;
            width: 96px;
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
            width: 44px;
            height: 32px;
            border-bottom-right-radius: 6px;
            background: #39a1e6;
            font-size: 20px;
            line-height: 32px;
            text-align: center;
            color: #fff;
        }
    }
</style>