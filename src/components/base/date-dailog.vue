<template>
	<v-dialog ref="dialog" v-model="modal" :return-value.sync="date" persistent width="290px">
		<template v-slot:activator="{ on }">
			<v-text-field
				v-model="date"
				:label="label"
				:rules="rules"
				outlined
				dense
				readonly
				:value="value"
				v-bind="$attrs"
				v-on="on"
			></v-text-field>
		</template>
		<v-date-picker v-model="date" scrollable>
			<v-spacer></v-spacer>
			<v-btn text color="primary" @click="modal = false">Cancel</v-btn>
			<v-btn text color="primary" @click="save">OK</v-btn>
		</v-date-picker>
	</v-dialog>
</template>

<script>
export default {
	name: 'DateDailog',
	props: {
		label: {
			type: String,
			default: 'Date',
		},
		rules: {
			type: Array,
			default: () => [],
		},
		value: {
			type: String,
		},
	},
	data() {
		return {
			modal: false,
		};
	},
	computed: {
		date: {
			get() {
				return this.value;
			},
			set(val) {
				this.$emit('input', val);
			},
		},
	},
	methods: {
		save() {
			this.$refs.dialog.save(this.date);
			this.$emit('input', this.date);
		},
	},
};
</script>

<style lang="scss" scoped></style>
