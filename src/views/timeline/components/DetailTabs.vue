<template>
    <div class="left-wrap">
        <el-tabs type="card" class="el-tabs" v-model="tabActive">
            <el-tab-pane label="资源选择" name="1"></el-tab-pane>
            <el-tab-pane label="投放屏幕" name="2"></el-tab-pane>
            <el-tab-pane label="定时发布" name="3"></el-tab-pane>
        </el-tabs>

        <div class="tabs-content">

            <!-- 资源选择 -->
            <content-list v-if="tabActive==1"></content-list>
            
            <!-- 投放屏幕 -->
            <screen-list 
                v-if="tabActive==2" 
                :timelineData="timeData"
                ref="screen"
            ></screen-list>

            <!-- 定时发布 -->
            <time-interval 
                v-if="tabActive==3" 
                :timelineData="timeData"
                ref="intervalScreen"
            ></time-interval>
        </div>


    </div>
</template>
<script>
import ContentList from './ContentList';
import ScreenList from './ScreenList';
import TimeInterval from './TimeInterval';
export default {
    props: ['timeData'],
    data(){
        return {
            tabActive: '1',
        }
    },
    created() {
        //时间轴发布成功 刷新投放屏幕列表
        eventBus.$on("timelinePubSuccess", target => {
            if(this.tabActive == 2){
                this.$refs.screen.init();
            }else if(this.tabActive == 3){
                console.log(this.$refs.intervalScreen)
                this.$refs.intervalScreen.init();
            }
        });
    },
    components: {
        ContentList,
        ScreenList,
        TimeInterval
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