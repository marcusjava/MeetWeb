import {
	FETCH_MEET_REQUEST,
	FETCH_MEET_SUCCESS,
	FETCH_MEET_ERROR,
	FETCH_MEETS_REQUEST,
	FETCH_MEETS_SUCCESS,
	FETCH_MEETS_ERROR,
	SET_MEET_ITEMS,
	CLEAR_ERRORS,
	CLEAR_SUCCESS,
} from '../types';

const initialState = {
	meeting: {
		loading: false,
		success: false,
		error: {},
		item: {},
	},
	meetings: {
		loading: false,
		success: false,
		error: {},
		items: [],
	},
};

export default (state = initialState, action) => {
	switch (action.type) {
		case FETCH_MEET_REQUEST:
			return {
				...state,
				meeting: {
					...state.meeting,
					loading: true,
					success: false,
				},
			};

		case FETCH_MEET_SUCCESS:
			return {
				...state,
				meeting: {
					...state.meeting,
					item: action.payload,
					loading: false,
					success: true,
				},
			};

		case FETCH_MEET_ERROR:
			return {
				...state,
				meeting: {
					...state.meeting,
					error: action.payload,
					loading: false,
					success: false,
				},
			};

		case SET_MEET_ITEMS:
			return {
				...state,
				meetings: {
					...state.meetings,
					items: action.payload,
				},
			};

		case FETCH_MEETS_REQUEST:
			return {
				...state,
				meetings: {
					...state.meetings,
					loading: true,
					success: false,
				},
			};

		case FETCH_MEETS_SUCCESS:
			return {
				...state,
				meetings: {
					...state.meetings,
					loading: false,
					success: true,
					items: action.payload,
				},
			};

		case FETCH_MEETS_ERROR:
			return {
				...state,
				meetings: {
					...state.meetings,
					error: action.payload,
					loading: false,
					success: false,
				},
			};
		case CLEAR_SUCCESS:
			return {
				...state,
				meeting: {
					...state.meeting,
					loading: false,
					success: false,
					error: false,
				},
				meetings: {
					...state.meetings,
					loading: false,
					success: false,
					error: false,
				},
			};

		default:
			return state;
	}
};
