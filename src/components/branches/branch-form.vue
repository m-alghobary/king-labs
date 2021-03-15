<template>
	<v-card>
		<v-form ref="branchForm" v-model="validForm" @submit.prevent="submited">
			<v-card-title>
				<span class="headline">{{ formTitle }}</span>
			</v-card-title>
			<v-divider></v-divider>
			<v-card-text>
				<v-row>
					<v-col class="py-0" sm="6" cols="12">
						<v-text-field v-model="formData.name" :rules="rules.name" dense label="اسم الفرع" outlined required></v-text-field>
					</v-col>
					<v-col class="py-0" sm="6" cols="12">
						<v-text-field v-model="formData.address" :rules="rules.email" dense label="الموقع" outlined required></v-text-field>
					</v-col>
				</v-row>
				<v-row>
					<v-col class="py-0" sm="6" cols="12">
						<v-text-field v-model="formData.phone" :rules="rules.phone" dense label="رقم التلفون" outlined required></v-text-field>
					</v-col>
				</v-row>
			</v-card-text>
			<v-divider></v-divider>
			<v-card-actions>
				<v-spacer></v-spacer>
				<v-btn color="blue darken-1" text @click="close">اغلاق</v-btn>
				<v-btn color="blue darken-1" type="submit" :disabled="!validForm" text>حفظ</v-btn>
			</v-card-actions>
		</v-form>
	</v-card>
</template>

<script>
export default {
	name: 'branchForm',
	props: {
		formTitle: {
			type: String,
			default: 'Make new branch',
		},
		branch: {
			type: Object,
			default: () => ({
				name: '',
				address: '',
				phone: '',
			}),
		},
		isEdit: {
			type: Boolean,
			default: false,
		},
	},
	data() {
		return {
			validForm: false,
			showPass: false,
		};
	},
	computed: {
		rules() {
			return {
				name: [(val) => !!val || 'اسم المستخدم مطلوب'],
				address: [(val) => !!val || 'الموقع مطلوب'],
				phone: [(val) => !!val || 'رقم التلفون مطلوب'],
			};
		},
		formData() {
			return this.branch;
		},
	},
	methods: {
		submited() {
			this.$emit('submited', {
				name: this.formData.name,
				address: this.formData.address,
				phone: this.formData.phone,
			});

			this.close();
		},
		close() {
			this.$refs.branchForm.reset();
			this.$emit('canceled');
		},
		reset() {
			this.$refs.branchForm.reset();
		},
	},
};
</script>

<style lang="scss" scoped></style>
