<template>
	<v-card>
		<v-form ref="batchForm" v-model="validForm" @submit.prevent="submited">
			<v-card-title>
				<span class="headline">{{ formTitle }}</span>
			</v-card-title>
			<v-divider></v-divider>
			<v-card-text>
				<v-row class="mb-2">
					<v-col class="py-0" sm="6" cols="12">
						<v-text-field v-model="formData.name" :rules="rules.name" dense label="اسم الدفعة" outlined required></v-text-field>
					</v-col>
					<v-col class="py-0" sm="6" cols="12">
						<v-text-field v-model="formData.identifier" dense label="رقم التعريف" outlined required></v-text-field>
					</v-col>
					<v-col class="py-0" sm="6" cols="12">
						<v-select
							v-model="formData.branch_id"
							:items="branchList"
							:rules="rules.branch_id"
							dense
							label="الفرع"
							outlined
							required
						></v-select>
					</v-col>
				</v-row>
				<agents-list v-model="formData.agents"></agents-list>
			</v-card-text>
			<v-divider></v-divider>
			<v-card-actions>
				<v-spacer></v-spacer>
				<v-btn color="blue darken-1" text @click="close">اغلاق</v-btn>
				<v-btn color="blue darken-1" type="submit" :disabled="saveDisabled" text>حفظ</v-btn>
			</v-card-actions>
		</v-form>
	</v-card>
</template>

<script>
import agentsList from './agents-list.vue';
import { branchesActions } from '../../state/mapper';

export default {
	components: { agentsList },
	name: 'BatchForm',
	props: {
		formTitle: {
			type: String,
			default: 'Make new company',
		},
		batch: {
			type: Object,
			default: () => ({
				name: '',
				identifier: '',
				branch_id: '',
				agents: [],
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
			branches: [],
		};
	},
	computed: {
		rules() {
			return {
				name: [(val) => !!val || 'اسم الدفعة مطلوب'],
				branch_id: [(val) => !!val || 'يرجى تحديد الفرع'],
			};
		},
		formData() {
			return this.batch;
		},
		saveDisabled() {
			return !this.validForm || this.formData.agents.length === 0;
		},
		branchList() {
			return this.branches.map((branch) => ({
				value: branch.id,
				text: branch.name,
			}));
		},
	},

	async created() {
		try {
			this.branches = await this.loadBranches();
		} catch (error) {
			this.$VAlert.error('');
		}
	},

	methods: {
		loadBranches: branchesActions.getBranchesAction,
		submited() {
			this.$emit('submited', {
				...this.formData,
			});

			this.close();
		},
		close() {
			this.$refs.batchForm.reset();
			this.$emit('canceled');
		},
		reset() {
			this.$refs.batchForm.reset();
		},
	},
};
</script>

<style lang="scss" scoped></style>
