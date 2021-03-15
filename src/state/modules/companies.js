import Vue from 'vue';
import { getState } from '../../utils/local-stoage-utils';
import api from '../../utils/api';
import { generateId } from '../../utils/helpers';

export const state = {
	companies: getState('vuex.companies') || [],
};

export const getters = {
	active(state) {
		return state.companies.filter((company) => company.state !== 3);
	},
};

export const mutations = {
	SET_COMPANIES(state, companiesList) {
		state.companies = [];

		companiesList.forEach((company, i) => {
			Vue.set(state.companies, i, company);
		});
	},
	ADD_COMPANY(state, newCompany) {
		if (newCompany.id) state.companies.push(newCompany);
		else
			state.companies.push({
				id: generateId(state.companies),
				...newCompany,
				state: 1,
			});
	},
	DELETE_COMPANY(state, companyId) {
		const current = state.companies.find((company) => company.id === companyId);
		if (current.state === 1) state.companies = state.companies.filter((company) => company.id !== companyId);
		else {
			current.state = 3;
			state.companies.forEach((company, i) => {
				if (company.id === companyId) {
					Vue.set(state.companies, i, current);
				}
			});
		}
	},
	EDIT_COMPANY(state, companyData) {
		const current = state.companies.find((company) => company.id === companyData.id);
		const data = {
			...companyData,
			state: current.state === 0 ? 2 : 1,
		};

		state.companies.forEach((company, i) => {
			if (company.id === companyData.id) {
				Vue.set(state.companies, i, data);
			}
		});
	},
};

export const actions = {
	getCompaniesList({ commit }) {
		return api.get('/companies').then((response) => {
			const { data } = response.data;
			commit('SET_COMPANIES', data);
			return data;
		});
	},
	saveCompany({ commit }, newCompany) {
		commit('ADD_COMPANY', newCompany);
	},
	deleteCompany({ commit }, companyId) {
		commit('DELETE_COMPANY', companyId);
	},
	getCompany({ state }, companyId) {
		return new Promise((resolve, reject) => {
			const company = state.companies.find((company) => company.id === companyId);
			if (!company) reject(new Error('Company not found!'));

			resolve(company);
		});
	},
	editCompany({ commit }, { companyData, companyId }) {
		commit('EDIT_COMPANY', {
			...companyData,
			id: companyId,
		});
	},

	async sync({ state }) {
		const requests = [];
		const companies = state.companies;

		const newCompanies = companies.filter((branch) => branch.state === 1);
		const editedCompanies = companies.filter((branch) => branch.state === 2);
		const deletedCompanies = companies.filter((branch) => branch.state === 3);

		newCompanies.forEach((branch) => {
			requests.push(api.post('/companies', branch));
		});

		editedCompanies.forEach((branch) => {
			requests.push(api.put(`/companies/${branch.id}`, branch));
		});

		deletedCompanies.forEach((branch) => {
			requests.push(api.delete(`/companies/${branch.id}`));
		});

		await Promise.all(requests);
	},
};
