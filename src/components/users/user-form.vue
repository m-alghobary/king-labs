<template>
	<v-card>
		<v-form ref="userForm" v-model="validForm" @submit.prevent="submited">
			<v-card-title>
				<span class="headline">{{ formTitle }}</span>
			</v-card-title>
			<v-divider></v-divider>
			<v-card-text>
				<v-row>
					<v-col class="py-0" sm="6" cols="12">
						<v-text-field v-model="formData.name" :rules="rules.name" dense label="اسم المستخدم" outlined required></v-text-field>
					</v-col>
					<v-col class="py-0" sm="6" cols="12">
						<v-text-field
							v-model="formData.email"
							:rules="rules.email"
							dense
							type="email"
							label="البريد الإلكتروني"
							outlined
							required
						></v-text-field>
					</v-col>
				</v-row>
				<v-row>
					<v-col class="py-0" sm="6" cols="12">
						<v-text-field v-model="formData.job_title" dense label="المسمى الوظيفي" outlined></v-text-field>
					</v-col>
					<v-col class="py-0" sm="6" cols="12">
						<v-text-field v-model="formData.phone" :rules="rules.phone" dense label="رقم التلفون" outlined required></v-text-field>
					</v-col>
				</v-row>
				<v-row>
					<v-col class="py-0" sm="6" cols="12">
						<v-select v-model="formData.branch_id" dense label="الفرع" :items="branchList" outlined required></v-select>
					</v-col>
					<v-col class="py-0" sm="6" cols="12">
						<v-text-field
							v-model="formData.password"
							:type="showPass ? 'text' : 'password'"
							:rules="rules.password"
							dense
							label="كلمة المرور"
							:append-icon="showPass ? 'mdi-eye' : 'mdi-eye-off'"
							outlined
							required
							@click:append="showPass = !showPass"
						></v-text-field>
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
import { branchesComputed } from '../../state/mapper';

export default {
	name: 'UserForm',
	props: {
		formTitle: {
			type: String,
			default: 'Make new user',
		},
		user: {
			type: Object,
			default: () => ({
				name: '',
				email: '',
				phone: '',
				job_title: '',
				password: '',
				branch_id: '',
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
		...branchesComputed,
		rules() {
			const passRule = this.isEdit ? [] : [(value) => !!value || 'كلمة المرور مطلوبة'];
			return {
				name: [(val) => !!val || 'اسم المستخدم مطلوب'],
				email: [(value) => !!value || 'بريد إلكتروني مطلوب', (value) => /.+@.+\..+/.test(value) || 'يرجى إدخال بريد إلكتروني صحيح'],
				phone: [(val) => !!val || 'رقم التلفون مطلوب'],
				branch_id: [(val) => !!val || 'يرجى تحديد الفرع'],
				password: passRule,
			};
		},
		formData() {
			return this.user;
		},
		branchList() {
			return this.active.map((branch) => ({
				value: branch.id,
				text: branch.name,
			}));
		},
	},
	async created() {
		// try {
		// 	this.branches = await this.loadBranches();
		// } catch (error) {
		// 	this.$VAlert.error('');
		// }
	},
	methods: {
		submited() {
			this.$emit('submited', {
				name: this.formData.name,
				email: this.formData.email,
				phone: this.formData.phone,
				job_title: this.formData.job_title,
				branch_id: this.formData.branch_id,
				branch: {
					name: this.active.find((b) => b.id === this.formData.branch_id).name,
				},
				password: this.formData.password,
				password_confirmation: this.formData.password,
			});

			this.close();
		},
		close() {
			this.$refs.userForm.reset();
			this.$emit('canceled');
		},
		reset() {
			this.$refs.userForm.reset();
		},
	},
};
</script>

<style lang="scss" scoped></style>
