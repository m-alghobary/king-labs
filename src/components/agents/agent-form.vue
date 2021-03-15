<template>
	<v-form ref="agentForm" v-model="validForm" @submit.prevent="submited">
		<v-card>
			<v-card-title>
				<span class="headline">{{ formTitle }}</span>
			</v-card-title>
			<v-divider></v-divider>
			<v-card-text>
				<v-row>
					<v-col class="py-0" sm="6" cols="12">
						<v-radio-group v-model="agentType" class="mt-1 mb-3" mandatory row>
							<template v-slot:label>
								<div>اختر نوع العميل:</div>
							</template>
							<v-radio label="عادي" value="1"></v-radio>
							<v-radio label="من قبل شركة" value="2"></v-radio>
						</v-radio-group>
					</v-col>
					<v-col v-if="agentType == 2" class="py-0" sm="6" cols="12">
						<v-select v-model="companyId" label="الشركة" :rules="rules.company" :items="companiesList" dense outlined></v-select>
					</v-col>
				</v-row>
				<v-divider class="mt-2"></v-divider>
				<label class="d-block mt-3 mb-5 ms-1">بيانات العميل</label>
				<v-row class="pt-2">
					<v-col class="py-0" sm="6" cols="12">
						<v-text-field v-model="formData.name" :rules="rules.name" dense outlined label="اسم العميل"></v-text-field>
					</v-col>
					<v-col class="py-0" sm="6" cols="12">
						<div class="d-flex">
							<v-text-field v-model="formData.age" :rules="rules.age" dense outlined label="عمر العميل" type="number"></v-text-field>
							<v-select
								v-model="formData.gender"
								:items="genders"
								:rules="rules.gender"
								dense
								outlined
								class="ms-3"
								label="جنس العميل"
							></v-select>
						</div>
					</v-col>
					<v-col class="py-0" sm="6" cols="12">
						<v-select v-model="formData.identity" :items="identitys" :rules="rules.identity" dense outlined label="نوع الهوية"></v-select>
					</v-col>
					<v-col class="py-0" sm="6" cols="12">
						<v-text-field
							v-model="formData.identity_number"
							type="number"
							:rules="rules.identity_number"
							dense
							outlined
							label="رقم الهوية"
						></v-text-field>
					</v-col>
					<v-col class="py-0" sm="6" cols="12">
						<v-select
							v-model="formData.travel_type"
							:items="travelTypes"
							:rules="rules.travel_type"
							dense
							outlined
							label="نوع السفر"
						></v-select>
					</v-col>
				</v-row>
			</v-card-text>
			<v-divider></v-divider>
			<v-card-actions>
				<v-spacer></v-spacer>
				<v-btn color="blue darken-1" text @click="close">اغلاق</v-btn>
				<v-btn color="blue darken-1" type="submit" :disabled="!validForm" text>
					<span>حفظ</span>
				</v-btn>
				<v-btn color="blue darken-1" type="submit" :disabled="!validForm" text @click="withInvoice = true">حفظ واظافة فحص</v-btn>
			</v-card-actions>
		</v-card>
	</v-form>
</template>

<script>
import { companiesComputed } from '../../state/mapper';

export default {
	name: 'AgentForm',
	props: {
		formTitle: {
			type: String,
			default: 'Make new agent',
		},
		agent: {
			type: Object,
			default: () => ({
				name: '',
				age: '',
				gender: '',
				travel_type: '',
				identity: '',
				identity_number: '',
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
			withInvoice: false,
			agentType: '1',
			companyId: 0,
			genders: [
				{ text: 'ذكر', value: 1 },
				{ text: 'انثى', value: 2 },
			],
			identitys: [
				{ text: 'شخصية', value: 'Personal' },
				{ text: 'جواز سفر', value: 'Passport' },
			],
			travelTypes: [
				{ text: 'بر', value: 'بر' },
				{ text: 'بحر', value: 'بحر' },
				{ text: 'جوء', value: 'جوء' },
			],
		};
	},
	computed: {
		...companiesComputed,
		rules() {
			return {
				name: [(val) => !!val || 'اسم العميل مطلوب'],
				company: [(val) => !!val || 'يرجى تحديد الشركة'],
				age: [(value) => !!value || 'عمر العميل مطلوب'],
				gender: [(val) => !!val || 'جنس العميل مطلوب'],
				travel_type: [(val) => !!val || 'يرجى تحديد نوع السفر'],
				identity: [(val) => !!val || 'يرجى تحديد نوع الهوية'],
				identity_number: [(value) => !!value || 'رقم الهوية مطلوب'],
			};
		},
		formData() {
			return this.agent;
		},
		companiesList() {
			return this.active.map((company) => ({
				text: company.name,
				value: company.id,
			}));
		},
	},
	watch: {
		agent: {
			handler(val) {
				if (val.company_id) {
					this.agentType = '2';
					this.companyId = val.company_id;
				}
			},
			immediate: true,
			deep: true,
		},
	},

	methods: {
		submited() {
			this.$emit('submited', {
				data: {
					...this.formData,
					company_id: this.agentType == 2 ? this.companyId : null,
					company: this.agentType == 2 ? this.active.find((c) => (c.id = this.companyId)).name : 'NO',
				},
				withInvoice: this.isEdit ? false : this.withInvoice,
			});

			this.close();
		},
		close() {
			this.$refs.agentForm.reset();
			this.$emit('canceled');
		},
		reset() {
			this.$refs.agentForm.reset();
		},
	},
};
</script>

<style lang="scss" scoped></style>
