<template>
    <el-card class="template-card content-details">
        <div class="header-wrap detail-header-wrap mb30">
            <el-page-header @back="$router.go(-1)">
            </el-page-header>
            <div class="header-right">
                <span @click="editScreen"><i class="el-icon-edit" title="编辑"></i>编辑</span>
                <el-divider direction="vertical"></el-divider>
                <span @click="collectScreen" v-if="!resData.isFavorite"><i class="el-icon-star-off" title="收藏"></i>收藏</span>
                <span @click="collectScreen" v-else><i class="el-icon-star-on" title="取消收藏"></i>取消收藏</span>
                <el-divider direction="vertical"></el-divider>
                <span @click="deletePlace"><i class="el-icon-delete" title="删除"></i>删除</span>
            </div>
            <div class="title">
                <h2>{{resData.displayName}}</h2>
            </div>
        </div>
        <div class="content">
            <div class="resource-wrap clearfix">
                <div class="left">
                    <img src="https://game.xfengjing.com/app/upload/market/photo/SNeDQguJTPQdWASQB0FuGF3xk5sjkooJZaAPxmAB.jpeg">
                </div>
                <div class="right">
                    <el-form 
                        label-width="90px"
                    >
                        <el-form-item label="名称">
                            <span>名称名称</span>
                        </el-form-item>
                        <el-form-item label="创建时间">
                            <span>2020-05-14 15:55</span>
                        </el-form-item>
                        <el-form-item label="品牌">
                            <span>万达</span>
                        </el-form-item>
                        <el-form-item label="分辨率">
                            <span>1920 x 1080</span>
                        </el-form-item>
                        <el-form-item label="比例">
                            <span>16 : 9</span>
                        </el-form-item>
                        <el-form-item label="文件大小">
                            <span>3.0MB</span>
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
                    <li class="clearfix" v-for="item in 4" :key="item">
                        <span class="week">周一、周五</span>
                        <span class="date">00:00-23:59</span>
                        <span class="type">禁止播放</span>
                    </li>
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
                        <span>2019-04-10</span>
                    </el-form-item>
                    <el-form-item label="计划结束">
                        <span>2020-05-14</span>
                    </el-form-item>
                    <el-form-item label="计划时长">
                        <span>248分32秒</span>
                    </el-form-item>
                    <el-form-item label="已播放时长">
                        <span>248分32秒</span>
                    </el-form-item>
                    <el-form-item label="计划曝光次数">
                        <span>200次</span>
                    </el-form-item>
                    <el-form-item label="已曝光次数">
                        <span>50次</span>
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
        <el-dialog
            width="720px"
            title="播放限制"
            class="play-limit-edit"
            :visible.sync="showPlayLimit"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            @close="showPlayLimit=false"
            append-to-body>
            <el-form label-width="80px">
                <el-form-item label="周期">
                    <el-checkbox-group size="small" v-model="limitParams.checkboxGroup">
                        <el-checkbox-button v-for="item in weekData" :label="item.label" :key="item.id">{{item.label}}</el-checkbox-button>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item label="时段">
                    <el-time-select
                        placeholder="起始时间"
                        v-model="startTime"
                        :picker-options="{
                            start: '05:00',
                            step: '00:15',
                            end: '23:30'
                        }">
                    </el-time-select>
                    <el-time-select
                        placeholder="结束时间"
                        v-model="endTime"
                        :picker-options="{
                            start: '05:00',
                            step: '00:15',
                            end: '23:30',
                            minTime: startTime
                        }">
                    </el-time-select>
                </el-form-item>
                <el-form-item label="规则">
                    <el-radio-group v-model="radio1">
                        <el-radio-button label="限制播放"></el-radio-button>
                        <el-radio-button label="禁止播放"></el-radio-button>
                    </el-radio-group>
                </el-form-item>
                <el-button class="created-btn" type="primary" size="small">添加规则</el-button>
                <el-form-item label="当前设置">
                    <ul>
                        <li class="t-header clearfix">
                            <span class="week">周期</span>
                            <span class="date">时段</span>
                            <span class="type">限制</span>
                            <span class="del">操作</span>
                        </li>
                        <li class="clearfix" v-for="item in 4" :key="item">
                            <span class="week">周一、周五</span>
                            <span class="date">00:00-23:59</span>
                            <span class="type">禁止播放</span>
                            <span class="del"><font-awesome-icon :icon="['fas', 'trash-alt']" /></span>
                        </li>
                    </ul>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="showPlayLimit = false">取 消</el-button>
                <el-button type="primary" @click="showPlayLimit = false">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 编辑播放计划 -->
        <el-dialog
            width="400px"
            title="播放计划"
            :visible.sync="showPlayPlan"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            @close="showPlayPlan=false"
            append-to-body>
            <el-form label-width="80px">
                <el-form-item label="计划开始">
                    <el-date-picker
                        v-model="planParams.date"
                        type="date"
                        placeholder="选择日期">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="计划结束">
                    <el-date-picker
                        v-model="planParams.date"
                        type="date"
                        placeholder="选择日期">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="曝光次数">
                    <el-input 
                        style="width: 220px"
                        v-model="planParams.date" 
                        type="number">
                        <template slot="append">次</template>
                    </el-input>
                </el-form-item>
                <el-form-item label="时长">
                    <el-input 
                        style="width: 220px"
                        v-model="planParams.date" 
                        type="number">
                        <template slot="append">分钟</template>
                    </el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="showPlayPlan = false">取 消</el-button>
                <el-button type="primary" @click="showPlayPlan = false">确 定</el-button>
            </span>
        </el-dialog>

    </el-card>
