<template>
    <el-card
        class="template-card content-details add-game-data"
        v-loading="detailLoading"
    >   
        <el-page-header @back="$router.push(`/games/details/${$route.params.id}/list`)">
            <div slot="content">
                {{$route.params.gameId ? '编辑游戏数据' : '创建游戏数据'}}
            </div>
        </el-page-header>

        <div class="del-btn">
            <el-button 
                v-if="contentParams.id"
                type="danger"
                size="small"
                @click="handleDelete"
            >
                删除
            </el-button>
        </div>

        <el-tabs 
            class="mt30"
            v-model="currentActive" 
            @tab-click="tabsHandleClick"
            type="card"
        >
            <el-tab-pane 
                label="游戏信息" 
                :name="`/games/details/${$route.params.id}/gameData/${$route.params.gameId}`"
            >
            </el-tab-pane>
            <el-tab-pane 
                label="排行榜管理" 
                :name="`/games/details/${$route.params.id}/gameData/${$route.params.gameId}/rank`"
            >
            </el-tab-pane>
            <!-- <el-tab-pane 
                label="皮肤" 
                name="skin"
            >
            </el-tab-pane> -->
            <el-tab-pane 
                :disabled="!contentParams.spotId"
                label="插播广告" 
                :name="`/games/details/${$route.params.id}/gameData/${$route.params.gameId}/adver/${contentParams.spotId}`"
            >
            </el-tab-pane>
            <el-tab-pane 
                :disabled="!contentParams.promotionId"
                label="活动" 
                :name="`/games/details/${$route.params.id}/gameData/${$route.params.gameId}/activity/${contentParams.promotionId}`"
            >   
            </el-tab-pane>
        </el-tabs>

        <el-row 
            :gutter="10" 
            class="mt20"
            v-if="currentActive == `/games/details/${$route.params.id}/gameData/${$route.params.gameId}`"
        >
            <el-col :xs="24" :sm="24" :md="12">
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
                            @uploadImgPath="$set(contentParams, 'image', $event); $set(contentParams, 'newUpload', 1)"
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
                                @change="changePackage"
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
                                ref="adverList"
                                @selected="$set(contentParams, 'spotId', $event)" 
                                :spotId="contentParams.spotId">
                            </adver-list>
                            <div class="el-link-add-btn">
                                <el-link 
                                    type="primary"
                                    @click="$refs.gameAddCutinAdver.showDialog()"
                                >
                                    添加插播广告
                                </el-link>
                            </div>
                        </el-form-item>

                        <el-form-item label="活动">
                            <activity-list 
                                ref="activityList"
                                @selected="$set(contentParams, 'promotionId', $event)"
                                :promotionId="contentParams.promotionId"
                            ></activity-list>
                            <div class="el-link-add-btn">
                                <el-link 
                                    type="primary"
                                    @click="$refs.gameAddActivity.showDialog()"
                                >
                                    添加活动
                                </el-link>
                            </div>
                        </el-form-item>
                        <el-form-item label="">
                            <el-button 
                                type="primary" 
                                v-loading="btnLoading" 
                                @click="addGameData"
                            >
                                提 交
                            </el-button>
                        </el-form-item>
                    </div>
                </el-form>
            </el-col>
        </el-row>


        <router-view v-else></router-view>

        <!-- 添加插播广告 -->
        <game-add-cutin-adver 
            ref="gameAddCutinAdver"
            @handleCreatedCutinAdvCall="handleCreatedCutinAdvCall"
        ></game-add-cutin-adver>

        <!-- 添加活动 -->
        <game-add-activity 
            ref="gameAddActivity"
            @handleCreatedActivityCall="handleCreatedActivityCall"
        ></game-add-activity>

    </el-card>
</template>

<script>
import { getOrganizationList } from "@/mixins";
import { getAspectRatio } from "@/views/screen/mixins";
import {
    packageList,
    gameDataConfigList,
    gameDataCreated,
    gameDataDetail,
    gameDataDelete
} from "@/api/game";
import UploadImg from "@/components/Upload/UploadImg";
import AdverList from '../components/AdverList';
import ActivityList from '../components/ActivityList';
import GameAddCutinAdver from './components/GameAddCutinAdver';
import GameAddActivity from './components/GameAddActivity';

export default {
    mixins: [getOrganizationList, getAspectRatio],
    data() {
        return {
            currentActive: 'game',
            isResouceShow: 0,    //解决 el-cascader组件   Cannot read property 'level' of null"
            loading: false,
            contentParams: {},
            packageData: {},
            configData: [],
            detailLoading: false,
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
                ]
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
            }
        };
    },
    mounted() {
        this.currentActive = this.$route.path;
        this.init();
    },
    methods: {
        init() {
            this.packageData = {};
            this.contentParams = { newUpload: 0 };

            let data = {
                applicationId: this.$route.params.id
            };
            let id = this.$route.params.gameId;

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
            this.detailLoading = true;
            this.cascaderOptions.forEach((item, index) => {
                // item.children = ;
                this.getPackageList(item.id).then((res) => {
                    this.detailLoading = false;
                    res.forEach(item => {
                        item.displayName = item.overallVersion + '-' + item.description;
                        ++this.isResouceShow;

                        this.packageData[item.id] = item;
                    })
                    this.$set(this.cascaderOptions[index], 'children', res);
                })
            })

        },

        //游戏包列表
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

        //游戏详情
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
                            this.$router.go(-1);
                        }
                    });
                }
            });
        },

        //选择游戏包
        changePackage(){
            if(this.contentParams.packageId){
                let { mobileSize, screenSize } = this.packageData[this.contentParams.packageId];
                this.contentParams.size = mobileSize + screenSize;
            }
        },

        //deleteGame 删除游戏
        handleDelete(){
            this.$confirm('此操作将删除当前游戏, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
            }).then(() => {
                 gameDataDelete(this.$route.params.gameId).then((res) => {
                    if (res.code === this.$successCode) {
                        this.$message.success("删除成功~");
                        this.$router.go(-1);
                    }
                });
            }).catch((err) => {});
        },

        //添加插播广告成功回调
        handleCreatedCutinAdvCall(data){
            this.$refs.adverList.addCutinAdver(data);
        },

        //添加活动成功回调
        handleCreatedActivityCall(data){
            this.$refs.activityList.addActivity(data);
        },

        //选择tab
        tabsHandleClick(tab){
            this.currentActive = tab.name;
            this.$router.push(tab.name)
        }
    },
    components: {
        UploadImg,
        AdverList,
        ActivityList,
        GameAddCutinAdver,
        GameAddActivity
    },
};
</script>

<style lang="scss" scoped>
    .add-game-data{
        position: relative;
        .el-link-add-btn{
            position: absolute;
            right: -110px;
            top: 0;
            width: 100px;
            text-align: left;
        }

        .del-btn{
            position: absolute;
            right: 20px;
            top: 20px;
        }
    }
</style>