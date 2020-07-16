import {
	FETCH_MEET_REQUEST,
	FETCH_MEET_SUCCESS,
	FETCH_MEET_ERROR,
	FETCH_MEETS_REQUEST,
	FETCH_MEETS_SUCCESS,
	FETCH_MEETS_ERROR,
	SET_MEET_ITEMS,
	CLEAR_SUCCESS,
} from '../types';

import { toastr } from 'react-redux-toastr';

import axios from 'axios';

export const save = (data, history) => (dispatch) => {
	dispatch({ type: FETCH_MEET_REQUEST });

	return axios
		.post('/meetings', data)
		.then((response) => {
			if (response.status === 201) {
				dispatch({ type: FETCH_MEET_SUCCESS, payload: response.data });
				dispatch(list());
			}
		})
		.catch((error) => {
			toastr.error('Erro ao salvar Audiência', error.response.data.message);
			dispatch({ type: FETCH_MEET_ERROR, payload: error.response.data });
		});
};

export const list = (query) => (dispatch) => {
	dispatch({ type: FETCH_MEETS_REQUEST });

	return axios
		.get('/meetings', { params: query })
		.then((response) => {
			dispatch({ type: FETCH_MEETS_SUCCESS, payload: response.data });
		})
		.catch((error) => {
			dispatch({ type: FETCH_MEETS_ERROR, payload: error.response.data });
		});
};

export const myMeets = () => (dispatch, getState) => {
	const { id } = getState().auth.user.credentials;
	const { items } = getState().meeting.meetings;

	return dispatch({
		type: SET_MEET_ITEMS,
		payload: items.filter((item) => {
			if (item.participants.find((participant) => participant._id === id)) {
				return item;
			} else {
				return {};
			}
		}),
	});
};

export const update = (data, id, query) => (dispatch) => {
	dispatch({ type: FETCH_MEET_REQUEST });
	return axios
		.put(`/meetings/${id}`, data)
		.then((response) => {
			dispatch({ type: FETCH_MEET_SUCCESS, payload: response.data });
			toastr.success('Videoconferência atualizada com sucesso');
			dispatch(list(query));
		})
		.catch((error) => {
			dispatch({ type: FETCH_MEET_ERROR, payload: error.response.data });
		});
};

export const get = (id) => (dispatch) => {
	dispatch({ type: FETCH_MEET_REQUEST });
	return axios
		.get(`/meetings/${id}`)
		.then((response) => {
			dispatch({ type: FETCH_MEET_SUCCESS, payload: response.data });
			toastr.success('Videoconferência atualizada com sucesso');
			dispatch(list());
		})
		.catch((error) => {
			dispatch({ type: FETCH_MEET_ERROR, payload: error.response.data });
		});
};

export const clear = () => (dispatch) => dispatch({ type: CLEAR_SUCCESS });
