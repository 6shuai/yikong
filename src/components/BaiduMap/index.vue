<template>
    <div class="map">
        <div class="search-wrap" v-if="showSearch">
            <el-input
                id="suggestId"
                prefix-icon="el-icon-search"
                v-model="keyword"
                size="small"
                placeholder="请输入关键字,选定后搜索"
                @change="setPlace(keyword)">
            </el-input>
            <el-button type="primary" size="small" @click="$parent.$parent.showMap = false">确定</el-button>
        </div>
        <div :id="mapId ? mapId : 'map-core'"></div>
    </div>
</template>

<script>
import BMap from 'BMap';
export default {
    name: "theMap",
    props: {
        lng: [String, Number],
        lat: [String, Number],
        showSearch: Boolean,        //是否显示搜索
        address: String,            //地区  省市区
        disableZoom: Boolean,       //是否禁用鼠标滚轮缩放
        mapId: String
    },
    data() {
        return {
            visible: true,
            location: {
                lng: "",
                lat: "",
            },
            map: {},
            ac: {},
            keyword: '',          //搜索关键词
        };
    },
    mounted() {
        this.setMap();
        if(this.showSearch) this.setSearch();
        if(this.lng && this.lat){
            this.mapCoordinate(this.lng, this.lat);
        }else if(this.address){
            this.keyword = this.address;
            this.setPlace(this.address)
        }
    },
    methods: {
        // 初始化地图
        setMap() {
            const _this = this;
            this.map = new BMap.Map(this.mapId ? this.mapId : 'map-core');
            // 默认定位北京故宫
            let [lng, lat] = [116.403684,39.920072];
            if(localStorage.lng && localStorage.lat){
                [lng, lat] = [localStorage.lng, localStorage.lat];
            }
            this.map.centerAndZoom(new BMap.Point(lng, lat), 11);
            
            // 鼠标缩放
            if(!this.disableZoom) this.map.enableScrollWheelZoom(true);

            var geoc = new BMap.Geocoder();
            // 点击获取经纬度和具体位置
            this.map.addEventListener("click", function(e) {
                _this.location.lng = parseFloat(e.point.lng);
                _this.location.lat = parseFloat(e.point.lat);

                var pt = e.point;

                geoc.getLocation(pt, function(rs) {
                //addressComponents对象可以获取到详细的地址信息
                var addComp = rs.addressComponents;
                var site =
                    addComp.province +
                    " " +
                    addComp.city +
                    " " +
                    addComp.district +
                    " " +
                    addComp.street +
                    " " +
                    addComp.streetNumber;
                _this.location.address = site;
                _this.$emit("getLocation", _this.location);
                });
            });
        },

        // 根据经纬度绘制地图中的坐标点
        drawLocation() {
            if (this.location.lng !== "" && this.location.lat !== "") {
                this.map.clearOverlays();
                const new_point = new BMap.Point(this.location.lng, this.location.lat);
                const marker = new BMap.Marker(new_point);
                this.map.addOverlay(marker);
                this.map.panTo(new_point);
            }
        },
        
        // 搜索位置功能实现
        setSearch() {
            const _this = this;
            //建立一个自动完成的对象
            this.ac = new BMap.Autocomplete({
                input: "suggestId",
                location: _this.map,
            });

            //鼠标放在下拉列表上的事件
            this.ac.addEventListener("onhighlight", function(e) {
                let str = "";
                let _value = e.fromitem.value;
                let value = "";
                if (e.fromitem.index > -1) {
                value =
                    _value.province +
                    _value.city +
                    _value.district +
                    _value.street +
                    _value.business;
                }
                value = "";
                if (e.toitem.index > -1) {
                _value = e.toitem.value;
                value =
                    _value.province +
                    _value.city +
                    _value.district +
                    _value.street +
                    _value.business;
                }
            });
            let myValue;
            //鼠标点击下拉列表后的事件
            this.ac.addEventListener("onconfirm", (e) => {
                let _value = e.item.value;
                myValue =
                _value.province +
                _value.city +
                _value.district +
                _value.street +
                _value.business;
                _this.setPlace(myValue);
            });
        },

        setPlace(myValue) {
            const _this = this;
            //清除地图上所有覆盖物
            this.map.clearOverlays();
            //智能搜索
            this.local = new BMap.LocalSearch(_this.map, {
                onSearchComplete: _this.onSearchComplete,
            });
            this.local.search(myValue);
        },

        onSearchComplete() {
            try {
                //获取第一个智能搜索的结果
                let pp = this.local.getResults().getPoi(0).point;
                this.location.address = this.local.getResults().keyword;
                this.location.lng = parseFloat(pp.lng).toFixed(3);
                this.location.lat = parseFloat(pp.lat).toFixed(3);
                this.map.centerAndZoom(pp, 18);
                //添加标注
                this.map.addOverlay(new BMap.Marker(pp));
            } catch (error) {
                
            }
        },

        // 向父组件传递经纬度
        selectLocation() {
            this.$emit("getLocation", this.location);
        },

        //父组件  传过来的坐标
        mapCoordinate(lng, lat){
            this.location.lng = lng;
            this.location.lat = lat;
            this.map.centerAndZoom(new BMap.Point(lng, lat), 18);
        }
    },
    watch: {
        location: {
            handler() {
                this.drawLocation();
                if(this.showSearch){
                    this.$emit("getLocation", this.location);
                }
            },
            deep: true,
        },
        address: {
            handler(){
                if(this.lng && this.lat) return
                this.keyword = this.address;
                this.setPlace(this.address);
            }
        },
        visible() {
            console.log("ddd");
        },
    },
};
</script>
<style lang="scss" scoped>
.map {
    width: 100%;
    height: 100%;
    font-size: 14px;
    position: relative;
    .search-wrap{
        position: absolute;
        width: 100%;
        top: 10px;
        left: 10px;
        z-index: 9999;
        .el-input{
            width: 250px;
        }
        .el-button{
            margin-left: 6px;
        }
    }
    #map-core, #map-main {
        width: 100%;
        height: 100%;
        margin-top: 10px;
    }
    .search {
        display: flex;
        margin-top: 10px;
        height: 40px;
        align-items: center;
        justify-content: center;
        #r-result {
            display: flex;
            align-items: center;
            height: 40px;
            background-color: rgb(255, 255, 255);
            p {
                height: 20px;
                padding-right: 10px;
            }
            input {
                width: 220px;
                height: 20px;
            }
        }
        .lng-lat {
            display: flex;
            .item {
                display: flex;
                align-items: center;
                padding-left: 10px;
                // height: 20px;
                // line-height: 20px;
                p {
                    // height: 20px;
                    padding-right: 10px;
                }
                input {
                    width: 100px;
                    height: 20px;
                }
                button {
                    color: #fff;
                    height: 28px;
                    width: 60px;
                    background: #40b0ff;
                    border: 1px solid #40b0ff;
                    border-radius: 2px;
                    &:hover {
                        background: #10b0ff;
                        border: 1px solid #10b0ff;
                        cursor: pointer;
                    }
                }
            }
        }
    }
}
</style>

<style>
    .tangram-suggestion {
    z-index: 99999999999999999999999999999;
    }
</style>
