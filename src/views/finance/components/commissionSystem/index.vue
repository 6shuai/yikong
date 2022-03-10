<template>
     <div 
        class="commission-system-wrap" 
    >
        
        <div class="commission-system-list">
            <div class="add-and-search mb10">
                <el-button 
                    type="primary" 
                    icon="el-icon-plus" 
                    size="small"
                    @click="$refs.createCommissionSystem.showCreateSystem()">
                    创建提成体系
                </el-button>
            </div>

            <ul class="list-wrap">
                <li 
                    v-for="(item, index) in resData" 
                    :key="item.id"
                    :class="{ active: index === currentIndex }"
                    @click="currentIndex = index"
                >
                    {{ item.displayName }}
                </li>
            </ul>

        </div>

        <div class="commission-system-detail">

            <div class="add-and-search mb10">
                <el-button 
                    type="primary" 
                    icon="el-icon-edit" 
                    @click="handleEditCommissionSystem"
                    size="small">
                    编辑提成体系
                </el-button>
            </div>

            <el-table
                class="mt20 mb20"
                v-if="resData[currentIndex]"
                stripe
                size="small"
                :data="resData[currentIndex].commissionRules"
                row-key="id"
                v-loading="tLoading"
                border>
                <el-table-column 
                    prop="discountLowerLimit" 
                    label="折扣下线" 
                    min-width="100"
                >
                    <template slot-scope="scope">
                        {{ scope.row.discountLowerLimit }} %
                    </template>
                </el-table-column>
                <el-table-column 
                    prop="discountUpperLimit" 
                    label="折扣上线" 
                    min-width="100"
                >
                    <template slot-scope="scope">
                        {{ scope.row.discountUpperLimit }} %
                    </template>
                </el-table-column>
                <el-table-column 
                    prop="percentage" 
                    label="提成" 
                    min-width="100"
                >
                    <template slot-scope="scope">
                        {{ scope.row.percentage }} %
                    </template>
                </el-table-column>
                
            </el-table>
        </div>


        <!-- 创建 编辑  提成体系 -->
        <create-commission-system 
            ref="createCommissionSystem"
            @createSuccess="createSuccess"
        ></create-commission-system>


    </div>

</template>

<script>
import { financeCommissionSystemList } from '@/api/finance'
import CreateCommissionSystem from './CreateCommissionSystem'

export default {
    components: {
        CreateCommissionSystem
    },
    data() {
        return {
            tLoading: false,
            resData: [],

            // 当前显示的提成体系 index
            currentIndex: 0
        }
    },
    mounted() {
        this.getCommissionSystemList()
    },
    methods: {
        getCommissionSystemList(){
            financeCommissionSystemList().then(res => {
                if(res.code === this.$successCode){
                    this.resData = res.obj
                }
            })
        },

        // 编辑提成体系
        handleEditCommissionSystem(){
            this.$refs.createCommissionSystem.showCreateSystem(this.resData[this.currentIndex])
        },

        // 编辑或创建提成体系  成功 有id为编辑  否则为创建
        createSuccess(data, id){
            if(id) {
                this.$set(this.resData, this.currentIndex, data)
            } else {
                this.resData.unshift(data)
                this.currentIndex = 0
                console.log(this.resData)
            }
        }
    }
}
</script>

<style lang="scss" scoped>
    .commission-system-wrap{
        display: flex;

        .commission-system-list{
            width: 300px;
            padding-right: 20px;
            border-right: 1px solid #e5e5e5;

            .list-wrap{
                margin-top: 10px;

                li{
                    padding: 10px;
                    line-height: 30px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    cursor: pointer;

                    &.active{
                        color: var(--color-primary);
                        background: #f2f7f9;
                    }   

                    &:hover{
                        color: var(--color-primary);
                        background: #f2f7f9;
                    }
                }
            }
        }

        .commission-system-detail{
            padding-left: 20px;
            flex: 1;
        }
    }
</style>