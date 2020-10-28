<template>
	<el-card class="template-card question-wrap" shadow="never">
		<div slot="header" class="clearfix">
			<span>组织类型</span>
        </div>

        <div class="top-operation-wrap">
            <el-button 
                class="created-btn"
                type="primary" 
                icon="el-icon-plus" 
                @click="showCreatedDialog()"
                size="small">
                创建组织类型
            </el-button>

            <el-input  
                clearable
                size="small"
                placeholder="组织类型名称"
                v-model="params.displayName"
                @input="search"
            ></el-input>
        </div>

		<el-table
			v-loading="tableLoading"
			stripe
			size="small"
			:data="resData"
			style="width: 100%;margin-bottom: 20px;"
			row-key="id"
            border>
            <el-table-column prop="id" label="ID" min-width="50"></el-table-column>
            <el-table-column prop="displayName" label="组织类型名称" min-width="100"></el-table-column>
            <el-table-column prop="commonType" label="是否组织外类型" min-width="50">
                <template slot-scope="scope">
                    {{scope.row.commonType ? '是' : '否'}}
                </template>
            </el-table-column>
			<el-table-column
				label="操作"
				width="150">
				<template slot-scope="scope">
                    <el-button 
                        type="success" 
                        size="mini" 
                        @click="showCreatedDialog(scope.row)"
                    >
                        编辑
                    </el-button>

                    <el-popover
                        placement="top"
                        :ref="'del'+scope.row.id"
                        width="200">
                        <p>此操作将删除此条组织类型【{{scope.row.displayName}}】, 是否继续?</p>
                        <div style="text-align: right; margin: 0">
                            <el-button size="mini" type="text" @click="$refs['del'+scope.row.id].doClose()">取消</el-button>
                            <el-button type="primary" size="mini" :loading="delLoading" @click="organizationTypeDelete(scope.row.id)">确定</el-button>
                        </div>
                        <el-button 
                            slot="reference"
                            size="mini"
                            type="danger"
                        >
                            删除
                        </el-button>
                    </el-popover>
				</template>
			</el-table-column>
		</el-table>

		<el-pagination
			background
			layout="total, prev, pager, next, sizes"
			:page-sizes="[40, 80, 100]"
			:current-page="Number(params.pageNo)"
			@size-change="handleSizeChange"
			@current-change="handleCurrentChange"
			:total="totalCount">
        </el-pagination>
        

        <!-- 添加组织类型 -->
        <el-dialog
            :title="addParams.id ? '编辑组织类型' : '添加组织类型'"
            :visible.sync="dialogVisible"
            width="30%">
            <el-form 
                label-width="130px"
                ref="addForm"
                :close-on-click-modal="false"
                :close-on-press-escape="false"
                :model="addParams"
                :rules="addParamsRules"
            >   
                <el-form-item label="是否组织外类型" prop="commonType">
                    <el-switch
                        v-model="addParams.commonType"
                        :active-value="1"
                        :inactive-value="0"
                    >
                    </el-switch>
                </el-form-item>
                <el-form-item label="组织类型名称" prop="displayName">
                    <el-input v-model="addParams.displayName" placeholder="组织类型名称"></el-input>
                </el-form-item>
            </el-form>

            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" :loading="addLoading" @click="createdType">确 定</el-button>
            </span>
        </el-dialog>

	</el-card>
</template>

<script>
import { organizationTypeList, organizationTypeCreated, organizationTypeDelete } from '@/api/user';
import { timeDisposeTool } from '@/mixins';
export default {
    mixins: [timeDisposeTool],
    data(){
        return {
            resData: [],
			params: {
				pageNo: 1,
                pageSize: 40,
			},
			totalCount: 0,                 //总条数
            tableLoading: false,
            dialogVisible: false,
            addParams: {                   //添加组织类型参数
                commonType: 0
            },                        
            addParamsRules: {
                commonType: [{ required: true, trigger: "blur", message: '请选择是否组织外类型~' }],
                displayName: [{ required: true, trigger: "blur", message: '请填写组织类型~' }],
            },
            delLoading: false,            //确定删除按钮 loading
            addLoading: false,            //创建类型 按钮 loading
        }
    },
    created() {
        this.init();
    },
    methods: {
        init(){
            this.tableLoading = true;
            organizationTypeList(this.params).then(res => {
                this.tableLoading = false;
                if(res.code === this.$successCode){
                    this.resData = res.obj.list;
                    this.totalCount = res.obj.totalRecords;
                }
            })
		},

        // 显示添加类型 模态框
        showCreatedDialog(data={commonType: 0}){
            this.addParams = JSON.parse(JSON.stringify(data));
            this.addParams.commonType = data.commonType ? 1 : 0;
            this.dialogVisible = true;
        },

        //添加或编辑  组织类型
        createdType(){
            this.$refs.addForm.validate(valid => {
				if (valid) {
                    this.addLoading = true;
                    organizationTypeCreated(this.addParams).then(res => {
                        this.addLoading = false;
                        if(res.code === this.$successCode){
                            this.$message.success('操作成功~');
                            this.dialogVisible = false;
                            this.init();
                        }
                    })
                }
            })
        },
		
		//删除组织类型
		organizationTypeDelete(id){
            this.delLoading = true;
            organizationTypeDelete(id).then(res => {
                this.delLoading = false;
                if(res.code === this.$successCode){
                    this.$refs[`del${id}`].doClose()
                    this.$message.success('删除成功~');
                    this.init();
                }
            })
        },
        
        //筛选搜索
        search(){
            this.params = {
                ...this.params,
                pageNo: 1,
            };
            this.init();
        },

		//页码
        handleCurrentChange(page){
            this.params.pageNo = page;
            this.init();
        },

        //每页多少条
        handleSizeChange(num){
            this.params.pageSize = num;
            this.init();
		}
    }
}
</script>
