<template>
  <div class="login-container">
    <el-form
		ref="loginForm"
		:model="loginForm"
		:rules="loginRules"
		class="login-form"
		auto-complete="on"
		label-position="left"
    >
		<div class="title-container">
			<img src="../../assets/images/login_logo.png" alt="易控">
		</div>

		<el-form-item prop="username">
			<span class="svg-container">
				<svg-icon icon-class="user" />
			</span>
			<el-input
				ref="username"
				v-model="loginForm.username"
				placeholder="账号"
				name="username"
				type="text"
				tabindex="1"
				auto-complete="on"
			/>
		</el-form-item>

		<el-form-item prop="password">
			<span class="svg-container">
				<svg-icon icon-class="password" />
			</span>
			<el-input
				:key="passwordType"
				ref="password"
				v-model="loginForm.password"
				:type="passwordType"
				placeholder="密码"
				name="password"
				tabindex="2"
				auto-complete="on"
				@keyup.enter.native="submitLogin"
			/>
			<span class="show-pwd" @click="showPwd">
			<svg-icon
				:icon-class="passwordType === 'password' ? 'eye' : 'eye-open'"
			/>
			</span>
		</el-form-item>

		<el-button
			:loading="loading"
			type="primary"
			style="width:100%;margin-bottom:30px;"
			@click.native.prevent="submitLogin"
			>{{loading ? '登录中' : '登录'}}</el-button
		>

		<div class="tips">
			<el-checkbox v-model="checked">记住账号</el-checkbox>
			<span class="register-btn">
				<router-link to="/register">注册</router-link>
			</span>
		</div>
		
    </el-form>
  </div>
</template>

<script>
import Cookies from 'js-cookie';

export default {
	name: "Login",
	data() {
		return {
			checked: false,         //记住账号
			loginForm: {},
			loginRules: {
				username: [
					{ required: true, trigger: "blur", message: '请输入用户名~' }
				],
				password: [
					{ required: true, trigger: "blur", message: '请输入密码~' }
				]
			},
			loading: false,
			passwordType: "password",
			redirect: undefined
		};
	},
	watch: {
		$route: {
			handler: function(route) {
				this.redirect = route.query && route.query.redirect;
			},
			immediate: true
		}
	},
	created() {
		this.getCookie();
	},
	methods: {
		getCookie() {
			const username = Cookies.get('username')
			const rememberMe = Cookies.get('rememberMe')
			this.loginForm = {
				username: username === undefined ? '' : username
			}
			this.checked = rememberMe === undefined ? false : Boolean(rememberMe);
		},
		//是否显示密码
		showPwd() {
			if (this.passwordType === "password") {
				this.passwordType = "";
			} else {
				this.passwordType = "password";
			}
			this.$nextTick(() => {
				this.$refs.password.focus();
			});
		},

		//登录
		submitLogin() {
			this.$refs.loginForm.validate(valid => {
				if (valid) {
					this.loading = true;
					if (this.checked) {
						Cookies.set('username', this.loginForm.username, { expires: 1 })
						Cookies.set('rememberMe', this.checked, { expires: 1 })
					} else {
						Cookies.remove('username')
						Cookies.remove('rememberMe')
					}
					this.$store.dispatch('user/login', this.loginForm).then((res) => {
						this.loading = false;
						this.loginSuccess(res);
					})
					.catch(() => {
						this.loading = false;
					});
				} else {
					this.$message.error('请输入所有字段');
					return false;
				}
			});
		},

		//登录成功
        loginSuccess(msg){
			localStorage.loginData = JSON.stringify(msg.obj);
            this.$router.push({
                path: '/'
            });
        },
	}
};
</script>

<style lang="scss">

$bg: #283443;
$light_gray: #fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
	// background-image:url('../../assets/images/1.jpg');
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;

.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-top: 20px;
	.el-checkbox{
		color: #fff;
	}
	.register-btn{
		float:right;
		&:hover{
			text-decoration: underline;
		}
	}
    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
	img{
		width: 70%;
		min-width: 240px;
		height: auto;
		display: block;
		margin: 0px auto 40px auto;
	}
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}
</style>
