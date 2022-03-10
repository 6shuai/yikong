<template>
    <div class="package-list-wrap">
        <h3 class="clearfix">
            {{
                versionType == 2
                    ? "线上版本"
                    : versionType == 1
                    ? "测试版本"
                    : "开发版本"
            }}
            <el-input
                class="w200 game-desc-search"
                prefix-icon="el-icon-search"
                clearable
                v-model="params.description"
                placeholder="发布信息"
                size="small"
                @input="updateData"
            ></el-input>
        </h3>
        <el-scrollbar
            v-loading="dataLoading"
            :class="{ 'package-scrollbar': resData.length > 3 }"
        >
            <div v-if="resData.length">
                <el-card
                    v-for="(item, index) in resData"
                    :key="index"
                    class="type-card"
                >
                    <el-row class="version-list">
                        <el-col :span="4" class="version">
                            <div class="version-wrap">
                                <p>版本号</p>
                                <p>{{ item.overallVersion || "-" }}</p>
                            </div>
                        </el-col>
                        <el-col :span="16">
                            <el-form label-width="120px">
                                <el-form-item label="发布时间">
                                    <span>{{
                                        formatTime(item.releaseTime)
                                    }}</span>
                                </el-form-item>
                                <el-form-item label="发布信息">
                                    <span>{{ item.description }}</span>
                                </el-form-item>
                                <el-form-item label="手机端版本">
                                    <span>{{ item.mobileVersion || "-" }}</span>
                                </el-form-item>
                                <el-form-item label="大屏端版本">
                                    <span>{{ item.screenVersion || "-" }}</span>
                                </el-form-item>
                            </el-form>
                        </el-col>
                        <el-col :span="4" v-if="gameDetail.editPackage">
                            <p v-if="item.versionType == 1">
                                <el-button
                                    size="small"
                                    type="primary"
                                    @click.stop="handleOnline(item.id, index)"
                                    :loading="onlineLoading[index]"
                                    >上线</el-button
                                >
                            </p>
                            <div v-if="item.versionType == 0">
                                <p>
                                    <el-button
                                        size="small"
                                        @click.stop="
                                            handleSubmitTest(item.id, index)
                                        "
                                        :loading="submitTestLoading[index]"
                                        type="primary"
                                        >提交测试</el-button
                                    >
                                </p>
                            </div>
                            <br />
                            <el-popover
                                placement="top"
                                :ref="'del' + item.id"
                                width="200"
                            >
                                <p>此操作将删除此游戏包, 是否继续?</p>
                                <div style="text-align: right; margin: 0">
                                    <el-button
                                        size="mini"
                                        type="text"
                                        @click="
                                            $refs['del' + item.id][0].doClose()
                                        "
                                        >取消</el-button
                                    >
                                    <el-button
                                        type="primary"
                                        size="mini"
                                        :loading="delLoading[index]"
                                        @click="handleDelete(item.id, 0, index)"
                                        >确定</el-button
                                    >
                                </div>
                                <el-button
                                    type="info"
                                    size="small"
                                    slot="reference"
                                    >删除</el-button
                                >
                            </el-popover>
                        </el-col>
                    </el-row>
                </el-card>

                <el-pagination
                    :hide-on-single-page="true"
                    background
                    layout="total, prev, pager, next, sizes"
                    :page-sizes="[40, 80, 100]"
                    :current-page="Number(params.pageNo)"
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :total="totalCount"
                >
                </el-pagination>
            </div>
            <div v-else>
                <el-row class="version-list">
                    <el-col :span="20">
                        <div v-if="versionType == 0" class="no-version">
                            暂无开发版本,请上传游戏包。
                        </div>
                        <div v-else-if="versionType == 1" class="no-version">
                            暂无测试版本
                        </div>
                        <div v-else-if="versionType == 2" class="no-version">
                            暂无线上版本
                        </div>
                    </el-col>
                </el-row>
            </div>
        </el-scrollbar>
    </div>
</template>
<script>
import { timeDisposeTool } from "@/mixins";
import {
    packageList,
    packageSubmitTest,
    packageOnline,
    packageDelete,
} from "@/api/game";
export default {
    mixins: [timeDisposeTool],
    props: ["versionType"],
    data() {
        return {
            params: {
                pageNo: 1,
                pageSize: 40,
            },
            dataLoading: false,
            totalCount: 0,
            resData: [],
            submitTestLoading: [], //提交测试btn loading
            onlineLoading: [],     //上线btn  loading
            delLoading: [],
        };
    },
    computed: {
        gameDetail() {
            return this.$store.state.game.details;
        },
    },
    methods: {
        packageListLoad(){
            this.params = {
                pageNo: 1,
                pageSize: 40,
                applicationId: this.$route.params.id,
                versionType: this.versionType,
            };
            this.init();
        },

        init() {
            this.dataLoading = true;
            packageList(this.params).then((res) => {
                this.dataLoading = false;
                if (res.code === this.$successCode) {
                    this.resData = res.obj.list;
                    this.totalCount = res.obj.totalRecords;
                }
            });
        },

        //提交测试
        handleSubmitTest(id, index) {
            this.$set(this.submitTestLoading, index, true);
            packageSubmitTest(id).then((res) => {
                this.$set(this.submitTestLoading, index, false);
                if (res.code === this.$successCode) {
                    this.$message.success("提交测试成功~");
                    this.init();
                }
            });
        },

        //上线
        handleOnline(id, index) {
            this.$set(this.onlineLoading, index, true);
            packageOnline(id).then((res) => {
                this.$set(this.onlineLoading, index, false);
                if (res.code === this.$successCode) {
                    this.$message.success("上线成功~");
                    this.init();
                }
            });
        },

        //删除游戏包
        handleDelete(id, isConfirm = 0, index) {
            this.$set(this.delLoading, index, true);
            let data = `?id=${id}&isConfirm=${isConfirm}`;
            packageDelete(data).then((res) => {
                this.$set(this.delLoading, index, false);
                this.$refs["del" + id][0].doClose();
                if (res.code === 404) {
                    this.$confirm(res.message, "提示", {
                        confirmButtonText: "确定",
                        cancelButtonText: "取消",
                        type: "warning",
                    })
                        .then(() => {
                            this.handleDelete(id, 1, index);
                        })
                        .catch(() => {});
                } else if (res.code === this.$successCode) {
                    this.$message.success('删除成功~');
                    this.resData.splice(index, 1);
                }
            });
        },

        //分页
        handleCurrentChange(page) {
            this.params.pageNo = page;
            this.init();
        },

        //每页条数
        handleSizeChange(size) {
            this.params.pageSize = size;
            this.init();
        },

        //刷新版本列表   或 搜索
        updateData() {
            this.params.pageNo = 1;
            this.init();
        },
    },
};
</script>

<style lang="scss">
.game-desc-search {
    float: right;
}
</style>