<template>
    <el-dialog
        class="locating-result"
        width="1200px"
        :title="`${lockDate.publishDate} -- ${lockDate.dueDate} 寻位结果`"
        :visible.sync="showLocatingResult"
        :close-on-press-escape="false"
        append-to-body
    >

        <!-- 锁位失败详情 -->
        <lock-fail-detail ref="lockFailDetail"></lock-fail-detail>

        <div class="total-price mb20">
            <el-tag type="primary">总刊例价: {{ totalPrice ? totalPrice : '-' }}</el-tag>
        </div>

        <el-card 
            class="screen-result"
            v-for="(item, date,  index) in resData"
            :key="index"
        >
            <el-tag type="danger">{{ date }} 锁位失败</el-tag>

            <div class="screen-list">
                <div class="screen-item" 
                    v-for="screen in item" 
                    :key="screen.screenContent.id"
                    @click="handleShowOccupyDetail(date, screen)"
                >

                    <el-image class="screen-photo" fit="cover" :src="screen.screenContent.defaultShow"></el-image>

                    <div class="screen-name overflow">{{ screen.screenContent.displayName }} {{ screen.screenContent.location ? `(${screen.screenContent.location})` : '' }}</div>

                    <div class="screen-bottom flex-center">
                        <span v-if="screen.screenContent.cityName">{{ screen.screenContent.cityName }}</span>
                        <span v-if="screen.screenContent.levelName">{{ screen.screenContent.levelName }}</span>
                    </div>
                </div>
            </div>
        </el-card>

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
import LockFailDetail from './LockFailDetail'

export default {
    components: {
        ScreenContentOccupyDetail,
        LockFailDetail
    },
    data(){
        return {
            showLocatingResult: false,
            btnLoading: false,
            lockPositionParams: [],
            resData: [],

            // 寻位日期
            lockDate: {},

            // 总刊例价
            totalPrice: null,

            // 查询上刊详情 传递的参数
            screenParams: {}
        }
    },
    methods: {
        // 显示寻位结果
        showLocatingResultDialog(data, screenList, screenTotalPrice, { publishDate, dueDate }){
            
            let arr = {}
            for(let i = 0; i < data.length; i++){
                for(let j = 0; j < data[i].results.length; j++){
                    data[i].results[j].screenContent = this.findScreenDetail(screenList, data[i].id)
                    if(!arr[data[i].results[j].date]) arr[data[i].results[j].date] = []
                    arr[data[i].results[j].date].push(data[i].results[j])
                }
            }
            
            // 是否空对象
            let obj = JSON.stringify(arr) 
            if(obj == '{}'){
                this.$message.success('操作成功~')
                this.$router.push(`/project/${this.$route.params.id}/locating`)
                return
            }
            
            this.resData = arr
            this.totalPrice = screenTotalPrice
            this.lockDate = {
                publishDate,
                dueDate
            }
        
            this.showLocatingResult = true
        },

        // 查找屏幕详情
        findScreenDetail(data, id){
            let obj = {}
            for(let i = 0; i < data.length; i++){
                if(data[i].id == id){
                    obj = data[i]
                }
            }
            return obj
        },  

        // 查询屏幕占位详情
        handleShowOccupyDetail(date, screenId){
            console.log(date, this.$refs)
            this.$refs.lockFailDetail.showFailDetail(date)
        },

        // 跳转到锁位列表
        handleGoLocating(){
            this.$emit('lockFail')

            // 含有锁位失败的屏幕  关闭寻位结果 重新选择屏幕再提交
            this.showLocatingResult = false
        }
    }
}

</script>

<style lang="scss" scoped>
    .locating-result{
        .total-price{
            text-align: right;
        }

        .screen-list{
            display: flex;
            flex-wrap: wrap;
            padding-top: 20px;

            .screen-item{
                width: 190px;
                margin: 0 24px 20px 24px;
                position: relative;

                .screen-photo{
                    width: 100%;
                    height: 133px;
                }

                .screen-name{
                    position: absolute;
                    left: 0;
                    top: 0;
                    z-index: 99;
                    width: 100%;
                    text-align: center;
                    color: #fff;
                    background:rgba(17, 24, 39, 0.45);
                    padding: 5px;
                }

                .screen-bottom{
                    font-size: 12px;
                    text-align: center;
                    padding: 10px 0;

                    span{
                        height: 20px;
                        line-height: 18px;
                        border: 1px solid #171717;
                        border-radius: 2px;
                        margin-left: 8px;
                        padding: 0 10px;
                    }
                }
            }
        }
    }
    
</style>


