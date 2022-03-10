<template>
    <el-dialog
        class="add-auth-group-wrap"
        title="添加权限群组"
        :visible.sync="dialogVisible"
        width="600px"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :append-to-body="true"
    >

        <div v-loading="loading">
            <el-checkbox-group v-model="groupIds">
                <el-checkbox 
                    border
                    :label="item.id" 
                    v-for="(item, index) in groupData" 
                    :key="index"
                    :disabled="selectedIds.includes(item.id)"
                >
                    <p class="title">
                        {{item.displayName}}
                    </p>
                    <p class="desc overflow">
                        {{item.description}}
                    </p>
                </el-checkbox>
            </el-checkbox-group>
        </div>

        <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" v-loading="btnLoading" @click="addResAuthGroup">确 定</el-button>
        </span>
    </el-dialog>
</template>

<script>
import { getMyGroupList } from '@/api/common';

export default {
    props: ['updateGroup', 'resParams'],
    data(){
        return{
            dialogVisible: false,
            loading: false,
            btnLoading: false,
            groupData: [],
            groupIds: [],
            selectedIds: []
        }
    },
    methods: {
        showAddGroup(selectedIds){
            this.dialogVisible = true;
            this.selectedIds = selectedIds;
            this.groupIds = JSON.parse(JSON.stringify(selectedIds));
            this.getGroupList();
        },

        getGroupList(){
            this.loading = true;
            getMyGroupList().then(res => {
                this.loading = false;
                if(res.code === this.$successCode){
                    this.groupData = res.obj;
                }
            })
        },

        addResAuthGroup(){
            let ids = this.groupIds.filter((item) => {
                return !this.selectedIds.includes(item)
            })

            if(!ids || !ids.length){
                this.$message.warning('还未选择权限群组~');
                return
            }

            let data = [];

            ids.forEach(item => {
                data.push({
                    ...this.resParams,
                    groupId: item
                })
            })

            this.btnLoading = true;
            this.updateGroup.update(data).then(res => {
                this.btnLoading = false;
                if(res.code === this.$successCode){
                    this.$message.success('操作成功~');
                    this.dialogVisible = false;
                    this.$emit('updateSuccess');
                }
            })
        }
    },
}
</script>

<style lang="scss">
    .add-auth-group-wrap{
        .el-checkbox{
            margin-bottom: 10px;
        }
        .el-checkbox.is-bordered{
            width: 100%;
            height: auto;
        }
        .el-checkbox.is-bordered+.el-checkbox.is-bordered{
            margin-left: 0;
        }
        .el-checkbox__label{
            vertical-align: middle;
            width: 550px;
            .title{
                color: #000;
            }
            .desc{
                color: #999;
                font-size: 12px;
            }
        }
    }
</style>