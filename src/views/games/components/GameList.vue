<template>
    <div style="height: 100%" class="timeline-wrap">
        <el-card 
            class="place-list" 
            shadow="always"
        >
            <div class="place-img" 
                :style="{height: imageH+'px'}"
                @click.stop="$router.push(`/games/details/${item.id}`)">
                <el-image fit="cover" :style="{height: imageH+'px'}" :src="item.image" class="image"></el-image>
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
                    <span class="name" @click="$router.push(`/games/details/${item.id}`)">({{item.id}}){{item.displayName}}</span>
                </div>
            </div>                    
        </el-card>
    </div>
</template>

<script>
export default {
    props: ['item', 'index', 'imageH'],
}
</script>

<style lang="scss" scope>
    @import '../../place/list/style/place-card.scss';
    .timeline-wrap{
        .place-list .place-title .name{
            width: 100% !important;
        }
        .place-img{
            background: #222831;
            background: -webkit-radial-gradient(0 100%,ellipse cover,rgba(104,128,138,.4) 10%,rgba(138,114,76,0) 40%),linear-gradient(180deg,rgba(57,173,219,.25) 0,rgba(42,60,87,.4)),linear-gradient(135deg,#670d10,#092756) !important;;
        }
    }
</style>