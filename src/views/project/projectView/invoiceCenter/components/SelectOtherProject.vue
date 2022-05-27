<template>
    <el-dialog
        width="1200px"
        title="添加其他项目"
        :visible.sync="showAddOtherProjectDialog"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        append-to-body
    >
        <div class="invoice-add-other-project-wrap" v-if="showAddOtherProjectDialog">
            <div class="project-list">
                <div class="search-input">
                    <el-input 
                        prefix-icon="el-icon-search"
                        size="small"
                        v-model="projectKeyword"
                        @input="handleSearchProject"
                    ></el-input>
                </div>
                <div class="project-table">
                    <el-row class="head">
                        <el-col :span="2">
                            <el-checkbox 
                                :value="resData.length && resData.length==selectedProjectList.length"
                                @change="handleAllSelected"
                            ></el-checkbox>
                        </el-col>
                        <el-col :span="8">项目名称</el-col>
                        <el-col :span="7">回款金额</el-col>
                        <el-col :span="7">可开票金额</el-col>
                    </el-row>
                    <el-scrollbar class="project-list-scrollbar hidden-scroll-x">
                        <el-row 
                            class="head" 
                            v-for="item in resData"
                            :key="item.id"
                            :class="{ 'highlight': item.payment < item.allowInvoicing }"
                        >
                            <el-col :span="2">
                                <el-checkbox 
                                    :value="item.checked" 
                                    :disabled="!item.payment"
                                    @change="item.checked = !item.checked; handleClickCheckbox(item)"
                                ></el-checkbox>
                            </el-col>
                            <el-col :span="8">{{ item.displayName }}</el-col>
                            <el-col :span="7">{{ item.payment }}</el-col>
                            <el-col :span="7">{{ item.allowInvoicing }}</el-col>
                        </el-row>
                    </el-scrollbar>
                </div>
            </div>
            <div class="arraw-wrap">
                <div class="arraw arraw-right" @click="handleMoveRight"><i class="el-icon-d-arrow-right"></i></div>
                <div class="arraw arraw-left" @click="handleMoveLeft"><i class="el-icon-d-arrow-left"></i></div>
            </div>
            <div class="selected-project-list">
                <div class="total-warp">
                    <span>已选择{{ rightData.length }}个项目</span>
                    <span class="total-price">合计 {{ moneyFormat(totalPrice) }}</span>
                </div>
                <el-row>
                    <el-col :span="2">
                        <el-checkbox 
                            :value="rightSelectedProjectIdList.length && rightSelectedProjectIdList.length == rightData.length" 
                            @change="handleAllSelectedRight"
                        ></el-checkbox>
                    </el-col>
                    <el-col :span="22">项目名称</el-col>
                </el-row>
                <el-scrollbar class="right-project hidden-scroll-x">
                    <el-row 
                        v-for="(item, index) in rightData"
                        :key="item.id"
                    >
                        <el-col :span="2">
                            <el-checkbox :value="item.checked" @change="item.checked = !item.checked; $set(rightData, index, item);handleClickRightCheckbox(item)"></el-checkbox>
                        </el-col>
                        <el-col :span="22">
                            <i v-if="item.payment < item.allowInvoicing" class="highlight el-icon-warning"></i>
                            {{ item.displayName }}
                        </el-col>
                    </el-row>
                </el-scrollbar>
            </div>
        </div>

        <span slot="footer" class="dialog-footer">
            <el-button @click="showAddOtherProjectDialog = false">取 消</el-button>
            <el-button
                type="primary"
                :disabled="!rightData || !rightData.length"
                :loading="createdLoading"
                @click="handleCreate"
                >确 定</el-button
            >
        </span>
    </el-dialog>
</template>

<script>
import InvoiceProjectDetail from '@/views/project/projectView/invoiceCenter/components/ProjectDetail'
import { priceFormat } from '@/utils/index'

