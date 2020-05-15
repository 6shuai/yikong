<template>
    <!-- 查看地理位置  地图 -->
    <el-dialog
        width="640px"
        :title="params.displayName"
        :visible.sync="showMap"
        append-to-body>
        <p>{{params.address}}</p>
        <div style="width: 600px;height: 400px">
            <the-map 
                v-if="showMap"
                :lng="params.longitude"
                :lat="params.latitude"
                mapId="map-main"
                :visible="true"
            ></the-map>
        </div>
        <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="showMap=false">确 定</el-button>
        </span>
    </el-dialog>
</template>
<script>
import TheMap from '@/components/BaiduMap/index';
export default {
    data(){
        return {
            showMap: false,
            params: {}
        }
    },
    methods: {
        showMapDialog(data){
            this.params = data;
            this.showMap = true;
        }
    },
    components: {
        TheMap
    }
}
</script>