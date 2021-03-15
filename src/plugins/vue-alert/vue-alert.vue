<template>
	<v-app v-if="show">
		<v-snackbar v-model="show" :timeout="timeout" :color="color" :top="isTop" :bottom="isBottom" :right="isRight" :left="isLeft">
			<div class="d-flex justify-space-between align-center">
				<span>{{ text }}</span>

				<v-btn v-if="hasCloseBtn" dark text icon class="" @click="show = false">
					<v-icon>mdi-close</v-icon>
				</v-btn>
			</div>
		</v-snackbar>
	</v-app>
</template>

<script>
export default {
	data() {
		return {
			show: false,
			hasCloseBtn: true,
			color: 'info',
			x: 'right',
			y: 'top',
			timeout: 5000,
			text: '',
		};
	},
	computed: {
		isTop() {
			return this.y === 'top';
		},
		isBottom() {
			return this.y === 'bottom';
		},
		isLeft() {
			return this.x === 'left';
		},
		isRight() {
			return this.x === 'right';
		},
	},
	mounted() {
		this.$root.$on('alert-show', ({ msg, color }) => {
			this.color = color;

			// update data with plugin options
			const opts = this.$root.$data.options;
			this.timeout = opts.timeout;
			this.hasCloseBtn = opts.closeBtn;

			// setup the correct place
			if (this.validPlace(opts.placement)) {
				this.initPlace(opts.placement);
			}

			// set the message
			this.text = msg;

			// show
			this.show = true;
		});
	},
	methods: {
		validPlace(value) {
			return ['top-right', 'top-left', 'bottom-right', 'bottom-left', 'top-center', 'bottom-center'].includes(value);
		},
		initPlace(placement) {
			this.y = placement.split('-')[0];
			this.x = placement.split('-')[1];
		},
	},
};
</script>
