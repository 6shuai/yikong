<template>
    <el-card class="template-card content-details">
        <div class="header-wrap detail-header-wrap mb30">
            <el-page-header @back="$router.go(-1)">
            </el-page-header>
            <div class="header-right">
                <span @click="editContent"><i class="el-icon-edit" title="编辑"></i>编辑</span>
                <el-divider direction="vertical"></el-divider>
                <span @click="collectContent" v-if="!resData.isFavorite"><i class="el-icon-star-off" title="收藏"></i>收藏</span>
                <span @click="collectContent" v-else><i class="el-icon-star-on" title="取消收藏"></i>取消收藏</span>
                <el-divider direction="vertical"></el-divider>
                <span @click="deleteContent"><i class="el-icon-delete" title="删除"></i>删除</span>
            </div>
            <div class="title">
                <h2>{{resData.displayName}}</h2>
            </div>
        </div>
        <div class="content">
            <div class="resource-wrap clearfix">
                <div class="left">
                    <el-image v-if="resData.contentTypeId == 1" :src="resData.contentPath" :preview-src-list="[resData.contentPath]"></el-image>
                    <video v-if="resData.contentTypeId == 2" :src="resData.contentPath" controls="controls"></video>
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
                            <span>{{resData.contentOwnerName}}</span>
                        </el-form-item>
                        <el-form-item label="分辨率">
                            <span>{{resData.width}} x {{resData.height}}</span>
                        </el-form-item>
                        <el-form-item label="比例">
                            <span>{{resData.aspectRatioWidth}} : {{resData.aspectRatioHeight}}</span>
                        </el-form-item>
                        <el-form-item label="文件大小">
                            <span>{{fileSize(resData.size)}}MB</span>
                        </el-form-item>
                    </el-form>
                </div>
            </div>
            <h2 class="info-title mt20 mb20">播放限制
                <el-button 
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
                        <span>{{playPlanData.targetLength}}</span>
                    </el-form-item>
                    <el-form-item label="已播放时长" v-if="playPlanData.planType==2">
                        <span>{{playPlanData.currentLength}}</span>
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
                    <li>
                        <div class="t-content">
                            <div class="title">跳一跳夏季赛</div>
                            <div class="play-limit">
                                <span class="limit-item">每日曝光 <span class="highlight">12次</span></span>
                                <span class="limit-item">每日时长 <span class="highlight">3分40秒</span></span>
                            </div>
                        </div>
                        <div class="right-icon">
                            <font-awesome-icon :icon="['fas', 'external-link-alt']" />
                        </div>
                    </li>
                </ul>
            </div>

        </div>

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
        
    </el-card>
</template>
<script>
import { contentDelete } from '@/api/content';
import { contentDetailData, contentIsFavorite } from '@/views/content/mixins';
import PlayLimit from '@/views/content/components/PlayLimit';
import PlayPlan from '@/views/content/components/PlayPlan';
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
        }
    },
    computed: {
        playPlanData(){
            return this.resData.playPlanData && this.resData.playPlanData.length ? this.resData.playPlanData[0] : {};
        }
    },
    mounted() {
        this.initDetail();
    },
    methods: {
        //编辑资源
        editContent(){
            this.$router.push(`/content/edit/${this.$route.params.id}`)
        },

        //删除资源
        deleteContent(){
            this.$confirm('此操作将删除该资源 是否继续?', '提示', {
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
            this.$refs.playLimit.showPlayLimit = true;
        },

        //显示编辑播放计划
        editPlan(){
            this.$refs.playPlan.showPlayPlan = true;
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
        }
    },
    components: {
        PlayLimit,
        PlayPlan
    }
}
</script>
<style lang="scss" scope>
    @import '../../styles/variables.scss';
    @import './style/content-details.scss';
</style>