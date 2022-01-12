<template>
    <div class="create_contract_wrap">

        <el-descriptions 
            title="合同信息"
            v-show="!showEdit"
            v-loading="dataLoading"
            border
        >
            <template slot="extra">
                <el-button 
                    type="primary" 
                    size="small"
                    icon="el-icon-edit"
                    @click="showEdit = true"
                >
                    编辑合同
                </el-button>
            </template>
            <el-descriptions-item label="合同号">{{ contractParams.contractNumber }}</el-descriptions-item>
            <el-descriptions-item label="甲方">{{ contractParams.firstPartyName }}</el-descriptions-item>
            <el-descriptions-item label="甲方负责人">{{ contractParams.firstResponsibleName }}</el-descriptions-item>
            <el-descriptions-item label="乙方">{{ contractParams.secondPartyName }}</el-descriptions-item>
            <el-descriptions-item label="乙方负责人">{{ contractParams.secondResponsibleName }}</el-descriptions-item>
            <el-descriptions-item label="合同金额">{{ contractParams.amount }}</el-descriptions-item>
            <el-descriptions-item label="签署日期">{{ contractParams.contractDate }}</el-descriptions-item>
            <el-descriptions-item label="合同期">{{ formatTime(contractParams.validBeginFormat) }} - {{ formatTime(contractParams.validEndFormat) }}</el-descriptions-item>
            <el-descriptions-item label="回合同日">{{ contractParams.firstArchiveDate }}</el-descriptions-item>
            <el-descriptions-item label="合同图片">
                <el-image 
                    v-for="(item, index) in contractParams.publishedContractPrints"
                    :key="index"
                    style="width: 100px; height: 100px"
                    :src="item.print" 
                    :preview-src-list="imageSrcList">
                </el-image>
            </el-descriptions-item>
        </el-descriptions>

        <el-form 
            label-width="100px"
            ref="contractForm"
            :model="contractParams"
            :rules="contractRules"
            v-show="showEdit"
        >
            <el-form-item label="合同号" prop="contractNumber">
                <el-input 
                    v-model="contractParams.contractNumber" 
                    placeholder="合同号"
                ></el-input>
            </el-form-item>
    
            <div class="horizontal">
                <el-form-item label="甲方">
                    <el-select 
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
                </el-form-item>
                <el-form-item 
                    label="甲方负责人" 
                    prop="firstResponsible"
                    v-if="contractParams.firstParty"
                >
                    <el-select 
                        v-model="contractParams.firstResponsible" 
                        filterable 
                        clearable
                        placeholder="请选择甲方负责人"
                    >
                        <el-option 
                            v-for="item in firstPartyMemberList" 
                            :key="item.userId"
                            :label="item.nickname ? item.nickname : item.accountName" 
                            :value="item.userId">
                            <span style="float: left">{{ item.nickname }}</span>
                            <span style="float: right; color: #8492a6; font-size: 13px">{{ item.accountName }}</span>
                        </el-option>
                    </el-select>
                </el-form-item>
            </div>
    
            <div class="horizontal">
                <el-form-item label="乙方">
                    <el-select 
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
                </el-form-item>
                <el-form-item 
                    label="乙方负责人" 
                    prop="secondResponsible"
                    v-if="contractParams.secondParty"
                >
                    <el-select 
                        v-model="contractParams.secondResponsible" 
                        filterable 
                        clearable
                        placeholder="请选择乙方负责人"
                    >
                        <el-option 
                            v-for="item in secondPartyMemberList" 
                            :key="item.userId"
                            :label="item.nickname ? item.nickname : item.accountName" 
                            :value="item.userId">
                            <span style="float: left">{{ item.nickname }}</span>
                            <span style="float: right; color: #8492a6; font-size: 13px">{{ item.accountName }}</span>
                        </el-option>
                    </el-select>
                </el-form-item>
            </div>
    
            <div class="horizontal">
                <el-form-item label="合同金额" prop="amount">
                    <el-input-number 
                        :controls="false"
                        v-model="contractParams.amount" 
                    ></el-input-number>
                </el-form-item>
                
            </div>
            <el-form-item label="签署日期">
                <el-date-picker
                    v-model="contractParams.contractDate"
                    type="date"
                    placeholder="选择签署日期"
                    value-format="yyyy-MM-dd"
                >
                </el-date-picker>
            </el-form-item>
    
            <el-form-item label="合同期">
                <el-date-picker
                    v-model="contractTime"
                    type="daterange"
                    value-format="yyyy-MM-dd"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                >
                </el-date-picker>
            </el-form-item>
    
            <el-form-item label="回合同日">
                <el-date-picker
                    v-model="contractParams.firstArchiveDate"
                    type="date"
                    placeholder="选择日期"
                    value-format="yyyy-MM-dd">
                </el-date-picker>
            </el-form-item>
    
            <el-form-item label="上传合同">
                <upload-img 
                    ref="uploadImg"
                    :isArray="true" 
                    :imgList="contractParams.publishedContractPrints"
                    :showCover="true"
                    @deleteImg="ShowDelete"
                    @uploadImgPath="uploadImgSuccess"
                ></upload-img>
            </el-form-item>
            
            <el-form-item>
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
import { getOrganizationList } from '@/mixins/index'
import { projectDetail, projectContractCreate, organizationUser } from '@/api/project'
import { dateAddHMS } from '@/utils/index'

export default {
    components: { 
        UploadImg
    },
    mixins: [getOrganizationList],
    data(){
        return {
            contractParams: {
                publishedContractPrints: []
            },

            // 创建合同 表单验证
            contractRules: {
                contractNumber: [{ required: true, message: '请输入合同号~', trigger: 'blur' }],
                firstResponsible: [{ required: true, message: '请选择甲方负责人~', type: 'number', trigger: 'change' }],
                secondResponsible: [{ required: true, message: '请选择乙方负责人~', type: 'number', trigger: 'change' }],
                amount: [{ required: true, message: '请输入合同金额~', type: 'number', trigger: 'blur' }],
            },

            // 甲方联系人列表
            firstPartyMemberList: [],

            // 乙方联系人列表
            secondPartyMemberList: [],

            // 合同期
            contractTime: [],

            // 提交按钮 loading
            btnLoading: false,

            // 是否显示编辑状态
            showEdit: false,

            dataLoading: false
        }
    },
    computed: {
        imageSrcList(){
            let arr = []
            this.contractParams.publishedContractPrints.forEach(item => {
                arr.push(item.print)
            })
            return arr
        }
    },
    mounted() {
        this.getContractDetail()
    },
    methods: {
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
            console.log(this.contractParams.publishedContractPrints)
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

        // 提交合同
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
                        firstArchiveDate: dateAddHMS(this.contractParams.firstArchiveDate)
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

        // 查询项目详情
        getDetail(){
            this.dataLoading = true
            projectDetail({ id: this.$route.params.id }).then(res => {
                this.dataLoading = false
                if(res.code === this.$successCode){
                    this.$store.state.user.projectContractDetail = res.obj.publishedContract ? res.obj.publishedContract : {}
                    this.getContractDetail()
                }
            })
        },

        // 获取合同详情
        getContractDetail(){
            let newData = this.$store.state.user.projectContractDetail
            let { contractDateFormat, validBeginFormat, validEndFormat, firstArchiveDateFormat, firstParty, secondParty } = newData
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
                firstArchiveDate: dateAddHMS(firstArchiveDateFormat),
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
    .create_contract_wrap{
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

        .el-descriptions {
            .el-image{
                margin: 10px;
                border-radius: 4px;
            }
        }
    }
</style>