<template>
    <!-- 创建品牌组织 -->
    <el-dialog
        title="新建品牌组织"
        :visible.sync="addGroupDialog"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        width="500px">
        <el-form 
            label-width="80px"
            ref="groupForm"
            :model="groupParams"
            :rules="groupRules"
            v-loading="loading"
        >
            <el-form-item label="品牌名称" prop="displayName">
                <el-input placeholder="品牌名称" v-model="groupParams.displayName"></el-input>
            </el-form-item>
            <el-form-item label="品牌类型" prop="organizationType">
                <el-select v-model="groupParams.organizationType" placeholder="请选择品牌类别" style="width:100%">
                    <el-option
                        v-for="item in groupTypeList"
                        :key="item.id"
                        :label="item.displayName"
                        :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="logo" prop="logo">
                <upload-img 
                    :isArray="false" 
                    :imgList="groupParams.logo"
                    @uploadImgPath="handleUploadSuccess"
                ></upload-img>
            </el-form-item>
            <el-form-item label="说明">
                <el-input placeholder="说明" type="textarea" :rows="3" v-model="groupParams.description"></el-input>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="addGroupDialog=false">取 消</el-button>
            <el-button type="primary" :loading="addBtnLoading" @click="addGroupSureBtn">确 定</el-button>
        </span>
    </el-dialog>
</template>
<script>
import { organizationCreated, brandOrganizationDetail, brandOrganizationEdit } from '@/api/user';
import { getOrganizationTypeList } from '@/mixins/index';
import UploadImg from '@/components/Upload/UploadImg';
export default {
    mixins: [getOrganizationTypeList],
    data(){
        return {
            groupParams:{}, 
            addGroupDialog: false,      //添加组织modal
            addBtnLoading: false,       //添加按钮loading
            groupRules: {
                displayName: [{ required: true, trigger: "blur", message: '请输入品牌名称~' }],
                organizationType: [{ required: true, trigger: "blur", message: '请选择品牌类型~' }],
                logo: [{ required: true, trigger: "change", message: '请上传品牌logo~' }]
            },
            loading: false
        }
    },
    methods: {
        //showdialog
        showDialog(){
            this.groupParams = {};
            this.addGroupDialog = true;
            this.getGroupType();
        },

        //编辑时 获取品牌详情
        getGroupDetail(id){
            this.showDialog();
            let data = {
                id: id
            }
            this.loading = true;
            brandOrganizationDetail(data).then(res => {
                this.loading = false;
                if(res.code === this.$successCode){
                    this.groupParams = res.obj;
                }
            })
        },

        //创建或修改 品牌组织
        addGroupSureBtn(){
            this.$refs.groupForm.validate((valid) => {
                if (valid) {
                    this.addBtnLoading = true;
    
                    if(this.groupParams.id){
                        //编辑
                        brandOrganizationEdit(this.groupParams).then(res => {
                            this.createdSuccess(res);
                        })
                    }else{
                        //创建
                        this.groupParams.owner = this.$store.state.user.loginData.id;
                        organizationCreated(this.groupParams).then(res => {
                            this.createdSuccess(res);
                        })
                    }

                }
            })
        },

        //创建 或 编辑成功操作
        createdSuccess(res){
            this.addBtnLoading = false;
            if(res.code === this.$successCode){
                this.$message.success('添加成功~');
                this.addGroupDialog = false;
                this.$emit('createdSuccess');
            }
        },

        //上传logo 成功
        handleUploadSuccess(path){
            this.$set(this.groupParams, 'logo', path);
        },
    },
    components: {
        UploadImg
    }
}
</script>