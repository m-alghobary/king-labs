<template>
	<Layout>
		<div class="d-flex">
			<h1 class="text-h4">المستخدمين</h1>
			<v-spacer></v-spacer>
			<v-btn color="primary" dark class="mb-1 ms-2" @click="formDialog = true">
				<v-icon class="d-none d-sm-block me-2">mdi-plus</v-icon>
				<v-icon class="d-sm-none d-block">mdi-plus</v-icon>
				<span class="d-none d-sm-block"> إظافة مستخدم </span>
			</v-btn>
		</div>
		<v-divider class="my-4"></v-divider>
		<v-card>
			<v-toolbar flat color="white">
				<v-text-field v-model="search" label="بحث" dense outlined single-line hide-details append-icon="mdi-magnify"></v-text-field>
				<v-spacer></v-spacer>
				<v-dialog v-model="formDialog" max-width="700px" @click:outside="closeForm">
					<user-form
						ref="userForm"
						:user="updateUser"
						:is-edit="isEditMode"
						:form-title="formTitle"
						@canceled="closeForm"
						@submited="saveUser"
					></user-form>
				</v-dialog>
			</v-toolbar>
		</v-card>
		<v-data-table :headers="headers" :loading="isLoading" :items="active" sort-by="id" sort-desc class="mt-8 elevation-16" :search="search">
			<template v-slot:[`item.actions`]="{ item }">
				<v-menu offset-y close-on-click origin="center center" transition="scale-transition">
					<template #activator="{ on, attrs }">
						<v-btn icon v-bind="attrs" v-on="on">
							<v-icon>mdi-dots-vertical</v-icon>
						</v-btn>
					</template>

					<v-list dense>
						<v-list-item-group color="primary">
							<v-list-item @click="editUser(item)">
								<v-list-item-icon>
									<v-icon>mdi-pencil</v-icon>
								</v-list-item-icon>
								<v-list-item-content>
									<v-list-item-title> تعديل </v-list-item-title>
								</v-list-item-content>
							</v-list-item>
						</v-list-item-group>
						<v-list-item-group color="primary">
							<v-list-item @click="userPermissions(item)">
								<v-list-item-icon>
									<v-icon>mdi-account-key</v-icon>
								</v-list-item-icon>
								<v-list-item-content>
									<v-list-item-title> الصلاحيات </v-list-item-title>
								</v-list-item-content>
							</v-list-item>
						</v-list-item-group>
						<v-list-item-group color="error">
							<v-list-item @click="deleteUser(item)">
								<v-list-item-icon>
									<v-icon color="error">mdi-delete</v-icon>
								</v-list-item-icon>
								<v-list-item-content>
									<v-list-item-title class="error--text">حذف</v-list-item-title>
								</v-list-item-content>
							</v-list-item>
						</v-list-item-group>
					</v-list>
				</v-menu>
			</template>
		</v-data-table>
		<v-dialog v-model="permissionsDialog" max-width="700px" @click:outside="closePermForm">
			<permissions-form
				ref="permissionsForm"
				:user="permissionsData"
				:is-edit="isEditMode"
				@canceled="closePermForm"
				@submited="savePermissions"
			></permissions-form>
		</v-dialog>
		<confirm-dailog ref="confirm"></confirm-dailog>
	</Layout>
</template>

<script>
import Layout from './layout/Layout';
import UserForm from '../components/users/user-form';
import ConfirmDailog from '../components/base/confirm-dailog';
import { usersComputed, usersActions, permissionsActions } from '../state/mapper';
import PermissionsForm from '../components/users/permissions-form.vue';

export default {
	name: 'Users',

	components: {
		Layout,
		UserForm,
		ConfirmDailog,
		PermissionsForm,
	},

	data: () => ({
		search: '',
		isLoading: false,
		formDialog: false,
		permissionsDialog: false,
		isEditMode: false,
		updateUser: {
			name: '',
			email: '',
			phone: '',
			job_title: '',
			branch_id: '',
			password: '',
		},
		permissionsData: {
			user_id: '',
			permissions: '',
		},
	}),

	computed: {
		...usersComputed,
		headers() {
			return [
				{ text: 'الرقم', value: 'id' },
				{ text: 'اسم المستخدم', value: 'name' },
				{ text: 'رقم التلفون', value: 'phone' },
				{ text: 'البريد الإلكتروني', value: 'email' },
				{ text: 'الفرع', value: 'branch.name' },
				{ text: 'إدارة', value: 'actions', sortable: false },
			];
		},
		formTitle() {
			return !this.isEditMode ? 'اظافة مستخدم' : 'تعديل مستخدم';
		},
	},
	methods: {
		...usersActions,
		...permissionsActions,
		editUser(user) {
			this.isEditMode = true;
			Object.assign(this.updateUser, user);
			this.formDialog = true;
		},
		async deleteUser(user) {
			try {
				const confirmed = await this.$refs.confirm.open('حذف مستخدم', 'هل انت متأكد من حذف هذا المستخدم؟');
				if (confirmed) {
					await this.deleteUserAction(user.id);
					this.$VAlert.success('تم حذف المستخدم');
				}
			} catch (error) {
				this.$VAlert.error('عذرا حدث خطأ!');
			}
		},
		async saveUser(userData) {
			try {
				if (this.isEditMode) {
					const userId = this.updateUser.id;
					await this.editUserAction({ userData, userId });
				} else {
					await this.saveUserAction(userData);
				}
				this.$VAlert.success('تم حفظ المستخدم');
			} catch (error) {
				this.$VAlert.error('عذرا حدث خطأ!');
			}
		},
		async userPermissions(user) {
			try {
				const data = await this.getUserPermissions(user.id);
				Object.assign(this.permissionsData, data);
				this.isEditMode = true;
			} catch (error) {
				Object.assign(this.permissionsData, {
					user_id: user.id,
					permissions: [],
				});
			}

			this.permissionsDialog = true;
		},
		async savePermissions(data) {
			try {
				if (this.isEditMode) {
					await this.editUserPermissions(data);
				} else {
					await this.saveUserPermissions(data);
				}
				this.$VAlert.success('تم حفظ المستخدم');
			} catch (error) {
				this.$VAlert.error('عذرا حدث خطأ!');
			}
		},
		closeForm() {
			this.$refs.userForm.reset();
			this.isEditMode = false;
			this.formDialog = false;
		},
		closePermForm() {
			this.$refs.permissionsForm.reset();
			this.isEditMode = false;
			this.permissionsDialog = false;
		},
	},
};
</script>

<style lang="scss" scoped></style>
