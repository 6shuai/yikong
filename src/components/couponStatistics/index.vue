<template>
	<el-card class="template-card content-details">
		<page-header title="优惠券统计"></page-header>

		<coupon-statistics-data></coupon-statistics-data>
		
	</el-card>
</template>

<script>
import PageHeader from "@/components/PageHeader";
import CouponStatisticsData from './components/List';

export default {
	components: {
		PageHeader,
		CouponStatisticsData
	}
}

</script>