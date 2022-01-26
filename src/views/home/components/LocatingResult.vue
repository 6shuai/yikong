<template>
    <el-dialog
        class="locating-result"
        width="740px"
        title="寻位结果"
        :visible.sync="showLocatingResult"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        append-to-body
    >
        <div class="total-price mb20">
            <el-tag type="primary">总刊例价: {{ totalPrice }}</el-tag>
        </div>

        <div 
            class="screen-result"
            v-for="(item, index) in resData"
            :key="index"
        >
            <h3>{{ item.screen }}</h3>
            <el-table
                class="mt20 mb20"
                stripe
                size="small"
                row-key="id"
                :data="[item]"
                border>
                <el-table-column 
                    v-for="(list, lIndex) in item.date"
                    :prop="lIndex" 
                    :key="lIndex"
                    :label="lIndex" 
                    min-width="60"
                >
                    <template slot-scope="scope">
                        <i v-if="list" class="el-icon-success"></i>
                        <i v-else class="el-icon-error"></i>
                    </template>
                </el-table-column>
            </el-table>
        </div>

        <span slot="footer" class="dialog-footer">
            <el-button @click="showLocatingResult = false">取 消</el-button>
            <el-button
                type="primary"
                :loading="btnLoading"
                @click="handleLockPosition"
                :disabled="resultHasFalse"
                >锁 位</el-button
            >
        </span>
    </el-dialog>
</template>

<script>
import { projectLockPosition } from '@/api/project'
export default {
    data(){
        return {
            showLocatingResult: false,
            btnLoading: false,
            lockPositionParams: [],
            resData: [],

            // 总刊例价
            totalPrice: null,

            // 寻位结果是否有  没有空位的
            resultHasFalse: false
        }
    },
    methods: {
        // 显示寻位结果
        showLocatingResultDialog(data, params){
            this.showLocatingResult = true
            this.lockPositionParams = params
            this.totalPrice = data.totalPrice
            this.dataFormatting(data.screenPlaceholders)
        },

        // 数据格式化
        dataFormatting(data){
            let arr = []
            this.resultHasFalse = false
            data.forEach((item, index) => {
                arr[index] = {
                    screen: '',
                    date: {}
                }
                for(var i in item){
                    if(i == '屏幕名称') {
                        arr[index].screen = item[i]
                    }else {
                        arr[index].date[i] = item[i]
                        if(!item[i]) this.resultHasFalse = true
                    }
                    
                }  
            })

            this.resData = arr
        },

        // 锁位
        handleLockPosition(){
            projectLockPosition(this.lockPositionParams).then(res => {
                if(res.code === this.$successCode){
                    this.$message.success('锁位成功~')
                    this.showLocatingResult = false
                    this.$emit('lockPositionSuccess')
                }
            })
        }
    }
}
</script>

<style lang="scss" scoped>
    .locating-result{

        .cell>i{
            font-size: 20px;

            &.el-icon-success{
                color: var(--color-success);
            }

            &.el-icon-error{
                color: var(--color-danger);
            }
        }

        .total-price{
            text-align: right;
        }
    }
</style>