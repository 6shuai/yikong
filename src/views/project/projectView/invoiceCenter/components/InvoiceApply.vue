<template>
    <div class="contract-wrap app-main-wrap">
        <el-card> 

            <div class="project-introduce">
                <el-page-header 
                    @back="handleClickCancel"
                    title="返回"
                > </el-page-header>
            </div>
            <div class="invoice-apply-wrap" v-loading="loading">
                <el-steps v-if="showReviewStep" :active="active" :align-center="true" finish-status="success">
                    <el-step title="填写发票申请"></el-step>

                    <!-- approved 发票申请是否通过  true 通过  false 驳回  没这个字段是未处理 -->
                    <el-step 
                        v-if="defaultInfo.approvalProcedures && defaultInfo.approvalProcedures.length"
                        v-for="(item, index) in defaultInfo.approvalProcedures"
                        :key="index"
                        :title="typeof(item.approved)=='boolean' ? `${item.personName}已${item.approved ? '通过' : '驳回'}` : `等待${item.personName}审批`"
                        :status="typeof(item.approved)=='boolean' ? item.approved ? 'success' : 'error' : `process`"
                    ></el-step>
                </el-steps>

                <!-- 发票申请 -->
                <el-form 
                    class="invoice-apply-form" 
                    v-if="!showInvoiceDetail"
                    label-width="110px"
                    ref="addInvoiceForm"
                    :model="invoiceParams"
                    :rules="invoiceParamsRules"
                >
                    <div class="form-wrap">
                        <el-form-item label="开票方式">
                            <el-select 
                                v-model="invoiceParams.merge" 
                                filterable 
                                class="w220"
                                placeholder="开票方式"
                                :disabled ="invoiceParams.id ? true : false"
                                @change="handleChangeInvoiceMethod"
                            >   
                                <el-option 
                                    v-for="item in invoiceMethodData" 
                                    :key="item.id"
                                    :label="item.value" 
                                    :value="item.id">
                                </el-option>
                            </el-select>

                            <a 
                                v-if="!invoiceParams.id"
                                v-show="invoiceParams.merge"
                                href="javascript:;" 
                                class="add-other-btn ml20"
                                @click="$refs.selectOtherProject.showSelectOtherProjectDialog(defaultInfo.projects, otherProjectData, invoiceParams.publishedProjects)"
                            >
                                <i class="el-icon-plus"></i>{{ otherProjectData && otherProjectData.length > 1 ? '编辑合并项目' : '添加其他项目' }}
                            </a>

                        </el-form-item>
                        <div v-if="invoiceParams.merge">
                            <el-form-item label="合并开票项目"></el-form-item>
                            <invoice-project-list v-show="otherProjectData && otherProjectData.length" :projectData="otherProjectData"></invoice-project-list>
                        </div>
                        <el-form-item label="发票类型" prop="invoiceType">
                            <el-radio-group v-model="invoiceParams.invoiceType">
                                <el-radio :label="1">增值税普通发票</el-radio>
                                <el-radio :label="2">增值税专用发票</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item label="发票类目" prop="goodsAndServices">
                            <el-select 
                                v-model="invoiceParams.goodsAndServices" 
                                filterable 
                                class="w220"
                                placeholder="发票类目"
                            >   
                                <el-option 
                                    v-for="item in goodsAndServicesData" 
                                    :key="item.id"
                                    :label="item.displayName" 
                                    :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="发票金额" prop="amount">
                            <el-input-number 
                                class="w220"
                                :precision="2"
                                :controls="false"
                                v-model="invoiceParams.amount" 
                                :max="(invoiceParams.merge || !allowUpdate) ? Infinity : currentProjectData.allowInvoicing"
                                :min="1"
                                placeholder="发票金额"
                                :disabled="invoiceParams.merge || !allowUpdate"
                            ></el-input-number>
                        </el-form-item>
                    </div>

                    <div class="form-wrap">
                        <el-form-item label="抬头类型" prop="titleType">
                            <el-radio-group v-model="invoiceParams.titleType">
                                <el-radio :label="1">企业</el-radio>
                                <el-radio :label="2">个人</el-radio>
                            </el-radio-group>
                        </el-form-item>

                        <!-- 企业抬头 -->
                        <el-form-item label="发票抬头" v-if="invoiceParams.titleType===1" prop="organization.displayName">
                            <el-input v-model="invoiceParams.organization.displayName"></el-input>
                        </el-form-item>

                        <!-- 个人抬头 -->
                        <el-form-item label="发票抬头" v-if="invoiceParams.titleType===2" prop="organization.realName">
                            <el-input v-model="invoiceParams.organization.realName"></el-input>
                        </el-form-item>

                        <div v-show="invoiceParams.titleType===1">
                            <el-form-item label="纳税人识别号" prop="organization.taxpayerNumber">
                                <el-input v-model="invoiceParams.organization.taxpayerNumber"></el-input>
                            </el-form-item>
                            <el-form-item label="企业地址" prop="organization.address">
                                <el-input v-model="invoiceParams.organization.address"></el-input>
                            </el-form-item>
                            <el-form-item label="企业电话" prop="organization.telephone">
                                <el-input v-model="invoiceParams.organization.telephone"></el-input>
                            </el-form-item>
                            <el-form-item label="开户行" prop="organization.bank">
                                <el-input v-model="invoiceParams.organization.bank"></el-input>
                            </el-form-item>
                            <el-form-item label="开户行账号" porp="organization.account">
                                <el-input v-model="invoiceParams.organization.account"></el-input>
                            </el-form-item>
                        </div>
                        <el-form-item label="邮箱" prop="organization.email">
                            <el-input v-model="invoiceParams.organization.email" placeholder="用于接收电子版发票"></el-input>
                        </el-form-item>
                        <el-form-item label="备注">
                            <el-input type="textarea" :rows="3" v-model="invoiceParams.description"></el-input>
                        </el-form-item>
                    </div>
                </el-form>

                <div class="b-btn-wrap" v-if="!showInvoiceDetail">
                    <el-button @click="handleClickCancel">取 消</el-button>
                    <el-button type="primary" :loading="btnLoading" @click="handleClickSubmit">提 交</el-button>
                </div>

                <!-- 发票详情 -->
                <invoice-detail 
                    v-loading="getDetailLoading"
                    v-if="showInvoiceDetail"
                    :data="invoiceParams"
                    :otherProjectData="otherProjectData"
                    :totalPrice="totalPrice"
                    :allowUpdate="allowUpdate"
                    :rejectText="rejectText"
                    :isLastOne="isLastOne"
                    :showReviewStep="showReviewStep"
                    :approvalProcedures="defaultInfo.approvalProcedures"
                    ref="invoiceDetail"
                ></invoice-detail>

                <!-- 选择其他项目 -->
                <select-other-project 
                    ref="selectOtherProject"
                    @selectOver="handelSelectOver"
                ></select-other-project>

            </div>
        </el-card>
    </div>
