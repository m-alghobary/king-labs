<template>
	<layout title="التقارير">
		<v-card>
			<v-card-title>
				<v-icon right>mdi-filter</v-icon>
				<span>فلترة</span>
			</v-card-title>
			<v-card-text>
				<v-row>
					<v-col v-if="isMain">
						<v-select
							:items="branchList"
							multiple
							small-chips
							v-model="filters.branches"
							label="الفروع"
							dense
							outlined
							hide-details
						></v-select>
					</v-col>
					<v-col>
						<date-dailog v-model="filters.from" label="من تأريخ" hide-details></date-dailog>
					</v-col>
					<v-col>
						<date-dailog v-model="filters.to" label="الى تأريخ" hide-details></date-dailog>
					</v-col>
					<v-col v-if="!isMain"></v-col>
				</v-row>
			</v-card-text>
			<v-card-actions class="px-5 pb-5">
				<v-spacer></v-spacer>
				<v-btn color="primary" @click="applyFilters">تطبيق</v-btn>
			</v-card-actions>
		</v-card>
		<v-card class="mt-7">
			<v-tabs>
				<v-tab>ماخص مالي حسب الفرع</v-tab>
				<v-tab>تقرير مالي تفصيلي</v-tab>
				<v-tab-item>
					<v-divider></v-divider>
					<v-btn class="my-2 ms-2" color="primary" @click="printSummary">
						<v-icon left>mdi-printer</v-icon>
						طباعة
					</v-btn>
					<v-divider></v-divider>
					<v-data-table :loading="isLoading" :items="summary" :headers="summaryHeaders">
						<template v-slot:[`item.invoices_sum_discount`]="{ value }"> {{ value || 0 }} </template>
						<template v-slot:[`item.invoices_sum_fee`]="{ value }"> {{ value || 0 }} </template>
						<template v-slot:[`item.invoices_sum_total_amount`]="{ item }"> {{ calcAmount(item) }} </template>
						<template v-slot:[`item.net_amount`]="{ item }"> {{ item.invoices_sum_total_amount || 0 }} </template>
						<template v-slot:[`body.append`]>
							<tr class="primary--text blue lighten-5">
								<td>الاجمالي</td>
								<td></td>
								<td>{{ summary.reduce((prev, cur) => prev + cur.invoices_count, 0) }}</td>
								<td>{{ summary.reduce((prev, cur) => (prev += calcAmount(cur)), 0) }}</td>
								<td>{{ summary.reduce((prev, cur) => prev + cur.invoices_sum_discount, 0) }}</td>
								<td>{{ summary.reduce((prev, cur) => prev + cur.invoices_sum_fee, 0) }}</td>
								<td>{{ summary.reduce((prev, cur) => (prev += cur.invoices_sum_total_amount), 0) }}</td>
							</tr>
						</template>
					</v-data-table>
				</v-tab-item>
				<v-tab-item>
					<v-divider></v-divider>
					<v-btn class="my-2 ms-2" color="primary" @click="printData">
						<v-icon left>mdi-printer</v-icon>
						طباعة
					</v-btn>
					<v-divider></v-divider>
					<v-data-table :loading="isLoading" :items="data" :headers="dataHeaders">
						<template v-slot:[`item.amount`]="{ item }"> {{ item.amount + item.discount }} </template>
						<template v-slot:[`item.net_amount`]="{ item }"> {{ item.amount + item.discount - item.discount - item.fee }} </template>
						<template v-slot:[`body.append`]>
							<tr class="primary--text blue lighten-5">
								<td>الاجمالي</td>
								<td></td>
								<td></td>
								<td></td>
								<td></td>
								<td>{{ amountTotal }}</td>
								<td>{{ discountTotal }}</td>
								<td>{{ data.reduce((prev, cur) => prev + cur.fee, 0) }}</td>
								<td>{{ netTotal }}</td>
							</tr>
						</template>
					</v-data-table>
				</v-tab-item>
			</v-tabs>
		</v-card>

		<v-dialog v-model="offlineDialog" max-width="350">
			<v-card>
				<v-card-title class="headline">لا يوجد انترنت</v-card-title>
				<v-card-text>عذرا لايمكن الطباعة بدون انترنت!</v-card-text>
				<v-card-actions>
					<v-spacer></v-spacer>
					<v-btn color="primary" text @click="offlineDialog = false">اغلاق</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>
	</layout>
