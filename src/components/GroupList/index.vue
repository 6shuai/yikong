<template slot="groupList" slot-scope="props">
    <div>
        <el-form-item label="权限群组" :prop="propValue">
            <el-select 
                v-model="groupIds" 
                filterable 
                multiple
                placeholder="请选择权限群组" 
                style="width:100%"
                @change="handleSelect"
            >
                <el-option 
                    v-for="item in groupData" 
                    :key="item.id"
                    :label="item.displayName" 
                    :value="item.id">
                </el-option>
            </el-select>
        </el-form-item>
    </div>
</template>
<script>
import { getMyGroupList } from '@/api/common';

export default {
    props: ['propValue'],
    data(){
        return {
            groupIds: null,
            groupData: [],
        }
    },
    created() {
        this.init();
    },
    methods: {
        init(){
            getMyGroupList().then(res => {
                if(res.code === this.$successCode){
                    this.groupData = res.obj;
                }
            })
        },

        //选择群组
        handleSelect(){
            this.$emit('groupSelected', this.groupIds);
        }
    },
}
</script>