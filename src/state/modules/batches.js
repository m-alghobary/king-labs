import Vue from 'vue';
import api from '../../utils/api';

export const state = {
	batches: [],
};

export const getters = {};

export const mutations = {
	SET_BATCHES(state, batchesList) {
		batchesList.forEach((batch, i) => {
			Vue.set(state.batches, i, batch);
		});
	},
	ADD_BATCH(state, newBatch) {
		state.batches.push(newBatch);
	},
	DELETE_BATCH(state, batchId) {
		state.batches = state.batches.filter((batch) => batch.id !== batchId);
	},
	EDIT_BATCH(state, batchData) {
		state.batches.filter((batch, i) => {
			if (batch.id === batchData.id) {
				Vue.set(state.batches, i, batchData);
			}
		});
	},
};

export const actions = {
	getBatchesList({ commit }) {
		return api.get('/batches').then((response) => {
			const { data } = response.data;
			commit('SET_BATCHES', data);
			return data;
		});
	},
	saveBatch({ commit }, newBatch) {
		return api.post('/batches', newBatch).then((res) => {
			const { data } = res.data;
			commit('ADD_BATCH', data);
			return data;
		});
	},
	getBatch(context, batchId) {
		return api.get(`/batches/${batchId}`).then((res) => {
			const { data } = res.data;
			return data;
		});
	},
	deleteBatch({ commit }, batchId) {
		return api.delete(`/batches/${batchId}`).then((res) => {
			const { data } = res.data;
			commit('DELETE_BATCH', batchId);
			return data;
		});
	},
	editBatch({ commit }, { batchData, batchId }) {
		return api.put(`/batches/${batchId}`, batchData).then((res) => {
			const { data } = res.data;
			commit('EDIT_BATCH', data);
			return data;
		});
	},
};
