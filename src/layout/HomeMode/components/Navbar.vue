<template>
	<div 
		class="navbar-home-mode"
	>	

		<breadcrumb class="breadcrumb-container" model="homeModel" />
		
		<div class="right-menu">
			<el-dropdown class="avatar-container" trigger="click">
				<div class="avatar-wrapper">
					<el-image class="icon user-avatar" :src="user.avatar" fit="cover" @click="handleShowSelectRole">
						<div slot="error" class="image-slot">
							<svg-icon icon-class="defalut-header-img"></svg-icon>
						</div>
					</el-image>
					<span class="nickname">{{ user.nickname }}</span>
					<i class="el-icon-arrow-down" />
				</div>
				<el-dropdown-menu slot="dropdown" class="user-dropdown">
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
import { mapState } from "vuex"
import Breadcrumb from "@/components/Breadcrumb"

export default {
	components: {
		Breadcrumb
	},
	computed: {
		...mapState({
			user: state => state.user.loginData,
			clickAvatarCount: state => state.user.clickAvatarCount
		})
	},
	methods: {
		async logout() {
			await this.$store.dispatch("user/logout");
			this.$router.push(`/login?redirect=${this.$route.fullPath}`);
			location.reload()
		},

		// 显示选择角色
		handleShowSelectRole(){
			this.$store.state.user.clickAvatarCount += 1
			if(this.$store.state.user.clickAvatarCount > 9){
				this.$store.state.user.currentRoleHomePageData = []
				localStorage.currentRoleHomePageData = []
				localStorage.homeRoute = ''
				this.$router.push('/')
			}
		}
	}
}
</script>

<style lang="scss">
.navbar-home-mode {
	height: 40px;
    line-height: 40px;
	overflow: hidden;
	position: relative;
	display: flex;
	justify-content: space-between;
	align-items: center;
	background: #374151;
	box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
	
	.nickname, .el-icon-arrow-down, .el-breadcrumb__inner a{
		color: #F3F4F6; 
	}

	.breadcrumb-container {
		float: left;
		cursor: pointer;
		color: #F3F4F6;
		transition: background 0.3s;
		-webkit-tap-highlight-color: transparent;

		&:hover {
			background: rgba(12, 11, 11, 0.025);
		}
	}

	.right-menu {

		&:focus {
			outline: none;
		}

		.right-menu-item {
			display: inline-block;
			padding: 0 8px;
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
				.user-avatar {
					cursor: pointer;
					width: 30px;
					height: 30px;
					border-radius: 50%;
					vertical-align: middle;
					.image-slot .svg-icon {
						width: 30px;
						height: 30px;
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
