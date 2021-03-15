<template>
	<v-card class="text-center mt-12 mx-auto" width="400">
		<v-card-text>
			<h2 class="mb-3">Sorry, Time Out</h2>
			<p>Check your internet connection, and try agin</p>
			<v-btn color="primary" dark @click="reload"> <v-icon left>mdi-reload</v-icon> Reload </v-btn>
		</v-card-text>
	</v-card>
</template>

<script>
export default {
	name: 'TimeOut',
	methods: {
		reload() {
			window.location.reload();
		},
	},
};
</script>

<style lang="scss" scoped></style>
