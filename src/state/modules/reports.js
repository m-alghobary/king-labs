import api from '../../utils/api';

export const state = {};

export const getters = {};

export const mutations = {};

export const actions = {
	getFinancialSummary(context, filters) {
		return api.get(`/reports/financial/summary?${filtersToQuery(filters)}`).then((res) => {
			return res.data;
		});
	},
	getFinancialData(context, filters) {
		return api.get(`/reports/financial/data?${filtersToQuery(filters)}`).then((res) => {
			return res.data.data.flat();
		});
	},
};

function filtersToQuery(filters) {
	const from = filters.from === '' ? '' : new Date(filters.from).toLocaleString();
	const to = filters.to === '' ? '' : new Date(filters.to).toLocaleString();

	return `branches=${filters.branches}&from=${from}&to=${to}`;
}
