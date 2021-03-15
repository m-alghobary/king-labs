<template>
	<v-card>
		<v-form v-model="validForm" ref="invoiceForm" @submit.prevent="submited">
			<v-card-title>
				<span>نتيجة الفحص</span>
				<v-spacer></v-spacer>
				<template v-if="formData.delivered">
					<span class="me-4">تم التسليم</span>
					<v-avatar color="success" size="24">
						<v-icon dark small>mdi-check</v-icon>
					</v-avatar>
				</template>
			</v-card-title>
			<v-divider></v-divider>
			<v-card-text>
				<div v-if="isLoading" class="text-center">
					<v-progress-circular indeterminate size="48" color="primary"></v-progress-circular>
				</div>
				<div v-else>
					<v-row>
						<v-col class="pb-0" sm="6" cols="12">
							<v-select
								:readonly="formData.delivered === 1"
								v-model="formData.result"
								:items="results"
								:rules="rules.result"
								label="النتيجة"
								dense
								outlined
							></v-select>
						</v-col>
						<v-col class="pb-0" sm="6" cols="12">
							<v-text-field :readonly="formData.delivered === 1" v-model="formData.note" label="ملاحظة" dense outlined></v-text-field>
						</v-col>
					</v-row>
				</div>
			</v-card-text>
			<v-divider></v-divider>
			<v-card-actions>
				<v-spacer></v-spacer>
				<v-btn color="blue darken-1" text @click="close">اغلاق</v-btn>
				<v-btn color="blue darken-1" type="submit" :disabled="!validForm" text>حفظ </v-btn>
			</v-card-actions>
		</v-form>
	</v-card>
</template>

<script>
import { resultsActions } from '../../state/mapper';

export default {
	name: 'EditInvoiceForm',

	props: {
		invoice: {
			type: Object,
			default: () => ({}),
		},
	},

	data: () => ({
		validForm: true,
		isEdit: false,
		isLoading: false,
		resultId: 0,
		formData: {
			result: '',
			note: '',
			delivered: false,
		},
		results: [
			{ text: 'Positive', value: 'Positive' },
			{ text: 'Negative', value: 'Negative' },
		],
	}),

	computed: {
		rules() {
			return {
				result: [(val) => !!val || 'يرجى ادخال النتيجة'],
			};
		},
	},

	async created() {
		if (!this.invoice.id) return;
		try {
			this.isLoading = true;
			const data = await this.getResultAction(this.invoice.id);
			this.formData.result = data.result;
			this.formData.note = data.note;
			this.formData.delivered = data.delivered;
			this.resultId = data.id;
			this.isEdit = true;
			this.isLoading = false;
		} catch (error) {
			this.isLoading = false;
			console.log(error);
		}
	},

	methods: {
		...resultsActions,
		submited() {
			this.$emit('submited', {
				data: {
					operation_id: this.invoice.id,
					...this.formData,
				},
				isEdit: this.isEdit,
				id: this.resultId,
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
