<template>
    <div class="screen-list-wrap">
        <el-card 
            class="place-list" 
            shadow="always"
        >
            <div class="place-img" 
                :style="{height: imageH+'px'}"
            >
                <el-image 
                    fit="cover" 
                    :src="item.defaultShow" 
                    class="image" 
                    :style="{height: imageH+'px'}"
                ></el-image>

                <!-- 屏幕状态 -->
                <div class="screen-state" title="屏幕状态">
                    <el-tag v-if="!item.state" class="status ing" effect="dark">建设中</el-tag>
                    <el-tag v-if="item.state == 1" class="status" type="success" effect="dark">在线</el-tag>
                    <el-tag v-if="item.state == 2" class="status" type="warning" effect="dark">离线</el-tag>
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

                <!-- 屏幕编号  10000 + 屏幕id -->
                <div 
                    class="screen-code" 
                    v-if="name != 'screenPrice'"
                >
                    {{ 10000 + Number(item.id) }}
                </div>
            
            </div>
            <div style="padding: 14px;">
                <div class="place-title">
                    <span class="name full">
                        {{item.displayName}}
                    </span>
                </div>
                
                <slot></slot>

                <div class="bottom clearfix">
                    <div class="adress overflow" :title="addressJoint(item) + item.address" @click.stop="$emit('seeAddress')">
                        <font-awesome-icon :icon="['fas', 'map-marker-alt']" />{{addressJoint(item)}}  {{item.address}}
                    </div>
                    <div class="place-logo" v-if="item.brandName">
                        <span><font-awesome-icon :icon="['far', 'building']" />{{item.brandName}}</span>
                    </div>
                </div>
            </div>                    
        </el-card>
    </div>
</template>

<script>
export default {
    props: ['item', 'index', 'name', 'imageH'],
    methods: {
        //场所地址  省市区 拼接
        addressJoint(row){
            return `${row.proName ? row.proName+'  ' : ''}${row.cityName ? row.cityName+'  ' : ''}${row.areaName ? row.areaName : ''}`;
        }
    }
}
</script>
<style lang="scss">
    .screen-list-wrap{
        .specification{
            overflow: hidden;
            margin-top: 8px;
            li{
                float: left;
                margin-right: 15px;
                font-size: 12px;
                color: #666;
            }
        }
        .place-img{
            .status{
                position: absolute;
                top: 0;
                left: 0;
                border-radius: 0;
                border-bottom-right-radius: 6px;
                &.ing{
                    background-color: #adadad;
                    border-color: #adadad;
                }
            }

            .screen-code{
                position: absolute;
                bottom: 0;
                left: 0;
                height: 20px;
                line-height: 20px;
                text-indent: 10px;
                width: 100%;
                background: rgba(0, 0, 0, .6);
                color: #fff;
            }
        }

    }
</style>