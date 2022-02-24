<template>
    <div class="screen-occupy-wrap">
        <el-row>
            <el-col :span="12">
                <div 
                    class="mb20"
                >
                    <el-date-picker
                        class="mr20"
                        v-model="params.date"
                        align="right"
                        type="date"
                        placeholder="选择日期"
                        value-format="yyyy-MM-dd"
                        @change="handleSearch">
                    </el-date-picker>
                </div>
                <screen-content-occupy-detail
                    :data="params"
                    ref="screenContentOccupyDetail"
                ></screen-content-occupy-detail>
            </el-col>

            <el-col :span="12">
                <h3 class="mb20">按照时段查询刊挂率</h3>
                <el-date-picker
                    class="mr20"
                    v-model="occupyRateParams.beginDate"
                    align="right"
                    type="date"
                    placeholder="开始日期"
                    value-format="yyyy-MM-dd"
                    @change="getScreenOccupyRate">
                </el-date-picker>
                <el-date-picker
                    class="mr20"
                    v-model="occupyRateParams.endDate"
                    align="right"
                    type="date"
                    placeholder="结束日期"
                    value-format="yyyy-MM-dd"
                    @change="getScreenOccupyRate">
                </el-date-picker>

                <el-table
                    class="mt20 mb20"
                    stripe
                    size="small"
                    :data="resData"
                    v-loading="tLoading"
                    border>
                    <el-table-column 
                        prop="date" 
                        label="日期" 
                        min-width="100"
                    >
                    </el-table-column>
                    <el-table-column 
                        prop="rate" 
                        label="刊挂率" 
                        min-width="100"
                    >
                    </el-table-column>
                </el-table>

            </el-col>

        </el-row>
    </div>
</template>

<script>
import { formatTime } from '@/utils/index'
import { screenOccupyRate } from '@/api/screen'
import ScreenContentOccupyDetail from '@/views/project/components/ScreenContentOccupyDetail'

export default {
    components: {
        ScreenContentOccupyDetail
    }, 
    data(){
        return {
            params: {
                screenId: this.$route.params.id,
                date: formatTime(new Date(), 'date')
            },

            // 刊挂率列表
            resData: [],

            // 刊挂率搜索条件
            occupyRateParams: {},
            tLoading: false
        }
    },
    methods: {
        // 按照日期搜索占位清空
        handleSearch(){
            this.$refs.screenContentOccupyDetail.getScreenOccupyDetail(this.params.date)
        },

        // 按照时段搜索屏幕刊挂率
        getScreenOccupyRate(){
            let { beginDate, endDate } = this.occupyRateParams
            if(beginDate && endDate){
                let data = {
                    ...this.occupyRateParams,
                    screenId: this.$route.params.id
                }
                this.tLoading = true
                screenOccupyRate(data).then(res => {
                    this.tLoading = false
                    if(res.code === this.$successCode){
                        let arr = []
                        for(let val in res.obj){
                            arr.push({
                                date: val,
                                rate: res.obj[val]
                            })
                        }
                        this.resData = arr
                    }
                })
            }

        }
    }
}
</script>

<style lang="scss" scoped>
    .screen-occupy-wrap{

    }
</style>