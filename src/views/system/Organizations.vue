<template>
    <el-card shadow="never">
        <div slot="header" class="clearfix">
            组织列表
        </div>
        <div class="top-operation-wrap">
            <el-button size="small" type="primary" @click="addGroupDialog=true;addParams={}">新建组织</el-button>
        </div>
        <el-table
            v-loading="tLoading"
            size="small"
            :data="resData"
            style="width: 100%;margin-bottom: 20px;"
            row-key="id"
            border>
            <el-table-column prop="accountName" label="组织名称" min-width="80"></el-table-column>
            <el-table-column prop="nickname" label="拥有者" min-width="80"></el-table-column>
            <el-table-column
                label="操作"
                min-width="80">
                <template slot-scope="scope">
                    <el-popover
                        style="margin-left:10px"
                        placement="top"
                        :ref="scope.row.id"
                        width="200">
                        <p>此操作将解散此组织【{{scope.row.nickname}}】, 是否继续?</p>
                        <div style="text-align: right; margin: 0">
                            <el-button size="mini" type="text" @click="$refs[scope.row.id].doClose()">取消</el-button>
                            <el-button type="primary" size="mini" @click="delCurrentGroup(scope.row.id)">确定</el-button>
                        </div>
                        <el-button 
                            size="mini"
                            type="danger"
                            slot="reference"
                        >
                            解散组织
                        </el-button>
                    </el-popover>
                </template>
            </el-table-column>
        </el-table>

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
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addGroupDialog=false">取 消</el-button>
                <el-button type="primary" :loading="addBtnLoading" @click="addGroupSureBtn">确 定</el-button>
            </span>
        </el-dialog>
    </el-card>
</template>

<script>
import { organizationCreated, organizationDelete } from '@/api/user';
export default {
    data(){
        return {
            resData: [],
            tLoading: false,
            addParams:{}, 
            addGroupDialog: false,      //添加组织modal
            addBtnLoading: false,       //添加按钮loading
        }
    },
    created() {
        // this.init();
    },
    methods: {
        init(){
            
        },

        //添加组织
        addGroupSureBtn(){
            if(!this.addParams.displayName){
                this.$message.warning('请填写组织名称~');
                return
            }
            this.addBtnLoading = true;
            this.addParams.owner = this.$store.state.user.loginData.id;
            organizationCreated(this.addParams).then(res => {
                this.addBtnLoading = false;
                if(res.code === this.$successCode){
                    this.$message.success('添加成功~');
                    this.addGroupDialog = false;
                    this.init();
                }
            })
        },

        //删除组织
        delCurrentGroup(){
            organizationDelete().then(res => {
                if(res.code === thsi.$successCode){
                    this.$message.success('解散组织成功~');
                    this.init();
                }
            })
        }
    },
}
</script>