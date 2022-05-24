<template>
	<el-breadcrumb class="app-breadcrumb" separator-class="el-icon-arrow-right">
		<transition-group name="breadcrumb">
			<el-breadcrumb-item v-for="(item,index) in levelList" :key="item.path+index">
				<span
					v-if="item.redirect==='noRedirect'||index==levelList.length-1"
					class="no-redirect"
				>{{ item.meta.title }}</span>
				<a v-else @click.prevent="handleLink(item)">{{ item.meta.title }}</a>
			</el-breadcrumb-item>
		</transition-group>
	</el-breadcrumb>
</template>

<script>
import pathToRegexp from "path-to-regexp";

export default {
	props: {
		model: String
	},
	data() {
		return {
			levelList: null
		};
	},
	watch: {
		$route() {
			this.getBreadcrumb();
		}
	},
	created() {
		this.getBreadcrumb();
	},
	methods: {
		getBreadcrumb() {
			// 只显示带有meta.title的路由
			let matched = this.$route.matched.filter(
				item => item.meta && item.meta.title
			);
			const first = matched[0];

			// if (!this.isHome(first)) {
			// 	matched = [{ path: "/", meta: { title: "首页" } }].concat(
			// 		matched
			// 	);
			// }
			this.levelList = matched.filter(
				item => item.meta && item.meta.title && item.meta.breadcrumb !== false
			);
		},

		isHome(route) {
			const name = route && route.name;
			if (!name) {
				return false;
			}
			return (
				name.trim().toLocaleLowerCase() === "Home".toLocaleLowerCase()
			);
		},

		pathCompile(path) {
			// To solve this problem https://github.com/PanJiaChen/vue-element-admin/issues/561
			const { params } = this.$route;
			var toPath = pathToRegexp.compile(path);
			return toPath(params);
		},

		handleLink(item) {
			const { redirect, path } = item;
			if (redirect) {
				this.$router.push(redirect);
				return;
			}
			if(this.model == 'homeModel' && !this.pathCompile(path)){
				this.$router.push('/');
			}else{
				this.$router.push(this.pathCompile(path) || '/');
			}
		}
	}
};
</script>