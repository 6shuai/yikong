<template>
    <el-dialog
        class="locating-result"
        width="1200px"
        title="寻位结果"
        :visible.sync="showLocatingResult"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        append-to-body
    >

        <!-- 上刊详情 -->
        <el-dialog
            width="520px"
            :visible.sync="showScreenContentOccupyList"
            append-to-body
        >
            <screen-content-occupy-detail
                v-if="showScreenContentOccupyList"
                :data="screenParams"
            ></screen-content-occupy-detail>
        </el-dialog>


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
                    min-width="80"
                >
                    <template slot-scope="scope">
                        <i v-if="list" class="el-icon-success"></i>
                        <div v-else>
                            <i class="el-icon-error"></i>
                            <el-button 
                                type="danger" 
                                plain
                                size="mini"
                                @click="handleShowOccupyDetail(lIndex, item.screenId, item.screen)"
                            >占位详情</el-button>
                        </div>
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
import ScreenContentOccupyDetail from './ScreenContentOccupyDetail'

export default {
    components: {
        ScreenContentOccupyDetail
    },
    data(){
        return {
            showLocatingResult: false,
            btnLoading: false,
            lockPositionParams: [],
            resData: [],

            // 总刊例价
            totalPrice: null,

            // 寻位结果是否有  没有空位的
            resultHasFalse: false,

            // 显示上刊详情
            showScreenContentOccupyList: false,

            // 查询上刊详情 传递的参数
            screenParams: {}
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
                    if(i === '屏幕名称') {
                        arr[index].screen = item[i]
                    }else if(i === 'screenId') {
                        arr[index].screenId = item[i]
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
        },

        // 查询屏幕占位详情
        handleShowOccupyDetail(date, screenId, screenName){
            this.screenParams = {
                date, 
                screenId,
                screenName
            }
            this.showScreenContentOccupyList = true
        }
    }
}

</script>

<style lang="scss" scoped>
    .locating-result{

        .cell {
            i{
                font-size: 20px;

                &.el-icon-success{
                    color: var(--color-success);
                }

                &.el-icon-error{
                    color: var(--color-danger);
                }
            }

            .el-button{
                padding: 5px;
            }
        }

        .total-price{
            text-align: right;
        }
    }
    
</style>


