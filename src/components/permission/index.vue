<template>
    <!-- 操作权限授权 -->
    <el-dialog
        class="add-game-data"
        title="授权"
        :visible.sync="dialogVisible"
        width="1200px"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
    >   
    <div v-if="premissionData.length">
    </div>
        <el-table
            ref="multipleTable"
            :data="tableData"
            tooltip-effect="dark"
            v-loading="tableLoading"
            style="width: 100%"
            border
            stripe
            @selection-change="handleSelectionChange">
            <el-table-column
                fixed
                label="ID"
                prop="userId"
                width="60">
            </el-table-column>
            <el-table-column
                fixed
                label="操作"
                prop="accountName"
                width="60">
                <template slot-scope="scope">
                    <el-link @click="colCheckAll(scope.$index)" type="primary">全选</el-link>
                </template>
            </el-table-column>
            <el-table-column
                fixed
                label="昵称"
                prop="accountName"
                width="120">
            </el-table-column>
            <el-table-column 
                v-for="(item, index) in premissionData"
                :key="index"
                :label="item.value"
                min-width="130">
                <template slot="header">
                    <el-checkbox 
                        v-model="item.checked"
                        @change="changeCheckAll($event, index, item.value)"
                    >{{item.label}}</el-checkbox>
                </template>
                <template slot-scope="scope">
                    <el-checkbox 
                        :true-label="1"
                        :false-label="0"
                        size="medium"
                        v-model="scope.row[item.value]"
                        @change="changeCheckbox($event, scope.$index, index, item.value)"
                    ></el-checkbox>
                </template>
            </el-table-column>
        </el-table>

        <el-pagination
            background
            class="mt20"
            layout="total, prev, pager, next, sizes"
            :page-sizes="[20, 50, 100]"
            :current-page="Number(params.pageNo)"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :total="totalCount">
        </el-pagination>

        <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button
                type="primary"
                v-loading="btnLoading"
                @click="handleChangePerm"
                >确 定</el-button
            >
        </span>
    </el-dialog>
</template>

<script>
import { parse } from 'path-to-regexp';
export default {
    props: ['premission', 'premissionApi'],
    data() {
        return {
            dialogVisible: false,
            btnLoading: false,
            tableLoading: false,
            params: {
                pageNo: 1,
                pageSize: 20,
            },
            totalCount: 0,
            tableData: [],
            selected: [],          //要修改的列表
            editParams: {},
            checkAll: [],
            premissionData: [],
        };
    },
    methods: {
        showPermission(params) {
            this.dialogVisible = true;
            this.editParams = params;
            this.params = {
                ...params
            }
            this.premissionData = JSON.parse(JSON.stringify(this.premission));
            if(this.premissionApi.list){
                this.init();
            }
        },

        init(){
            this.tableLoading = true;
            this.premissionApi.list(this.params).then(res => {
                this.tableLoading = false;
                if(res.code === this.$successCode){
                    let { list, totalRecords } = res.obj;
                    this.tableData = list;
                    this.totalCount = totalRecords;
                }
            })
        },

        handleSelectionChange(val){
            console.log(val)
        },

        //修改权限
        handleChangePerm() {
            let data = [];
            this.selected.forEach(item => {
                data.push({
                    ...this.editParams,
                    ...item,
                })
            }) 
            if(!data.length){
                this.$message.warning('没做啥修改啊 (⊙o⊙)');
                return
            }
            this.premissionApi.update(data).then(res => {
                if(res.code === this.$successCode){
                    this.$message.success('操作成功~');
                    this.dialogVisible = false;
                }
            })
        },

        //页码
        handleCurrentChange(page){
            this.params.pageNo = page;
        },

        //每页条数
        handleSizeChange(size){
            this.params.pageSize = size;
        },

        //修改多选框
        changeCheckbox(event, $index, index, value){
            let tag = true;
            let data = this.tableData[$index];

            this.selected.forEach((item, i) => {
                if(item.userId == data.userId){
                    this.$set(this.selected, i, data);
                    tag = false;
                }
            })
            if(tag){
                this.selected.push(data);
            }

            if(!value) return;
            let len = 0;
            this.tableData.forEach(item => {
                if(item[value]){
                    len += 1;
                }
            })
            
            this.resetCheckAll(index, len == this.tableData.length);
        },

        //全选
        changeCheckAll(event, index, value){
            this.tableData.forEach((item, index) => {
                item[value] = event;
                this.$set(this.tableData[index], value, event);
            })
            this.selected = this.tableData;

            this.resetCheckAll(index, event);
        },

        resetCheckAll(index, state){
            let copy = JSON.parse(JSON.stringify(this.premissionData));
            copy[index].checked = state;
            this.premissionData = [];
            this.$nextTick(() => {
                this.premissionData = copy;
            })
        },

        //按用户 行 全选
        colCheckAll($index){
            this.tableData[$index].state = !this.tableData[$index].state;
            let state = this.tableData[$index].state;
            this.premissionData.forEach((item, index) => {
                this.tableData[$index][item.value] = state;
                this.changeCheckbox(!state, $index);
            })
        }
    },
};
</script>