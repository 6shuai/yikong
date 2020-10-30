/*
 * @Author: liushuai 
 * @Date: 2020-10-30 15:55:58 
 * @Desc: 时间轴复制
 * @Last Modified by: liushuai
 * @Last Modified time: 2020-10-30 15:56:28
 */
<template>
    <div class="copy-content" @click.prevent="checked=!checked; handleCheckChange();">
        <el-checkbox  
            v-model="checked" 
            @change="handleCheckChange">
        </el-checkbox>
    </div>
</template>
<script>
export default {
    props: ['data'],
    data(){
        return{
            checked: false
        }
    },
    methods: {
        handleCheckChange(){
            this.$emit('setCopyData', {
                checked: this.checked,
                id: this.data.id,
                data: this.data
            });
        }
    },
}
</script>
<style lang="scss">
    .copy-content{
        position: absolute;
        top: 0px;
        left: 0px;
        width: 100%;
        height: 100%;
        z-index: 999;
        background: rgba($color: #000000, $alpha: 0.6);
        .el-checkbox{
            top: 5px;
            left: 5px;
        }
    }
</style>