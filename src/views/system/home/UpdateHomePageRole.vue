<template>
    <el-dialog
        title="更新主页角色"
        :visible.sync="showHomePageBindRole"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        width="500px">
        <el-form 
            label-width="80px"
        >
            <el-form-item label="角色" prop="roleId">
                <el-select 
                    multiple 
                    v-model="addParams.roleIds" 
                    placeholder="请选择角色" 
                    style="width:100%"
                >
                    <el-option 
                        v-for="item in roleListData" 
                        :key="item.id" 
                        :label="item.displayName" 
                        :value="item.id"
                    ></el-option>
                </el-select>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="showHomePageBindRole=false">取 消</el-button>
            <el-button type="primary" :loading="addBtnLoading" @click="handleUpateHomePageRole">确 定</el-button>
        </span>
    </el-dialog>

</template>

<script>
import { homePageRoleList, homePageRoleUpdate } from '@/api/user'

export default {
    data(){
        return {
            showHomePageBindRole: false,     
            addParams: {},           
            addBtnLoading: false,

            // 角色列表
            roleListData: []
        }
    },
    mounted() {
        this.getRoleList()
    },
    methods: {
        // 显示模态框
        showDialog(data){
            let { id, roles } = JSON.parse(JSON.stringify(data))
            let roleIds = []
            roles.forEach(item => {
                roleIds.push(item.id)  
            })

            this.addParams = {
                id,
                roleIds
            }
            this.showHomePageBindRole = true
        },

        // 角色列表
        getRoleList(){
            homePageRoleList().then(res => {
                if(res.code === this.$successCode){
                    this.roleListData = res.obj
                }
            })
        },

        // 更新主页绑定的角色
        handleUpateHomePageRole(){            
            let { id, roleIds } = this.addParams 
            let data = `?id=${id}&roleIds=${roleIds.join(',')}`
            this.addBtnLoading = true
            homePageRoleUpdate(data).then(res => {
                this.addBtnLoading = false
                if(res.code === this.$successCode){
                    this.showHomePageBindRole = false
                    this.$message.success('操作成功~')
                    this.$parent.init()
                }
            })
        }

    }
}
</script>