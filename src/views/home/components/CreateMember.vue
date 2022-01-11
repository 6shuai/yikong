<template>
    <el-dialog
        width="520px"
        title="添加成员"
        :visible.sync="showAddMember"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        append-to-body
    >
        <el-form 
            label-width="80px"
        >
            <el-form-item label="选择用户">
                <el-select
                    v-model="addParams.member"
                    filterable
                    remote
                    reserve-keyword
                    placeholder="输入用户名或昵称搜索"
                    :remote-method="getMemberData"
                    :loading="selectLoading"
                >
                    <el-option
                        v-for="item in memberData"
                        :key="item.id"
                        :label="item.accountName"
                        :value="item.id">
                        <span style="float: left">{{ item.accountName }}</span>
                        <span style="float: right; color: #8492a6; font-size: 13px">{{ item.nickname }}</span>
                    </el-option>
                </el-select>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="showAddMember = false">取 消</el-button>
            <el-button
                :disabled="!addParams.member"
                type="primary"
                :loading="createdLoading"
                @click="handleCreate"
                >确 定</el-button
            >
        </span>
    </el-dialog>
</template>

<script>
import { projectMemberSearch, projectMemberCreate } from '@/api/project'

export default {
    data(){
        return {
            showAddMember: false,
            createdLoading: false,

            // 用户列表
            memberData: [],

            // 加载用户列表 loading
            selectLoading: false,

            addParams: {}
        }
    },
    methods: {
        // 显示添加用户窗口
        showAddMemberDialog(){
            this.showAddMember = true
        },

        // 获取用户列表
        getMemberData(keyword){
            if(!keyword) return
            this.selectLoading = true
            projectMemberSearch({ name: keyword }).then(res => {
                this.selectLoading = false
                if(res.code === this.$successCode){
                    this.memberData = res.obj
                }
            })
        },

        // 新建项目
        handleCreate(){
            this.createdLoading = true
            this.addParams.project = this.$route.params.id
            projectMemberCreate(this.addParams).then(res => {
                this.createdLoading = false
                if(res.code === this.$successCode){
                    this.$message.success('添加成功~')
                    this.showAddMember = false
                    this.$parent.getProjectMemberList()
                }
            })

        }
    },
}
</script>