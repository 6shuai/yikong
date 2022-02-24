<template>
	<div 
		class="navbar"
		:class="{ 'navbar-dark': !showMenu }"
	>
		<hamburger 
			v-if="showMenu"
			:is-active="sidebar.opened" 
			class="hamburger-container" 
			@toggleClick="toggleSideBar" 
		/>

		<img 
			v-else 
			class="miniview-logo" 
			src="../../assets/images/login_logo.png" 
			alt="小风景"
			@click="$router.push('/')"
		>

		<breadcrumb class="breadcrumb-container" />

		<div class="right-menu">
			<el-dropdown class="avatar-container" trigger="click">
				<div class="avatar-wrapper">
					<el-image class="icon user-avatar" :src="user.avatar" fit="cover">
						<div slot="error" class="image-slot">
							<svg-icon icon-class="defalut-header-img"></svg-icon>
						</div>
					</el-image>
					<span class="nickname">{{ user.nickname }}</span>
					<i class="el-icon-arrow-down" />
				</div>
				<el-dropdown-menu slot="dropdown" class="user-dropdown">
					<router-link to="/">
						<el-dropdown-item>首页</el-dropdown-item>
					</router-link>
					<router-link to="/user">
						<el-dropdown-item>个人中心</el-dropdown-item>
					</router-link>
					<el-dropdown-item divided>
						<span style="display:block;" @click="logout">退出</span>
					</el-dropdown-item>
				</el-dropdown-menu>
			</el-dropdown>
		</div>
	</div>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import Breadcrumb from "@/components/Breadcrumb";
import Hamburger from "@/components/Hamburger";

export default {
	components: {
		Breadcrumb,
		Hamburger,
	},
	computed: {
		...mapGetters(["sidebar"]),
		...mapState({
			user: state => state.user.loginData,
			showMenu: state => state.settings.showMenu
		})
	},
	methods: {
		toggleSideBar() {
			this.$store.dispatch("app/toggleSideBar");
		},
		async logout() {
			await this.$store.dispatch("user/logout");
			this.$router.push(`/login?redirect=${this.$route.fullPath}`);
			location.reload()
		},
	},
};
</script>

<style lang="scss">
.navbar {
	height: 72px;
	overflow: hidden;
	position: relative;
	background: #fff;
	box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);

	&.navbar-dark{
		background: #2b2f3a;

		.nickname, .el-icon-arrow-down{
			color: #fff;
		}

		.el-breadcrumb__inner a {
			color: #fff;
		}
	}

	.miniview-logo{
		height: 56px;
		margin: 8px 20px;
		float: left;
		cursor: pointer;
	}

	.hamburger-container {
		line-height: 70px;
		height: 100%;
		float: left;
		cursor: pointer;
		transition: background 0.3s;
		-webkit-tap-highlight-color: transparent;

		&:hover {
			background: rgba(0, 0, 0, 0.025);
		}
	}

	.breadcrumb-container {
		float: left;
	}

	.right-menu {
		float: right;
		height: 100%;

		&:focus {
			outline: none;
		}

		.right-menu-item {
			display: inline-block;
			padding: 0 8px;
			height: 100%;
			font-size: 18px;
			color: #5a5e66;
			vertical-align: text-bottom;

			&.hover-effect {
				cursor: pointer;
				transition: background 0.3s;

				&:hover {
					background: rgba(0, 0, 0, 0.025);
				}
			}
		}

		.avatar-container {
			margin-right: 30px;

			.avatar-wrapper {
				margin-top: 12px;

				.user-avatar {
					cursor: pointer;
					width: 48px;
					height: 48px;
					border-radius: 50%;
					vertical-align: middle;
					.image-slot .svg-icon {
						width: 48px;
						height: 48px;
					}
				}

				.nickname {
					margin-left: 6px;
					cursor: pointer;
				}

				.el-icon-caret-bottom {
					cursor: pointer;
					font-size: 12px;
				}
			}
		}
	}
}
</style>
