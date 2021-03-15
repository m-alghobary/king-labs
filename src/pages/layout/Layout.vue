<template>
	<div>
		<TopNavbar @meunClicked="showDrawer = !showDrawer"></TopNavbar>
		<SideBar :drawer="showDrawer"></SideBar>
		<v-main>
			<v-container fluid class="px-5 pt-5 pb-8">
				<div class="py-3">
					<div v-if="title">
						<h1 class="text-h4">{{ title }}</h1>
						<v-divider class="my-4"></v-divider>
					</div>
					<slot />
				</div>
			</v-container>
		</v-main>
	</div>
</template>

<script>
import SideBar from './SideBar';
import TopNavbar from './TopNavbar';

export default {
	components: {
		SideBar,
		TopNavbar,
	},

	props: {
		title: {
			type: String,
			default: null,
		},
	},

	data: () => ({
		showDrawer: true,
	}),

	methods: {},
};
</script>

<style lang="scss" scoped></style>
