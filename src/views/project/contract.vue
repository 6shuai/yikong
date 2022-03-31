<template>
    <div class="create-contract-wrap">

        <div class="edit-btn">
            <el-tag type="warning" v-if="contractParams.approval == 2">审批中</el-tag>
            <el-tag type="success" v-if="contractParams.approval == 3">审批通过</el-tag>
            <el-tag type="info" v-if="contractParams.approval == 4">审批已被拒绝</el-tag>
        </div>

        <div 
            class="edit-btn" 
            v-if="contractParams.approval == 1 || contractParams.approval == 4"
            v-show="!showEdit">
            <el-button 
                type="primary" 
                size="small"
                icon="el-icon-edit"
                @click="showEdit = true"
            >
                编辑合同
            </el-button>
            <el-button 
                type="primary" 
                size="small"
                icon="el-icon-s-check"
                :loading="submitApprovalBtnLoading"
                @click="submitApproval"
            >
                提交审核
            </el-button>
        </div>

        <el-form 
            v-loading="dataLoading"
            label-width="100px"
            ref="contractForm"
            :model="contractParams"
            :rules="contractRules"
        >
            <el-form-item label="合同号:" prop="contractNumber">
                <el-input 
                    v-show="showEdit"
                    v-model="contractParams.contractNumber" 
                    placeholder="合同号"
                ></el-input>
                <span v-show="!showEdit">{{ contractParams.contractNumber }}</span>
            </el-form-item>
    
            <div class="horizontal">
                <el-form-item label="甲方:">
                    <el-select 
                        v-show="showEdit"
                        v-model="contractParams.firstParty" 
                        filterable
                        clearable 
                        placeholder="请选择甲方"
                        @change="handelChangeFirstParty"
                    >
                        <el-option 
                            v-for="item in groupData" 
                            :key="item.id"
                            :label="item.displayName" 
                            :value="item.id">
                        </el-option>
                    </el-select>
                    <span v-show="!showEdit">{{ contractParams.firstPartyName }}</span>
                </el-form-item>
                <el-form-item 
                    label="甲方负责人:" 
                    v-if="contractParams.firstParty"
                >
                    <el-select 
                        v-show="showEdit"
                        v-model="contractParams.firstResponsible" 
                        filterable 
                        clearable
                        placeholder="请选择甲方负责人"
                    >
                        <el-option 
                            v-for="(item, index) in firstPartyMemberList" 
                            :key="index"
                            :label="item.nickname ? item.nickname : item.accountName" 
                            :value="item.userId">
                            <span style="float: left">{{ item.nickname }}</span>
                            <span style="float: right; color: #8492a6; font-size: 13px">{{ item.accountName }}</span>
                        </el-option>
                    </el-select>
                    <span v-show="!showEdit">{{ contractParams.firstResponsibleName }}</span>
                </el-form-item>
            </div>
    
            <div class="horizontal">
                <el-form-item label="乙方:">
                    <el-select 
                        v-show="showEdit"
                        v-model="contractParams.secondParty" 
                        filterable 
                        clearable
                        placeholder="请选择乙方"
                        @change="handleChangeSecondParty"
                    >
                        <el-option 
                            v-for="item in groupData" 
                            :key="item.id"
                            :label="item.displayName" 
                            :value="item.id">
                        </el-option>
                    </el-select>
                    <span v-show="!showEdit">{{ contractParams.secondPartyName }}</span>
                </el-form-item>
                <el-form-item 
                    label="乙方负责人:" 
                    v-if="contractParams.secondParty"
                >
                    <el-select 
                        v-show="showEdit"
                        v-model="contractParams.secondResponsible" 
                        filterable 
                        clearable
                        placeholder="请选择乙方负责人"
                    >
                        <el-option 
                            v-for="(item, index) in secondPartyMemberList" 
                            :key="index"
                            :label="item.nickname ? item.nickname : item.accountName" 
                            :value="item.userId">
                            <span style="float: left">{{ item.nickname }}</span>
                            <span style="float: right; color: #8492a6; font-size: 13px">{{ item.accountName }}</span>
                        </el-option>
                    </el-select>
                    <span v-show="!showEdit">{{ contractParams.secondResponsibleName }}</span>
                </el-form-item>
            </div>
    
            <div class="horizontal">
                <el-form-item label="合同金额:" prop="amount">
                    <el-input-number 
                        v-show="showEdit"
                        :controls="false"
                        v-model="contractParams.amount" 
                    ></el-input-number>
                    <span v-show="!showEdit">{{ contractParams.amount }}</span>
                </el-form-item>
                
            </div>
            <el-form-item label="签署日期:">
                <el-date-picker
                    v-show="showEdit"
                    v-model="contractParams.contractDate"
                    type="date"
                    placeholder="选择签署日期"
                    value-format="yyyy-MM-dd"
                >
                </el-date-picker>
                <span v-show="!showEdit">{{ contractParams.contractDate }}</span>
            </el-form-item>

            <el-form-item label="合同期:">
                <el-date-picker
                    v-show="showEdit"
                    v-model="contractTime"
                    type="daterange"
                    value-format="yyyy-MM-dd"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                >
                </el-date-picker>
                <span v-show="!showEdit">{{ contractParams.validBeginFormat ? `${contractParams.validBegin}  -  ${contractParams.validEnd}` : '' }}</span>
            </el-form-item>
    
            <el-form-item label="回合同日:">
                {{ contractParams.secondArchiveDate }}

                <el-button 
                    type="primary"
                    size="mini"
                    plain
                    v-if="!contractParams.secondArchiveDate"
                    :disabled="contractParams.approval != 3"
                    @click="handleReturnContractDate"
                >回合同</el-button>

            </el-form-item>

            <el-form-item label="付款截止日期:">
                <el-date-picker
                    v-show="showEdit"
                    v-model="contractParams.paymentDue"
                    type="datetime"
                    placeholder="选择日期"
                    format="yyyy-MM-dd HH:mm:ss"
                    value-format="yyyy-MM-dd HH:mm:ss">
                </el-date-picker>
                <span v-show="!showEdit">{{ contractParams.paymentDue }}</span>
            </el-form-item>

            <el-form-item label="提成体系:">
                <el-select 
                    class="w220"
                    v-show="showEdit"
                    v-model="contractParams.commissionSystem" 
                    filterable 
                    style="width: 100%"
                    placeholder="请选择提成体系"
                >   
                    <el-option 
                        v-for="item in CommissionSystemData" 
                        :key="item.id"
                        :label="item.displayName" 
                        :value="item.id">
                    </el-option>
                </el-select>
                <span v-show="!showEdit">{{ contractParams.commissionSystemName }}</span>
            </el-form-item>
    
            <el-form-item :label="showEdit ? '上传合同:' : '合同文件'">
                <upload-img 
                    v-show="showEdit"
                    ref="uploadImg"
                    :isArray="true" 
                    :imgList="contractParams.publishedContractPrints"
                    accept="image/*,.pdf"
                    @deleteImg="ShowDelete"
                    @uploadImgPath="uploadImgSuccess"
                ></upload-img>
                <div 
                    class="contract-image-list"
                    v-show="!showEdit"
                >
                    <span 
                        class="item"
                        v-for="(item, index) in contractParams.publishedContractPrints"
                        :key="index"
                    >
                        <a 
                            class="pdf-file"
                            v-if="item.print.substr(item.print.lastIndexOf('.')) == '.pdf'"
                            :href="item.print"
                            target="_blank"
                        >
                        </a>
                        <el-image 
                            fit="cover"
                            v-else
                            :src="item.print"
                            :preview-src-list="[item.print]"
                        >
                        </el-image>
                    </span>
                </div>
            </el-form-item>

            <el-form-item label="说明:">
                <el-input 
                    v-show="showEdit"
                    type="textarea"
                    :rows="3"
                    v-model="contractParams.description" 
                    placeholder="说明"
                ></el-input>
                <span v-show="!showEdit">{{ contractParams.description }}</span>
            </el-form-item>
            
            <el-form-item v-if="showEdit">
                <el-button @click="contractParams.id ? showEdit = false : $router.push('/')">取 消</el-button>
                <el-button 
                    type="primary"
                    :loading="btnLoading"
                    @click="handleSaveContract"
                >
                    提 交
                </el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
