<template>
	<v-combobox
		v-model="selected"
		:items="items"
		:rules="rules"
		small-chips
		dense
		outlined
		multiple
		label="الفحوصات"
		@change="$emit('input', selected)"
	></v-combobox>
</template>

<script>
import { testsComputed } from '../../state/mapper';
export default {
	name: 'TestSelect',

	props: {
		value: {
			type: Array,
			default: () => [],
		},
		rules: {
			type: Array,
			default: () => [],
		},
	},

	data: () => ({
		selected: [],
	}),

	computed: {
		...testsComputed,
		items() {
			return this.active.map((test) => ({
				text: `${test.name} (${test.price})`,
				value: test.id,
				...test,
			}));
		},
	},
};
</script>

<style lang="scss" scoped></style>
