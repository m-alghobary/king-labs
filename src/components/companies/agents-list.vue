<template>
	<div class="">
		<v-container class="grey lighten-4 rounded-lg mb-3">
			<h4 class="mb-2">قائمة العملاء</h4>
			<v-simple-table max-height="300px" fixed-header>
				<template v-slot:default>
					<thead>
						<tr>
							<th class="text-right">اسم العميل</th>
							<th class="text-right">عمر العميل</th>
							<th class="text-right">جنس العميل</th>
							<th class="text-right">نوع الهوية</th>
							<th class="text-right">رقم الهوية</th>
							<th></th>
						</tr>
					</thead>
					<tbody>
						<tr v-for="agent in agents" :key="agent.name">
							<td>{{ agent.name }}</td>
							<td>{{ agent.age }}</td>
							<td>{{ agent.gender }}</td>
							<td>{{ agent.identity }}</td>
							<td>{{ agent.identity_number }}</td>
							<td class="text-left">
								<v-btn icon color="error" @click="deleteAgent(agent.name)">
									<v-icon>mdi-delete</v-icon>
								</v-btn>
							</td>
						</tr>
					</tbody>
				</template>
			</v-simple-table>
		</v-container>
		<v-form ref="form" v-model="validForm">
			<v-container class="grey lighten-4 rounded-lg">
				<v-row class="pt-5">
					<v-col class="py-0" sm="6" cols="12">
						<v-text-field v-model="agentData.name" :rules="rules.name" dense outlined label="اسم العميل"></v-text-field>
					</v-col>
					<v-col class="py-0" sm="6" cols="12">
						<div class="d-flex">
							<v-text-field v-model="agentData.age" :rules="rules.age" dense outlined label="عمر العميل" type="number"></v-text-field>
							<v-select
								v-model="agentData.gender"
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
						<v-select
							v-model="agentData.identity"
							:items="identitys"
							:rules="rules.identity"
							dense
							outlined
							label="نوع الهوية"
						></v-select>
					</v-col>
					<v-col class="py-0" sm="6" cols="12">
						<v-text-field
							v-model="agentData.identity_number"
							type="number"
							:rules="rules.identity_number"
							dense
							outlined
							label="رقم الهوية"
						></v-text-field>
					</v-col>
					<v-col class="py-0" sm="6" cols="12">
						<v-select
							v-model="agentData.travel_type"
							:items="travelTypes"
							:rules="rules.travel_type"
							dense
							outlined
							label="نوع السفر"
						></v-select>
					</v-col>
				</v-row>
				<div class="d-flex mt-4">
					<v-tooltip top>
						<template #activator="{ on }">
							<v-btn :disabled="!validForm" fab small color="primary" v-on="on" @click="addAgent"> <v-icon>mdi-plus</v-icon> </v-btn>
						</template>
						<span>إظافة عميل</span>
					</v-tooltip>
				</div>
			</v-container>
		</v-form>
	</div>
</template>

<script>
export default {
	name: 'CompanyAgents',

	props: {
		value: {
			type: Array,
			default: () => [],
		},
	},

	data: () => ({
		agents: [],
		validForm: false,
		genders: [
			{ text: 'ذكر', value: 1 },
			{ text: 'انثى', value: 2 },
		],
		identitys: [
			{ text: 'شخصية', value: 'Personal' },
			{ text: 'جواز سفر', value: 'Passport' },
		],
		agentData: {
			name: '',
			age: '',
			gender: '',
			travel_type: '',
			identity: '',
			identity_number: '',
		},
		travelTypes: [
			{ text: 'بر', value: 'بر' },
			{ text: 'بحر', value: 'بحر' },
			{ text: 'جوء', value: 'جوء' },
		],
	}),

	computed: {
		rules() {
			return {
				name: [(val) => !!val || 'اسم العميل مطلوب'],
				age: [(value) => !!value || 'عمر العميل مطلوب'],
				gender: [(val) => !!val || 'جنس العميل مطلوب'],
				travel_type: [(val) => !!val || 'يرجى تحديد نوع السفر'],
				identity: [(val) => !!val || 'يرجى تحديد نوع الهوية'],
				identity_number: [(value) => !!value || 'رقم الهوية مطلوب'],
			};
		},
	},

	watch: {
		value: {
			handler(val) {
				if (val && val.length) {
					this.agents = val;
				}
			},
			immediate: true,
		},
	},

	mounted() {
		this.$emit('input', this.agents);
	},

	methods: {
		addAgent() {
			this.agents.push({
				...this.agentData,
			});

			this.$refs.form.reset();
			this.$emit('input', this.agents);
		},

		deleteAgent(name) {
			this.agents = this.agents.filter((agent) => agent.name !== name);
			this.$emit('input', this.agents);
		},
	},
};
</script>

<style lang="scss" scoped></style>
