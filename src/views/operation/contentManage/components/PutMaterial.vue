<template>
    <div>
        <div 
            v-if="type == 'drag'"
            class="put-material-drag-wrap" 
            :class="'order-count-' + (order ? order.length : 1)"
            v-loading="uploadLoading"
        >
            <div 
                class="item" 
                :class="{ 'active': item.hover }"
                v-for="(item, index) in order" 
                :key="index"
                @dragenter="$set(order[index], 'hover', true), selectedOrderIndex=index"
                @dragover="$set(order[index], 'hover', true), selectedOrderIndex=index"
                @dragleave="$set(order[index], 'hover', false)"
                @drop="handleDrop($event, index); $set(order[index], 'hover', false)"
            >

                <materialUpload ref="materialUpload" :multiple="true" @putMaterial="putMaterial"></materialUpload>

                <i class="el-icon-upload"></i>
                <p>添加至 {{ item.roomType == 1 ? '商场' : '小风景' }} 时间池</p>
            </div>
        </div>

        <el-dialog
            width="520px"
            title="选择时间池"
            class="select-time-pool-dialog"
            :visible.sync="showSelectTimePool"
            :show-close="false"
            append-to-body
        >
            <el-form label-width="180px">
                <el-form-item label="该素材所属的时间池">
                    <el-radio-group 
                        size="mini" 
                        v-model="selectedOrderIndex"
                    >
                        <el-radio 
                            v-for="(item, index) in order" 
                            :key="index"
                            :label="index"
                        >
                            {{ item.roomType == 1 ? '商场' : '小风景' }}
                        </el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button size="mini" @click="showSelectTimePool = false">取消</el-button>

                <div class="confirm-btn">
                    <el-button
                        size="mini"
                        type="primary"
                        @click="handleAddLayout"
                        >确认</el-button
                    >

                    <materialUpload v-if="type != 'other'" :multiple="true" @putMaterial="putMaterial"></materialUpload>
                    
                </div>
            </span>
        </el-dialog>

    </div>
</template>

<script>
import { operationPutMaterial } from '@/api/contentManage'
import MaterialUpload from '../../components/MaterialUpload'

export default {
    components: {
        MaterialUpload
    },
    props: {
        screenId: Number,
        type: String
    },
    data() {
        return {
            // 上传中
            uploadLoading: false,


            // 选择的订单index
            selectedOrderIndex: 0,

            order: [],

            // 显示选择时间池
            showSelectTimePool: false
        }
    },
    methods: {
        showUploadMaterial(order){
            this.order = order
            if(this.type === 'add' || this.type === 'other') this.showSelectTimePool = true
        },

        handleDrop(e){
            this.$emit('closeUpload')
            this.$refs.materialUpload.handleChangeFile(null, e.dataTransfer.files)
        },

        // 投放素材
        putMaterial(uploadContents){
            let { projectId, placeholder } = this.order[this.selectedOrderIndex]
            let data = {
                project: projectId,
                placeholder,
                contents: uploadContents
            }

            operationPutMaterial(data).then(res => {
                if(res.code === this.$successCode){
                    this.$emit('closeUpload')
                    this.$message.success('操作成功~')
                    this.showPutMaterial = false
                    this.$emit('putSuccess')
                }
            })
        },

        // 添加其他布局
        handleAddLayout(){
            if(this.type === 'add') return 
            this.showSelectTimePool = false
            this.$emit('addLayout', this.order[this.selectedOrderIndex].projectId)
        }
    }
}
</script>

<style lang="scss" scoped>

    .put-material-drag-wrap{
        position: absolute;
        top: 0;
        left: 0;
        z-index: 99;
        width: 100%;
        height: 100%;
        display: flex;
        flex-wrap: wrap;

        .item{
            background: rgba(17, 24, 39, 0.6);
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            color: #fff;
            border: 1px solid rgba(17, 24, 39, 0.75);
            cursor: pointer;
            position: relative;

            .el-icon-upload{
                font-size: 25px;
                padding: 20px 0;
            }

            &.active{
                background: rgba(2, 132, 199, 0.75);
            }

            &:hover{
                background: rgba(2, 132, 199, 0.75);
            }
        }
        
        &.order-count-1{
            .item{
                width: 100%;
                height: 100%;
            }
        }

        &.order-count-2{
            .item{
                width: 50%;
                height: 100%;
            }
        }

        &.order-count-3{
            .item{
                width: 50%;
                height: 50%;

                &:last-child{
                    width: 100%;
                }
            }
        }

        &.order-count-4{
            .item{
                width: 50%;
                height: 50%;
            }
        }
    }
</style>

<style lang="scss">
    .select-time-pool-dialog{
        .confirm-btn{
            display: inline-block;
            width: 56px;
            height: 28px;
            cursor: pointer;
            position: relative;

            input{
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                opacity: 0;
            }
        }
    }
</style>