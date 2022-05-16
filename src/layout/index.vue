<template>
	<div>
		<div 
			:class="classObj" 
			class="app-wrapper"
			v-if="classicMode"
		>
			<div v-if="device === 'mobile' && sidebar.opened" class="drawer-bg" @click="handleClickOutside" />
			<sidebar class="sidebar-container" />
			<div :class="{ hasTagsView: false }" class="main-container">
				<div :class="{ 'fixed-header': fixedHeader }">
					<navbar />
					<!-- <tags-view /> -->
				</div>
				<app-main />
			</div>
		</div>

		<home-mode v-else></home-mode>
		
	</div>
</template>

<script>
import { Navbar, Sidebar, AppMain, TagsView } from "./components";
import HomeMode from './HomeMode'
import ResizeMixin from "./mixin/ResizeHandler";
import { mapState } from "vuex";

export default {
	name: "Layout",
	components: {
		Navbar,
		Sidebar,
		AppMain,
		TagsView,
		HomeMode
	},
	mixins: [ResizeMixin],
	computed: {
		...mapState({
			sidebar: state => state.app.sidebar,
			device: state => state.app.device,
			needTagsView: state => state.settings.tagsView,
			fixedHeader: state => state.settings.fixedHeader,
			sidebarLogo: state => state.settings.sidebarLogo,
			classicMode: state => state.settings.classicMode
		}),
		classObj() {
			return {
				hideSidebar: !this.sidebar.opened,
				openSidebar: this.sidebar.opened,
				withoutAnimation: this.sidebar.withoutAnimation,
				mobile: this.device === "mobile"
			};
		}
	},
	created() {
		if(localStorage.classicMode) this.$store.state.settings.classicMode =  JSON.parse(localStorage.classicMode)
	},
	methods: {
		handleClickOutside() {
			this.$store.dispatch("app/closeSideBar", { withoutAnimation: false });
		}
	}
};
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";
@import "~@/styles/variables.scss";

.app-wrapper {
	@include clearfix;
	position: relative;
	height: 100%;
	width: 100%;
	&.mobile.openSidebar {
		position: fixed;
		top: 0;
	}
}
.drawer-bg {
	background: #000;
	opacity: 0.3;
	width: 100%;
	top: 0;
	height: 100%;
	position: absolute;
	z-index: 999;
}

.fixed-header {
	position: fixed;
	top: 0;
	right: 0;
	z-index: 9;
	width: calc(100% - #{$sideBarWidth});
	transition: width 0.28s;
	z-index: 999;
}

.hideSidebar .fixed-header {
	width: calc(100% - 54px);
}

.mobile .fixed-header {
	width: 100%;
}

.full-screen {
	.logo {
		width: 50px;
		height: 50px;
		display: inline-block;
	}
}

.app-breadcrumb.el-breadcrumb {
	display: inline-block;
	font-size: 16px;
	line-height: 72px;
	margin-left: 8px;

	.no-redirect {
		color: #97a8be;
		cursor: text;
	}
}
</style>