import UploadImg from '@/components/Upload/UploadImg'
import { organizationListProject } from '@/api/user'
import { projectDetail, projectContractCreate, organizationUser, projectContractSubmitApproval, projectContractSubmitReturnDate } from '@/api/project'
import { financeCommissionSystemList } from '@/api/finance'
import { dateAddHMS } from '@/utils/index'

export default {
    components: { 
        UploadImg
    },
    data(){
        return {
            contractParams: {
                publishedContractPrints: []
            },

            // 创建合同 表单验证
            contractRules: {
                contractNumber: [{ required: true, message: '请输入合同号~', trigger: 'blur' }],
                amount: [{ required: true, message: '请输入合同金额~', type: 'number', trigger: 'blur' }],
            },

            // 组织列表
            groupData: [],

            // 甲方联系人列表
            firstPartyMemberList: [],

            // 乙方联系人列表
            secondPartyMemberList: [],

            // 合同期
            contractTime: [],

            // 提成体系列表
            CommissionSystemData: [],

            // 提交按钮 loading
            btnLoading: false,

            // 是否显示编辑状态
            showEdit: false,

            dataLoading: false,

            // 提交审批按钮loading
            submitApprovalBtnLoading: false
        }
    },
    mounted() {
        this.getDetail()
        this.getContractDetail()
        this.getGroupList()
        this.getCommissionSystemList()
    },
    methods: {
        // 获取组织列表
        getGroupList(){
            organizationListProject().then(res => {
                this.groupData = res.obj
            })
        },


        // 上传图片成功
        uploadImgSuccess(path){
            if(!this.contractParams.publishedContractPrints) this.contractParams.publishedContractPrints = []
            this.contractParams.publishedContractPrints.push({
                print: path
            })
        },

        // 删除图片
        ShowDelete(file){
            this.contractParams.publishedContractPrints.splice(file.index, 1)
        },

        // 选择甲方
        handelChangeFirstParty(){
            if(!this.firstPartyMemberList.length) this.getGroupMemberList(this.contractParams.firstParty).then(res => this.firstPartyMemberList = res)
        },

        // 选择已方
        handleChangeSecondParty(){
            if(!this.secondPartyMemberList.length) this.getGroupMemberList(this.contractParams.secondParty).then(res => this.secondPartyMemberList = res)
        },

        // 查询品牌组织下的 用户列表
        getGroupMemberList(id, data){
            return new Promise((resolve) => {
                organizationUser({ organizationId: id }).then(res =>{
                    resolve(res.obj)
                })
            })
        },

        // 查询提成体系列表
        getCommissionSystemList(){
            financeCommissionSystemList().then(res => {
                if(res.code === this.$successCode){
                    this.CommissionSystemData = res.obj
                }
            })
        },

        // 保存合同
        handleSaveContract(){
            this.$refs.contractForm.validate((valid) => {
                if(valid){
                    this.btnLoading = true
                    let data = {
                        ...JSON.parse(JSON.stringify(this.contractParams)),
                        project: Number(this.$route.params.id),
                        contractDate: dateAddHMS(this.contractParams.contractDate),
                        validBegin: dateAddHMS(this.contractTime[0]),
                        validEnd: dateAddHMS(this.contractTime[1]),
                        secondArchiveDate: dateAddHMS(this.contractParams.secondArchiveDate),
                    }
                    projectContractCreate(data).then(res => {
                        this.btnLoading = false
                        if(res.code === this.$successCode){
                            this.$message.success('提交成功~')
                            this.getDetail()
                        }
                    })
                }
            })
        },

        // 合同提交审批
        submitApproval(){
            this.submitApprovalBtnLoading = true
            projectContractSubmitApproval(this.contractParams.id).then(res => {
                this.submitApprovalBtnLoading = false
                if(res.code === this.$successCode){
                    this.$message.success('合同审批提交成功~')

                    // 审批状态 变成审批中
                    this.contractParams.approval = 2
                }
            })
        },

        // 提交回合同日
        handleReturnContractDate(){
            projectContractSubmitReturnDate(this.contractParams.id).then(res => {
                if(res.code === this.$successCode){
                    this.$message.success('操作成功~')
                    this.getDetail()
                }
            })
        },

        // 查询项目详情
        getDetail(){
            this.dataLoading = true
            projectDetail({ id: this.$route.params.id }).then(res => {
                this.dataLoading = false
                if(res.code === this.$successCode){
                    this.$store.state.user.projectDetail = res.obj
                    this.$store.state.user.projectContractDetail = res.obj.publishedContract ? res.obj.publishedContract : {}
                    this.getContractDetail()
                }
            })
        },

        // 获取合同详情
        getContractDetail(){
            let newData = this.$store.state.user.projectContractDetail
            let { contractDateFormat, validBeginFormat, validEndFormat, secondArchiveDateFormat, paymentDueFormat, firstParty, secondParty } = newData
            if(!newData.id) {
                this.showEdit = true 
            }else{
                this.showEdit = false
            }

            this.contractParams = {
                ...newData,
                contractDate: dateAddHMS(contractDateFormat),
                validBegin: dateAddHMS(validBeginFormat),
                validEnd: dateAddHMS(validEndFormat),
                secondArchiveDate: dateAddHMS(secondArchiveDateFormat),
                paymentDue: paymentDueFormat,
                publishedContractPrints: newData.publishedContractPrints || []
            }

            if(validBeginFormat){
                this.contractTime = [dateAddHMS(validBeginFormat), dateAddHMS(validEndFormat)]
            }else{
                this.contractTime = []
            }

            // 查询甲方负责人
            if(firstParty){
                this.handelChangeFirstParty()
            }

            // 查询乙方负责人
            if(secondParty){
                this.handleChangeSecondParty()
            }
        },

        formatTime(date){
            return dateAddHMS(date)
        }
    }
}
</script>

<style lang="scss">
    .create-contract-wrap{
        .horizontal{
            display: flex;

            .el-form-item{
                width: 310px;

                &:nth-child(2){
                    margin-left: 60px;
                }

                .el-input, .el-select, .el-input-number{
                    width: 220px;
                }
                
                .el-input-number .el-input__inner{
                    text-align: left;
                }
            }
        }

        .edit-btn{
            text-align: right;
            margin-bottom: 20px;
        }

        .contract-image-list{
            display: flex;
            flex-wrap: wrap;

            .item{
                cursor: pointer;
                margin: 0 10px 10px 0;

                .el-image, a{
                    width: 100px; 
                    height: 100px;
                    border-radius: 4px;
                    border: 1px solid #e5e5e5;
                    display: block;
                }

                a.pdf-file{
                    text-align: center;
                    background: url('../../assets/images/pdf.png') no-repeat center;
                }
            }
        }

        .el-form-item__label{
            font-weight: bold;
        }
    }
</style>