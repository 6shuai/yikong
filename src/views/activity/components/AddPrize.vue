<template>
    <el-dialog
        class="add-prize-dialog"
        :title="prizeParams.id ? '编辑奖品' : '添加奖品'"
        :visible.sync="showPrizeDialog"
        width="600px"
        :append-to-body="true"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
    >
        <el-form
            label-width="100px"
            ref="addPrizeForm"
            :model="prizeParams"
            :rules="prizeRules"
        >
            <el-form-item label="奖品" prop="currencyId">
                <el-select
                    :loading="prizeLoading"
                    style="width: 100%"
                    v-model="prizeParams.currencyId"
                    filterable
                    clearable
                    placeholder="请选择奖品"
                >
                    <el-option
                        v-for="item in currencyData"
                        :key="item.id"
                        :label="item.displayName"
                        :value="item.id"
                    >
                        <span style="float: left">{{ item.displayName }}</span>
                        <span
                            style="
                                float: right;
                                color: #8492a6;
                                font-size: 13px;
                            "
                            >{{ item.description }}</span
                        >
                    </el-option>
                    <div class="add-prize-pagination">
                        <el-pagination
                            small
                            @current-change="handleCurrentChange"
                            :page-size="Number(currencyParams.pageSize)"
                            :current-page="Number(currencyParams.pageNo)"
                            layout="prev, pager,next,total"
                            :total="totalCount">
                        </el-pagination>
                    </div>
                </el-select>
            </el-form-item>
            <el-form-item label="总数量" prop="total">
                <el-input
                    v-model="prizeParams.total"
                    placeholder="总数量"
                ></el-input>
            </el-form-item>
            <el-form-item label="单次上限" prop="awardCountLimit">
                <el-input-number
                    v-model="prizeParams.awardCountLimit"
                    placeholder="单次上限"
                    :min="1"
                    controls-position="right"
                ></el-input-number>
            </el-form-item>
            <el-form-item label="概率">
                <el-input-number
                    v-model="prizeParams.rate"
                    placeholder="概率"
                    :min="0"
                    controls-position="right"
                ></el-input-number>
                <span class="symbol">%</span>
            </el-form-item>
        </el-form>

        <span slot="footer" class="dialog-footer">
            <el-button @click="showPrizeDialog = false">取 消</el-button>
            <el-button
                type="primary"
                :loading="btnLoading"
                @click="handleAddPrize"
                >确 定</el-button
            >
        </span>
    </el-dialog>
</template>

<script>
import { activityCurrencyList, activityPrizeCreated } from "@/api/activity";

export default {
    props: ['currencyType'],
    data() {
        return {
            showPrizeDialog: false,
            prizeParams: {},
            btnLoading: false,
            currencyData: [],
            prizeLoading: false,
            currencyParams: {            //奖品列表筛选参数
                pageSize: 40,
                pageNo: 1
            },
            totalCount: 0,
            prizeRules: {
                currencyId: [
                    {
                        required: true,
                        trigger: "blur",
                        message: "请选择奖品~",
                    },
                ],
                total: [
                    {
                        required: true,
                        trigger: "blur",
                        message: "请输入奖品的总数量~",
                    },
                ],
                awardCountLimit: [
                    {
                        required: true,
                        trigger: "blur",
                        message: "请输入单次上限~",
                    },
                ],
            },
        };
    },
    methods: {
        showDialog(data) {
            this.prizeParams = data ? JSON.parse(JSON.stringify(data)) : {};
            this.showPrizeDialog = true;
            if (!this.currencyData.length) this.getCurrencyList();
            this.$nextTick(() => {
                this.$refs["addPrizeForm"].clearValidate();
            });
        },

        //奖品数据列表
        getCurrencyList() {
            this.prizeLoading = true;
            this.currencyParams.currencyType = this.currencyType;
            activityCurrencyList(this.currencyParams).then((res) => {
                this.prizeLoading = false;
                if (res.code === this.$successCode) {
                    let { list, totalRecords } = res.obj;
                    this.currencyData = list;
                    this.totalCount = totalRecords;
                }
            });
        },

        //分页
        handleCurrentChange(page){
            this.currencyParams.pageNo = page;
            this.getCurrencyList();
        },

        //添加
        handleAddPrize() {
            this.$refs.addPrizeForm.validate((valid) => {
                if (valid) {
                    this.btnLoading = true;
                    activityPrizeCreated(this.prizeParams).then((res) => {
                        this.btnLoading = false;
                        if (res.code === this.$successCode) {
                            this.$message.success("操作成功~");
                            this.showPrizeDialog = false;
                            this.$emit("prizeCreatedSuccess");
                        }
                    });
                }
            });
        },
    },
};
</script>

<style lang="scss" scope>
    .add-prize-dialog {
        .symbol {
            color: #d92027;
            margin-left: 10px;
        }
    }
    .add-prize-pagination{
        padding: 10px;
    }
</style>