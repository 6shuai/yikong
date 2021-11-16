<!--
 * @Author: liushuai
 * @Date: 2021-11-15 17:57:20
 * @LastEditors: liushuai
 * @LastEditTime: 2021-11-16 11:24:36
 * @Description: file content
 * @FilePath: \pclient\src\components\CardList\index.vue
-->
<template>
    <div class="place-content" id="app-main-wrap">
         <el-empty 
            v-if="!resData.length"
            :description="emptyMsg">
        </el-empty>
        <div class="place-box">
            <div class="place-p" 
                :style="{width: placeW}" 
                v-for="(item, index) in resData" 
                :key="index">
                <div style="height: 100%" class="timeline-wrap">
                    <el-card 
                        class="place-list" 
                        shadow="always"
                    >
                        <div class="place-img" 
                            :style="{height: imageH+'px'}">
                            <slot name="card" :data="item"></slot>
                            <el-image fit="cover" :style="{height: imageH+'px'}" :src="item[paramsName.image]" class="image"></el-image>
                        </div>
                        <div style="padding: 14px;">
                            <div class="place-title">
                                <span class="name">{{item[paramsName.name]}}</span>
                            </div>
                        </div>                    
                    </el-card>
                </div>

            </div>
        </div>
    </div>
</template>

<script>
import { screenSizeWatch } from '@/mixins';
export default {
    mixins: [screenSizeWatch],
    props: ['emptyMsg', 'resData', 'paramsName']
}
</script>

<style lang="scss" scope>
@import '../../views/place/style/place-card.scss';
</style>