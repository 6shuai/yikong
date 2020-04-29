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
            <el-table
                v-loading="tLoading"
                stripe
                size="small"
                :data="resData"
                style="width: 100%;margin-bottom: 20px;"
                row-key="id"
                border>
                <el-table-column prop="displayName" label="场所名" min-width="90"></el-table-column>
                <el-table-column prop="nickname" label="所属品牌" min-width="80">
                    <template slot-scope="scope">
                        <div class="organization-logo">
                            <img src="https://game.xfengjing.com/app/upload/market/photo/7YmAs4QpmOCRNvD84Imkw8MQq7Ctdt1sr3d5kS8S.png" alt="中粮" title="中粮">
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="type" label="场所类型" min-width="80"></el-table-column>
                <el-table-column prop="address" label="场所地址" min-width="80">
                    <template slot-scope="scope">
                        <el-link title="点击查看位置" @click="currentPlace=scope.row;showMap=true">{{addressJoint(scope.row)}}</el-link>
                    </template>
                </el-table-column>
                <el-table-column label="场所照片" min-width="120">
                    <template slot-scope="scope">
                        <el-image
                            class="place-img"
                            fit="contain"
                            src="https://game.xfengjing.com/app/upload/market/photo/SNeDQguJTPQdWASQB0FuGF3xk5sjkooJZaAPxmAB.jpeg"
                            :preview-src-list="imgList">
                        </el-image>
                    </template>
                </el-table-column>
                <!-- <el-table-column prop="qq" label="联系人" min-width="80"></el-table-column>
                <el-table-column prop="mobile" label="联系电话" min-width="90"></el-table-column>
                <el-table-column prop="email" label="联系邮箱" min-width="100"></el-table-column> -->
                <el-table-column prop="email" label="联系场所" min-width="120">
                    <template slot-scope="scope">
                        <p title="联系人">
                            <i class="el-icon-user"></i>
                            <span>刘帅</span>
                        </p>
                        <p title="手机号">
                            <i class="el-icon-mobile"></i>
                            <span>18810498554</span>
                        </p>
                        <p title="邮箱">
                            <i class="el-icon-message"></i>
                            <span>245691516@qq.com</span>
                        </p>
                    </template>
                </el-table-column>
                <el-table-column
                    label="操作"
                    min-width="150">
                    <template slot-scope="scope">
                        <el-button 
                            size="mini" 
                            type="success"
                            @click="editCurrentPlace(scope.row)"
                        >
                            编辑
                        </el-button>
                        <el-popover
                            style="margin-left:10px"
                            placement="top"
                            :ref="scope.row.id"
                            width="200">
                            <p>此操作将删除场所【{{scope.row.displayName}}】, 是否继续?</p>
                            <div style="text-align: right; margin: 0">
                                <el-button size="mini" type="text" @click="$refs[scope.row.id].doClose()">取消</el-button>
                                <el-button type="primary" size="mini" @click="delCurrentPlace(scope.row.id)">确定</el-button>
                            </div>
                            <el-button 
                                size="mini"
                                type="danger"
                                slot="reference"
                            >
                                删除
                            </el-button>
                        </el-popover>
                    </template>
                </el-table-column>
            </el-table>

            <el-pagination
                background
                layout="total, prev, pager, next, sizes"
                :page-sizes="[10, 20, 30, 50]"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :total="totalCount">
            </el-pagination>
        </el-card>

        <!-- 添加场所 -->
        <add-place ref="addPlace"></add-place>
        
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

    </div>
</template>

<script>
import { placeList, placeDelete } from '@/api/place';
import AddPlace from './AddPlace';
import TheMap from '@/components/BaiduMap/index';

export default {
    data(){
        return {
            params: {
                pageNo: 1,
                pageSize: 10
            },
            showMap: false,                //地图
            currentPlace: {},              //选中的场所参数
            resData: [
                {
                    displayName: '马东东',
                    mobile: '18810498554',
                    email: '245691516@qq.com',
                    avatar: 'https://game.xfengjing.com/app/upload/market/photo/SNeDQguJTPQdWASQB0FuGF3xk5sjkooJZaAPxmAB.jpeg'
                }
            ],
            totalCount: 10,        //总条数
            tLoading: false,
            imgList: [             //大图预览
                'https://game.xfengjing.com/app/upload/market/photo/SNeDQguJTPQdWASQB0FuGF3xk5sjkooJZaAPxmAB.jpeg'
            ]
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
        AddPlace,
        TheMap
    }
}
</script>
<style lang="scss">
    .place-list-wrap{
        .place-img img{
            max-height: 120px;
            cursor: pointer;
        }
        .organization-logo{
            height: 40px;
            img{
                height: 100%;
            }
        }
    }
</style>