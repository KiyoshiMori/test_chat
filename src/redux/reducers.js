const types = {
	TEST_ACTION: "TEST_ACTION"
};

export const actionTest = text => ({
	type: types.TEST_ACTION,
	payload: text,
});

export const testReducer = (state = {}, action) => {
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
