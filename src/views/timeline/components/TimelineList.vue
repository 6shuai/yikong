<template>
    <div style="height: 100%" class="timeline-wrap">
        <el-card 
            class="place-list" 
            shadow="always"
        >
            <div class="place-img" 
                :style="{height: imageH+'px'}"
                @click.stop="$router.push(`/timeline/details/${item.id}`)">
                <img v-if="item.image" :src="item.image" class="image" :style="{height: imageH+'px'}">
            
            </div>
            <div style="padding: 14px;">
                <div class="place-title">
                    <span class="name" @click="$router.push(`/timeline/details/${item.id}`)">({{item.id}}){{item.displayName}}</span>
                </div>
                <div class="desc" :title="`最后修改人: ${ item.lastUpdateUser || '-' }
最后修改时间: ${ item.lastUpdateTime || '-' }`">
                    <p><i class="el-icon-user"></i>{{ item.lastUpdateUser || '-' }}</p>
                    <p><i class="el-icon-time"></i>{{ item.lastUpdateTime }}</p>
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

<style lang="scss">
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