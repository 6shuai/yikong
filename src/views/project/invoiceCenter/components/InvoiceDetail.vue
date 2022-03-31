<template>
    <div class="invoice-detail-wrap">
        <el-row class="invoice-apply-form" :gutter="20">
            <el-col :span="12">
                <el-form label-width="100px" v-if="data.organization">
                    <el-form-item label="开票方式">{{ data.merge ? '合并开票' : '普通开票' }}</el-form-item>
                    <div v-if="data.merge">
                        <el-form-item label="合并开票项目"></el-form-item>
                        <invoice-project-list :projectData="otherProjectData"></invoice-project-list>
                    </div>
                    <div v-else>
                        <el-form-item label="项目名称">{{ otherProjectData[0] ? otherProjectData[0].displayName : '' }}</el-form-item>
                        <el-form-item label="发票金额">{{ data.amount }}</el-form-item>
                    </div>
                    <el-form-item label="发票类型">{{ data.invoiceType == 1 ? '增值税普通发票' : '增值税专用发票' }}</el-form-item>
                    <el-form-item label="发票类目">{{ data.goodsAndServicesName }}</el-form-item>
                    <el-form-item label="邮箱">{{ data.organization.email }}</el-form-item>
                    <el-form-item label="备注">{{ data.description }}</el-form-item>
                </el-form>
            </el-col>
    
            <el-col :span="12">
                <el-form label-width="100px">
                    <el-form-item label="纳税人识别号">{{ data.organization.taxpayerNumber }}</el-form-item>
                    <el-form-item label="企业地址">{{ data.organization.address }}</el-form-item>
                    <el-form-item label="企业电话">{{ data.organization.telephone }}</el-form-item>
                    <el-form-item label="开户行">{{ data.organization.bank }}</el-form-item>
                    <el-form-item label="开户行账号">{{ data.organization.account }}</el-form-item>
                    <el-form-item label="申请日期">{{ data.applyTimeFormat }}</el-form-item>
                    <el-form-item label="驳回理由" class="reason-text" v-if="rejectText">{{ rejectText }}</el-form-item> 

                    <!-- 审批状态：1、已提交未审批；2、审批中；3、已通过；4、已拒绝 -->
                    <el-form-item label="发票操作" v-if="data.approval != 3 && showReviewStep">
                        <template slot-scope="scope">
                            <el-button 
                                type="primary" 
                                size="mini" 
                                @click="handleShowInvoiceEdit"
                            >
                                修改申请
                            </el-button>
                        </template>
                    </el-form-item> 
    
                    <!-- 只有最后一位审核员才能操作 -->
                    <div v-if="isLastOne && data.approval != 3">
                        <el-form-item label="发票材质">
                            <el-select 
                                v-model="invoiceReviewParams.material" 
                                filterable 
                                class="w220"
                                @change="$set(invoiceReviewParams, 'print','')"
                            >   
                                <el-option 
                                    v-for="item in invoiceMaterial" 
                                    :key="item.id"
                                    :label="item.name" 
                                    :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="上传发票">
                            <upload-img 
                                v-if="invoiceReviewParams.material == 1"
                                :isArray="false" 
                                :imgList="invoiceReviewParams.print"
                                @uploadImgPath="invoiceUploadSuccess"
                            ></upload-img>

                            <div v-if="invoiceReviewParams.material == 2">
                                <el-upload
                                    class="upload-pdf"
                                    drag
                                    :action="action"
                                    accept=".pdf"
                                    :show-file-list="false"
                                    :on-success="uploadSuccess"
                                    :on-error="uploadError"
                                    multiple>
                                    <i class="el-icon-document"></i>请上传发票文件
                                </el-upload>

                                <a class="pdf-file" :href="invoiceReviewParams.print" v-if="invoiceReviewParams.print" target="_blank">{{ invoiceReviewParams.print }}</a>

                            </div>

                        </el-form-item>
                    </div>

                    <!-- 审核过 -->
                    <div v-if="data.approval == 3">
                        <el-form-item label="发票材质">{{ invoiceReviewParams.material == 1 ? '纸质版' : '电子版' }}</el-form-item>
                        <el-form-item label="查看发票">
                            <el-image
                                class="invoice-img"
                                v-if="invoiceReviewParams.material == 1"
                                :src="invoiceReviewParams.print"
                                :preview-src-list="[invoiceReviewParams.print]"
                                fit="cover"
                            ></el-image>
                            <a class="pdf-file" :href="invoiceReviewParams.print" v-if="invoiceReviewParams.material==2" target="_blank">{{ invoiceReviewParams.print }}</a>
                        </el-form-item>
                    </div>

                </el-form>
            </el-col>
        </el-row>
    
        <!-- 审核操作 -->
        <div class="review-wrap" v-if="!showReviewStep && (data.approval == 1 || data.approval == 2) && !isApproved">
            <div class="turn-down-reson-list">
                <p>请选择驳回理由: <span v-if="!invoiceReviewParams.reason || (invoiceReviewParams.reason == 'other' && !invoiceReviewParams.reasonContent)" class="trun-down-tip">进行驳回操作前,请先选择驳回理由!</span></p>
                <div class="reson-wrap">
                    <el-radio-group v-model="invoiceReviewParams.reason">
                        <el-radio v-for="item in reasonData" :key="item.id" :label="item.id">{{ item.reason }}</el-radio>
                        <el-radio label="other">
                            <span>其他</span>
                            <el-input v-model.trim="invoiceReviewParams.reasonContent"></el-input>
                        </el-radio>
                    </el-radio-group>
                </div>
            </div>

            <div class="btn-wrap">
                <el-button 
                    type="danger" 
                    :disabled="!invoiceReviewParams.reason || (invoiceReviewParams.reason == 'other' && !invoiceReviewParams.reasonContent)"
                    :loading="btnLoading"
                    @click="handleReview(0)"
                >
                    驳 回
                </el-button>
                <el-button 
                    type="primary"
                    :loading="btnLoading"
                    @click="handleReview(1)"
                >通 过</el-button>
            </div>

        </div>
    </div>

