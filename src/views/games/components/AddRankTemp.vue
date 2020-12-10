<template>
    <el-dialog
        class="add-game-data"
        :title="$route.params.id ? '编辑排行榜模板' : '创建排行榜模板'"
        :visible.sync="dialogVisible"
        width="600px"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
    >
        <el-form
            v-loading="loading"
            label-width="100px"
            ref="addRankTempForm"
            :model="rankParams"
            :rules="rankRules"
        >
            <el-form-item label="模板名称" prop="displayName">
                <el-input
                    v-model="rankParams.displayName"
                    placeholder="模板名称"
                ></el-input>
            </el-form-item>
            <el-form-item label="排行榜类型" prop="rankingListType">
                <el-select
                    v-model="rankParams.rankingListType"
                    filterable
                    placeholder="请选择排行榜类型"
                    style="width: 100%"
                >
                    <el-option
                        v-for="item in rankTypeData"
                        :key="item.id"
                        :label="item.displayName"
                        :value="item.id"
                    >
                        <span style="float: left">{{ item.displayName }}</span>
                        <span style="float: right; color: #8492a6; font-size: 13px">{{ item.description }}</span>
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="描述">
                <el-input
                    type="textarea"
                    :rows="2"
                    v-model="rankParams.description"
                    placeholder="描述"
                ></el-input>
            </el-form-item>
            <el-form-item label="数值前缀">
                <el-input
                    v-model="rankParams.prefix"
                    placeholder="数值前缀"
                ></el-input>
            </el-form-item>
            <el-form-item label="数值后缀">
                <el-input
                    v-model="rankParams.suffix"
                    placeholder="数值后缀"
                ></el-input>
            </el-form-item>
            <el-form-item label="小数位数">
                <el-input-number 
                    v-model="rankParams.decimalPlaces" 
                    :min="0" 
                    :max="100" 
                    label="描述文字"
                ></el-input-number>
            </el-form-item>
            <el-form-item label="最大记录数">
                <el-input-number 
                    v-model="rankParams.maxCount" 
                    :min="1" 
                    label="最大记录数"
                ></el-input-number>
            </el-form-item>
        </el-form>

        <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" v-loading="btnLoading" @click="addRankTempData">确 定</el-button>
        </span>
    </el-dialog>
</template>

<script>
import { rankTempCreated, rankTempTypeList } from '@/api/game';
export default {
    data() {
        return {
            dialogVisible: false,
            loading: false,
            rankParams: {},
            btnLoading: false,
            rankRules: {
                displayName: [ { required: true, trigger: "blur", message: "请输入模板名称~" } ],
                rankingListType: [ { required: true, trigger: "blur", message: "请选择排行榜类型~" } ],
            },
            rankTypeData: []
        };
    },
    methods: {
        showDialog(id) {
            this.getRankTypeData();
            this.dialogVisible = true;
            this.$nextTick(() => {
                this.$refs['addRankTempForm'].clearValidate();
            })

            this.rankParams = {
                maxCount: 1000,
                appid: this.$route.params.id
            };

            //获取详情
            if (id) {

            }
        },

        //创建 或 修改游戏装配数据
        addRankTempData() {
            this.$refs.addRankTempForm.validate((valid) => {
                if (valid) {
                    this.btnLoading = true;
                    rankTempCreated(this.rankParams).then(res => {
                        this.btnLoading = false;
                        if(res.code === this.$successCode){
                            this.$message.success(this.rankParams.id ? '创建成功~' : '编辑成功~');
                            this.dialogVisible = false;
                        }
                    })
                }
            });
        },

        //排行榜类型
        getRankTypeData(){
            rankTempTypeList().then(res => {
                this.rankTypeData = res.obj;
            })
        }
    }
};
</script>