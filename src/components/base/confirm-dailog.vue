<template>
	<v-dialog v-model="dialog" max-width="350" @keydown.esc="close">
		<v-card>
			<v-card-title class="headline">{{ title }}</v-card-title>
			<v-card-text v-show="!!message">{{ message }}</v-card-text>
			<v-card-actions>
				<v-spacer></v-spacer>
				<v-btn color="primary" text @click="close">اغلاق</v-btn>
				<v-btn color="primary" text @click="agree">{{ okText }}</v-btn>
			</v-card-actions>
		</v-card>
	</v-dialog>
</template>

<script>
export default {
	data: () => ({
		dialog: false,
		confirm: null,
		cancel: null,
		message: null,
		title: null,
		okText: '',
	}),
	methods: {
		open(title, message, okText = 'حذف') {
			this.dialog = true;
			this.title = title;
			this.message = message;
			this.okText = okText;
			return new Promise((resolve, reject) => {
				this.confirm = resolve;
				this.cancel = reject;
			});
		},
		agree() {
			this.confirm(true);
			this.dialog = false;
		},
		close() {
			this.confirm(false);
			this.dialog = false;
		},
	},
};
</script>

<style lang="scss" scoped></style>
