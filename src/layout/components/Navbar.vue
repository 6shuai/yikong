<template>
	<div class="navbar">
		<hamburger
			:is-active="sidebar.opened"
			class="hamburger-container"
			@toggleClick="toggleSideBar"
		/>

		<breadcrumb class="breadcrumb-container" />

		<div class="right-menu">
			<el-dropdown class="avatar-container" trigger="click">
				<div class="avatar-wrapper">
					<el-image
						class="icon user-avatar"
						:src="user.avatar"
						fit="cover">
					</el-image>
					<span class="nickname">{{ user.nickname }}</span>
					<i class="el-icon-caret-bottom" />
				</div>
				<el-dropdown-menu slot="dropdown" class="user-dropdown">
					<router-link to="/">
						<el-dropdown-item>
						首页
						</el-dropdown-item>
					</router-link>
					<router-link to="/user/center">
						<el-dropdown-item>
						个人中心
						</el-dropdown-item>
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
      user: state => state.user.loginData
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

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);

  .hamburger-container {
    line-height: 46px;
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
        margin-top: 5px;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
          vertical-align: middle;
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
