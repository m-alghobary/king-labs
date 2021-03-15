<template>
	<v-card>
		<v-form ref="invoiceForm" v-model="validForm" @submit.prevent="submited">
			<v-toolbar dark color="primary">
				<v-btn icon dark @click="close">
					<v-icon>mdi-close</v-icon>
				</v-btn>
				<v-toolbar-title><span class="headline">إظافة فحص</span></v-toolbar-title>
				<v-spacer></v-spacer>
				<v-toolbar-items>
					<v-btn color="blue darken-1" type="submit" :disabled="!validForm" elevation="0">حفظ </v-btn>
					<v-btn color="blue darken-1" type="submit" :disabled="!validForm" elevation="0" @click="withPrint = true">حفظ وطباعة </v-btn>
				</v-toolbar-items>
			</v-toolbar>
			<v-card-text>
				<v-container>
					<label class="d-block mb-6 ms-1">حدد الفحوصات المطلوبة</label>
					<v-row>
						<v-col v-for="agent in agents" :key="agent.id" sm="4" cols="12">
							<p class="my-2">
								<v-avatar size="10" color="primary" class="me-2"> </v-avatar>
								{{ agent.name }}
							</p>
							<test-select v-model="agent.tests" :rules="rules.tests"></test-select>
						</v-col>
					</v-row>
					<v-divider class="my-5"></v-divider>
					<v-switch v-model="showDiscount" label="إضافة تخفيض"></v-switch>
					<template v-if="showDiscount">
						<label class="d-block my-3 ms-1">بيانات التخفيض</label>
						<v-row>
							<v-col>
								<v-select v-model="discountType" :items="discountTypes" label="نوع التخفيض" dense outlined></v-select>
							</v-col>
							<v-col>
								<v-select
									v-model="discountBy"
									:rules="rules.discountBy"
									:items="discountBys"
									label="بتوجية من"
									dense
									outlined
								></v-select>
							</v-col>
							<v-col>
								<v-text-field type="number" v-model="discount" :rules="rules.discount" label="التخفيض" dense outlined>
									<template v-slot:append>
										<span class="mt-1 primary--text text-body-2 mark">
											{{ discountType === 'Percent' ? '%' : 'YR' }}
										</span>
									</template>
								</v-text-field>
							</v-col>
						</v-row>
					</template>
					<template v-if="companyDiscount">
						<label class="d-block my-3 ms-1">عمولة الشركة</label>
						<v-row>
							<v-col md="4" sm="6">
								<v-text-field readonly type="number" v-model="companyDiscount" dense outlined>
									<template v-slot:append>
										<span class="mt-1 primary--text text-body-2 mark">%</span>
									</template>
								</v-text-field>
							</v-col>
						</v-row>
					</template>
					<label class="d-block my-3 ms-1">بيانات الدفع</label>
					<v-row>
						<v-col>
							<v-text-field type="number" v-model="total" readonly label="المبلغ كاملا" dense outlined>
								<template v-slot:append>
									<span class="mt-1 primary--text text-body-2 mark">YR</span>
								</template>
							</v-text-field>
						</v-col>
						<v-col>
							<v-select v-model="payMethod" :items="paymentMethods" label="طريقة الدفع" dense outlined></v-select>
						</v-col>
						<v-col>
							<v-text-field type="number" v-model="amount" label="المبلغ المقبوض" dense outlined :rules="rules.amount">
								<template v-slot:append>
									<span class="mt-1 primary--text text-body-2 mark">YR</span>
								</template>
							</v-text-field>
						</v-col>
						<v-col>
							<v-text-field readonly type="number" v-model="remain" label="المبلغ المتبقي" dense outlined>
								<template v-slot:append>
									<span class="mt-1 primary--text text-body-2 mark">YR</span>
								</template>
							</v-text-field>
						</v-col>
					</v-row>
				</v-container>
			</v-card-text>
		</v-form>
	</v-card>
</template>

