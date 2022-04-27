<template>
    <el-dialog
        width="700px"
        :title="detailData.displayName"
        :visible.sync="showPlaceScreenDetail"
        append-to-body
    >
        <div class="place-screen-detail-wrap" v-loading="loading">
            <el-image :src="detailData.defaultShow"></el-image>

            <div class="detail-content">
                <div class="address">
                    <i class="el-icon-place"></i>
                    商场地址: {{addressJoint(detailData)}}  {{detailData.address}}
                </div>
                <ul>
                    <li>资源编码: 大屏编码</li>
                    <li>资源类型: {{ detailData.resourceType == 1 ? '硬广资源' : '软广资源' }}</li>
                    <li>资源等级: {{ detailData.levelName }}</li>
                    <li>场地: {{ detailData.indoor ? '室外' : '室内' }}</li>
                    <li>屏幕类型: {{ detailData.screenTypeName }}</li>
                    <li>屏幕尺寸宽: {{ detailData.physicalWidth }}m</li>
                    <li>屏幕尺寸高: {{ detailData.physicalHeight }}m</li>
                    <li>屏幕面积:{{ detailData.screenArea }}m²</li>
                    <li>分辨率: {{ detailData.resolutionWidth }} x {{ detailData.resolutionHeight }}</li>
                    <li>亮屏时间: {{ detailData.beginTime }} - {{ detailData.endTime }}</li>
                    <li>年客流量: {{ detailData.flowVolume ? detailData.flowVolume + '万人次' : '-' }} </li>
                    <li>商户数量: {{ detailData.merchantCount }}</li>
                    <li class="row">主力店: {{ detailData.placeAnchor }}</li>
                    <li class="row">硬广刊例价: {{ detailData.price }}元/2周</li>
                </ul>
            </div>
        </div>
    </el-dialog>
</template>

<script>
import { projectLocationScreenDetail } from '@/api/project'

export default {
    data() {
        return {
            showPlaceScreenDetail: false,

            // 商场大屏详情信息
            detailData: {},

            loading: false
        }
    },
    methods: {
        showDetail(screenId, priceSystem = this.$store.state.project.playRuleData.priceSystem){
            this.showPlaceScreenDetail = true
            this.detailData = {}
            let data = {
                priceSystem,
                screen: screenId  
            }
            this.loading = true
            projectLocationScreenDetail(data).then(res => {
                this.loading = false
                if(res.code === this.$successCode){
                    this.detailData = res.obj
                }
            })
        },

        // 大屏地址  省市区 拼接
        addressJoint(row){
            return `${row.proName ? row.proName+'  ' : ''}${row.cityName ? row.cityName+'  ' : ''}${row.areaName ? row.areaName : ''}`;
        },
    }
}
</script>

<style lang="scss" scoped>
    .place-screen-detail-wrap{
        .el-image{
            width: 100%;
        }

        .detail-content{
            padding: 20px;

            .address{
                padding-bottom: 10px;
                
                i{
                    padding-right: 5px;
                }
            }

            ul{
                display: flex;
                flex-wrap: wrap;

                li{
                    width: 50%;
                    line-height: 26px;

                    &.row{
                        width: 100%;
                    }
                }
            }
        }
    }
</style>