</template>

<script>
import UploadImg from '@/components/Upload/UploadImg'
import { financeCommissionInvoiceTurnDownReasonList, financeCommissionInvoiceReview } from '@/api/finance'
import { uploadUrl } from '@/utils'
import qs from 'qs'
import InvoiceProjectList from './InvoiceProjectList'

export default {
    components: {
        UploadImg,
        InvoiceProjectList
    },
    props: {
        data: Object,
        otherProjectData: Array,

        // 驳回原因
        rejectText: String,

        // 是否可以修改
        allowUpdate: Boolean,

        // 是否最后一位审核员
        isLastOne: Boolean,

        // 是否显示步骤条
        showReviewStep: Boolean,

        // 审核步骤信息
        approvalProcedures: Array
    },
    data(){
        return {
            // 发票材质 1纸质版  2电子版
            invoiceMaterial: [
                { id: 1, name: '纸质版' },
                { id: 2, name: '电子版' }
            ],

            // 发票审核参数
            invoiceReviewParams: {
                // 选中的发票材质
                material: 1
            },

            // 驳回理由列表
            reasonData: [],

            btnLoading: false,

            // 上传文件 接口地址
            action: uploadUrl,

            // 当前审核人是否已经审核过
            isApproved: false
        }
    },
    mounted() {
        
        // 当前审核人数据
        if(this.approvalProcedures && this.approvalProcedures.length){
            let data = JSON.parse(localStorage.loginData)
            let userId = data.id
            let currentReviewInfo = this.approvalProcedures.find((n) => n.person == userId)
            this.isApproved =  currentReviewInfo ? currentReviewInfo.approved : false
        } 

        if(!this.showReviewStep && this.allowUpdate) {
            this.getReasonList()
        }
    },
    methods: {
        // 修改申请
        handleShowInvoiceEdit(){
            this.$parent.$parent.showInvoiceDetail = false
        },
        
        //上传发票纸质版 成功
        invoiceUploadSuccess(path){
            this.invoiceReviewParams.print = path
        },

        // 上传发票文件 成功
        uploadSuccess(res){
            if(res.code === this.$successCode){
                this.$message.success('上传成功~')
                this.$set(this.invoiceReviewParams, 'print', res.obj.path)
                console.log(res.obj.path, this.invoiceReviewParams)
            }else{
                this.$message.error(res.message)
            }
        },

        //上传失败
        uploadError() {
            this.$message.error('上传失败~')
        },

        // 获取驳回理由列表
        getReasonList(){
            financeCommissionInvoiceTurnDownReasonList().then(res => {
                if(res.code === this.$successCode){
                    this.reasonData = res.obj
                }
            })
        },

        // 审核操作   isApproved 驳回 0  通过 1
        handleReview(state){
            if(this.isLastOne && !this.invoiceReviewParams.material){
                this.$message.error('您未选择发票材质~')
                return
            }else if(this.isLastOne && !this.invoiceReviewParams.print){
                this.$message.error('您未上传发票图片~')
                return
            }
            

            // 驳回理由是否自定义的
            let { reasonContent } = this.invoiceReviewParams
            if(reasonContent) delete this.invoiceReviewParams.reason

            this.invoiceReviewParams.isApproved = state
            this.invoiceReviewParams.invoice = this.$route.query.invoiceId

            this.btnLoading = true
            financeCommissionInvoiceReview(qs.stringify(this.invoiceReviewParams)).then(res => {
                this.btnLoading = false
                if(res.code === this.$successCode){
                    this.isApproved = true
                    this.$message.success({
                        message: '操作成功~',
                        duration: 1500,
                        onClose: () => {
                            this.$router.go(-1);
                        },
                    })
                }
            })
        }
    }
}
</script>

<style lang="scss">
    .invoice-detail-wrap{
        .invoice-apply-form{
            .layout-list-wrap{
                display: flex;
                align-items: center;
                position: relative;
            }
        }

        .upload-pdf .el-upload-dragger{
            width: 150px;
            height: 42px;
        }

        .pdf-file{
            color: var(--color-primary);
            text-decoration: underline;
        }

        .invoice-img{
            width: 150px;
            height: 150px;
            border-radius: 4px;
        }

        .review-wrap{
            padding-top: 20px;
            border-top: 1px solid #e5e5e5;

            .turn-down-reson-list{
                p{
                    padding: 10px 0;

                    .trun-down-tip{
                        padding-left: 20px;
                        color: red;
                    }
                }

                .reson-wrap{
                    margin: 0 120px;
                    .el-radio{
                        width: 220px;
                    }

                    .el-input{
                        width: 170px;
                    }
                }
            }

            .btn-wrap{
                text-align: center;
                margin-top: 40px;

                .el-button{
                    margin: 0 20px;
                }
            }
        }

        .reason-text, .reason-text label{
            color: var(--color-danger);
        }
    }
</style>