export default {
    components: {
        InvoiceProjectDetail
    },
    data(){
        return {
            showAddOtherProjectDialog: false,
            createdLoading: false,

            // 项目列表 
            projectList: [],

            resData: [],

            // 已选中的项目
            selectedProjectList: [],

            // 已选中的项目id
            selectedProjectIdList: [],

            // 穿梭框右侧数据
            rightData: [],

            // 右侧已选项目id
            rightSelectedProjectIdList: [],

            // 已选的项目未开票金额合计
            totalPrice: 0,

            // 项目搜索关键字
            projectKeyword: ''
        }
    },
    computed: {
        // 金额格式化
        moneyFormat(){
            return (key) => {
                return priceFormat(key)
            }
        },
    },
    methods: {
        // 显示选择其他项目
        showSelectOtherProjectDialog(data = [], selectData = [], selectDataIds = []){
            this.selectedProjectList = []
            this.selectedProjectIdList = []
            this.rightData = []
            this.rightSelectedProjectIdList = []


            this.resData = JSON.parse(JSON.stringify(data)).filter((item) => item.id != this.$route.query.projectId)
            this.projectList = JSON.parse(JSON.stringify(this.resData))

            this.showAddOtherProjectDialog = true

            if(selectData.length > 1){
                for(let i = 0; i < selectData.length; i++){
                    this.handleClickCheckbox(selectData[i])
                }
                this.handleMoveRight()
            }
        },

        // 搜索项目
        handleSearchProject(){
            if(!this.projectKeyword){
                this.resData = JSON.parse(JSON.stringify(this.projectList))
                return
            }
            this.resData = this.projectList.filter((item) => item.displayName.indexOf(this.projectKeyword) > -1)
        },

        // 选择多选框
        handleClickCheckbox(item){
            if(this.selectedProjectIdList.includes(item.id)){
                this.selectedProjectList.splice(this.selectedProjectIdList.indexOf(item.id),1)
                this.selectedProjectIdList.splice(this.selectedProjectIdList.indexOf(item.id),1)
            }else{
                this.selectedProjectList.push(item)
                this.selectedProjectIdList.push(item.id)
            }
        },

        // 全选
        handleAllSelected(){
            let result = true
            if(this.resData.length == this.selectedProjectList.length){
                result = false
            }

            this.selectedProjectList = []
            this.selectedProjectIdList = []

            for(let i = 0; i < this.resData.length; i++){
                this.resData[i].checked = result
                if(result && this.resData[i].payment) {
                    this.selectedProjectList.push(this.resData[i]) 
                    this.selectedProjectIdList.push(this.resData[i].id)
                }
            }
        },

        // 右侧多选框
        handleClickRightCheckbox(item){
            if(this.rightSelectedProjectIdList.includes(item.id)){
                this.rightSelectedProjectIdList.splice(this.rightSelectedProjectIdList.indexOf(item.id),1)
            }else{
                this.rightSelectedProjectIdList.push(item.id)
            }
        },

        // 右侧全选
        handleAllSelectedRight(){
            let result = true
            if(this.rightData.length == this.rightSelectedProjectIdList.length){
                result = false
            }
            this.rightSelectedProjectIdList = []

            for(let i = 0; i < this.rightData.length; i++){
                this.rightData[i].checked = result
                if(result) {
                    this.rightSelectedProjectIdList.push(this.rightData[i].id)
                }
            }
        },

        // 左侧已选中的数据 发送到右侧
        handleMoveRight(){
            if(!this.selectedProjectIdList.length) return 

            let data = []
            data = this.resData.filter((item) => {
                item.checked = false
                return this.selectedProjectIdList.includes(item.id)
            })
            this.resData = this.resData.filter((item) => {
                return !this.selectedProjectIdList.includes(item.id)
            })
            this.rightData = this.rightData.concat(data).sort((a,b) =>  a.id-b.id)
            this.selectedProjectList = []
            this.selectedProjectIdList = []
            this.notInvoicedPriceTotal()
        },

        handleMoveLeft(){
            if(!this.rightSelectedProjectIdList.length) return 

            let data = []
            data = this.rightData.filter((item) => {
                item.checked = false
                return this.rightSelectedProjectIdList.includes(item.id)
            })
            this.rightData = this.rightData.filter((item) => {
                return !this.rightSelectedProjectIdList.includes(item.id)
            })
            this.resData = this.resData.concat(data).sort((a,b) =>  a.id-b.id)
            this.rightSelectedProjectIdList = []  
            this.notInvoicedPriceTotal()
        },

        // 未开票金额合计
        notInvoicedPriceTotal(){
            let price = 0
            this.rightData.forEach(item => {
                price += item.allowInvoicing
            })
            this.totalPrice = price
        },

        // 提交
        handleCreate(){
            this.showAddOtherProjectDialog = false
            this.$emit('selectOver', this.rightData)
        }
    }
}
</script>

<style lang="scss" scoped>
    $border: 1px solid #e5e5e5;

    .invoice-add-other-project-wrap{
        display: flex;   
        align-items: center;

         .highlight{
            color: red;
        }

        .el-row{
            .el-col{
                height: 40px;
                line-height: 40px;
                border-right: $border;
                border-bottom: $border;   
                text-align: center;
    
                &:last-child{
                    border-right: none;
                }
            }

            &:hover{
                background: #d6d6d6;
            }

        }
        
        .project-list{
            width: 710px;
            height: 494px;
            border: $border;
            
            .search-input{
                padding: 10px;
                border-bottom: $border;
            }

            .project-table{
                .project-list-scrollbar{
                    height: 415px;
                }
            }
        }

        .arraw-wrap{
            width: 120px;
            padding: 0 20px;

            .arraw{
                padding: 5px 20px;
                margin: 20px 0;
                font-size: 26px;
                border: $border;
                border-radius: 6px;
                text-align: center;
                cursor: pointer;

                &:hover{
                    border-color: var(--color-primary);
                    color: var(--color-primary);
                }
            }
        }

        .selected-project-list{
            width: 350px;
            height: 494px;
            border: $border;

            .total-warp{
                height: 52px;
                line-height: 52px;
                background: #000;
                color: #fff;
                padding: 0 10px;
                border: $border;
                display: flex;

                .total-price{
                    flex: 1;
                    text-align: right;
                }
            }

            .right-project{
                height: 440px;
            }
        }

    }
</style>