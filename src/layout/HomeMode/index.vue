<template>
	<div 
		:class="classObj" 
		class="app-wrapper full-screen"
	>	
		<sidebar />
		<div class="home-mode-main-container">
			<div class="fixed-header">
				<navbar />
			</div>
			<app-main />
		</div>
	</div>
</template>

<script>
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import AppMain from '../components/AppMain'
import ResizeMixin from "../mixin/ResizeHandler"
import { mapState } from "vuex"

export default {
	name: "Layout",
	components: {
		Navbar,
		Sidebar,
		AppMain
	},
	mixins: [ResizeMixin],
	computed: {
		...mapState({
			sidebar: state => state.app.sidebar,
			currentRoleHomePageData: state => state.user.currentRoleHomePageData
		}),
		classObj() {
			return {
				hideSidebar: !this.sidebar.opened,
				openSidebar: this.sidebar.opened,
				mobile: !this.currentRoleHomePageData.length
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

<style lang="scss">
.home-mode-main-container{
	min-height: 100%;
	transition: margin-left .28s;
	margin-left: 136px;
}

.app-wrapper {
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
	width: calc(100% - 136px);
	transition: width 0.28s;
	z-index: 999;
}

.hideSidebar {
	.fixed-header {
		width: calc(100% - 43px);
	}

    .home-mode-sidebar {
		width: 43px !important;
		.menu-name{
        	opacity: 0;
		}
    }

    .home-mode-main-container {
		margin-left: 43px;
    }

}

.mobile {
	.home-mode-main-container, .fixed-header {
		width: 100%;
		margin: 0;
	}
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
	font-size: 14px;
	line-height: 40px;
	margin-left: 20px;

	.no-redirect {
		color: #D1D5DB;
		cursor: text;
	}
}
</style>
