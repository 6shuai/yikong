<template>
    <div>
        <el-select 
            size="small"
            placeholder="国家" 
            class="region-select"
            :value="1"
        >
            <el-option :value="1" label="中国"></el-option>
        </el-select>
        <el-select 
            clearable
            size="small"
            placeholder="省" 
            class="region-select"
            v-model="params.proNo"
            @change="cityList();$emit('selectArea', params)"
        >
            <el-option
                v-for="item in region.provinces"
                :key="item.id"
                :label="item.proName"
                :value="item.proNo">
            </el-option>
        </el-select>
        <el-select 
            clearable
            size="small"
            placeholder="市" 
            class="region-select"
            v-model="params.cityNo"
            @change="areasList();$emit('selectArea', params)"
        >
            <el-option
                v-for="item in region.city"
                :key="item.id"
                :label="item.cityName"
                :value="item.cityNo">
            </el-option>
        </el-select>
        <el-select 
            clearable
            size="small"
            placeholder="区" 
            class="region-select"
            v-model="params.areaNo"
            @change="$emit('selectArea', params)"
        >
            <el-option
                v-for="item in region.areas"
                :key="item.id"
                :label="item.areaName"
                :value="item.areaNo">
            </el-option>
        </el-select>
    </div>
</template>

<script>
import { placeProvincesData, placeCitysData, placeAreasData } from '@/api/place';
export default {
    data(){
        return {
            params: {
                // country: 1,            //国家 默认中国
            },
            region: {}
        }
    },
    created() {
        this.provincesList();
    },
    methods: {
        //省份
        provincesList(){
            placeProvincesData().then(res => {
                this.$set(this.region, 'provinces', res.obj);
            })
        },

        //市
        cityList(){
            this.$set(this.params, 'cityNo', '');
            this.$set(this.params, 'areaNo', '');
            this.$set(this.region, 'city', []);
            this.$set(this.region, 'areas', []);
            if(!this.params.proNo) return
            placeCitysData(this.params.proNo).then(res => {
                this.$set(this.region, 'city', res.obj);
            })
        },

        //县
        areasList(){
            this.$set(this.params, 'areaNo', '');
            this.$set(this.region, 'areas', []);
            if(!this.params.cityNo) return
            placeAreasData(this.params.cityNo).then(res => {
                this.$set(this.region, 'areas', res.obj);
            })
        }
    },
}
</script>