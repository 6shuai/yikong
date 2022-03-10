<template>
	<el-card class="template-card content-details statistics-list">
        <page-header :title="activeName">
            <el-radio-group slot="headerRight" v-model="activeName">
                <el-radio-button label="数据统计"></el-radio-button>
                <el-radio-button label="奖励统计"></el-radio-button>
                <el-radio-button label="行为统计"></el-radio-button>
                <el-radio-button label="留存统计"></el-radio-button>
            </el-radio-group>
        </page-header>

        <!-- 数据统计 -->
        <game-data-statistics v-if="activeName=='数据统计'"></game-data-statistics>

        <!-- 奖励统计 -->
        <game-award-statistics v-if="activeName=='奖励统计'"></game-award-statistics>

        <!-- 行为统计 -->
        <game-behavior-statistics v-if="activeName=='行为统计'"></game-behavior-statistics>

        <!-- 留存统计 -->
        <game-player-keep-statistics v-if="activeName=='留存统计'"></game-player-keep-statistics>


	</el-card>
</template>

<script>
import gameDataStatistics from './game/index';
import gameAwardStatistics from './award/index';
import gameBehaviorStatistics from './charts/index';
import gamePlayerKeepStatistics from './playerKeep/index';
import PageHeader from '@/components/PageHeader'

export default {
    data(){
        return {
            activeName: '数据统计'
        }
    },
    components: {
        gameDataStatistics,
        gameAwardStatistics,
        gameBehaviorStatistics,
        gamePlayerKeepStatistics,
        PageHeader
    }
}
</script>


<style lang="scss">
    .statistics-list{
        .statistics-header-right{
            float: right;
            width: 450px;
            text-align: right;

            .el-radio-button__inner{
                border: 1px dashed #8484FF;
                border-left: 0;
            }

            .el-radio-button:first-child .el-radio-button__inner{
                border-left: 1px dashed #8484FF;
            }
        }
    }
</style>