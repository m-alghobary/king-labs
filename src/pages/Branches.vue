<template>
	<Layout>
		<div class="d-flex">
			<h1 class="text-h4">الفروع</h1>
			<v-spacer></v-spacer>
			<v-btn color="primary" dark class="mb-1 ms-2" @click="formDialog = true">
				<v-icon class="d-none d-sm-block me-2">mdi-plus</v-icon>
				<v-icon class="d-sm-none d-block">mdi-plus</v-icon>
				<span class="d-none d-sm-block"> إظافة فرع </span>
			</v-btn>
		</div>
		<v-divider class="my-4"></v-divider>
		<v-card>
			<v-toolbar flat color="white">
				<v-text-field v-model="search" label="بحث" dense outlined single-line hide-details append-icon="mdi-magnify"></v-text-field>
				<v-spacer></v-spacer>
				<v-btn outlined color="primary" @click="mainDialog = true">تحديد الفرع الرئيسي</v-btn>
				<v-dialog v-model="formDialog" max-width="700px" @click:outside="closeForm">
					<branch-form
						ref="branchForm"
						:branch="updateBranch"
						:form-title="formTitle"
						:is-edit="isEditMode"
						@canceled="closeForm"
						@submited="saveBranch"
					></branch-form>
				</v-dialog>
				<v-dialog v-model="mainDialog" max-width="400" @click:outside="mainDialog = false">
					<v-card>
						<v-card-title>تحديد الفرع الرئيسي</v-card-title>
						<v-divider></v-divider>
						<v-card-text>
							<v-select class="mt-4" v-model="mainBranch" dense label="الفرع" :items="branchList" outlined required></v-select>
						</v-card-text>
						<v-divider></v-divider>
						<v-card-actions>
							<v-spacer></v-spacer>
							<v-btn color="primary" text @click="mainDialog = false">
								اغلاق
							</v-btn>
							<v-btn color="primary" text @click="saveMain">
								حفظ
							</v-btn>
						</v-card-actions>
					</v-card>
				</v-dialog>
			</v-toolbar>
		</v-card>
		<v-data-table
			:headers="headers"
			:loading="isLoading"
			:items="active"
			sort-by="id"
			sort-desc
			class="mt-8 elevation-16"
			:search="search"
			:item-class="isMain"
		>
			<template v-slot:[`item.actions`]="{ item }">
				<v-tooltip top>
					<template v-slot:activator="{ on }">
						<v-btn dark small min-width="40" color="success" @click="editBranch(item)" v-on="on">
							<v-icon size="18">mdi-pencil</v-icon>
						</v-btn>
					</template>
					<span> تعديل </span>
				</v-tooltip>
				<v-tooltip top>
					<template v-slot:activator="{ on }">
						<v-btn dark small min-width="40" class="mx-3" color="error" @click="deleteBranch(item)" v-on="on">
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
import ConfirmDailog from '../components/base/confirm-dailog';
import { branchesComputed, branchesActions } from '../state/mapper';
import BranchForm from '../components/branches/branch-form';

export default {
	name: 'Users',

	components: {
		Layout,
		BranchForm,
		ConfirmDailog,
	},

	data: () => ({
		search: '',
		isLoading: false,
		formDialog: false,
		mainDialog: false,
		isEditMode: false,
		mainBranch: '',
		updateBranch: {
			name: '',
			phone: '',
			address: '',
		},
	}),

	computed: {
		...branchesComputed,
		headers() {
			return [
				{ text: 'الرقم', value: 'id' },
				{ text: 'اسم الفرع', value: 'name' },
				{ text: 'رقم التلفون', value: 'phone' },
				{ text: 'العنوان', value: 'address' },
				{ text: 'إدارة', value: 'actions', sortable: false },
			];
		},
		formTitle() {
			return !this.isEditMode ? 'اظافة فرع' : 'تعديل فرع';
		},
		branchList() {
			return this.active.map((branch) => ({
				value: branch.id,
				text: branch.name,
			}));
		},
	},

	// async created() {
	// 	try {
	// 		this.isLoading = true;
	// 		await this.getBranchesAction();
	// 		this.isLoading = false;
	// 	} catch (error) {
	// 		this.$VAlert.error('عذرا حدث خطأ!');
	// 		this.isLoading = false;
	// 	}
	// },

	methods: {
		...branchesActions,
		editBranch(branch) {
			this.isEditMode = true;
			Object.assign(this.updateBranch, branch);
			this.formDialog = true;
		},
		async deleteBranch(branch) {
			try {
				const confirmed = await this.$refs.confirm.open('حذف مستخدم', 'هل انت متأكد من حذف هذا الفرع؟');
				if (confirmed) {
					await this.deleteBranchAction(branch.id);
					this.$VAlert.success('تم حذف الفرع');
				}
			} catch (error) {
				this.$VAlert.error('عذرا حدث خطأ!');
			}
		},
		async saveBranch(branchData) {
			try {
				if (this.isEditMode) {
					const branchId = this.updateBranch.id;
					await this.editBranchAction({ branchData, branchId });
				} else {
					await this.saveBranchAction(branchData);
				}
				this.$VAlert.success('تم حفظ الفرع');
			} catch (error) {
				this.$VAlert.error('عذرا حدث خطأ!');
			}
		},
		async saveMain() {
			try {
				this.isLoading = true;
				await this.editMainAction(this.mainBranch);
				this.isLoading = false;
				this.$VAlert.success('تم حفظ الفرع');
			} catch (error) {
				this.$VAlert.error('عذرا حدث خطأ!');
				this.isLoading = false;
			}

			this.mainDialog = false;
		},
		isMain(item) {
			return item.is_main ? 'green lighten-5' : '';
		},
		closeForm() {
			this.$refs.branchForm.reset();
			this.isEditMode = false;
			this.formDialog = false;
		},
	},
};
</script>

<style lang="scss" scoped></style>
