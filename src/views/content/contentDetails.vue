<template>
    <el-card class="template-card content-details">
        <page-header 
            :title="resData.displayName"
            backPath="/content/index"
        >
            <div slot="headerRight">
                <span 
                    v-if="resData.authorize"
                    @click="$refs.pagePermission.showPermission({contentId: $route.params.id})"
                    ><i class="el-icon-lock" title="授权"></i>授权
                    <el-divider direction="vertical"></el-divider>
                </span>
                <span 
                    v-if="resData.edit"
                    @click="editContent">
                    <i class="el-icon-edit" title="编辑"></i>编辑
                    <el-divider direction="vertical"></el-divider>
                </span>
                <span 
                    @click="collectContent" 
                    v-if="!resData.isFavorite">
                    <i class="el-icon-star-off" title="收藏"></i>收藏
                </span>
                <span 
                    @click="collectContent" 
                    v-else>
                    <i class="el-icon-star-on" title="取消收藏"></i>取消收藏
                </span>
                <el-divider direction="vertical"></el-divider>
                <span 
                    v-if="resData.deleteRight"
                    @click="deleteContent">
                    <i class="el-icon-delete" title="删除"></i>删除
                </span>
            </div>
        </page-header>

        <el-tabs 
            v-model="tabActiveName" 
            class="mb20"
            @tab-click="handleTab"
        >
            <el-tab-pane label="基本信息" :name="`/content/details/${$route.params.id}`"></el-tab-pane>
            <!-- 监播数据 -->
            <el-tab-pane label="次数统计" :name="`/content/details/${$route.params.id}/count`"></el-tab-pane>
            <el-tab-pane label="时间统计" :name="`/content/details/${$route.params.id}/time`"></el-tab-pane>
        </el-tabs>     
    
        <div class="content" v-show="tabActiveName === `/content/details/${$route.params.id}`">
            <div class="resource-wrap clearfix">
                <div class="left">
                    <content-preview ref="contentPreview"></content-preview>
                </div>
                <div class="right">
                    <el-form 
                        label-width="90px"
                    >
                        <el-form-item label="名称">
                            <span>{{resData.displayName}}</span>
                        </el-form-item>
                        <el-form-item label="创建时间">
                            <span>{{resData.creationTime}}</span>
                        </el-form-item>
                        <el-form-item label="品牌">
                            <span>{{resData.brandName}}</span>
                        </el-form-item>
                        <el-form-item label="分辨率">
                            <span v-if="resData.width">{{resData.width}} x {{resData.height}}</span>
                            <span v-else> - </span>
                        </el-form-item>
                        <el-form-item label="比例">
                            <span v-if="resData.aspectRatioWidth">{{resData.aspectRatioWidth}} : {{resData.aspectRatioHeight}}</span>
                            <span v-else> - </span>
                        </el-form-item>
                        <el-form-item label="文件大小">
                            <span>{{resData.size ? fileSize(resData.size) : ' - '}}MB</span>
                        </el-form-item>
                        <el-form-item label="数据统计" v-if="resData.statisics && resData.contentTypeId == 3">
                            <el-link
                                @click="handleStatistics"
                                type="primary"
                                >游戏数据统计</el-link
                            >
                        </el-form-item>
                        <el-form-item label="优惠券统计:" v-if="resData.statisics && resData.contentTypeId == 3">
                            <el-link type="primary" @click="handleCouponStatistics">优惠券数据统计</el-link>
                        </el-form-item>
                    </el-form>
                </div>
            </div>
            <h2 class="info-title mt20 mb20">播放限制
                <el-button 
                    v-if="resData.editPlaybackRestriction"
                    class="edit-btn" 
                    size="mini" 
                    icon="el-icon-edit" 
                    @click="editPlayimit"
                    type="primary">编辑
                </el-button>
            </h2>
            <div class="content-item play-limit">
                <ul>
                    <li class="t-header clearfix">
                        <span class="week">周期</span>
                        <span class="date">时段</span>
                        <span class="type">限制</span>
                    </li>
                    <li class="clearfix" v-for="item in resData.playbackRestrictionData" :key="item.id">
                        <span class="week">{{selectedDate(item.validDate)}}</span>
                        <span class="date">{{item.beginTimeFormat}} - {{item.endTimeFormat}}</span>
                        <span class="type">{{item.rule==1 ? '限制播放' : '禁止播放'}}</span>
                    </li>
                    <li class="no-data" v-if="resData.playbackRestrictionData && !resData.playbackRestrictionData.length">暂无播放限制~</li>
                </ul>
            </div>

            <h2 class="info-title mt20 mb20">播放计划 
                <el-button 
                    v-if="resData.editPlayPlan"
                    class="edit-btn" 
                    size="mini" 
                    icon="el-icon-edit" 
                    @click="editPlan"
                    type="primary">编辑
                </el-button>
            </h2>
            <div class="content-item play-plan">
                <el-form 
                    label-width="100px"
                >
                    <el-form-item label="计划开始">
                        <span>{{playPlanData.beginDateFormat || '-'}}</span>
                    </el-form-item>
                    <el-form-item label="计划结束">
                        <span>{{playPlanData.endDateFormat || '-'}}</span>
                    </el-form-item>
                    <el-form-item label="计划时长" v-if="playPlanData.planType==2">
                        <span>{{playPlanData.targetLength}}秒</span>
                    </el-form-item>
                    <el-form-item label="已播放时长" v-if="playPlanData.planType==2">
                        <span>{{playPlanData.currentLength}}秒</span>
                    </el-form-item>
                    <el-form-item label="计划曝光次数" v-if="playPlanData.planType==1">
                        <span>{{playPlanData.targetTimes}}次</span>
                    </el-form-item>
                    <el-form-item label="已曝光次数" v-if="playPlanData.planType==1">
                        <span>{{playPlanData.currentTimes}}次</span>
                    </el-form-item>
                </el-form>
            </div>

            <h2 class="info-title mt20 mb20">时间轴</h2>
            <div class="content-item timeline">
                <ul>
                    <li v-for="item in resData.timelineContainerData" :key="item.id">
                        <div class="t-content">
                            <div v-if="resData.jumpToTimeline" class="title" @click="$router.push(`/timeline/details/${item.id}`)">{{item.displayName}}</div>
                            <div v-else class="title">{{item.displayName}}</div>
                            <!-- <div class="play-limit">
                                <span class="limit-item">每日曝光 <span class="highlight">12次</span></span>
                                <span class="limit-item">每日时长 <span class="highlight">3分40秒</span></span>
                            </div> -->
                        </div>
                        <div class="right-icon">
                            <font-awesome-icon :icon="['fas', 'external-link-alt']" />
                        </div>
                    </li>
                </ul>
            </div>

        </div>

        <router-view v-if="tabActiveName != `/content/details/${$route.params.id}`"></router-view>

        <!-- 编辑播放限制 -->
        <play-limit 
            ref="playLimit" 
            :weekData="weekData" 
            :data="resData.playbackRestrictionData"
            @updateDetail="initDetail"
        ></play-limit>

        <!-- 编辑播放计划 -->
        <play-plan 
            ref="playPlan"
            @updateDetail="initDetail"
        ></play-plan>

        <!-- 授权 -->
        <permission 
            ref="pagePermission" 
            :premissionApi="premissionApi"
        ></permission>


        
    </el-card>
