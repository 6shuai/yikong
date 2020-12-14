<template>
    <el-card class="game-add-wrap" v-loading="detailLoading">
        <el-page-header @back="$router.go(-1)">
            <div slot="content">
                {{$route.params.id ? '编辑活动' : '创建活动'}}
            </div>
        </el-page-header>
        <el-row :gutter="10" class="mt30" v-loading="$route.params.id && loading">
            <el-col :xs="24" :sm="24" :md="12">
                <el-form 
                    label-width="160px"
                    ref="activityRef"
                    :model="activityParams"
                    :rules="activityRules"
                >
                    <el-form-item label="活动名称" prop="displayName">
                        <el-input v-model="activityParams.displayName" placeholder="活动名称"></el-input>
                    </el-form-item>
                    <el-form-item label="活动描述">
                        <el-input type="textarea" :rows="3" v-model="activityParams.description" placeholder="活动描述"></el-input>
                    </el-form-item>
                    <el-form-item label="开始时间" prop="startTime">
                        <el-date-picker
                            v-model="activityParams.startTime"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            format="yyyy-MM-dd HH:mm:ss"
                            placeholder="开始时间"
                        >
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="结束时间" prop="endTime">
                        <el-date-picker
                            v-model="activityParams.endTime"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            format="yyyy-MM-dd HH:mm:ss"
                            placeholder="结束时间"
                        >
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="选择奖池" prop="endTime">
                        <el-button size="small" type="primary">添加奖池</el-button>
                        <el-scrollbar class="pond-wrap">
                            <el-row class="item" v-for="(item, index) in 10" :key="index">
                                <el-col :span="10">
                                    <p class="title">一行白鹭上青天</p>
                                    <p>一次发放：2个</p>
                                </el-col>
                                <el-col :span="10">
                                    <p>发放：随机</p>
                                    <p>允许重复：允许</p>
                                </el-col>
                                <el-col :span="4">
                                    <p>
                                        <el-link type="primary">编辑</el-link>
                                    </p>
                                    <p>
                                        <el-link type="danger">删除</el-link>
                                    </p>
                                </el-col>
                            </el-row>
                        </el-scrollbar>
                    </el-form-item>

                    <el-form-item label="">
                        <el-button type="primary" icon="el-icon-check" :loading="btnLoading">提  交</el-button>
                    </el-form-item>
                </el-form>
            </el-col>
        </el-row>
    </el-card>
</template>
<script>

export default {
    data(){
        return {
            btnLoading: false,     
            detailLoading: false,
            activityParams: {},
            activityRules: {
                displayName: [{ required: true, trigger: "blur", message: '请输入活动名称~' }],
                startTime: [{ required: true, trigger: "blur", message: '请选择开始时间~' }],
                endTime: [{ required: true, trigger: "blur", message: '请选择结束时间~' }],
            },
        }
    },
    mounted() {

    },
    methods: {
        

    }
}
</script>
<style lang="scss" scope>
    .game-add-wrap{
        .pond-wrap{
            .item{
                margin-bottom: 20px;
                border: 1px solid #EBEEF5;
                border-radius: 6px;
                box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);
                padding: 5px;
                overflow: hidden;
                p{
                    line-height: 22px;
                    color: #999;
                    &.title{
                        font-size: 15px;
                        color: #000;
                    }
                }
            }
        }
    }
</style>