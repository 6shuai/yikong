<template>
	<div>
		<div 
			:class="classObj" 
			class="app-wrapper"
			v-if="showMenu"
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
	
		<div 
			:class="classObj" 
			class="app-wrapper full-screen"
			v-else
		>
			<div :class="{ 'fixed-header': fixedHeader }" style="width: 100%">
				<navbar />
			</div>
			<app-main />
		</div>
	</div>
</template>

<script>
import { Navbar, Sidebar, AppMain, TagsView } from "./components";
import ResizeMixin from "./mixin/ResizeHandler";
import { mapState } from "vuex";

export default {
	name: "Layout",
	components: {
		Navbar,
		Sidebar,
		AppMain,
		TagsView
	},
	mixins: [ResizeMixin],
	computed: {
		...mapState({
			sidebar: state => state.app.sidebar,
			device: state => state.app.device,
			needTagsView: state => state.settings.tagsView,
			fixedHeader: state => state.settings.fixedHeader,
			sidebarLogo: state => state.settings.sidebarLogo,
			showMenu: state => state.settings.showMenu
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
		if(localStorage.showMenu) this.$store.state.settings.showMenu =  JSON.parse(localStorage.showMenu)
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
</style>
