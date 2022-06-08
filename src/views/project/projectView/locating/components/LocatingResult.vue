<template>
    <el-dialog
        class="locating-result"
        width="1200px"
        title="寻位结果"
        :visible.sync="showLocatingResult"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :show-close="false"
        append-to-body
    >

        <!-- 占位详情 -->
        <el-dialog
            width="520px"
            :visible.sync="showScreenContentOccupyList"
            :title="screenName"
            append-to-body
        >
            <screen-content-occupy-detail
                v-if="showScreenContentOccupyList"
                :data="screenParams"
                source="locating"
            ></screen-content-occupy-detail>
        </el-dialog>


        <div class="total-price mb20">
            <el-tag type="primary">总刊例价: {{ totalPrice ? totalPrice : '-' }}</el-tag>
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
                    v-for="(list, lIndex) in item.results"
                    :key="lIndex"
                    :label="list.date" 
                    min-width="80"
                >
                    <template slot-scope="scope">
                        <i v-if="list.result" class="el-icon-success"></i>
                        <div v-else>
                            <i class="el-icon-error"></i>
                            <el-button 
                                type="danger" 
                                plain
                                size="mini"
                                @click="handleShowOccupyDetail(list.date, item.id, item.screen)"
                            >占位详情</el-button>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
        </div>

        <span slot="footer" class="dialog-footer">
            <el-button
                type="primary"
                :loading="btnLoading"
                @click="handleGoLocating"
                >确 定</el-button
            >
        </span>
    </el-dialog>
</template>

<script>
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
            screenParams: {},

            // 占位详情屏幕名称
            screenName: ''
        }
    },
    methods: {
        // 显示寻位结果
        showLocatingResultDialog(data, screenList, screenTotalPrice){
            this.resultHasFalse = false
            this.showLocatingResult = true
            for(let i = 0; i < data.length; i++){
                for(let j = 0; j < screenList.length; j++){
                    if(data[i].id == screenList[j].id){
                        data[i].screen = screenList[j].displayName + (screenList[j].screenCount ? `(${screenList[j].location})` : '')
                    }
                }
                this.findResultHasFalse(data[i].results)
            }
            this.resData = data
            this.totalPrice = screenTotalPrice
        },

        // 查询寻位结果  是否含有 false
        findResultHasFalse(list){
            for(let i = 0; i < list.length; i++){
                if(!list[i].result){
                    this.resultHasFalse = true
                    return
                }
            }
        },

        // 查询屏幕占位详情
        handleShowOccupyDetail(date, screenId, screenName){
            this.screenParams = {
                date, 
                screenId
            }
            this.screenName = screenName + ' - ' + date
            this.showScreenContentOccupyList = true
        },

        // 跳转到锁位列表
        handleGoLocating(){
            if(this.resultHasFalse){
                this.$emit('lockFail')

                // 含有锁位失败的屏幕  关闭寻位结果 重新选择屏幕再提交
                this.showLocatingResult = false
            }else{
                this.$router.push(`/project/${this.$route.params.id}/locating`)
            }
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


