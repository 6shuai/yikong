<template>
    <!-- 修改角色 -->
    <el-dialog
        title="修改角色"
        :append-to-body="true"
        :visible.sync="changeRoleDialog"
        width="520px"
    >
        <el-select
            v-model="params.roleIds"
            multiple
            placeholder="请选择角色"
            style="width: 100%"
        >
            <el-option
                v-for="item in roleData"
                :key="item.id"
                :label="item.displayName"
                :value="item.id"
            >
            </el-option>
        </el-select>

        <span slot="footer" class="dialog-footer">
            <el-button v-loading="btnLoading" type="primary" @click="handleSave"
                >保 存</el-button
            >
            <el-button @click="changeRoleDialog = false">关 闭</el-button>
        </span>
    </el-dialog>
</template>

<script>
import { groupResRoleList, groupResRoleChange } from "@/api/group";
export default {
    data() {
        return {
            changeRoleDialog: false,
            btnLoading: false,
            params: {},
            roleData: [],
        };
    },
    methods: {
        showChangeRoleDialog(data) {
            this.params = {
                id: data.id,
                roleIds: data.roleIds
                    ? data.roleIds.split(",").map(Number)
                    : [],
            };
            this.changeRoleDialog = true;
            this.getRoleList();
        },

        getRoleList() {
            groupResRoleList().then((res) => {
                if (res.code === this.$successCode) {
                    this.roleData = res.obj;
                }
            });
        },

        //保存
        handleSave() {
            let params = JSON.parse(JSON.stringify(this.params));
            let data = `?id=${params.id}&roleIds=${params.roleIds.join(",")}`;
            this.btnLoading = true;
            groupResRoleChange(data).then((res) => {
                this.btnLoading = false;
                if (res.code === this.$successCode) {
                    this.$message.success("保存成功~");
                    this.changeRoleDialog = false;
                    this.$emit("changeRoleSuccess");
                }
            });
        },
    },
};
</script>
<style lang="scss">
.search-result-wrap {
    min-height: 50px;

    .member-header-img {
        width: 45px;
        height: 45px;
        border-radius: 50%;
    }
    .search-member-list {
        width: 100%;
        padding: 20px 0;
        min-height: 50px;
        text-align: center;
        li {
            display: flex;
            flex-wrap: nowrap;
            padding: 15px 0;
            line-height: 40px;
            &:hover {
                background: #e9f3fb;
            }
            &.s-header {
                background: #f5f5f5;
                &:hover {
                    background: #f5f5f5;
                }
            }
            & > span {
                flex: 1;
                padding: 0 10px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                i {
                    color: #67c23a;
                    font-size: 18px;
                    cursor: pointer;
                }
            }
        }
    }
}
</style>