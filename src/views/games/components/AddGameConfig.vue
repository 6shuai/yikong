<template>
    <el-dialog
        class="add-game-data"
        :title="contentParams.id ? '编辑游戏数据' : '创建游戏数据'"
        :visible.sync="dialogVisible"
        width="600px"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
    >
        <el-form
            v-loading="loading"
            label-width="160px"
            ref="addGameForm"
            :model="contentParams"
            :rules="placeRules"
        >
            <el-form-item label="名称" prop="displayName">
                <el-input
                    v-model="contentParams.displayName"
                    placeholder="名称"
                ></el-input>
            </el-form-item>
            <el-form-item label="所属品牌" prop="contentOwner">
                <el-select
                    v-model="contentParams.contentOwner"
                    filterable
                    placeholder="请选择所属品牌"
                    style="width: 100%"
                >
                    <el-option
                        v-for="item in groupData"
                        :key="item.id"
                        :label="item.displayName"
                        :value="item.id"
                    >
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="展示图片" prop="image">
                <upload-img
                    :imgList="contentParams.image"
                    @uploadImgPath="$set(contentParams, 'image', $event); $set(contentParams, 'newUpload ', 1)"
                ></upload-img>
            </el-form-item>
            <div v-if="contentParams.contentType !== 4">
                <el-form-item label="分辨率(像素)" class="is-required">
                    <el-row>
                        <el-col :span="11">
                            <el-form-item prop="width">
                                <el-input
                                    type="number"
                                    :min="1"
                                    v-model="contentParams.width"
                                    placeholder="宽"
                                ></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="2" style="text-align: center">
                            <span>x</span>
                        </el-col>
                        <el-col :span="11">
                            <el-form-item prop="height">
                                <el-input
                                    type="number"
                                    :min="1"
                                    v-model="contentParams.height"
                                    placeholder="高"
                                ></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form-item>
                <el-form-item label="分辨率(宽高比)" prop="aspectRatio">
                    <el-select
                        v-model="contentParams.aspectRatio"
                        placeholder="请选择分辨率(宽高比)"
                        style="width: 100%"
                    >
                        <el-option
                            v-for="item in aspectRatioData"
                            :key="item.id"
                            :label="item.width + ' : ' + item.height"
                            :value="item.id"
                        >
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="游戏包" prop="packageId">
                    <el-cascader 
                        :key="isResouceShow"
                        v-model="contentParams.packageId"
                        :options="cascaderOptions" 
                        :show-all-levels="false"
                        :props="cascaderProps"
                        style="width: 100%"
                    >
                        <template slot-scope="{ node, data }">
                            <span>{{ data.overallVersion }}</span>
                            <span> {{ data.description }} </span>
                        </template>
                    </el-cascader>

                </el-form-item>
                <el-form-item label="游戏配置" prop="configId">
                    <el-select
                        filterable
                        v-model="contentParams.configId"
                        placeholder="请选择游戏配置"
                        style="width: 100%"
                    >
                        <el-option
                            v-for="item in configData"
                            :key="item.id"
                            :label="item.displayName"
                            :value="item.id"
                        >
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="插播广告">
                    <adver-list 
                        @selected="$set(contentParams, 'spotId', $event)" 
                        :spotId="contentParams.spotId">
                    </adver-list>
                </el-form-item>

                <el-form-item label="活动">
                    <activity-list 
                        @selected="$set(contentParams, 'promotionId', $event)"
                        :promotionId="contentParams.promotionId"
                    ></activity-list>
                </el-form-item>
            </div>
        </el-form>

        <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" v-loading="btnLoading" @click="addGameData">确 定</el-button>
        </span>
    </el-dialog>
</template>

<script>
import { getOrganizationList } from "@/mixins";
import { getAspectRatio } from "@/views/screen/mixins";
import {
    packageList,
    gameDataConfigList,
    gameDataCreated,
    gameDataDetail,
    gameActivity
} from "@/api/game";
import UploadImg from "@/components/Upload/UploadImg";
import AdverList from './AdverList';
import ActivityList from './ActivityList';

