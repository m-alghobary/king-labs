<template>
	<Layout>
		<div class="d-flex">
			<h1 class="text-h4">الشركات</h1>
			<v-spacer></v-spacer>
			<v-btn color="primary" dark class="mb-1 ms-2" @click="formDialog = true">
				<v-icon class="d-none d-sm-block me-2">mdi-plus</v-icon>
				<v-icon class="d-sm-none d-block">mdi-plus</v-icon>
				<span class="d-none d-sm-block"> إظافة شركة </span>
			</v-btn>
		</div>
		<v-divider class="my-4"></v-divider>
		<v-card>
			<v-toolbar flat color="white">
				<v-text-field v-model="search" label="بحث" dense outlined single-line hide-details append-icon="mdi-magnify"></v-text-field>
				<v-spacer></v-spacer>

				<v-dialog v-model="formDialog" max-width="700px" @click:outside="closeForm">
					<company-form
						ref="companyForm"
						:company="updateCompany"
						:form-title="formTitle"
						:is-edit="isEditMode"
						@canceled="closeForm"
						@submited="saveCompany"
					></company-form>
				</v-dialog>
			</v-toolbar>
		</v-card>
		<v-data-table :headers="headers" :loading="isLoading" :items="active" sort-by="id" sort-desc class="mt-8 elevation-16" :search="search">
			<template v-slot:[`item.discount`]="{ value }">
				{{ `${value}%` }}
			</template>
			<template v-slot:[`item.actions`]="{ item }">
				<v-tooltip top>
					<template v-slot:activator="{ on }">
						<v-btn dark small min-width="40" color="success" @click="editCompany(item)" v-on="on">
							<v-icon size="18">mdi-pencil</v-icon>
						</v-btn>
					</template>
					<span> تعديل </span>
				</v-tooltip>
				<v-tooltip top>
					<template v-slot:activator="{ on }">
						<v-btn dark small min-width="40" class="mx-3" color="error" @click="deleteCompany(item)" v-on="on">
							<v-icon size="18">mdi-delete</v-icon>
						</v-btn>
					</template>
					<span>حذف</span>
				</v-tooltip>
			</template>
		</v-data-table>
		<confirm-dailog ref="confirm"></confirm-dailog>
	</Layout>
</template>

<script>
import Layout from './layout/Layout';
import CompanyForm from '../components/companies/company-form';
import ConfirmDailog from '../components/base/confirm-dailog';
import { companiesComputed, companiesActions } from '../state/mapper';

export default {
	name: 'Companys',

	components: {
		Layout,
		CompanyForm,
		ConfirmDailog,
	},

	data: () => ({
		search: '',
		isLoading: false,
		formDialog: false,
		isEditMode: false,
		updateCompany: {
			name: '',
			email: '',
			phone: '',
			fee: '',
			password: '',
		},
	}),

	computed: {
		...companiesComputed,
		headers() {
			return [
				{ text: 'الرقم', value: 'id' },
				{ text: 'اسم الشركة', value: 'name' },
				{ text: 'رقم التلفون', value: 'phone' },
				{ text: 'البريد الإلكتروني', value: 'email' },
				{ text: 'التخفيض', value: 'discount' },
				{ text: 'إدارة', value: 'actions', sortable: false },
			];
		},
		formTitle() {
			return !this.isEditMode ? 'اظافة شركة' : 'تعديل شركة';
		},
	},

	methods: {
		...companiesActions,
		editCompany(company) {
			this.isEditMode = true;
			Object.assign(this.updateCompany, company);
			this.formDialog = true;
		},
		async deleteCompany(company) {
			try {
				const confirmed = await this.$refs.confirm.open('حذف شركة', 'هل انت متأكد من حذف هذا الشركة؟');
				if (confirmed) {
					await this.deleteCompanyAction(company.id);
					this.$VAlert.success('تم حذف الشركة');
				}
			} catch (error) {
				this.$VAlert.error('عذرا حدث خطأ!');
			}
		},
		async saveCompany(companyData) {
			try {
				if (this.isEditMode) {
					const companyId = this.updateCompany.id;
					await this.editCompanyAction({ companyData, companyId });
				} else {
					await this.saveCompanyAction(companyData);
				}
				this.$VAlert.success('تم حفظ الشركة');
			} catch (error) {
				this.$VAlert.error('عذرا حدث خطأ!');
			}
		},
		closeForm() {
			this.$refs.companyForm.reset();
			this.isEditMode = false;
			this.formDialog = false;
		},
	},
};
</script>

<style lang="scss" scoped></style>
