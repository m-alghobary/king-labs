<template>
	<v-card>
		<v-form ref="testForm" v-model="validForm" @submit.prevent="submited">
			<v-card-title>
				<span class="headline">{{ formTitle }}</span>
			</v-card-title>
			<v-divider></v-divider>
			<v-card-text>
				<v-row>
					<v-col class="py-0" sm="6" cols="12">
						<v-text-field v-model="formData.name" :rules="rules.name" dense label="اسم الفحص" outlined required></v-text-field>
					</v-col>
					<v-col class="py-0" sm="6" cols="12">
						<v-text-field v-model="formData.price" :rules="rules.price" dense label="السعر" outlined required></v-text-field>
					</v-col>
					<v-col class="py-0" sm="6" cols="12">
						<v-text-field v-model="formData.duration" :rules="rules.duration" dense label="المدة الزمنية" outlined required>
							<template v-slot:append>
								<span class="mt-1 primary--text text-body-2 mark">ساعات</span>
							</template>
						</v-text-field>
					</v-col>
					<v-col class="py-0" sm="6" cols="12">
						<v-text-field v-if="isEdit" v-model="formData.note" dense label="ملاحظة" outlined required></v-text-field>
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
	name: 'testForm',
	props: {
		formTitle: {
			type: String,
			default: 'Make new test',
		},
		test: {
			type: Object,
			default: () => ({
				name: '',
				price: '',
				duration: '',
				note: '',
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
				name: [(val) => !!val || 'اسم الفحص مطلوب'],
				price: [(val) => !!val || 'السعر مطلوب'],
				duration: [(val) => !!val || 'المدة الزمنية مطلوبة'],
			};
		},
		formData() {
			return this.test;
		},
	},
	methods: {
		submited() {
			this.$emit('submited', {
				name: this.formData.name,
				price: this.formData.price,
				duration: this.formData.duration,
				note: this.formData.note,
			});

			this.close();
		},
		close() {
			this.$refs.testForm.reset();
			this.$emit('canceled');
		},
		reset() {
			this.$refs.testForm.reset();
		},
	},
};
</script>

<style lang="scss" scoped></style>
