<template>
    <add-get-limit 
        :activityId="$route.params.activityId"
    >
    </add-get-limit>
</template>

<script>
import AddGetLimit from "@/views/activity/components/AddGetLimit";
export default {
    components: { 
        AddGetLimit
    }
}
</script>