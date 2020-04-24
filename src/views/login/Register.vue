<template>
	<div class="register-container">
		<el-form
			label-width="100px"
			:rules="rules"
			ref="registerForm"
			:model="registerForm"
			class="registerContainer rigister-form"
		>
			<div class="title-container">
				<h3 class="title">注册新用户</h3>
			</div>
			<el-form-item prop="accountName" label="登录名：">
				<el-input
					size="normal"
					type="text"
					v-model="registerForm.accountName"
					auto-complete="off"
					placeholder="输入登录名"
				></el-input>
			</el-form-item>
			<el-form-item prop="nickname" label="昵称：">
				<el-input
					size="normal"
					type="text"
					v-model="registerForm.nickname"
					auto-complete="off"
					placeholder="输入昵称"
				></el-input>
			</el-form-item>
			<el-form-item prop="password" label="登录密码：">
				<el-input
					size="normal"
					type="password"
					v-model="registerForm.password"
					auto-complete="off"
					placeholder="输入密码"
				></el-input>
			</el-form-item>
			<el-form-item prop="confirmPassword" label="确认密码：">
				<el-input
					size="normal"
					type="password"
					v-model="registerForm.confirmPassword"
					auto-complete="off"
					placeholder="确认密码"
				></el-input>
			</el-form-item>
			<el-form-item label-width="0">
				<el-button
					size="normal"
					type="primary"
					@click="submit"
					class="register-btn"
					:loading="loading"
				>注册</el-button
			>
		</el-form-item>

		<div class="tips">
			<router-link to="/login">登录</router-link>
		</div>
		</el-form>
	</div>
</template>

<script>
import { userRegister } from "@/api/user";
export default {
	name: "Login",
	data() {
		// 校验密码一致性
		var validatePass = (rule, value, callback) => {
			if (value === "") {
				callback(new Error("请再次输入密码！"));
			} else if (value !== this.registerForm.password) {
				callback(new Error("两次输入密码不一致！"));
			} else {
				callback();
			}
		};
		return {
			loading: false,
			registerForm: {
				accountName: "",
				nickname: "",
				password: "",
				confirmPassword: "",
			},
			rules: {
				accountName: [{ required: true, message: "请输入登录名", trigger: "blur" }],
				nickname: [{ required: true, message: "请输入昵称", trigger: "blur" }],
				password: [{ required: true, message: "请输入密码", trigger: "blur" }],
				confirmPassword: [
					{ required: true, message: "请再次输入密码", trigger: "blur" },
					{ validator: validatePass, trigger: "blur" },
				],
			}
		};
	},
	watch: {
		$route: {
			handler: function(route) {
				this.redirect = route.query && route.query.redirect;
			},
			immediate: true,
		},
	},
	methods: {
		//提交注册
		submit() {
		this.$refs.registerForm.validate((valid) => {
			if (valid) {
				this.loading = true;
				userRegister(this.registerForm).then((resp) => {
					this.loading = false;
					if (resp && resp.obj) {
						this.registerForm = {};
						this.$message({
							message: '注册成功~',
							type: 'success',
							onClose: () => {
								// 跳转到登录页面
								this.$router.push("/");
							}
						});
						
					}
				});
			} else {
				this.$message.error("请合法输入所有字段");
				return false;
			}
		});
		},
	},
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
.register-container {
  // background-image:url('../../assets/images/1.jpg');
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      -webkit-appearance: none;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }
  .el-form-item__label {
    color: #d1d1d1;
  }
}
</style>

<style lang="scss" scoped>
$dark_gray: #889aa4;
$light_gray: #eee;

.register-container {
  min-height: 100%;
  width: 100%;
  background: -webkit-radial-gradient(0 100%,ellipse cover,rgba(104,128,138,.4) 10%,rgba(138,114,76,0) 40%),linear-gradient(180deg,rgba(57,173,219,.25) 0,rgba(42,60,87,.4)),linear-gradient(135deg,#670d10,#092756);
  overflow: hidden;

  .rigister-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
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
  }
  .register-btn {
    width: 80%;
    display: block;
    margin: 0 auto;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-top: 20px;
    text-align: center;
    &:hover{
		text-decoration: underline;
	}
  }
}
</style>
