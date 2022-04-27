<template>
    <div class="place-detail-merchant" id="app-main-wrap">
        <div class="app-main-wrap">

            <el-empty v-if="!merchantData.length"></el-empty>
            <div v-else class="place-content">
                <div class="place-box">
                    <div 
                        class="place-p" 
                        :style="{width: placeW}" 
                        v-for="(item, index) in merchantData" 
                        :key="index"
                    >
                        <el-card 
                            class="place-list" 
                            shadow="always"
                        >
                            <div 
                                class="place-img" 
                                :style="{height: imageH+'px'}"
                            >
                                <!-- 是否主力店 -->
                                <div class="main-store" v-if="item.placeAnchor"><i class="el-icon-medal"></i></div>
                                
                                <!-- 设置 或 取消主力店 -->
                                <div class="main-store-set">
                                    <el-button 
                                        v-if="!item.placeAnchor"
                                        type="primary" 
                                        size="mini"
                                        :loading="addLoading"
                                        @click="handleAddMainStore(item.id, index)"
                                    >
                                        添加为主力店
                                    </el-button>
                                    <el-button
                                        v-if="item.placeAnchor"
                                        type="warning" 
                                        size="mini"
                                        :loading="delLoading"
                                        @click="handleDeleteMainStore(item.placeAnchor, index)"
                                    >
                                        取消主力店
                                    </el-button>
                                </div>

                                <el-image fit="cover" :style="{height: imageH+'px'}" :src="item.image" class="image"></el-image>
                            </div>
                            <div style="padding: 14px;">
                                <div class="place-title" :title="item.displayName">
                                    <p class="name">{{ item.displayName }}</p>
                                </div>
                            </div>                    
                        </el-card>
                    </div>

                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { screenSizeWatch } from '@/mixins'
import { placeMerchantSetMainStore, placeMerchantDeleteMainStore } from '@/api/place'

export default {
    mixins: [screenSizeWatch],
    props: {
        merchantData: Array
    },
    data(){
        return {
            // 添加按钮 loading
            addLoading: false,

            // 删除按钮loading
            delLoading: false
        }
    },
    methods: {
        // 添加为主力店
        handleAddMainStore(id, index){
            this.addLoading = true
            let data = {
                place: this.$route.params.id,
                merchant: id
            }
            placeMerchantSetMainStore(data).then(res => {
                this.addLoading = false
                if(res.code === this.$successCode){
                    this.$message.success('添加成功~')
                    this.merchantData[index].placeAnchor = res.obj
                }
            })
        },

        // 取消设置为主力店
        handleDeleteMainStore(id, index){
            this.delLoading = true
            placeMerchantDeleteMainStore(id).then(res => {
                this.delLoading = false
                if(res.code === this.$successCode){
                    this.$message.success('取消成功~')
                    this.$delete(this.merchantData[index], 'placeAnchor')
                }
            })
        }
    }
}
</script>
<style lang="scss">
    @import '../../../styles/variables.scss';
    @import '../style/place-card.scss';

    .place-detail-merchant{
        .place-img{
            position: relative;

            .main-store{
                position: absolute;
                top: 0;
                left: 0;
                z-index: 99;
                padding: 5px 10px;
                background: var(--color-info);
                color: #fff;
                border-radius: 4px;
            }

            .main-store-set{
                position: absolute;
                top: 40px;
                right: 20px;
                z-index: 99;
                display: none;
            }
        }

        .place-list:hover{
            .main-store-set{
                display: block;
            }
        }
    }
</style>