<template>
	<Layout>
		<v-card class="py-10">
			<div class="text-center">
				<p class="display-4 pb-4">404</p>
				<p class="display-1">الصفحة غير موجودة</p>
				<p class="heading">المعذرة! لايوجد مثل هذه الصفحة</p>
				<v-btn to="/" text large class="my-4" color="primary"><v-icon left>mdi-arrow-right</v-icon>الصفحة الرئيسية</v-btn>
			</div>
		</v-card>
	</Layout>
</template>

<script>
import Layout from './layout/Layout';

export default {
	components: {
		Layout,
	},
	page: {
		title: 'Not found',
	},
};
</script>

<style lang="scss" scoped></style>
