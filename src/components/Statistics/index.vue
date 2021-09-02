<template>
	<el-card class="template-card content-details statistics-list">
		<div class="header-wrap detail-header-wrap mb30">
			<el-page-header @back="$router.go(-1)"> </el-page-header>
            <div class="statistics-header-right">
                <el-radio-group v-model="activeName">
					<el-radio-button label="数据统计"></el-radio-button>
					<el-radio-button label="奖励统计"></el-radio-button>
					<el-radio-button label="行为统计"></el-radio-button>
                    <el-radio-button label="留存统计"></el-radio-button>
				</el-radio-group>
            </div>
			<div class="title">
				<h2>{{ activeName }}</h2>
			</div>
		</div>

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
        gamePlayerKeepStatistics
    }
}
</script>


<style lang="scss" scope>
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