</template>

<script>
import layout from './layout/Layout.vue';
import { reportsActions, authComputed, branchesActions } from '../state/mapper';
import { print } from '../utils/print';
import dateDailog from '../components/base/date-dailog.vue';

export default {
	components: { layout, dateDailog },
	name: 'Reports',

	data: () => ({
		summary: [],
		data: [],
		branches: [],
		isLoading: false,
		offlineDialog: false,
		filters: {
			branches: [],
			from: '',
			to: '',
		},
	}),

	computed: {
		...authComputed,
		summaryHeaders() {
			return [
				{ text: 'الرقم', value: 'id' },
				{ text: 'اسم الفرع', value: 'name' },
				{ text: 'عدد الفحوصات', value: 'invoices_count' },
				{ text: 'اجمالي المبلغ', value: 'invoices_sum_total_amount' },
				{ text: 'اجمالي الخصم', value: 'invoices_sum_discount' },
				{ text: 'عمولة الوكيل', value: 'invoices_sum_fee' },
				{ text: 'صافي التوريد', value: 'net_amount' },
			];
		},
		dataHeaders() {
			return [
				{ text: 'الرقم', value: 'id' },
				{ text: 'اسم الفرع', value: 'barnch' },
				{ text: 'التاريخ', value: 'date' },
				{ text: 'اسم العميل', value: 'agent' },
				{ text: 'رقم الجواز', value: 'identityNo' },
				{ text: 'اجمالي المبلغ', value: 'amount' },
				{ text: 'اجمالي الخصم', value: 'discount' },
				{ text: 'عمولة الوكيل', value: 'fee' },
				{ text: 'صافي التوريد', value: 'net_amount' },
			];
		},
		amountTotal() {
			return this.data.reduce((prev, cur) => (prev += cur.amount + cur.discount), 0);
		},
		discountTotal() {
			return this.data.reduce((prev, cur) => prev + cur.discount, 0);
		},
		netTotal() {
			return this.data.reduce((prev, cur) => (prev += cur.amount - cur.fee), 0);
		},
		branchList() {
			return this.branches.map((branch) => ({
				value: branch.id,
				text: branch.name,
			}));
		},
		isMain() {
			if (!this.branches.length) return false;
			const main = this.branches.find((branch) => branch.is_main);
			return main.id === this.currentUser.data.branch_id;
		},
	},

	async created() {
		try {
			this.isLoading = true;
			this.branches = await this.loadBranches();
			await this.loadReports();
			this.isLoading = false;
		} catch (error) {
			this.$VAlert.error('عذرا حدث خطأ!');
			this.isLoading = false;
		}
	},

	methods: {
		...reportsActions,
		loadBranches: branchesActions.getBranchesAction,

		async loadReports() {
			this.summary = await this.getFinancialSummary(this.filters);
			this.data = await this.getFinancialData(this.filters);
		},

		calcAmount(item) {
			const amount = item.invoices_sum_total_amount || 0;
			const discount = item.invoices_sum_discount || 0;
			const fee = item.invoices_sum_fee || 0;

			return amount + discount + fee;
		},

		async applyFilters() {
			await this.loadReports();
		},

		filtersToQuery() {
			const branches = this.isMain ? this.filters.branches : this.currentUser.data.branch_id;
			const from = this.filters.from === '' ? '' : new Date(this.filters.from).toString();
			const to = this.filters.to === '' ? '' : new Date(this.filters.to).toString();

			return `branches=${branches}&from=${from}&to=${to}`;
		},

		printSummary() {
			if (window.navigator.onLine) {
				print(`/print/reports/summary?${this.filtersToQuery()}`);
			} else {
				this.offlineDialog = true;
			}
		},

		printData() {
			if (window.navigator.onLine) {
				print(`/print/reports/data?${this.filtersToQuery()}`);
			} else {
				this.offlineDialog = true;
			}
		},
	},
};
</script>

<style lang="scss" scoped></style>
