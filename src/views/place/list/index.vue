<template>
    <div class="place-list-wrap">
        <el-card class="template-card" shadow="never">
            <div slot="header" class="clearfix">
                <span>场所管理</span>
            </div>
            <div class="top-operation-wrap">
                <el-input size="small" placeholder="场所名"></el-input>
                <el-button size="small" type="primary" icon="el-icon-search">搜索</el-button>
                <el-button size="small" type="primary" icon="el-icon-plus" @click="$refs.addPlace.showDialog({enabled: true})">添加场所</el-button>
            </div>
        </el-card>
        <div v-if="!tLoading && !resData.length" style="margin: 20px;text-align:center">暂无数据~</div>
        <div v-else class="place-content">
            <div class="place-box" v-loading="tLoading">
                <el-card 
                    class="place-list" 
                    shadow="always"
                    v-for="item in resData"
                    :key="item.id"
                >
                    <div class="place-img">
                        <img src="https://game.xfengjing.com/app/upload/market/photo/SNeDQguJTPQdWASQB0FuGF3xk5sjkooJZaAPxmAB.jpeg" class="image">
                        <!-- 编辑 -->
                        <el-button 
                            class="icon-button edit" 
                            size="small" 
                            type="primary" 
                            icon="el-icon-edit" 
                            title="编辑"
                            @click="editCurrentPlace(item)"
                            round>
                        </el-button>
                        <!-- 删除 -->
                        <el-popover
                            style="margin-left:10px"
                            placement="top"
                            class="icon-button delete"
                            :ref="item.id"
                            width="200">
                            <p>此操作将删除场所【{{item.displayName}}】, 是否继续?</p>
                            <div style="text-align: right; margin: 0">
                                <el-button size="mini" type="text" @click="$refs[item.id][0].doClose()">取消</el-button>
                                <el-button type="primary" size="mini" @click="delCurrentPlace(item.id)">确定</el-button>
                            </div>
                            <el-button size="small" type="danger" slot="reference" icon="el-icon-delete" round title="删除"></el-button>
                        </el-popover>
                    </div>
                    <div style="padding: 14px;">
                        <div class="place-title" @click="$refs.placeDetail.show()">
                            <p>{{item.displayName}}</p>
                        </div>
                        <div class="bottom clearfix">
                            <div class="adress" title="点击查看位置" @click="currentPlace=item;showMap=true">
                                <i class="el-icon-location-information"></i>{{addressJoint(item)}}
                            </div>
                            <div class="place-logo">
                                <img src="https://game.xfengjing.com/app/upload/market/photo/7YmAs4QpmOCRNvD84Imkw8MQq7Ctdt1sr3d5kS8S.png" alt="中粮" title="中粮">
                            </div>
                        </div>
                    </div>
                </el-card>

            </div>

            <el-pagination
                background
                layout="total, prev, pager, next, sizes"
                :page-sizes="[20, 30, 40, 50]"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :total="totalCount">
            </el-pagination>
        </div>

        <!-- 添加场所 -->
        <place-add ref="addPlace"></place-add>
        
        <!-- 查看地理位置  地图 -->
        <el-dialog
            width="640px"
            :title="currentPlace.displayName"
            :visible.sync="showMap"
            append-to-body>
            <p>{{currentPlace.address}}</p>
            <the-map 
                v-if="showMap"
                :lng="currentPlace.longitude"
                :lat="currentPlace.latitude"
                :visible="true"
            ></the-map>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="showMap=false">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 场所详情 -->
        <place-detail ref="placeDetail"></place-detail>

    </div>
</template>

<script>
import { placeList, placeDelete } from '@/api/place';
import PlaceAdd from './PlaceAdd';
import TheMap from '@/components/BaiduMap/index';
import PlaceDetail from './PlaceDetail';

export default {
    data(){
        return {
            params: {
                pageNo: 1,
                pageSize: 20
            },
            showMap: false,                //地图
            currentPlace: {},              //选中的场所参数
            resData: [],
            totalCount: 0,         //总条数
            tLoading: true
        }
    },
    created() {
        this.init();
    },
    methods: {
        //场所列表
        init(){
            this.tLoading = true;
            placeList(this.params).then(res => {
                this.tLoading = false;
                if(res.code === this.$successCode){
                    this.resData = res.obj.list;
                    this.totalCount = res.obj.totalRecords;
                }
            })
        },

        //编辑场所
        editCurrentPlace(data){
            this.$refs.addPlace.showDialog(data);
        },

        //删除场所
        delCurrentPlace(id){
            placeDelete(id).then(res => {
                if(res.code === this.$successCode){
                    this.$message.success('删除成功~');
                    this.init();
                }
            })
        },

        //页码
        handleCurrentChange(page){
            this.params.pageNo = page;
            this.init();
        },

        //每页多少条
        handleSizeChange(num){
            this.params.pageSize = num;
            this.init();
        },

        //场所地址  省市区 拼接
        addressJoint(row){
            return `${row.proName ? row.proName+'  ' : ''}${row.cityName ? row.cityName+'  ' : ''}${row.areaName ? row.areaName : ''}`;
        }
    },
    components: {
        PlaceAdd,
        TheMap,
        PlaceDetail
    }
}
</script>
<style lang="scss">
    .place-list-wrap{
        .organization-logo{
            height: 40px;
            img{
                height: 100%;
            }
        }
        .place-content{
            margin-left: -20px;
            padding:15px;
            .place-box{
                display: flex;
                flex-wrap: wrap;
                .place-list{
                    width: 280px;
                    height: 250px;
                    overflow: hidden;
                    margin: 0 0 20px 20px;
                    &:hover .place-img{
                        .icon-button{
                            opacity: 1;
                        }
                        img{
                            transform: scale(1.05);
                        }
                    }
                    .el-card__body{
                        padding: 0;
                    }
                    .place-title{
                        color: #333;
                        cursor: pointer;
                        p{
                            overflow: hidden;
                            text-overflow: ellipsis;
                            white-space: nowrap;
                            width: 100%;
                            margin: 0;
                            &:hover{
                                color: #409EFF;
                            }
                        }
                    }
                    .place-img{
                        width: 100%;
                        height: 170px;
                        overflow: hidden;
                        position: relative;
                        img.image{
                            width: 100%;
                            height: 170px;
                            transition: all .5s ease-in-out;
                        }
                        .icon-button{
                            position: absolute;
                            right: 10px;
                            opacity: 0;
                            transition: all .5s ease-in-out;
                            &.edit{
                                top: 40px;
                            }
                            &.delete{
                                top: 90px;
                            }
                        }
                    }
                    .bottom{
                        padding-top: 5px;
                        font-size: 12px;
                        color: #999;
                        display: flex;
                        .adress{
                            width: 140px;
                            overflow: hidden;
                            text-overflow: ellipsis;
                            white-space: nowrap;
                            cursor: pointer;
                            line-height: 30px;
                            &:hover{
                                text-decoration: underline;
                            }
                        }
                        .place-logo{
                            width: 110px;
                            text-align: right;
                            img{
                                max-width: 100%;
                                height: 30px;
                            }
                        }
                    }
                }
            }

        }
    }
</style>