<script>
import testSelect from '../base/test-select.vue';
import { companiesActions } from '../../state/mapper';

export default {
	components: { testSelect },
	name: 'InvoiceForm',

	props: {
		agents: {
			type: Array,
			default: () => [],
		},
	},

	data: () => ({
		validForm: true,
		withPrint: false,
		showDiscount: false,
		tests: [],
		selected: [],
		discount: 0,
		companyDiscount: 0,
		amount: '',
		paymentMethods: [
			{ text: 'نقدا', value: 'Cash' },
			{ text: 'آجل', value: 'Credit' },
			{ text: 'جزئي', value: 'Partial' },
		],
		discountTypes: [
			{ text: 'نسبة', value: 'Percent' },
			{ text: 'مبلغ', value: 'Amount' },
		],
		discountBys: [
			{ text: 'المدير العام', value: 'المدير العام' },
			{ text: 'نائب المدير العام', value: 'نائب المدير العام' },
			{ text: 'المدير المالي', value: 'المدير المالي' },
			{ text: 'مدير المختبر', value: 'مدير المختبر' },
		],
		payMethod: 'Cash',
		discountType: 'Percent',
		discountBy: '',
		totalPrice: '',
	}),

	computed: {
		rules() {
			return {
				tests: [
					(val) => {
						return !!val.length || 'يرجى تحديد الفحوصات';
					},
				],
				amount: [(val) => val > 0 || 'يرجى ادخال المبلغ المقبوض'],
				discount: [(val) => !!val || 'يرجى تحديد من وحجه التخفيظ'],
				discountBy: [(val) => !!val || 'يرجى تحديد من وحجه التخفيظ'],
			};
		},

		remain: {
			get() {
				const val = this.total - this.amount;
				return val < 0 ? 0 : val;
			},
			set() {},
		},

		compDiscount() {
			return this.companyDiscount > 0 ? this.totalPrice * (this.companyDiscount / 100) : 0;
		},

		getDiscount() {
			let val = parseInt(this.discount);
			if (!val) return 0;

			return this.discountType === 'Percent' ? this.totalPrice * (val / 100) : val;
		},

		total: {
			get() {
				return this.totalPrice - this.getDiscount - this.compDiscount;
			},
			set() {},
		},

		deliveryDate() {
			const tests = this.agents.map((agent) => agent.tests).flat();
			const houres = Math.max(...tests.map((test) => test.duration));
			const now = new Date();
			if (houres !== -Infinity) now.setTime(now.getTime() + houres * 60 * 60 * 1000);

			return now.toLocaleString();
		},
	},

	watch: {
		agents: {
			async handler(val) {
				this.totalPrice = this.total = val.reduce((prev, cur) => {
					return prev + cur.tests.reduce((t, test) => t + test.price, 0);
				}, 0);
			},
			deep: true,
		},
	},

	async mounted() {
		if (this.agents[0].company_id) {
			const data = await this.getCompanyAction(this.agents[0].company_id);
			this.discount_type = 'Percent';
			this.companyDiscount = data.discount;
		}
	},

	methods: {
		...companiesActions,
		submited() {
			this.$emit('submited', {
				data: {
					payment_method: this.payMethod,
					total_amount: this.total,
					amount: this.amount > this.total ? this.total : this.amount,
					remain: this.remain,
					discount: this.getDiscount,
					fee: this.compDiscount,
					discount_type: this.discountType,
					discount_by: this.discountBy,
					delivery_date: this.deliveryDate,
					agents: this.agents.map((agent) => ({
						id: agent.id,
						name: agent.name,
						tests: [agent.tests[0].id],
						testName: agent.tests[0].name,
					})),
				},
				withPrint: this.withPrint,
			});

			this.close();
		},
		close() {
			this.$refs.invoiceForm.reset();
			this.$emit('canceled');
		},
		reset() {
			this.$refs.invoiceForm.reset();
		},
	},
};
</script>

<style lang="scss" scoped></style>
