<template>
	<v-card>
		<v-form ref="companyForm" v-model="validForm" @submit.prevent="submited">
			<v-card-title>
				<span class="headline">{{ formTitle }}</span>
			</v-card-title>
			<v-divider></v-divider>
			<v-card-text>
				<v-row>
					<v-col class="py-0" sm="6" cols="12">
						<v-text-field v-model="formData.name" :rules="rules.name" dense label="اسم الشركة" outlined required></v-text-field>
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
						<v-text-field v-model="formData.phone" :rules="rules.phone" dense label="رقم التلفون" outlined required></v-text-field>
					</v-col>
					<v-col class="py-0" sm="6" cols="12">
						<v-text-field v-model="formData.discount" dense label="التخفيض" outlined>
							<template v-slot:append>
								<span class="mt-1 primary--text text-body-2 mark">%</span>
							</template>
						</v-text-field>
					</v-col>
				</v-row>
				<v-row>
					<v-col v-if="!isEdit" class="py-0" sm="6" cols="12">
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
export default {
	name: 'UserForm',
	props: {
		formTitle: {
			type: String,
			default: 'Make new company',
		},
		company: {
			type: Object,
			default: () => ({
				name: '',
				email: '',
				phone: '',
				discount: '',
				password: '',
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
				email: [(value) => !!value || 'بريد إلكتروني مطلوب', (value) => /.+@.+\..+/.test(value) || 'يرجى إدخال بريد إلكتروني صحيح'],
				phone: [(val) => !!val || 'رقم التلفون مطلوب'],
				discount: [(val) => !!val || 'يرجى تحديد التخفيض'],
				password: [(value) => !!value || 'كلمة المرور مطلوبة'],
			};
		},
		formData() {
			return this.company;
		},
	},
	methods: {
		submited() {
			this.$emit('submited', {
				name: this.formData.name,
				email: this.formData.email,
				phone: this.formData.phone,
				discount: this.formData.discount,
				password: !this.isEdit ? this.formData.password : undefined,
				password_confirmation: !this.isEdit ? this.formData.password : undefined,
			});

			this.close();
		},
		close() {
			this.$refs.companyForm.reset();
			this.$emit('canceled');
		},
		reset() {
			this.$refs.companyForm.reset();
		},
	},
};
</script>

<style lang="scss" scoped></style>
