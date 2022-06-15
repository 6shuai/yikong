<template>
    <el-popover
        popper-class="operation-adaptation-popver"
        :visible-arrow="false"
        ref="pop1"
        placement="bottom-start"
        width="774"
        v-model="visible">
        <ul>
            <li class="adapt" @click="setAdaptationModel(1)">
                <div class="content flex-center">
                    <div class="image-wrap">
                        <img src="../../../../assets/images/operation_exemplary.png" />
                    </div>
                </div>

                <div class="bottom">
                    <p class="title">适应</p>
                    <p class="msg text-q">全部显示 不变形 可能黑边</p>
                </div>
            </li>
            <li class="stretch" @click="setAdaptationModel(2)">
                <div class="content flex-center">
                    <div class="image-wrap">
                        <img src="../../../../assets/images/operation_exemplary.png" />
                    </div>
                </div>

                <div class="bottom">
                    <p class="title">拉伸</p>
                    <p class="msg text-q">全部显示 可能变形 无黑边</p>
                </div>
            </li>
            <li class="full" @click="setAdaptationModel(3)">
                <div class="content flex-center">
                    <div class="image-wrap">
                        <img src="../../../../assets/images/operation_exemplary.png" />
                        <div class="mask"></div>
                    </div>
                </div>

                <div class="bottom">
                    <p class="title">充满</p>
                    <p class="msg text-q">可能部分显示 无变形 无黑边</p>
                </div>
            </li>
        </ul>
    </el-popover>
</template>

<script>
import { operationContentAdaptation } from '@/api/contentManage'

// {
// "package": 135, // 要设置的素材包的包id
// "placeholder": 189, // 要设置的素材包投放的锁位id
// "region": 22, // 内容所在的布局区域的区域id
// "pattern": 1 // 要设置的适配模式：1：适应；2：拉伸；3：充满
// }


export default {
    data() {
        return {
            visible: false,
            params: {}
        }
    },
    methods: {
        setAdaptationModel(type){
            this.params.pattern = type
            operationContentAdaptation(this.params).then(res => {
                if(res.code === this.$successCode){
                    this.$message.success('操作成功~')
                    this.visible = false
                }
            })
        }
    }
}
</script>

<style lang="scss">
    .operation-adaptation-popver{
        padding: 0;

        ul{
            display: flex;

            li{
                flex: 1;
                text-align: center;
                padding: 24px;
                cursor: pointer;

                .content{
                    width: 210px;
                    height: 118px;

                    .image-wrap{
                        width: 100%;
                        background: var(--bg-color-dark-1);
                        text-align: center;
                    }
                }

                &.adapt{
                    .image-wrap{
                        margin: 14px 0;
                        height: 90px;
                    }
                }

                &.stretch{
                    .image-wrap{
                        margin: 14px 0;
                        height: 90px;

                        img{
                            width: 100%;
                            height: 100%;
                        }
                    }
                }

                &.full{
                    .image-wrap{
                        position: relative;
                        height: 118px;
                    }

                    img{
                        width: 100%;
                        height: 100%;
                    }

                    .mask{
                        position: absolute;
                        top:14px;
                        bottom: 14px;
                        left: 0;
                        width: 100%;
                        background: var(--bg-color-dark-1);
                        opacity: 0.4;
                    }
                }

                .bottom{
                    padding-top: 3px;

                    .title{   
                        line-height: 24px;
                    }
                }

                &:hover{
                    background: var(--color-primary);
                    color: #fff;
                }
            }
        }
    }
</style>