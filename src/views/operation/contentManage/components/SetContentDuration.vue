<!--
 * @Author: liushuai
 * @Date: 2022-06-15 11:30:37
 * @LastEditors: liushuai
 * @LastEditTime: 2022-06-16 10:59:13
 * @Description: file content
 * @FilePath: \pclient\src\views\operation\contentManage\components\SetContentDuration.vue
-->
<template>
    <el-popover
        popper-class="operation-set-content-duration-popver"
        :visible-arrow="false"
        ref="setDurationPop"
        placement="bottom-start"
        width="180"
        v-model="visible">

        <ul>
            <li v-for="(item, index) in durationList" :key="index" @click="handleSetContentDuration(item)">
                {{ item }}s
            </li>
            <li @click="handleSetContentDuration(params.defaultDuration || 15)">默认时长</li>
            <li class="custom flex-center">
                <el-input-number
                    size="mini" 
                    :controls="false"
                    v-model="params.customDuration"
                ></el-input-number>
                <span @click="handleSetContentDuration(params.customDuration)">自定义</span>
            </li>
        </ul>

    </el-popover>
</template>

<script>

export default {
    data() {
        return {
            visible: false,

            durationList: [5, 10, 15, 30],
            
            params: {
                // 当前素材包的index
                index: null,

                // 默认时长
                defaultDuration: null,

                // 自定义时长
                customDuration: null
            }
        }
    },
    methods: {
        // 保存素材包的时长
        handleSetContentDuration(duration){
            this.$emit('saveContentDuration', duration, this.params.index)
            this.visible = false
        }
    }
}
</script>

<style lang="scss">
    .operation-set-content-duration-popver{
        padding: 0;
        
        li{
            height: 42px;
            line-height: 42px;
            padding: 0 12px;
            border-bottom: 1px solid #e5e5e5;
            cursor: pointer;
            
            &:hover{
                background: var(--color-primary);
                color: #fff;
            }

            &.custom{
                .el-input-number{
                    width: 90px;
                }

                span{
                    display: inline-block;
                    width: 50px;
                    height: 27px;
                    line-height: 27px;
                    text-align: center;
                    margin-left: 18px;
                    background: var(--color-primary);
                    border-radius: 3px;
                    color: #fff;
                }

                &:hover{
                    background: #fff;
                }
            }
        }
    }
</style>