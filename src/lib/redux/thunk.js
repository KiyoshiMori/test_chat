import { actions } from './reducers';

// Actions
const { authorize } = actions;

// Auth MW
export const auth = (data) => {
	return dispatch => {
		return dispatch(authorize({ isAuth: !!data.token, loading: data.loading }));
	}
};
