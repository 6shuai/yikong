<template>
    <div class="invoice-center-projcet-detail">
        <el-table
            class="mt20 mb20"
            stripe
            size="small"
            :data="projectDetailData"
            row-key="id"
            border>
            <el-table-column 
                prop="displayName" 
                label="项目名称" 
                min-width="150"
            ></el-table-column>
            <el-table-column 
                prop="nickname" 
                label="素材状态" 
                min-width="300"
            >
                <template slot-scope="scope">
                    <el-scrollbar 
                        class="hidden-scroll-y"
                        style="{width: 100%}"
                    >   
                        <div 
                            class="layout-list-wrap"
                            :style="{ width: scope.row.materials.length * 110 + 'px' }"
                        >
                            <div 
                                class="content-list" 
                                v-for="(item, index) in scope.row.materials" :key="index"
                            >   
                                
                                <screen-layout 
                                    :screen="item" 
                                    :maxWidth="100"
                                    :showBorder="false"
                                >
                                    <template v-slot:state>
                                        <div 
                                            class="material-state"
                                            :class="item.state=='已下刊' ? 'state-1' : 'state-2'"
                                        ></div>
                                    </template>

                                    <template v-slot="dataDefalut">
                                        <img 
                                            class="content-image"
                                            :src="dataDefalut.data.image" 
                                        >
                                    </template>
                                </screen-layout>
                            </div>
                        </div>
                    </el-scrollbar>
                </template>
            </el-table-column>
            <el-table-column 
                prop="amount" 
                label="合同金额" 
                min-width="100"
            >
                <template slot-scope="scope">
                    ￥{{ scope.row.amount }}元
                </template>
            </el-table-column>
            <el-table-column 
                prop="payment" 
                label="回款金额" 
                min-width="100"
            >
                <template slot-scope="scope">
                    ￥{{ scope.row.payment }}元
                </template>
            </el-table-column>
            <el-table-column 
                prop="invoiceAmount" 
                label="开票金额" 
                min-width="100"
            >
                <template slot-scope="scope">
                    {{ moneyFormat(scope.row.invoiceAmount) }}
                </template>
            </el-table-column>
        </el-table>
        
        <div class="tip mt20">
            <div class="material-state state-1">已下刊素材</div>
            <div class="material-state state-2">未下刊素材</div>
        </div>

    </div>
</template>

<script>
import ScreenLayout from '@/views/screenLayout/components/ScreenLayout'
import { priceFormat } from '@/utils/index'

export default {
    components: {
        ScreenLayout
    },
    props: {
        projectDetailData: Array
    },
    computed: {
        // 金额格式化
        moneyFormat(){
            return (key) => {
                return priceFormat(key)
            }
        },
    }
}
</script>

<style lang="scss">
.invoice-center-projcet-detail{
    .layout-list-wrap{
        display: flex;
        align-items: center;
        margin: 10px 0;
        position: relative;
    }

    .content-list{
        width: 100px;
        margin: 10px 5px;
        display: inline-block;
    }

    .tip{
        .material-state{
            margin-left: 20px;
            display: inline-block;

            &::before{
                content: '';
                width: 15px;
                height: 15px;
                background: #999;
                display: inline-block;
                vertical-align: middle;
                margin-top: -2px;
                margin-right: 5px;
                border-radius: 2px;
            }

            &.state-2::before{
                background: var(--color-danger);
            }
        }
    }
}
</style>