</template>
<script>
import { contentDelete, contentAuthority, contentAuthorityUpdate, contentAuthorityDelete } from '@/api/content';
import { contentDetailData, contentIsFavorite } from '@/views/content/mixins';
import PlayLimit from '@/views/content/components/PlayLimit';
import PlayPlan from '@/views/content/components/PlayPlan';
import ContentPreview from '@/views/content/components/ContentPreview';
import Permission from '@/components/permission';
import PageHeader from '@/components/PageHeader';
export default {
    mixins: [contentDetailData, contentIsFavorite],
    data(){
        return {
            weekData: [
                { id: 1, label: '周一' },
                { id: 2, label: '周二' },
                { id: 3, label: '周三' },
                { id: 4, label: '周四' },
                { id: 5, label: '周五' },
                { id: 6, label: '周六' },
                { id: 7, label: '周日' }
            ],
            premissionApi: {
                list: contentAuthority,
                update: contentAuthorityUpdate,
                delete: contentAuthorityDelete
            },
            tabActiveName: `/content/details/${this.$route.params.id}`
        }
    },
    computed: {
        playPlanData(){
            return this.resData.playPlanData && this.resData.playPlanData.length ? this.resData.playPlanData[0] : {};
        }
    },
    mounted() {
        this.tabActiveName = this.$route.path
        this.hasPagePerm('Content').then(res => {
            if(res){
                new Promise((resolve) => {
                    this.initDetail(resolve);
                }).then(res => {
                    this.$refs.contentPreview.contentPreviewData(this.resData.oldContents ? this.resData.oldContents : this.resData, 'detail');
                })
            }
        })
    },
    methods: {
        //编辑内容
        editContent(){
            this.$router.push(`/content/edit/${this.$route.params.id}`)
        },

        //删除内容
        deleteContent(){
            this.$confirm('此操作将删除该内容 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
                center: true
            }).then(() => {
                contentDelete(this.$route.params.id).then(res => {
                    if(res.code === this.$successCode){
                        this.$message.success({
                            message: '删除成功~',
                            duration: 1000,
                            onClose: () => {
                                this.$router.push('/content/index');
                            }
                        });
                    }
                })
            })
        },

        //收藏
        collectContent(){
            let p = {
                isFavorite: this.resData.isFavorite ? 0 : 1,
                contentId: this.resData.id,
                userId: this.$store.state.user.loginData.id
            }
            let s = `?isFavorite=${p.isFavorite}&contentId=${p.contentId}&userId=${p.userId}`;
            new Promise((resolve) => {
                this.handleFavorite(s, resolve);
            }).then(res => {
                this.$set(this.resData, 'isFavorite', p.isFavorite);
            })
        },

        //显示编辑播放限制
        editPlayimit(){
            this.$refs.playLimit.showDialog();
        },

        //显示编辑播放计划
        editPlan(){
            this.$refs.playPlan.showDialog();
            if(this.resData.playPlanData.length){
                let p = JSON.parse(JSON.stringify(this.resData.playPlanData[0]));
                let data = {
                    id: p.id,
                    beginDate: p.beginDateFormat,
                    endDate: p.endDateFormat,
                    planType: p.planType,
                    targetLength: p.targetLength,
                    targetTimes: p.targetTimes
                }
                this.$refs.playPlan.planParams = data;
                this.$refs.playPlan.dateData = [data.beginDate, data.endDate];
            }
        },

        fileSize(size){
            return (size / 1024  / 1024).toFixed(2);
        },

        //播放限制列表 已选中的日期 
        selectedDate(data){
            data = String(data);
            let arr = data.split("");
            let weekArr = [];
            for(let i = 0; i< arr.length; i++){
                if(arr[i] == 2){
                    weekArr.push(this.weekData[i].label);
                }
            }
            return weekArr.join('、');
        },

        //数据统计
        handleStatistics(){
            this.$router.push({
                path: '/game/statisics',
                query: {
                    source: 'content',
                    contentId: this.$route.params.id
                }
            });
        },

        //优惠券数据统计
        handleCouponStatistics(){
            this.$router.push({
                path: '/game/couponStatisics',
                query: {
                    source: 'content',
                    contentId: this.$route.params.id
                }
            });
        },

        //切换tab
        handleTab(){
            this.$router.push(this.tabActiveName)
        }
    },
    watch:{
        $route(to, from) {
            this.tabActiveName = to.path
        }
    },
    components: {
        PlayLimit,
        PlayPlan,
        ContentPreview,
        Permission,
        PageHeader
    }
}
</script>
<style lang="scss" scope>
    @import '../../styles/variables.scss';
    @import './style/content-details.scss';
</style>