<template>
    <div class="height: 100%">
        <el-card 
            class="place-list" 
            shadow="always"
        >
            <div class="place-img" 
                :style="{height: imageH+'px'}"
                @click.stop="$router.push(`/screen/details/${item.id}`)">
                <img :src="item.defaultShow" class="image" :style="{height: imageH+'px'}">
                <!-- 屏幕状态 -->
                <el-tag v-if="!item.state" class="status ing" effect="dark">建设中</el-tag>
                <el-tag v-if="item.state == 1" class="status" type="success" effect="dark">在线</el-tag>
                <el-tag v-if="item.state == 2" class="status" type="warning" effect="dark">离线</el-tag>
                <!-- 收藏 -->
                <el-button 
                    v-if="name == 'screen'"
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
                    <span class="name" @click="$router.push(`/screen/details/${item.id}`)">{{item.displayName}}</span>
                </div>
                <div class="specification">
                    <ul>
                        <li title="点距规格">
                            <span>{{item.dotPitchName}}</span>
                        </li>
                        <li title="分辨率">
                            <span>{{item.resolutionWidth}} x {{item.resolutionHeight}}</span>
                        </li>
                        <li title="宽高比">
                            <span>{{item.aspectRatioWidth}} : {{item.aspectRatioHeight}}</span>
                        </li>
                    </ul>
                </div>
                <div class="bottom clearfix">
                    <div class="adress overflow" :title="addressJoint(item) + item.address" @click="$emit('seeAddress')">
                        <font-awesome-icon :icon="['fas', 'map-marker-alt']" />{{addressJoint(item)}}  {{item.address}}
                    </div>
                    <div class="place-logo">
                        <span><font-awesome-icon :icon="['far', 'building']" />{{item.organizationName}}</span>
                    </div>
                </div>
            </div>                    
        </el-card>
    </div>
</template>

<script>
import { screenIsFavorite } from '@/views/screen/mixins';
export default {
    props: ['item', 'index', 'name', 'imageH'],
    mixins: [screenIsFavorite],
    methods: {
        //场所地址  省市区 拼接
        addressJoint(row){
            return `${row.proName ? row.proName+'  ' : ''}${row.cityName ? row.cityName+'  ' : ''}${row.areaName ? row.areaName : ''}`;
        },

        //收藏 或 取消收藏
        handleCollect(data, index){
            let p = {
                isFavorite: data.isFavorite ? 0 : 1,
                placeId: data.id,
                userId: this.$store.state.user.loginData.id
            }
            let s = `?isFavorite=${p.isFavorite}&screenId=${p.placeId}&userId=${p.userId}`;
            new Promise((resolve) => {
                this.handleFavorite(s, resolve);
            }).then(res => {
                this.$parent.resData[index].isFavorite = p.isFavorite;
            })
        },
    }
}
</script>