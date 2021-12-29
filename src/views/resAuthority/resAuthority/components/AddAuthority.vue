<template>
    <!-- 添加权限 编辑权限 -->
    <el-dialog
        :title="addParams.id ? '编辑内容权限' : '添加内容权限'"
        :visible.sync="addAuthDialog"
        :before-close="handleClose"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        width="500px"
    >
        <el-form
            label-width="80px"
            :rules="addRules"
            ref="addAuthForm"
            :model="addParams"
        >
            <el-form-item label="父权限">
                <el-select
                    v-model="addParams.parentId"
                    placeholder="请选择父权限"
                >
                    <el-option
                        v-for="item in authList"
                        :label="item.displayName"
                        :key="item.id"
                        :value="item.id"
                    ></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="权限名" prop="displayName">
                <el-input v-model="addParams.displayName"></el-input>
            </el-form-item>
            <el-form-item label="描述">
                <el-input v-model="addParams.description"></el-input>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="handleClose">取 消</el-button>
            <el-button
                type="primary"
                :loading="addBtnLoading"
                @click="addAuthSureBtn"
                >确 定</el-button
            >
        </span>
    </el-dialog>
</template>

<script>
import { resAuthorityCreated, eidtMenuAuth } from "@/api/resAuthority";
export default {
    props: ["authList"],
    data() {
        return {
            addAuthDialog: false, //添加权限modal
            addParams: {}, //添加权限参数
            addBtnLoading: false, //添加按钮 loading
            addRules: {
                parentId: [
                    {
                        required: true,
                        message: "前选择父权限",
                        trigger: "change",
                    },
                ],
                displayName: [
                    {
                        required: true,
                        message: "请输入权限名",
                        trigger: "blur",
                    },
                ],
            },
        };
    },
    methods: {
        //添加 和 更新 权限
        addAuthSureBtn() {
            this.$refs.addAuthForm.validate((valid) => { 
                if (valid) {
                    this.addBtnLoading = true;
                    //添加权限
                    resAuthorityCreated(this.addParams).then((res) => {
                        this.authRes(res);
                    });
                }
            });
        },

        //编辑权限
        editAuth(row) {
            let data = JSON.parse(JSON.stringify(row));
            this.addParams = data;
            this.addAuthDialog = true;
        },

        //添加或编辑 权限 接口返回
        authRes(res) {
            this.addAuthDialog = false;
            this.addBtnLoading = false;
            if (res.code === this.$successCode) {
                this.$parent.init();
                this.handleClose();
                this.$message.success(
                    this.addParams.id
                        ? "编辑内容权限成功~"
                        : "添加内容权限成功~"
                );
            }
        },

        //关掉模态框 清空验证状态
        handleClose() {
            this.$refs["addAuthForm"].resetFields();
            this.addAuthDialog = false;
        },
    },
};
</script>