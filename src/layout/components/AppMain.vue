<template>
	<section class="app-main">
		
		<home-tabs></home-tabs>

		<transition name="fade-transform" mode="out-in">
			<keep-alive :include="cachedViews">
				<router-view></router-view>
			</keep-alive>
		</transition>
	</section>
</template>

<script>
import HomeTabs from './HomeTabs'

export default {
	name: 'AppMain',
	components: {
		HomeTabs
	},
	computed: {
		cachedViews() {
			return this.$store.state.tagsView.cachedViews
		},
		/* key() {
			return this.$route.path
		} */
	}
}
</script>

<style lang="scss" scoped>
.app-main {
	/* 50= navbar  50  */
	min-height: calc(100vh - 0px);
	width: 100%;
	position: relative;
	overflow: hidden;
}

.fixed-header+.app-main {
	padding-top: 72px;
	background: #f5f5f5;
	overflow-x: auto;
}

.app-main>.el-card{
	margin: 10px;
}

.hasTagsView {
	.app-main {
		/* 84 = navbar + tags-view = 50 + 34 */
		min-height: calc(100vh - 84px);
	}

	.fixed-header+.app-main {
		padding-top: 84px;
	}
}
</style>

<style lang="scss">
// fix css style bug in open el-dialog
.el-popup-parent--hidden {
	.fixed-header {
		padding-right: 15px;
	}
}
</style>
