<template>
    <!-- 新建组织 -->
    <el-dialog
        title="新建组织"
        :visible.sync="addGroupDialog"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        width="500px">
        <el-form 
            label-width="80px"
        >
            <el-form-item label="组织名称">
                <el-input v-model="addParams.displayName"></el-input>
            </el-form-item>
            <el-form-item label="组织类型">
                <el-select v-model="addParams.organizationType" placeholder="请选择组织类别" style="width:100%">
                    <el-option
                        v-for="item in groupTypeList"
                        :key="item.id"
                        :label="item.displayName"
                        :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="addGroupDialog=false">取 消</el-button>
            <el-button type="primary" :loading="addBtnLoading" @click="addGroupSureBtn">确 定</el-button>
        </span>
    </el-dialog>
</template>
<script>
import { organizationCreated, organizationType } from '@/api/user';
export default {
    data(){
        return {
            addParams:{}, 
            addGroupDialog: false,      //添加组织modal
            addBtnLoading: false,       //添加按钮loading
            groupTypeList: [],          //组织类型
        }
    },
    methods: {
        //showdialog
        showDialog(){
            this.addParams = {};
            this.addGroupDialog = true;
            this.getGroupType();
        },

        //添加组织
        addGroupSureBtn(){
            if(!this.addParams.displayName){
                this.$message.warning('请填写组织名称~');
                return
            }else if(!this.addParams.organizationType){
                this.$message.warning('请选择组织类型~');
                return
            }
            
            this.addBtnLoading = true;
            this.addParams.owner = this.$store.state.user.loginData.id;
            organizationCreated(this.addParams).then(res => {
                this.addBtnLoading = false;
                if(res.code === this.$successCode){
                    this.$message.success('添加成功~');
                    this.addGroupDialog = false;
                    this.$parent.searchGroupInfo();
                }
            })
        },

        //获取组织类型   新建组织 commonType： 0
        getGroupType(){
            organizationType(0).then(res => {
                if(res.code === this.$successCode){
                    // 新建组织的时候，前端列出的可选组织类型，不包含组织外类型，就是说组织类型数据的commonType: true的数据不列出。
                    this.groupTypeList = res.obj.filter(item => {
                        return !item.commonType
                    })
                }
            })
        }
    }
}
</script>