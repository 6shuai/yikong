<template>
    <div class="left-wrap">
        <el-tabs type="card" class="el-tabs" v-model="tabActive">
            <el-tab-pane label="屏幕布局" name="1"></el-tab-pane>
            <el-tab-pane label="资源选择" name="2"></el-tab-pane>
            <el-tab-pane label="投放屏幕" name="3"></el-tab-pane>
        </el-tabs>

        <div class="tabs-content">
            <!-- 屏幕布局 -->
            <screen-layout :timeData="timeData" v-show="tabActive==1"></screen-layout>

            <!-- 资源选择 -->
            <content-list v-show="tabActive==2"></content-list>
            
            <!-- 投放屏幕 -->
            <screen-list v-show="tabActive==3"></screen-list>
        </div>


    </div>
</template>
<script>
import ScreenLayout from './ScreenLayout';
import ContentList from './ContentList';
import ScreenList from './ScreenList';
export default {
    props: ['timeData'],
    data(){
        return {
            tabActive: '2',
        }
    },
    methods: {
        
    },
    components: {
        ScreenLayout,
        ContentList,
        ScreenList
    }
}
</script>
<style lang="scss" scope>
    .left-wrap{
        height: 100%;
        overflow: hidden;
        .tabs-content{
            height: calc(100% - 56px);
        }
    }
</style>