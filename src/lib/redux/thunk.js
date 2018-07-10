import { actions } from './reducers';

// Actions
const { authorize } = actions;

// Auth MW
export const auth = (data, isReg) => {
	return async dispatch => {
		dispatch(authorize({ isAuth: false, loading: true, error: null }));
		try {
			const receivedData = await data;

			return dispatch(authorize({
				isAuth: !!receivedData.data[isReg ? 'signup' : 'login'].token,
				loading: false,
				error: receivedData.data[isReg ? 'signup' : 'login'].error
			}));
		} catch (e) {
			console.log('ERROR', e);
			return dispatch(authorize({
				isAuth: false,
				loading: false,
				error: 'some kind of error'
			}))
		}
	}
};
