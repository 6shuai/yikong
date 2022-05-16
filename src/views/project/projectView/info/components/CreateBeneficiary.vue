<template>
    <el-dialog
        width="520px"
        :title="addParams.id ? '修改受益人' : '添加受益人'"
        :visible.sync="showAddBeneficiary"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        append-to-body
    >
        <el-form 
            label-width="80px"
        >
            <el-form-item label="选择用户" prop="person">
                <el-select
                    v-model="addParams.person"
                    filterable
                    remote
                    reserve-keyword
                    placeholder="输入用户名或昵称搜索"
                    :remote-method="getMemberData"
                    :loading="selectLoading"
                    @change="selectMember"
                >
                    <el-option
                        v-for="item in memberData"
                        :key="item.id"
                        :label="item.nickname"
                        :value="item.id">
                        <span style="float: left">{{ item.nickname }}</span>
                        <span style="float: right; color: #8492a6; font-size: 13px">{{ item.accountName }}</span>
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="提点" prop="percent">
                <el-input-number
                    :precision="2"
                    v-model="addParams.percent"
                    :controls="false"
                    :min="0"
                    placeholder="提点"
                ></el-input-number>
                <span class="ml10">%</span>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="showAddBeneficiary = false">取 消</el-button>
            <el-button
                :disabled="!addParams.person || !addParams.percent"
                type="primary"
                :loading="createdLoading"
                @click="handleCreate"
                >确 定</el-button
            >
        </span>
    </el-dialog>
</template>

<script>
import { projectMemberSearch, projectBeneficiaryCreate } from '@/api/project'
import { accMul } from '@/utils/index'

export default {
    data(){
        return {
            showAddBeneficiary: false,
            createdLoading: false,

            // 用户列表
            memberData: [],

            // 加载用户列表 loading
            selectLoading: false,

            // 选中的用户
            personName: '',

            // 当前编辑的index
            index: null,

            addParams: {}
        }
    },
    methods: {
        // 显示添加受益人窗口
        showAddBeneficiaryDialog(data = {}, index = null){
            this.addParams = JSON.parse(JSON.stringify(data))
            this.showAddBeneficiary = true
            this.personName = data.personName
            this.index = index
            if(data.id) {
                this.addParams.percent = accMul(this.addParams.percent, 100)
                this.$nextTick(() => {
                    this.getMemberData(this.personName)
                })
            }
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

        // 选择用户
        selectMember(id){
            let obj = {}
            obj = this.memberData.find(item => {
                return item.id === id
            })
            this.personName = obj.nickname
        },

        // 新建项目
        handleCreate(){
            this.addParams.project = this.$route.params.id

            let percent = Number(this.addParams.percent)
            if(typeof percent != 'number' || isNaN(percent)){
                this.$message.warning('提点输入格式不对啊~')
                return
            }else if(percent > 100){
                this.$message.warning('提点不能超过100~')
                return
            }

            let data = JSON.parse(JSON.stringify(this.addParams))
            data.percent = data.percent / 100

            this.createdLoading = true
            projectBeneficiaryCreate(data).then(res => {
                this.createdLoading = false
                if(res.code === this.$successCode){
                    this.$message.success('添加成功~')
                    this.showAddBeneficiary = false
                    this.$emit('addSuccess', {
                        ...data,
                        personName: this.personName,
                        id: res.obj,
                        index: this.index
                    })
                }
            })

        }
    },
}
</script>