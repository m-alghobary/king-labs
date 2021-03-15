<template>
	<v-card>
		<v-form ref="permissionsForm" v-model="validForm" @submit.prevent="submited">
			<v-card-title>
				<span class="headline">صلاحيات المستخدم</span>
			</v-card-title>
			<v-divider></v-divider>
			<v-container fluid class="pa-5">
				<label class="d-block mb-6 ms-1">حدد صلاحيات المستخدم</label>
				<v-row>
					<v-col cols="12" sm="4" md="4">
						<v-checkbox v-model="formData.permissions" label="لوحة التحكم" value="dashboard" hide-details></v-checkbox>
						<v-checkbox v-model="formData.permissions" label="العملاء" value="agents" hide-details></v-checkbox>
						<v-checkbox v-model="formData.permissions" label="حذف العملاء" value="agents_delete" hide-details></v-checkbox>
					</v-col>
					<v-col cols="12" sm="4" md="4">
						<v-checkbox v-model="formData.permissions" label="التقارير" value="reports" hide-details></v-checkbox>
						<v-checkbox v-model="formData.permissions" label="العمليات" value="invoices" hide-details></v-checkbox>
						<v-checkbox v-model="formData.permissions" label="الفحوصات" value="tests" hide-details></v-checkbox>
					</v-col>
					<v-col cols="12" sm="4" md="4">
						<v-checkbox v-model="formData.permissions" label="المستخدمين" value="users" hide-details></v-checkbox>
						<v-checkbox v-model="formData.permissions" label="الفروع" value="branches" hide-details></v-checkbox>
						<v-checkbox v-model="formData.permissions" label="الشركات" value="companies" hide-details></v-checkbox>
					</v-col>
				</v-row>
			</v-container>
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
	name: 'PermissionsForm',
	props: {
		user: {
			type: Object,
			default: () => ({
				user_id: '',
				permissions: [],
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
		};
	},
	computed: {
		rules() {
			return {
				permissions: [(val) => !!val || 'اسم المستخدم مطلوب'],
			};
		},
		formData() {
			return this.user;
		},
	},
	methods: {
		submited() {
			this.$emit('submited', {
				user_id: this.user.user_id,
				permissions: this.formData.permissions,
			});

			this.close();
		},
		close() {
			this.$refs.permissionsForm.reset();
			this.$emit('canceled');
		},
		reset() {
			this.$refs.permissionsForm.reset();
		},
	},
};
</script>

<style lang="scss" scoped></style>