</template>
<script>
import { screenDelete } from '@/api/screen';
import { getScreenDetail, screenIsFavorite } from '@/views/screen/mixins';
export default {
    mixins: [getScreenDetail, screenIsFavorite],
    data(){
        return {
            showPlayLimit: false,               //播放限制 编辑窗口
            limitParams: {                      //播放限制 编辑参数
                checkboxGroup: [],
            },
            weekData: [
                { id: 1, label: '周一' },
                { id: 2, label: '周二' },
                { id: 3, label: '周三' },
                { id: 4, label: '周四' },
                { id: 5, label: '周五' },
                { id: 6, label: '周六' },
                { id: 7, label: '周日' }
            ],
            showPlayPlan: false,                  //播放计划  编辑窗口
            planParams: {},                       //播放计划  编辑参数
        }
    },
    mounted() {
        // this.initDetail();
    },
    methods: {
        //编辑场所
        editScreen(){
            this.$router.push(`/content/edit/${this.$route.params.id}`)
        },

        //删除场所
        deletePlace(){
            this.$confirm('此操作将删除该屏幕 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
                center: true
            }).then(() => {
                // screenDelete(this.$route.params.id).then(res => {
                //     if(res.code === this.$successCode){
                //         this.$message.success({
                //             message: '删除成功~',
                //             duration: 1000,
                //             onClose: () => {
                //                 this.$router.push('/screen/index');
                //             }
                //         });
                //     }
                // })
            })
        },

        //收藏
        collectScreen(){
            // let p = {
            //     isFavorite: this.resData.isFavorite ? 0 : 1,
            //     screenId: this.resData.id,
            //     userId: this.$store.state.user.loginData.id
            // }
            // let s = `?isFavorite=${p.isFavorite}&screenId=${p.screenId}&userId=${p.userId}`;
            // new Promise((resolve) => {
            //     this.handleFavorite(s, resolve);
            // }).then(res => {
            //     this.$set(this.resData, 'isFavorite', p.isFavorite);
            // })
        },

        //显示编辑播放限制
        editPlayimit(){
            this.showPlayLimit = true;
        },

        //显示编辑播放计划
        editPlan(){
            this.showPlayPlan = true;
        }
    }
}
</script>
<style lang="scss" scope>
    @import '../../styles/variables.scss';
    @import './style/content-details.scss';
</style>