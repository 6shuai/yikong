<template>
	<div class="content-wrap clearfix">
		<el-scrollbar style="height: 100%" v-loading="loading">
			<div class="search-wrap mb10 ml10">
				<el-radio-group size="small" @change="handleClickTab" v-model="params.contentType">
					<el-radio-button :label="1">图片</el-radio-button>
					<el-radio-button :label="2">视频</el-radio-button>
					<el-radio-button :label="4">图集</el-radio-button>
					<el-radio-button :label="3">游戏</el-radio-button>
					<el-radio-button :label="5">直播</el-radio-button>
					<el-radio-button :label="6">剪贴板</el-radio-button>
				</el-radio-group>

				<el-input
					clearable
					size="small"
					placeholder="内容名称"
					v-model="params.displayName"
					@input="handleSearch"
				></el-input>
				<el-select
					v-if="params.contentType != 3"
					v-model="params.brand"
					size="small"
					clearable
					filterable
					@change="init"
					placeholder="请选择品牌"
				>
					<el-option v-for="item in groupData" :key="item.id" :label="item.displayName" :value="item.id"></el-option>
				</el-select>
			</div>

			<draggable
				class="content-draggable"
				v-if="contentData.length"
				:options="dragOption"
				:list="contentData"
				:clone="onClone"
				:group="{
					name: 'componentLibrary',
					pull: 'clone',
					put: false,
				}"
				ghostClass="ghost"
				dragClass="drag-module"
			>
				<div
					class="box-card content-list"
					ref="contentList"
					v-for="(item, index) in contentData"
					:key="index"
					@click="handlePreview(item)"
					:title="item.displayName"
				>
					<div class="cover"></div>

					<!-- 剪贴板 -->
					<div
						class="atlas"
						v-if="item.list && params.contentType == 6"
						:class="`atlas-${item.list.length > 4 ? '4' : item.list.length}`"
					>
						<div v-for="(img, index) in item.list" :key="index" class="img">
							<el-image v-if="index <= 3" fit="cover" :src="img.image"></el-image>
						</div>
					</div>

					<!-- 图集 -->
					<div
						v-else-if="item.subContentsData && item.contentTypeId == 4"
						class="atlas"
						:class="`atlas-${item.subContentsData.length > 4
						? '4'
						: item.subContentsData.length
						}`"
					>
						<el-image
							fit="cover"
							class="img"
							v-for="(img, index) in filterVideo(item.subContentsData)"
							v-if="img.contentType == 1 && index <= 3"
							:key="index"
							:src="img.image"
						>
							<div slot="placeholder" class="image-slot"></div>
						</el-image>
					</div>
					<el-image v-else fit="cover" class="img" :src="item.image">
						<div slot="placeholder" class="image-slot"></div>
					</el-image>
					<div class="desc">
						<p class="title" :title="item.displayName">{{ item.displayName }}</p>
						<p class="duration" v-if="item.duration">
							<font-awesome-icon :icon="['far', 'clock']" />
							{{
								item.duration
							}}秒
						</p>
					</div>
				</div>
			</draggable>
			<div v-else class="no-data">暂无数据~</div>

			<!-- 分页 -->
			<el-pagination
				v-if="params.contentType != 6"
				class="mt10 mb10"
				background
				hide-on-single-page
				layout="total, prev, pager, next"
				:page-size="params.pageSize"
				:current-page="Number(params.pageNo)"
				@current-change="handleCurrentChange"
				:total="contentTotal"
			></el-pagination>
		</el-scrollbar>

		<!-- 预览 -->
		<el-dialog :title="previewData.displayName" :visible.sync="dialogVisible" width="60%">
			<div v-if="dialogVisible">
				<!-- 图片 -->
				<div class="preview" v-if="previewData.contentTypeId == 1">
					<el-image fit="cover" :src="previewData.contentPath">
						<div slot="placeholder" class="image-slot"></div>
					</el-image>
				</div>

				<!-- 视频 -->
				<div class="preview" v-if="previewData.contentTypeId == 2">
					<video :src="previewData.contentPath" controls="controls" :autoplay="true" :loop="true"></video>
				</div>

				<!-- 图集 -->
				<content-preview v-if="previewData.contentTypeId == 4" ref="contentPreview"></content-preview>
			</div>
		</el-dialog>
	</div>
</template>

<script>
import { timelineContentList } from "@/api/timeline";
import ContentPreview from "@/views/content/components/ContentPreview";
import { getOrganizationList } from "@/mixins";
import Draggable from "vuedraggable";
export default {
	mixins: [getOrganizationList],
	data() {
		return {
			contentData: [],
			dialogVisible: false, //显示预览弹框
			previewData: {}, //点击内容  预览的数据
			loading: false,
			dragOption: {
				fallbackOnBody: false,
				sort: false,
				scrollSpeed: 20,
			},
			contentType: 1,
			contentTotal: 0, //内容总数
			params: {
				pageNo: 1,
				pageSize: 50,
				contentType: 1, //contentType 1 图片 2 视频 3 互动 4 图集
			},
		};
	},
	mounted() {
		this.init();
	},
	methods: {
		init() {
			this.loading = true;
			timelineContentList(this.params).then((res) => {
				this.loading = false;
				if (res.code === this.$successCode) {
					let { list, totalRecords } = res.obj;
					this.contentData = list;
					this.contentTotal = totalRecords;
				}
			});
		},

		//选择内容类型
		handleClickTab() {
			if (this.params.contentType == 6) {
				this.clipboardList();
			} else {
				this.params.pageNo = 1;
				this.init();
			}
		},

		//分页
		handleCurrentChange(page) {
			this.params.pageNo = page;
			this.init();
		},

		//搜索
		handleSearch() {
			this.params.pageNo = 1;
			this.init();
		},

		//预览
		handlePreview(data) {
			if (data.contentTypeId == 3) return;
			this.previewData = data;
			let msg =
				this.previewData.contentTypeId == 4
					? this.previewData.subContentsData
					: this.previewData;
			this.dialogVisible = true;
			this.$nextTick(() => {
				try {
					this.$refs.contentPreview.contentPreviewData(msg);
				} catch (error) { }
			});
		},

		//过滤视频
		filterVideo(data) {
			return data.filter((item) => {
				return item.contentType == 1;
			});
		},

		onClone(item) {
			const data = {
				...item,
			};
			return data;
		},

		//剪贴板内容
		clipboardList() {
			let data = localStorage.timelineCopyDataList
				? JSON.parse(localStorage.timelineCopyDataList)
				: [];

			this.contentData = data;
		},
	},
	components: {
		ContentPreview,
		Draggable,
	},
};
</script>

<style lang="scss">
.content-wrap {
	margin-left: -10px;
	height: 100%;

	.search-wrap {
		.el-input,
		.el-select {
			width: 200px;
		}
	}

	.content-draggable {
		display: inline-block;

		.content-list {
			width: 100px;
			margin: 0 0 10px 10px;
			padding-bottom: 2px;
			float: left;
			cursor: pointer;
			border: 1px solid #eee;
			border-radius: 3px;
			box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
			background: #fff;
			position: relative;
			overflow: hidden;

			.cover {
				position: absolute;
				width: 100%;
				height: 100%;
				z-index: 10;
			}

			.el-image {
				width: 100%;
				height: 60px;
				background: #000;
			}

			img {
				width: 100px;
				height: 60px;
				z-index: 99;
			}

			.atlas {
				width: 100px;
				height: 60px;
				background: #000;
				overflow: hidden;

				&-2 .img {
					display: inline-block;
					width: 50px;
					height: 60px;
				}

				&-3,
				&-4 {
					display: flex;
					flex-wrap: wrap;

					.img {
						width: 50px;
						height: 30px;

						img {
							width: 50px;
							height: 30px;
						}
					}
				}
			}

			.desc {
				width: 100px;
				background: #fff;

				.duration {
					font-size: 12px;
					color: #999;
					padding: 0 5px;

					svg {
						margin-right: 3px;
					}
				}

				.title {
					line-height: 20px;
					font-size: 12px;
					width: 100%;
					margin: 0 3px;
					overflow: hidden;
					white-space: nowrap;
				}
			}
		}
	}
}
</style>
