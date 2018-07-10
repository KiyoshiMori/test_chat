let initialState = {};

if (process.browser) {
	initialState = window.__REDUX_STATE__;

	const redux_state = document.getElementById('redux-state');
	redux_state.parentElement.removeChild(redux_state);
	delete window.__REDUX_STATE__;

	console.log(initialState);
}

const types = {
	AUTH: "AUTH",
};

export const actions = {
	authorize: data => ({
		type: types.AUTH,
		payload: {
			isAuth: data.isAuth,
			loading: data.loading,
		}
	}),
};

export const authReducer = (state = initialState, action) => {
	switch(action.type) {
		case types.AUTH:
			return {
				...state,
				authorization: {
					...action.payload
				},
			};
		default:
			return state;
	}
};