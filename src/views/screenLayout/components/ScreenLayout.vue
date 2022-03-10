<!--
 * @Author: liushuai
 * @Date: 2022-03-02 14:41:04
 * @LastEditors: liushuai
 * @LastEditTime: 2022-03-02 17:33:10
 * @Description: file content
 * @FilePath: \pclient\src\views\screenLayout\components\ScreenLayout.vue
-->
<template>
    <div 
        class="screen-layout-warp"
    >
        <div 
            class="temp-layout"
            :style="{
                width: screen.height > screen.width ? screen.width / screen.height * maxWidth + 'px' : maxWidth + 'px',
                height: screen.height > screen.width ? maxWidth + 'px' : screen.height / screen.width * maxWidth + 'px'
            }"
        >
            <div 
                class="item" 
                :class="{ 'item-boder': showBorder }"
                v-for="(sub, index) in screen.materialInfo || screen.logicRegionSubs" 
                :key="sub.id"
                :style="{
                    width: sub.percentageWidth + '%',
                    height: sub.percentageHeight + '%',
                    top: sub.percentageY + '%',
                    left: sub.percentageX + '%'
                }"
            >   

                <slot :index="index" :data="sub"></slot>

            </div>
        </div>
    </div>

</template>

<script>
export default {
    props: {
        screen: Object,
        maxWidth: Number,
        showBorder: {
            type: Boolean,
            default: true
        }
    }
}
</script>

<style lang="scss" scoped>
.screen-layout-warp{
    .temp-layout{
        display: block;
        position: relative;
        border: 1px solid #ffdc93;
        margin: 0 auto;
        .item{
            position: absolute;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;

            &.item-boder{
                border: 1px solid #ff2e63;
            }

            &:hover{
                .select-content{
                    z-index: 20;
                    box-shadow: 0 1px 4px #ff2e627c;
                    background: #fff;
                }

            }

            .content-image{
                width: 100%;
                height: 100%;
                position: absolute;
                z-index: 10;
            }
        }
    }

    .content-detail{
        position: absolute;
        bottom: 0px;
        left: 0;
        width: 100%;
        height: 20px;
        line-height: 20px;
        background: rgba(0, 0, 0, 0.5);
        color: #fff;
        font-size: 14px;
        text-align: center;
        z-index: 66;
    }
}
</style>