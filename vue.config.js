'use strict'
const path = require('path')
const defaultSettings = require('./src/settings.js')

function resolve(dir) {
	return path.join(__dirname, dir)
}

const name = defaultSettings.title || '易控' // page title

// If your port is set to 80,
// use administrator privileges to execute the command line.
// For example, Mac: sudo npm run
// You can change the port by the following methods:
// port = 9528 npm run dev OR npm run dev --port = 9528
const port = process.env.port || process.env.npm_config_port || 8080 // dev port

// All configuration item explanations can be find in https://cli.vuejs.org/config/
module.exports = {
	/**
	 * You will need to set publicPath if you plan to deploy your site under a sub path,
	 * for example GitHub Pages. If you plan to deploy your site to https://foo.github.io/bar/,
	 * then publicPath should be set to "/bar/".
	 * In most cases please use '/' !!!
	 * Detail: https://cli.vuejs.org/config/#publicpath
	 */
	publicPath: './',
	outputDir: 'dist',
	assetsDir: 'static',
	// lintOnSave: process.env.NODE_ENV === 'development',
	lintOnSave: false,
	productionSourceMap: false,
	devServer: {
		port: 8080,
		// 测试环境
		// proxy: 'http://123.206.83.233:8191',       
		// 线上环境
		// proxy: 'http://123.206.83.233:8181',

		// 本地环境
		// proxy: 'http://192.168.34.58:8181',
		
		//本地环境
		proxy: {
			'/user': {
				target: 'http://192.168.34.58:8181',
				changeOrigin: true
			},
			'/project': {
				target: 'http://192.168.34.58:8181',
				changeOrigin: true
			},
			'/businessTransaction': {
				target: 'http://192.168.34.58:8181',
				changeOrigin: true
			},
			'/auditor': {
				target: 'http://192.168.34.58:8181',
				changeOrigin: true
			},
			'/collectionRequest': {
				target: 'http://192.168.34.58:8181',
				changeOrigin: true
			},
			'/commissionSystem': {
				target: 'http://192.168.34.58:8181',
				changeOrigin: true
			},
			'/contractReview': {
				target: 'http://192.168.34.58:8181',
				changeOrigin: true
			},
			'/finance': {
				target: 'http://192.168.34.58:8181',
				changeOrigin: true
			},
			'/invoiceReview': {
				target: 'http://192.168.34.58:8181',
				changeOrigin: true
			},
			'/materialPlayback': {
				target: 'http://192.168.34.58:8181',
				changeOrigin: true
			},


			'/sign_in': {
				target: 'http://192.168.34.58:8181',
				changeOrigin: true
			},
			
			'/common': {
				target: 'http://192.168.34.58:8181',
				changeOrigin: true
			},
			'/logout': {
				target: 'http://192.168.34.58:8181',
				changeOrigin: true
			},
			'/entry': {
				target: 'http://192.168.34.58:8181',
				changeOrigin: true
			},
			'/system': {
				target: 'http://192.168.34.58:8181',
				changeOrigin: true
			},

			'/public': {
				target: 'http://192.168.34.58:8181',
				changeOrigin: true
			},
			'/homePage': {
				target: 'http://192.168.34.58:8181',
				changeOrigin: true
			},
			'/priceSystem': {
				target: 'http://192.168.34.58:8181',
				changeOrigin: true
			},

			'/order': {
				target: 'https://static.xfengjing.com/publish',
				changeOrigin: true
			},

			'/get_order': {
				target: 'https://static.xfengjing.com/publish',
				changeOrigin: true
			},

			
			'/upload': {
				target: 'https://static.xfengjing.com/publish',
				changeOrigin: true
			},

			'/target_placeholder': {
				target: 'https://static.xfengjing.com/publish',
				changeOrigin: true
			},

			'/throw_in_material': {
				target: 'https://static.xfengjing.com/publish',
				changeOrigin: true
			},
			'/material': {
				target: 'https://static.xfengjing.com/publish',
				changeOrigin: true
			},
			'/price_system': {
				target: 'https://static.xfengjing.com/publish',
				changeOrigin: true
			},
			'/material_target': {
				target: 'https://static.xfengjing.com/publish',
				changeOrigin: true
			},
			'/screen_statistics': {
				target: 'https://static.xfengjing.com/publish',
				changeOrigin: true
			},
			'/unlock': {
				target: 'https://static.xfengjing.com/publish',
				changeOrigin: true
			},
			'/delete_order': {
				target: 'https://static.xfengjing.com/publish',
				changeOrigin: true
			},
			'/remove_material': {
				target: 'https://static.xfengjing.com/publish',
				changeOrigin: true
			},
			'/unlock': {
				target: 'https://static.xfengjing.com/publish',
				changeOrigin: true
			},
			'/layout': {
				target: 'https://static.xfengjing.com/publish',
				changeOrigin: true
			},
			'/default_layout': {
				target: 'https://static.xfengjing.com/publish',
				changeOrigin: true
			},
			'/landlord': {
				target: 'https://static.xfengjing.com/publish',
				changeOrigin: true
			},
			'/default_layout': {
				target: 'https://static.xfengjing.com/publish',
				changeOrigin: true
			},
			'/screen_default': {
				target: 'https://static.xfengjing.com/publish',
				changeOrigin: true
			},
			'/screen_layout': {
				target: 'https://static.xfengjing.com/publish',
				changeOrigin: true
			},
			'/sales_throw_in_content': {
				target: 'https://static.xfengjing.com/publish',
				changeOrigin: true
			},
			'/throw_in_content': {
				target: 'https://static.xfengjing.com/publish',
				changeOrigin: true
			},
			'/screen_for_operation': {
				target: 'https://static.xfengjing.com/publish',
				changeOrigin: true
			},
			'/operational_material': {
				target: 'https://static.xfengjing.com/publish',
				changeOrigin: true
			},
			'/screen':  {
				target: 'http://192.168.34.58:8181',
				changeOrigin: true
			},
		},
		
		public: '192.168.137.1:8080'
	},
	configureWebpack: {
		// provide the app's title in webpack's name field, so that
		// it can be accessed in index.html to inject the correct title.
		name: name,
		resolve: {
			alias: {
				'@': resolve('src')
			}
		},
		externals: {
			'BMap': 'BMap'
		}
	},
	chainWebpack(config) {
		config.plugins.delete('preload') // TODO: need test
		config.plugins.delete('prefetch') // TODO: need test

		// set svg-sprite-loader
		config.module
			.rule('svg')
			.exclude.add(resolve('src/icons'))
			.end()
		config.module
			.rule('icons')
			.test(/\.svg$/)
			.include.add(resolve('src/icons'))
			.end()
			.use('svg-sprite-loader')
			.loader('svg-sprite-loader')
			.options({
				symbolId: 'icon-[name]'
			})
			.end()

		// set preserveWhitespace
		config.module
			.rule('vue')
			.use('vue-loader')
			.loader('vue-loader')
			.tap(options => {
				options.compilerOptions.preserveWhitespace = true
				return options
			})
			.end()

		config
			// https://webpack.js.org/configuration/devtool/#development
			.when(process.env.NODE_ENV === 'development',
				config => config.devtool('cheap-source-map')
			)

		config
			.when(process.env.NODE_ENV !== 'development',
				config => {
					config
						.plugin('ScriptExtHtmlWebpackPlugin')
						.after('html')
						.use('script-ext-html-webpack-plugin', [{
							// `runtime` must same as runtimeChunk name. default is `runtime`
							inline: /runtime\..*\.js$/
						}])
						.end()
					config
						.optimization.splitChunks({
							chunks: 'all',
							cacheGroups: {
								libs: {
									name: 'chunk-libs',
									test: /[\\/]node_modules[\\/]/,
									priority: 10,
									chunks: 'initial' // only package third parties that are initially dependent
								},
								elementUI: {
									name: 'chunk-elementUI', // split elementUI into a single package
									priority: 20, // the weight needs to be larger than libs and app or it will be packaged into libs or app
									test: /[\\/]node_modules[\\/]_?element-ui(.*)/ // in order to adapt to cnpm
								},
								commons: {
									name: 'chunk-commons',
									test: resolve('src/components'), // can customize your rules
									minChunks: 3, //  minimum common number
									priority: 5,
									reuseExistingChunk: true
								}
							}
						})
					config.optimization.runtimeChunk('single')
				}
			)
	}
}
