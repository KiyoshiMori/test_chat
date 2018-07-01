const types = {
	TEST_ACTION: "TEST_ACTION"
};

export const actionTest = text => ({
	type: types.TEST_ACTION,
	payload: text,
});

let initialState = {};

if (process.browser) {
	initialState = window.__REDUX_STATE__;

	const redux_state = document.getElementById('redux-state');
	redux_state.parentElement.removeChild(redux_state);
	delete window.__REDUX_STATE__;
}

export const testReducer = (state = initialState, action) => {
	switch(action.type) {
		case types.TEST_ACTION:
			return {
				...state,
				test: {
					...state.test,
					payload: action.payload,
				}
			};
		default:
			return state;
	}
};
