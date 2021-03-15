<template>
	<Layout>
		<div class="d-flex">
			<h1 class="text-h4">العملاء</h1>
			<v-spacer></v-spacer>
			<v-btn color="primary" dark class="mb-1 ms-2" @click="formDialog = true">
				<v-icon class="d-none d-sm-block me-2">mdi-plus</v-icon>
				<v-icon class="d-sm-none d-block">mdi-plus</v-icon>
				<span class="d-none d-sm-block"> إظافة دفعة </span>
			</v-btn>
		</div>
		<v-divider class="my-4"></v-divider>
		<v-card>
			<v-toolbar flat color="white">
				<v-text-field v-model="search" label="بحث" dense outlined single-line hide-details append-icon="mdi-magnify"></v-text-field>
				<v-spacer></v-spacer>
				<v-dialog v-model="formDialog" max-width="700px" @click:outside="closeForm">
					<batch-form
						ref="batchForm"
						:form-title="formTitle"
						:is-edit="isEditMode"
						:batch="updateBatch"
						@submited="saveBatch"
						@canceled="closeForm"
					></batch-form>
				</v-dialog>
				<v-dialog v-model="agentsDialog" max-width="800px">
					<v-card>
						<v-card-title>
							<h4 class="mb-2">قائمة العملاء</h4>
						</v-card-title>
						<v-card-text>
							<v-simple-table max-height="300px" fixed-header>
								<template v-slot:default>
									<thead>
										<tr>
											<th class="text-right">اسم العميل</th>
											<th class="text-right">عمر العميل</th>
											<th class="text-right">جنس العميل</th>
											<th class="text-right">نوع الهوية</th>
											<th class="text-right">رقم الهوية</th>
										</tr>
									</thead>
									<tbody>
										<tr v-for="agent in agents" :key="agent.name">
											<td>{{ agent.name }}</td>
											<td>{{ agent.age }}</td>
											<td>{{ agent.gender }}</td>
											<td>{{ agent.identity }}</td>
											<td>{{ agent.identity_number }}</td>
										</tr>
									</tbody>
								</template>
							</v-simple-table>
						</v-card-text>
						<v-card-actions>
							<v-spacer></v-spacer>
							<v-btn color="primary" text @click="agentsDialog = false">اغلاق</v-btn>
						</v-card-actions>
					</v-card>
				</v-dialog>
			</v-toolbar>
		</v-card>
		<v-data-table
			:headers="headers"
			:loading="isLoading"
			:items="batches"
			sort-by="id"
			sort-desc
			class="mt-8 elevation-16"
			:search="search"
			@click:row="loadAgents"
		>
			<template v-slot:[`item.actions`]="{ item }">
				<v-tooltip top>
					<template v-slot:activator="{ on }">
						<v-btn dark small min-width="40" color="success" @click.stop="editBatch(item)" v-on="on">
							<v-icon size="18">mdi-pencil</v-icon>
						</v-btn>
					</template>
					<span> تعديل </span>
				</v-tooltip>
				<v-tooltip top>
					<template v-slot:activator="{ on }">
						<v-btn dark small min-width="40" class="mx-3" color="error" @click.stop="deleteBatch(item)" v-on="on">
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
import { batchesComputed, batchesActions } from '../state/mapper';
import BatchForm from '../components/companies/batch-form';

export default {
	name: 'CompanyAgents',

	components: {
		Layout,
		ConfirmDailog,
		BatchForm,
	},

	data: () => ({
		search: '',
		isLoading: false,
		formDialog: false,
		agentsDialog: false,
		isEditMode: false,
		updateBatch: {
			name: '',
			identifier: '',
			branch_id: '',
		},
		agents: [],
	}),

	computed: {
		...batchesComputed,
		headers() {
			return [
				{ text: 'الرقم', value: 'id' },
				{ text: 'اسم الدفعة', value: 'name' },
				{ text: 'رقم التعريف', value: 'identifier' },
				{ text: 'عدد العملاء', value: 'agents_count' },
				{ text: 'إدارة', value: 'actions', sortable: false },
			];
		},
		formTitle() {
			return !this.isEditMode ? 'اظافة دفعة' : 'تعديل دفعة';
		},
	},

	created() {
		this.loadBatches();
	},

	methods: {
		...batchesActions,
		async loadBatches() {
			try {
				this.isLoading = true;
				await this.getBatchesAction();
				this.isLoading = false;
			} catch (error) {
				this.$VAlert.error('عذرا حدث خطأ!');
				this.isLoading = false;
			}
		},
		async editBatch(batch) {
			this.isEditMode = true;
			const data = await this.getBatchAction(batch.id);
			Object.assign(this.updateBatch, data);
			this.updateBatch.branch_id = data.agents[0].branch_id;
			this.formDialog = true;
		},
		async loadAgents(item) {
			const data = await this.getBatchAction(item.id);
			this.agents = data.agents;
			this.agentsDialog = true;
		},
		async deleteBatch(batch) {
			try {
				const confirmed = await this.$refs.confirm.open('حذف دفعة', 'هل انت متأكد من حذف هذا الدفعة؟');
				if (confirmed) {
					await this.deleteBatchAction(batch.id);
					this.$VAlert.success('تم حذف الدفعة');
				}
			} catch (error) {
				this.$VAlert.error('عذرا حدث خطأ!');
			}
		},
		async saveBatch(batchData) {
			try {
				if (this.isEditMode) {
					const batchId = this.updateBatch.id;
					await this.editBatchAction({ batchData, batchId });
				} else {
					await this.saveBatchAction(batchData);
				}

				this.loadBatches();
				this.$VAlert.success('تم حفظ الدفعة');
			} catch (error) {
				this.$VAlert.error('عذرا حدث خطأ!');
			}
		},
		closeForm() {
			this.$refs.batchForm.reset();
			this.isEditMode = false;
			this.formDialog = false;
		},
	},
};
</script>

<style lang="scss" scoped></style>
