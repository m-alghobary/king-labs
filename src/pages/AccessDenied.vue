<template>
	<Layout>
		<div class="text-center pt-12">
			<p class="display-3 pb-4">غير مسموح بالدخول</p>
			<p class="heading">ليس لديك حق الوصول إلى هذه الصفحة!</p>
			<v-btn :to="$route.query.redirectTo" text large class="my-5"><v-icon class="mr-3">mdi-arrow-left</v-icon>الرجوع للخلف</v-btn>
		</div>
	</Layout>
</template>

<script>
import Layout from './layout/Layout';

export default {
	name: 'AccessDenied',
	components: {
		Layout,
	},
	page: {
		title: 'غير مسموح بالدخول',
	},
};
</script>

<style lang="scss" scoped></style>