export default {
    mixins: [getOrganizationList, getAspectRatio],
    data() {
        return {
            isResouceShow: 0,    //解决 el-cascader组件   Cannot read property 'level' of null"
            dialogVisible: false,
            loading: false,
            contentParams: {},
            packageData: [],
            configData: [],
            btnLoading: false,
            placeRules: {
                displayName: [
                    { required: true, trigger: "blur", message: "请输入名称~" },
                ],
                contentOwner: [
                    {
                        required: true,
                        trigger: "change",
                        message: "请选择所属品牌~",
                    },
                ],
                image: [
                    {
                        required: true,
                        trigger: "change",
                        message: "请上传一张展示图片~",
                    },
                ],
                width: [
                    { required: true, trigger: "blur", message: "请输入宽~" },
                ],
                height: [
                    { required: true, trigger: "blur", message: "请输入高~" },
                ],
                aspectRatio: [
                    {
                        required: true,
                        trigger: "change",
                        message: "请选择分辨率(宽高比)~",
                    },
                ],
                packageId: [
                    {
                        required: true,
                        trigger: "change",
                        message: "请选择游戏包~",
                    },
                ],
                size: [
                    {
                        required: true,
                        trigger: "blur",
                        message: "请输入游戏包大小~",
                    },
                ],
            },
            cascaderOptions: [
                {
                    id: 2,
                    description: '线上版本',
                },
                {
                    id: 1,
                    description: '测试版本',
                },
                {
                    id: 0,
                    description: '开发版本',
                }
            ],
            cascaderProps: {
                expandTrigger: 'hover',
                emitPath: false,
                value: "id",
                label: "displayName"
            },
        };
    },
    methods: {
        showDialog(id) {
            this.dialogVisible = true;
            this.contentParams = { newUpload: 0 };

            this.$nextTick(() => {
                this.$refs['addGameForm'].clearValidate();
            })

            let data = {
                applicationId: this.$route.params.id
            };

            gameDataConfigList(data).then((res) => {
                if (res.code === this.$successCode) {
                    this.configData = res.obj;
                }
            });

            //获取详情
            if (id) {
                this.loading = true;
                this.getDetail(id);
            }

            this.cascaderOptions.forEach((item, index) => {
                // item.children = ;
                this.getPackageList(item.id).then((res) => {
                    res.forEach(item => {
                        item.displayName = item.overallVersion + '-' + item.description;
                        ++this.isResouceShow;
                    })
                    this.$set(this.cascaderOptions[index], 'children', res);
                })
            })

        },

        getPackageList(type){
            return new Promise(resolve => {
                let data = {
                    pageSize: 9999,
                    applicationId: this.$route.params.id,
                    versionType: type
                };
                packageList(data).then((res) => {
                    if (res.code === this.$successCode) {
                        resolve(res.obj.list);
                    }
                });
            })
        },

        getDetail(id) {
            gameDataDetail(id).then((res) => {
                this.loading = false;
                if (res.code === this.$successCode && res.obj) {
                    this.contentParams = {
                        ...this.contentParams,
                        ...res.obj,
                        id:  res.obj.contentId
                    }
                }
            });
        },

        //创建 或 修改游戏装配数据
        addGameData() {
            this.$refs.addGameForm.validate((valid) => {
                if (valid) {
                    this.btnLoading = true;
                    gameDataCreated(this.contentParams).then((res) => {
                        this.btnLoading = false;
                        if (res.code === this.$successCode) {
                            this.$message.success("创建成功~");
                            this.dialogVisible = false;
                            this.$emit('createdSuccess');
                        }
                    });
                }
            });
        }
    },
    components: {
        UploadImg,
        AdverList,
        ActivityList
    },
};
</script>

<style lang="scss" scope>
.add-game-data {
    .el-form-item__content {
        // width: 200px;
    }
}
</style>