</template>

<script>
import { projectInvoiceCenterDefaultInfo, projectInvoiceCreate, projectInvoiceDetail, projectInvoiceReviewDetail } from '@/api/project'
import { getGoodsAndServicesList } from '@/api/common'
import InvoiceDetail from "./InvoiceDetail"
import SelectOtherProject from './SelectOtherProject'
import InvoiceProjectList from './InvoiceProjectList'

export default {
    components: {
        InvoiceDetail,
        SelectOtherProject,
        InvoiceProjectList
    },
    data() {
        return {
            active: 0,
            invoiceParams: {
                // 公司数据
                organization: {},
                merge: false,
                invoiceType: 1,
                titleType: 1
            },

            // 发票默认信息
            defaultInfo: {},

            // 开票方式
            invoiceMethodData: [
                {
                    id: false,
                    value: '普通开票'
                },
                {
                    id: true,
                    value: '合并开票'
                }
            ],

            // 表单验证
            invoiceParamsRules: {
                invoiceType: [{ required: true, type: 'number', message: '请选择项发票类型~', trigger: 'change' }],
                goodsAndServices: [{ required: true, type: 'number', message: '请选择发票类目~', trigger: 'change' }],
                amount: [{ required: true, message: '请输入发票金额~', trigger: 'blur' }],
                titleType: [{ required: true, type: 'number', message: '请选择抬头类型~', trigger: 'change' }],
                'organization.displayName': [{ required: true, message: '请输入发票抬头~', trigger: 'blur' }],
                'organization.realName': [{ required: true, message: '请输入发票抬头~', trigger: 'blur' }],
                'organization.taxpayerNumber': [{ required: true, message: '请输入纳税人识别号~', trigger: 'blur' }],
                'organization.address': [{ required: true, message: '请输入企业地址~', trigger: 'blur' }],
                'organization.telephone': [{ required: true, message: '请输入企业电话~', trigger: 'blur' }],
                'organization.bank': [{ required: true, message: '请输入开户行~', trigger: 'blur' }],
                'organization.account': [{ required: true, message: '请输入开户行账号~', trigger: 'blur' }],
                'organization.email': [{ required: true, message: '请输入邮箱账号~', trigger: 'blur' }],
            },

            // 发票类目
            goodsAndServicesData: [],

            // 当前项目的信息
            currentProjectData: {
                allowInvoicing: 0
            },

            // 其他项目
            otherProjectData: [],

            // 是否只查看发票
            showInvoiceDetail: false,

            // 开票数据加载中
            loading: false,

            // 显示总额
            totalPrice: 0,

            // 驳回理由
            rejectText: '',

            // 是否可以修改
            allowUpdate: true,

            // 是否是最后一位审核人
            isLastOne: false,

            // 是否显示审核步骤
            showReviewStep: true,

            // 获取发票详情接口  审核人 调用的接口是 projectInvoiceReviewDetail
            invoiceDetailApi: '',

            // 提交按钮 loading
            btnLoading: false,

            // 获取详情loading
            getDetailLoading: false,

            // 发票详情 copy
            copyInvoiceDetail: {}
        }
    },
    mounted() {
        this.invoiceDetailApi = projectInvoiceDetail
        if(localStorage.homeRoute != '/project'){
            this.showReviewStep = false
            this.invoiceDetailApi = projectInvoiceReviewDetail
        }

        let { invoiceId, clientId, edit } = this.$route.query
        this.showInvoiceDetail = (!invoiceId || edit) ? false : true
        this.getGoodsAndServices()
        if(clientId) this.getDefaultInfo(clientId, invoiceId)

        if(Number(invoiceId)){
            this.getInvoiceDetail(invoiceId)
        }

    },
    methods: {
        // 获取开发票 基本信息 项目列表,客户公司数据啥的
        getDefaultInfo(clientId, invoiceId){
            this.loading = true
            projectInvoiceCenterDefaultInfo({
                organization: clientId
            }).then(res => {
                this.loading = false
                if(res.code === this.$successCode){
                    if(invoiceId){
                        delete res.obj.approvalProcedures
                    }
                    this.defaultInfo = {
                        ...this.defaultInfo,
                        ...res.obj
                    }
                    if(this.invoiceParams.organization && !this.invoiceParams.organization.id) this.invoiceParams.organization = this.defaultInfo.organization

                    // 当前项目的信息
                    let arr = this.defaultInfo.projects.filter((item) => item.id == this.$route.query.projectId)
                    if(arr && arr.length) {
                        let { allowInvoicing, amount, displayName, payment, id, materials } = arr[0]
                        this.currentProjectData = {
                            allowInvoicing: this.currentProjectData.allowInvoicing += allowInvoicing,
                            amount,
                            displayName,
                            payment,
                            id,
                            materials
                        }
                    } 
                }
            })
        },

        // 获取发票详情
        getInvoiceDetail(id){
            this.getDetailLoading = true
            this.invoiceDetailApi({ id }).then(res => {
                this.getDetailLoading = false
                if(res.code === this.$successCode){
                    let { publishedInvoice, approvalProcedures, publishedProject, reason, allowUpdate, lastOne } = res.obj
                    this.invoiceParams = publishedInvoice
                    this.currentProjectData.allowInvoicing += publishedInvoice.amount
                    this.defaultInfo.approvalProcedures = approvalProcedures
                    this.invoiceParams.publishedProjects = []
                    this.rejectText = reason
                    this.allowUpdate = allowUpdate
                    this.invoiceMethodId = publishedProject.length <= 1 ? 1 : 2
                    this.isLastOne = lastOne

                    // 是否已审核通过
                    if( this.invoiceParams.approval == 3){
                        this.$refs.invoiceDetail.invoiceReviewParams = this.invoiceParams
                    }
                    
                    this.otherProjectData = publishedProject

                    // 合并开票 publishedProjects 传入项目id
                    if(publishedInvoice.merge == true){
                        publishedProject.forEach(element => {
                            this.totalPrice += element.allowInvoicing
                            this.invoiceParams.publishedProjects.push({ id: element.id })
                        })
                    }

                    this.copyInvoiceDetail = JSON.parse(JSON.stringify(this.invoiceParams))
                    this.setCurrentStep()
                }
            })
        },

        // 查询发票类目
        getGoodsAndServices(){
            getGoodsAndServicesList().then(res => {
                this.goodsAndServicesData = res.obj
            })
        },

        // 选择其他项目结束
        handelSelectOver(data){
            let arr = JSON.parse(JSON.stringify(this.currentProjectData))
            this.otherProjectData = JSON.parse(JSON.stringify(data))
            this.otherProjectData.unshift(arr)
            this.invoiceParams.publishedProjects = []
            this.totalPrice = 0
            this.otherProjectData.forEach(element => {
                this.totalPrice += element.allowInvoicing
                this.invoiceParams.publishedProjects.push({ id: element.id })
                this.invoiceParams.amount = this.totalPrice
            })
        },

        // 当前进行到哪步了
        setCurrentStep(){
            for(let i = 0; i < this.defaultInfo.approvalProcedures.length; i++){
                let item = this.defaultInfo.approvalProcedures[i]
                if(typeof(item.approved)=='boolean'){
                    this.active = i + 2
                }
            }
        },

        // 选择开票方式
        handleChangeInvoiceMethod(){
            this.$delete(this.invoiceParams, 'amount')
            this.otherProjectData = []
            this.invoiceParams.publishedProjects = []
        },

        // 提交
        handleClickSubmit(){
            this.$refs.addInvoiceForm.validate((valid) => {
                if(valid){
                    if(this.invoiceParams.id && this.invoiceParams.approval != 4){
                        this.$confirm(
                            `提交后,流程将被重置, 您确定要进行修改吗?`,
                            "注意",
                            {
                                confirmButtonText: "确定",
                                cancelButtonText: "取消",
                                type: "warning",
                                center: true
                            }
                        ).then(() => {
                            this.invoiceCreata()
                        })
                    }else{
                        this.invoiceCreata()
                    }
                }
            })
        },

        // 创建开票
        invoiceCreata(){
            this.btnLoading = true
            if(!this.invoiceParams.publishedProjects || this.invoiceParams.publishedProjects.length <= 1) this.invoiceParams.publishedProjects = [{ id: this.$route.query.projectId }]
            projectInvoiceCreate(this.invoiceParams).then(res => {
                this.btnLoading = false
                if(res.code === this.$successCode){
                    this.$message.success('提交成功~')
                    this.$router.push(`/project/${this.$route.query.projectId}/invoiceCenter`)
                }
            })
        },

        // 取消
        handleClickCancel(){
            if(this.$route.query.invoiceId && !this.isObjectValueEqual(this.copyInvoiceDetail, this.invoiceParams)){
                this.$confirm(
                    `您已修改发票,但还未进行提交,确定要离开此页面吗?`,
                    "注意",
                    {
                        confirmButtonText: "确定",
                        cancelButtonText: "取消",
                        type: "warning",
                        center: true
                    }
                ).then(() => {
                    this.$router.go(-1)
                })
                return
            }
            this.$router.go(-1)
        },

        // 比较两个对象是否相等
        isObjectValueEqual (oldData = {}, newData = {}) {
            // 类型为基本类型时,如果相同,则返回true
            if (oldData === newData)return true
            if (this.isObject(oldData) && this.isObject(newData) && Object.keys(oldData).length === Object.keys(newData).length) {
                // 类型为对象并且元素个数相同
                // 遍历所有对象中所有属性,判断元素是否相同
                for (const key in oldData) {
                    if (oldData.hasOwnProperty(key)) {
                        if (!this.isObjectValueEqual(oldData[key], newData[key])) {
                            // 对象中具有不相同属性 返回false
                            return false
                        }
                    }
                }
            }else if (this.isArray(oldData) && this.isArray(oldData) && oldData.length === newData.length) {
                // 类型为数组并且数组长度相同
                for (let i = 0, length = oldData.length; i < length; i++) {
                    if (!this.isObjectValueEqual(oldData[i], newData[i])) {
                        // 如果数组元素中具有不相同元素,返回false
                        return false
                    }
                }
            }else {
                // 其它类型,均返回false
                return false
            }
            // 走到这里,说明数组或者对象中所有元素都相同,返回true
            return true
        },

        // 判断此类型是否是Array类型
        isObject (obj) {
            return Object.prototype.toString.call(obj) ==='[object Object]'
        },

        // 判断此对象是否是Object类型
        isArray (arr) {
            return Object.prototype.toString.call(arr) ==='[object Array]'
        }

    }
}


</script>

<style lang="scss">
    .invoice-apply-wrap{
        .invoice-apply-form{
            padding-top: 40px;
            display: flex;
            justify-content: center;
    
            .form-wrap{
                width: 750px;
                margin: 0 20px;

                .add-other-btn{
                    display: inline-block;
                    color: var(--color-primary);
                }
            }
    
        }

        .b-btn-wrap{
            padding: 20px 0;
            text-align: center;

            .el-button{
                margin: 0 30px;
            }
        }

        .content-list{
            width: 100px;
            margin: 20px 5px;
            display: inline-block;
        }
    }
</style>